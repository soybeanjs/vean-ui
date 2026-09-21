import path from 'node:path';
import process from 'node:process';
import { Application, ReflectionKind } from 'typedoc';
import type { Comment, DeclarationReflection, ProjectReflection, Reflection, SignatureReflection } from 'typedoc';
import ts from 'typescript';
import { components as ariaComponents } from '../../../aria/src/constants/components';
import { kebabCase } from '../../../aria/src/shared/string';
import {
  hashGenerationInputs,
  hashGenerationOutputs,
  isGenerationUpToDate,
  writeGenerationFingerprint
} from '../shared/generation-cache';
import { writeGeneratedJsonDirectory, writeJsonFile } from '../shared/json';
import type { GeneratedJsonDirectoryWriteResult } from '../shared/json';

type ApiSectionKind = 'props' | 'emits' | 'slots' | 'slotProps';

type ApiMember = {
  name: string;
  type: string;
  required: boolean;
  description: string;
  descriptionKey: string | null;
  default: string | null;
  inheritedFrom: string | null;
  sourcePath: string | null;
  referencedTypes: ApiTypeReference[];
};

type ApiCallable = {
  name: string;
  type: string;
  parameters: string | null;
  required: boolean;
  description: string;
  descriptionKey: string | null;
  sourcePath: string | null;
  referencedTypes: ApiTypeReference[];
};

type ApiTypeReference = {
  name: string;
  kind: 'interface' | 'typeAlias' | 'typeLiteral' | 'unknown';
  type: string;
  resolvedType: string | null;
  description: string;
  descriptionKey: string | null;
  sourcePath: string | null;
  typeParameters: string[];
  external: boolean;
  members: ApiMember[];
  callables: ApiCallable[];
};

type ApiSection = {
  kind: ApiSectionKind;
  name: string;
  type: string;
  resolvedType: string | null;
  description: string;
  descriptionKey: string | null;
  sourcePath: string | null;
  typeParameters: string[];
  members: ApiMember[];
  callables: ApiCallable[];
  referencedTypes: ApiTypeReference[];
};

type ComponentSymbolApi = Partial<Record<ApiSectionKind, ApiSection>>;

type ComponentApi = {
  component: string;
  symbols: Record<string, ComponentSymbolApi>;
};

type ComponentApiIndexEntry = {
  component: string;
  file: string;
  symbols: string[];
};

type ComponentApiIndex = {
  generatedAt: string;
  schemaVersion: 4;
  components: Record<string, ComponentApiIndexEntry>;
};

const rootDir = process.cwd();

/**
 * Declaration file that lets the TypeScript and TypeDoc programs resolve `.vue`
 * imports. Passed explicitly as a program root name, because the programs are
 * otherwise built from the package entry point alone.
 */
const vueModuleShimPath = 'packages/scripts/src/typings/typedoc.d.ts';

/**
 * Everything that can change the extracted API data: the packages whose
 * declarations reach it, the compiler configs that resolve them, and the
 * generator itself. The lockfile stands in for the dependency versions that
 * supply external types.
 */
const apiInputPaths = [
  'packages/ui/src',
  'packages/aria/src',
  'packages/theme/src',
  'packages/scripts/src',
  'tsconfig.json',
  'packages/ui/tsconfig.json',
  'packages/aria/tsconfig.json',
  'package.json',
  'pnpm-lock.yaml'
];

type ApiPackageConfig = {
  key: string;
  entryPoint: string;
  outputDir: string;
  sourceRoots: string[];
  /** `<component>/types.ts` lookup roots used to complete symbol sections. */
  componentRoots: string[];
  /**
   * Skip components already emitted by another package. The `aria` dataset
   * only carries aria-only exports (e.g. `visually-hidden`), because every
   * aria type reachable from `@vean/ui` is already in the `ui` dataset.
   */
  onlyMissingFrom?: string;
  paths: Record<string, string[]>;
};

/** Packages for the docs target currently being generated (set per target run). */
let currentApiPackages: ApiPackageConfig[] = [];

/** Alias map shared by the peripheral package datasets (aria). */
const peripheralPackagePaths: Record<string, string[]> = {
  '@vean/ui': ['./packages/ui/src/index.ts'],
  '@vean/aria': ['./packages/aria/src/index.ts'],
  '@vean/aria/*': ['./packages/aria/src/*'],
  '@vean/theme': ['./packages/theme/src/index.ts'],
  '@vean/theme/*': ['./packages/theme/src/*']
};

/**
 * Build the per-package extraction config for a docs target's `api` output
 * directory. Each docs target gets its own set so `generateApiData` can write
 * into multiple targets per run. Order matters: packages listed with
 * `onlyMissingFrom` must run after the package they de-duplicate against.
 */
function createApiPackages(apiRootDir: string): ApiPackageConfig[] {
  return [
    {
      key: 'ui',
      entryPoint: 'packages/ui/src/index.ts',
      outputDir: path.join(apiRootDir, 'ui'),
      sourceRoots: ['packages/ui/src/', 'packages/aria/src/'],
      componentRoots: ['packages/ui/src/components', 'packages/aria/src/components'],
      paths: {
        '@/*': ['./packages/ui/src/*'],
        '@vean/ui': ['./packages/ui/src/index.ts'],
        '@vean/theme': ['./packages/theme/src/index.ts'],
        '@vean/theme/*': ['./packages/theme/src/*']
      }
    },
    {
      key: 'aria',
      entryPoint: 'packages/aria/src/index.ts',
      outputDir: path.join(apiRootDir, 'aria'),
      sourceRoots: ['packages/aria/src/'],
      componentRoots: ['packages/aria/src/components'],
      onlyMissingFrom: 'ui',
      paths: { ...peripheralPackagePaths }
    }
  ];
}

function createTypedocTsconfig(pkg: ApiPackageConfig): Record<string, unknown> {
  return {
    extends: './tsconfig.json',
    compilerOptions: {
      paths: pkg.paths,
      skipLibCheck: true,
      types: ['vite/client']
    },
    // Only the package's own sources are listed: everything else it needs
    // (`@vean/ui`, `@vean/theme`, ...) is reachable through `paths`,
    // which keeps each program scoped and avoids dragging unrelated packages in.
    include: [vueModuleShimPath, ...pkg.sourceRoots.map(sourceRoot => `${sourceRoot}**/*`)],
    exclude: ['apps/docs/**/*', 'test/**/*']
  };
}
const emptyIgnoredIndexes = Object.freeze([]) satisfies readonly number[];
const tsTypeFormatFlags =
  ts.TypeFormatFlags.NoTruncation |
  ts.TypeFormatFlags.UseSingleQuotesForStringLiteralType |
  ts.TypeFormatFlags.InTypeAlias;
const builtInTypeNames = new Set([
  'Array',
  'Awaited',
  'Boolean',
  'Date',
  'Error',
  'Exclude',
  'Extract',
  'Function',
  'Generator',
  'InstanceType',
  'Iterator',
  'Lowercase',
  'Map',
  'NonNullable',
  'Number',
  'Object',
  'Omit',
  'Parameters',
  'Partial',
  'Pick',
  'Promise',
  'PropertyKey',
  'Readonly',
  'ReadonlyArray',
  'ReadonlyMap',
  'ReadonlySet',
  'Record',
  'RegExp',
  'Required',
  'ReturnType',
  'Set',
  'String',
  'Symbol',
  'ThisType',
  'Uint8Array',
  'Uncapitalize',
  'Uppercase',
  'WeakMap',
  'WeakSet'
]);

type TsDeclaration = ts.InterfaceDeclaration | ts.TypeAliasDeclaration;

type TsTypeContext = {
  declaration: TsDeclaration;
  type: ts.Type;
  checker: ts.TypeChecker;
  memberReflections: Map<string, DeclarationReflection>;
  ignoredPropertyNames: Set<string>;
  ignoredSourcePaths: Set<string>;
};

type TsProgramContext = {
  checker: ts.TypeChecker;
  program: ts.Program;
};

type AliasExportMeta = {
  aliasName: string;
  originalName: string;
  ownerComponentKey: string;
  ownerSourcePath: string;
  originalComponentKey: string | null;
};

const declarationCache = new Map<string, Map<string, TsDeclaration>>();

let tsProgramContext: TsProgramContext | null = null;
let typedocParsedConfig: ts.ParsedCommandLine | null = null;

const reflectionSuffixes = [
  { suffix: 'SlotProps', kind: 'slotProps' },
  { suffix: 'Slots', kind: 'slots' },
  { suffix: 'Emits', kind: 'emits' },
  { suffix: 'Props', kind: 'props' }
] satisfies Array<{ suffix: string; kind: ApiSectionKind }>;
const apiSectionSuffixes = {
  props: 'Props',
  emits: 'Emits',
  slots: 'Slots',
  slotProps: 'SlotProps'
} satisfies Record<ApiSectionKind, string>;
const componentSymbolsByKey = Object.fromEntries(
  Object.entries(ariaComponents).map(([componentKey, symbols]) => [kebabCase(componentKey), symbols])
) as Record<string, string[]>;
const componentKeyBySymbolName = buildComponentKeyBySymbolName();
const aliasExportRegistry = buildAliasExportRegistry();
const aliasExportByAliasName = new Map(aliasExportRegistry.map(aliasMeta => [aliasMeta.aliasName, aliasMeta]));
const aliasExportByOwnerAndOriginalName = new Map(
  aliasExportRegistry.map(aliasMeta => [`${aliasMeta.ownerComponentKey}:${aliasMeta.originalName}`, aliasMeta])
);

function buildComponentKeyBySymbolName(): Record<string, string> {
  const symbolOwners = new Map<string, string>();
  const ambiguousSymbols = new Set<string>();

  for (const [componentKey, symbols] of Object.entries(componentSymbolsByKey)) {
    for (const symbolName of symbols) {
      const existingOwner = symbolOwners.get(symbolName);

      if (!existingOwner) {
        symbolOwners.set(symbolName, componentKey);
        continue;
      }

      if (existingOwner !== componentKey) {
        ambiguousSymbols.add(symbolName);
      }
    }
  }

  ambiguousSymbols.forEach(symbolName => {
    symbolOwners.delete(symbolName);
  });

  return Object.fromEntries(symbolOwners.entries());
}

function buildAliasExportRegistry(): AliasExportMeta[] {
  const aliasExports: AliasExportMeta[] = [];

  for (const componentKey of Object.keys(componentSymbolsByKey)) {
    const componentIndexFilePath = path.join(rootDir, 'packages/aria/src/components', componentKey, 'index.ts');
    const source = ts.sys.readFile(componentIndexFilePath);

    if (!source) {
      continue;
    }

    const sourceFile = ts.createSourceFile(
      componentIndexFilePath,
      source,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS
    );

    for (const statement of sourceFile.statements) {
      if (!ts.isExportDeclaration(statement) || !statement.exportClause || !ts.isNamedExports(statement.exportClause)) {
        continue;
      }

      const moduleSpecifierNode = statement.moduleSpecifier;
      const moduleSpecifier =
        moduleSpecifierNode && ts.isStringLiteral(moduleSpecifierNode) ? moduleSpecifierNode.text : null;
      const originalComponentKey = moduleSpecifier ? getComponentKeyFromModuleSpecifier(moduleSpecifier) : null;

      for (const element of statement.exportClause.elements) {
        if (!element.propertyName || element.propertyName.text === element.name.text) {
          continue;
        }

        aliasExports.push({
          aliasName: element.name.text,
          originalName: element.propertyName.text,
          ownerComponentKey: componentKey,
          ownerSourcePath: toSourcePath(componentIndexFilePath),
          originalComponentKey
        });
      }
    }
  }

  return aliasExports;
}

function getComponentKeyFromModuleSpecifier(moduleSpecifier: string): string | null {
  const normalizedModuleSpecifier = moduleSpecifier.replace(/\\/gu, '/');
  const match = normalizedModuleSpecifier.match(/^\.\.\/([^/]+)(?:\/.*)?$/u);

  return match?.[1] ?? null;
}

function toPosixPath(filePath: string): string {
  return filePath.split(path.sep).join('/');
}

function toRelativePath(filePath: string): string {
  return toPosixPath(path.relative(rootDir, filePath));
}

function toSourcePath(filePath: string): string {
  const relativePath = toRelativePath(filePath);

  return relativePath.startsWith('..') ? toPosixPath(filePath) : relativePath;
}

function toDescriptionKeySegment(value: string): string {
  return value
    .replace(/\.[^.]+$/u, '')
    .replace(/[^a-zA-Z0-9]+/gu, '_')
    .replace(/^_+|_+$/gu, '')
    .replace(/_{2,}/gu, '_')
    .toLowerCase();
}

function createDescriptionKey(...segments: Array<string | null | undefined>): string | null {
  const normalizedSegments = segments
    .map(segment => segment?.trim())
    .filter((segment): segment is string => Boolean(segment))
    .map(toDescriptionKeySegment);

  if (!normalizedSegments.length) {
    return null;
  }

  return `api.generated.${normalizedSegments.join('.')}`;
}

function getCommentText(comment?: Comment): string {
  if (!comment) {
    return '';
  }

  return comment.summary
    .map(part => part.text)
    .join('')
    .trim();
}

function getTypeParameters(reflection: DeclarationReflection | SignatureReflection): string[] {
  return reflection.typeParameters?.map(typeParameter => typeParameter.toString()) ?? [];
}

function getSourcePath(reflection: Reflection): string | null {
  if (!reflection.isDeclaration()) {
    return null;
  }

  const source = reflection.sources?.[0]?.fullFileName;

  if (!source) {
    return null;
  }

  return toSourcePath(source);
}

function getComponentKeyFromPath(sourcePath: string | null): string | null {
  if (!sourcePath) {
    return null;
  }

  for (const componentRoot of getCurrentComponentRoots()) {
    const match = sourcePath.match(new RegExp(`(?:^|/)${escapeRegExpForRegExp(componentRoot)}/([^/]+)/`));

    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

/** Deduplicated component roots across the configured packages. */
function getCurrentComponentRoots(): string[] {
  return [...new Set(currentApiPackages.flatMap(pkg => pkg.componentRoots))];
}

function getSectionMeta(reflectionName: string): { sectionName: string; kind: ApiSectionKind } | null {
  for (const item of reflectionSuffixes) {
    if (reflectionName.endsWith(item.suffix)) {
      return {
        sectionName: reflectionName.slice(0, -item.suffix.length),
        kind: item.kind
      };
    }
  }

  return null;
}

function getComponentKeyForSymbol(symbolName: string): string | null {
  return componentKeyBySymbolName[symbolName] ?? null;
}

function getComponentKeyForApiType(typeName: string, sourcePath: string | null): string | null {
  const sectionMeta = getSectionMeta(typeName);

  if (sectionMeta) {
    return getComponentKeyForSymbol(sectionMeta.sectionName) ?? getComponentKeyFromPath(sourcePath);
  }

  return getComponentKeyForSymbol(typeName) ?? getComponentKeyFromPath(sourcePath);
}

function resolveDisplayAliasMeta(typeName: string, componentKey: string): AliasExportMeta | null {
  const directAlias = aliasExportByAliasName.get(typeName);

  if (directAlias?.ownerComponentKey === componentKey) {
    return directAlias;
  }

  return aliasExportByOwnerAndOriginalName.get(`${componentKey}:${typeName}`) ?? null;
}

function resolveDisplayTypeName(typeName: string, componentKey: string): string {
  const directAlias = aliasExportByAliasName.get(typeName);

  if (directAlias?.ownerComponentKey === componentKey) {
    return directAlias.aliasName;
  }

  const ownedAlias = aliasExportByOwnerAndOriginalName.get(`${componentKey}:${typeName}`);

  if (ownedAlias) {
    return ownedAlias.aliasName;
  }

  if (directAlias?.originalComponentKey === componentKey) {
    return directAlias.originalName;
  }

  return typeName;
}

function normalizeTypeTextForComponent(typeText: string | null, componentKey: string): string | null {
  if (!typeText) {
    return typeText;
  }

  let normalizedTypeText = typeText;
  const aliasNames = Array.from(aliasExportByAliasName.keys()).sort((left, right) => right.length - left.length);

  for (const aliasName of aliasNames) {
    const aliasMeta = aliasExportByAliasName.get(aliasName);

    if (!aliasMeta) {
      continue;
    }

    if (aliasMeta.originalComponentKey === componentKey) {
      normalizedTypeText = normalizedTypeText.replace(
        new RegExp(`\\b${escapeRegExpForRegExp(aliasMeta.aliasName)}\\b`, 'gu'),
        aliasMeta.originalName
      );
    }
  }

  const originalNames = Array.from(aliasExportByOwnerAndOriginalName.keys())
    .filter(key => key.startsWith(`${componentKey}:`))
    .map(key => aliasExportByOwnerAndOriginalName.get(key)!)
    .sort((left, right) => right.originalName.length - left.originalName.length);

  for (const aliasMeta of originalNames) {
    normalizedTypeText = normalizedTypeText.replace(
      new RegExp(`\\b${escapeRegExpForRegExp(aliasMeta.originalName)}\\b`, 'gu'),
      aliasMeta.aliasName
    );
  }

  return normalizedTypeText;
}

function escapeRegExpForRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
}

function resolveNormalizedApiOwner(
  value: { name: string; sourcePath: string | null },
  componentKey: string
): {
  normalizedName: string;
  normalizedSourcePath: string | null;
  normalizedComponentKey: string;
} {
  const normalizedName = resolveDisplayTypeName(value.name, componentKey);
  const aliasMeta = resolveDisplayAliasMeta(value.name, componentKey);
  const normalizedSourcePath =
    aliasMeta?.ownerComponentKey === componentKey ? aliasMeta.ownerSourcePath : value.sourcePath;

  return {
    normalizedName,
    normalizedSourcePath,
    normalizedComponentKey: getComponentKeyForApiType(normalizedName, normalizedSourcePath) ?? componentKey
  };
}

function normalizeReferencedTypes(referencedTypes: ApiTypeReference[], componentKey: string): ApiTypeReference[] {
  return referencedTypes.map(referencedType => normalizeApiTypeReference(referencedType, componentKey));
}

function normalizeApiTypeReference(type: ApiTypeReference, componentKey: string): ApiTypeReference {
  const { normalizedName, normalizedSourcePath, normalizedComponentKey } = resolveNormalizedApiOwner(
    type,
    componentKey
  );

  return {
    ...type,
    name: normalizedName,
    type: normalizeTypeTextForComponent(type.type, normalizedComponentKey) ?? type.type,
    resolvedType: normalizeTypeTextForComponent(type.resolvedType, normalizedComponentKey),
    descriptionKey: type.external
      ? null
      : (createDescriptionKey(normalizedSourcePath, normalizedName) ?? type.descriptionKey),
    sourcePath: normalizedSourcePath,
    members: type.members.map(member =>
      normalizeApiMember(member, normalizedName, normalizedSourcePath, normalizedComponentKey)
    ),
    callables: type.callables.map(callable =>
      normalizeApiCallable(callable, normalizedName, normalizedSourcePath, normalizedComponentKey)
    )
  };
}

function normalizeApiMember(
  member: ApiMember,
  ownerTypeName: string,
  ownerSourcePath: string | null,
  componentKey: string
): ApiMember {
  return {
    ...member,
    type: normalizeTypeTextForComponent(member.type, componentKey) ?? member.type,
    descriptionKey:
      createDescriptionKey(ownerSourcePath, ownerTypeName, 'members', member.name) ?? member.descriptionKey,
    inheritedFrom: normalizeTypeTextForComponent(member.inheritedFrom, componentKey),
    referencedTypes: normalizeReferencedTypes(member.referencedTypes, componentKey)
  };
}

function normalizeApiCallable(
  callable: ApiCallable,
  ownerTypeName: string,
  ownerSourcePath: string | null,
  componentKey: string
): ApiCallable {
  return {
    ...callable,
    type: normalizeTypeTextForComponent(callable.type, componentKey) ?? callable.type,
    parameters: normalizeTypeTextForComponent(callable.parameters, componentKey),
    descriptionKey:
      createDescriptionKey(ownerSourcePath, ownerTypeName, 'callables', callable.name) ?? callable.descriptionKey,
    referencedTypes: normalizeReferencedTypes(callable.referencedTypes, componentKey)
  };
}

function normalizeApiSection(section: ApiSection, componentKey: string): ApiSection {
  const { normalizedName, normalizedSourcePath, normalizedComponentKey } = resolveNormalizedApiOwner(
    section,
    componentKey
  );

  return {
    ...section,
    name: normalizedName,
    type: normalizeTypeTextForComponent(section.type, normalizedComponentKey) ?? section.type,
    resolvedType: normalizeTypeTextForComponent(section.resolvedType, normalizedComponentKey),
    descriptionKey: createDescriptionKey(normalizedSourcePath, normalizedName, section.kind) ?? section.descriptionKey,
    sourcePath: normalizedSourcePath,
    members: section.members.map(member =>
      normalizeApiMember(member, normalizedName, normalizedSourcePath, normalizedComponentKey)
    ),
    callables: section.callables.map(callable =>
      normalizeApiCallable(callable, normalizedName, normalizedSourcePath, normalizedComponentKey)
    ),
    referencedTypes: normalizeReferencedTypes(section.referencedTypes, normalizedComponentKey)
  };
}

function getLeadingNodeText(sourceText: string, sourceFile: ts.SourceFile, node: ts.Node): string {
  return sourceText.slice(node.getFullStart(), node.getStart(sourceFile));
}

function hasVueIgnoreComment(sourceText: string, sourceFile: ts.SourceFile, node: ts.Node): boolean {
  return getLeadingNodeText(sourceText, sourceFile, node).includes('@vue-ignore');
}

function getTsProgramContext(): TsProgramContext {
  if (tsProgramContext) {
    return tsProgramContext;
  }

  const parsedConfig = getTypedocParsedConfig(currentApiPackages[0]);
  const program = ts.createProgram({
    rootNames: parsedConfig.fileNames,
    options: parsedConfig.options,
    projectReferences: parsedConfig.projectReferences
  });

  tsProgramContext = {
    checker: program.getTypeChecker(),
    program
  };

  return tsProgramContext;
}

function getTypedocParsedConfig(pkg: ApiPackageConfig): ts.ParsedCommandLine {
  if (typedocParsedConfig) {
    return typedocParsedConfig;
  }

  typedocParsedConfig = ts.parseJsonConfigFileContent(createTypedocTsconfig(pkg), ts.sys, rootDir, undefined);

  if (typedocParsedConfig.errors.length) {
    throw new Error(
      typedocParsedConfig.errors.map(error => ts.flattenDiagnosticMessageText(error.messageText, '\n')).join('\n')
    );
  }

  return typedocParsedConfig;
}

function resetProgramState(): void {
  typedocParsedConfig = null;
  tsProgramContext = null;
  declarationCache.clear();
}

function getDeclarationSourcePath(declaration: ts.Node | undefined): string | null {
  if (!declaration) {
    return null;
  }

  return toSourcePath(declaration.getSourceFile().fileName);
}

function isDependencySourcePath(sourcePath: string | null): boolean {
  return sourcePath !== null && sourcePath.includes('/node_modules/');
}

function getTsDeclarationsForFile(filePath: string): Map<string, TsDeclaration> {
  const cached = declarationCache.get(filePath);

  if (cached) {
    return cached;
  }

  const { program } = getTsProgramContext();
  const sourceFile = program.getSourceFile(filePath);
  const declarations = new Map<string, TsDeclaration>();

  if (!sourceFile) {
    declarationCache.set(filePath, declarations);
    return declarations;
  }

  function visit(node: ts.Node): void {
    if ((ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) && node.name) {
      declarations.set(node.name.text, node);
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  declarationCache.set(filePath, declarations);

  return declarations;
}

function getTsDeclaration(filePath: string, name: string): TsDeclaration | null {
  return getTsDeclarationsForFile(filePath).get(name) ?? null;
}

function getIgnoredInterfaceExtendsTypes(
  sourceText: string,
  sourceFile: ts.SourceFile,
  declaration: ts.InterfaceDeclaration
): readonly ts.ExpressionWithTypeArguments[] {
  const extendsClause = declaration.heritageClauses?.find(clause => clause.token === ts.SyntaxKind.ExtendsKeyword);

  if (!extendsClause) {
    return emptyIgnoredIndexes as readonly ts.ExpressionWithTypeArguments[];
  }

  const ignoredTypes = extendsClause.types.filter(typeNode => hasVueIgnoreComment(sourceText, sourceFile, typeNode));

  return ignoredTypes.length ? ignoredTypes : (emptyIgnoredIndexes as readonly ts.ExpressionWithTypeArguments[]);
}

function getIgnoredIntersectionTypes(
  sourceText: string,
  sourceFile: ts.SourceFile,
  declaration: ts.TypeAliasDeclaration
): readonly ts.TypeNode[] {
  if (!ts.isIntersectionTypeNode(declaration.type)) {
    return emptyIgnoredIndexes as readonly ts.TypeNode[];
  }

  const ignoredTypes = declaration.type.types.filter(typeNode => hasVueIgnoreComment(sourceText, sourceFile, typeNode));

  return ignoredTypes.length ? ignoredTypes : (emptyIgnoredIndexes as readonly ts.TypeNode[]);
}

function getIgnoredTypeNodes(declaration: TsDeclaration): readonly ts.TypeNode[] {
  const sourceFile = declaration.getSourceFile();
  const sourceText = sourceFile.text;

  if (ts.isInterfaceDeclaration(declaration)) {
    return getIgnoredInterfaceExtendsTypes(sourceText, sourceFile, declaration);
  }

  if (ts.isTypeAliasDeclaration(declaration)) {
    return getIgnoredIntersectionTypes(sourceText, sourceFile, declaration);
  }

  return emptyIgnoredIndexes as readonly ts.TypeNode[];
}

function getSymbolDeclaration(symbol: ts.Symbol): ts.Declaration | undefined {
  return symbol.valueDeclaration ?? symbol.declarations?.[0];
}

function getTypeDeclaration(symbol: ts.Symbol | undefined): ts.Declaration | undefined {
  return symbol?.declarations?.find(
    declaration =>
      ts.isInterfaceDeclaration(declaration) ||
      ts.isTypeAliasDeclaration(declaration) ||
      ts.isTypeLiteralNode(declaration)
  );
}

function getResolvedSymbol(symbol: ts.Symbol, checker: ts.TypeChecker): ts.Symbol {
  return symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
}

function getTypedocMemberReflections(reflection: DeclarationReflection): Map<string, DeclarationReflection> {
  const memberReflections = new Map<string, DeclarationReflection>();

  for (const child of reflection.children ?? []) {
    if (child.isDeclaration() && child.kindOf(ReflectionKind.Property)) {
      memberReflections.set(child.name, child);
    }
  }

  return memberReflections;
}

function getIgnoredPropertyMetadata(
  declaration: TsDeclaration,
  checker: ts.TypeChecker
): {
  ignoredPropertyNames: Set<string>;
  ignoredSourcePaths: Set<string>;
} {
  const ignoredPropertyNames = new Set<string>();
  const ignoredSourcePaths = new Set<string>();

  for (const ignoredTypeNode of getIgnoredTypeNodes(declaration)) {
    const ignoredType = checker.getTypeFromTypeNode(ignoredTypeNode);

    for (const symbol of checker.getApparentType(ignoredType).getProperties()) {
      ignoredPropertyNames.add(symbol.name);

      const symbolDeclaration = getSymbolDeclaration(symbol);
      const sourcePath = getDeclarationSourcePath(symbolDeclaration);

      if (sourcePath) {
        ignoredSourcePaths.add(sourcePath);
      }
    }
  }

  return {
    ignoredPropertyNames,
    ignoredSourcePaths
  };
}

function createTsTypeContext(options: {
  declaration: TsDeclaration;
  checker: ts.TypeChecker;
  memberReflections: Map<string, DeclarationReflection>;
}): TsTypeContext {
  const { ignoredPropertyNames, ignoredSourcePaths } = getIgnoredPropertyMetadata(options.declaration, options.checker);

  return {
    declaration: options.declaration,
    type: options.checker.getTypeAtLocation(options.declaration.name),
    checker: options.checker,
    memberReflections: options.memberReflections,
    ignoredPropertyNames,
    ignoredSourcePaths
  };
}

function getTsTypeContext(reflection: DeclarationReflection): TsTypeContext | null {
  const sourceFilePath = reflection.sources?.[0]?.fullFileName;

  if (!sourceFilePath) {
    return null;
  }

  const { checker } = getTsProgramContext();
  const declaration = getTsDeclaration(sourceFilePath, reflection.name);

  if (!declaration) {
    return null;
  }

  return createTsTypeContext({
    declaration,
    checker,
    memberReflections: getTypedocMemberReflections(reflection)
  });
}

function createNestedTsTypeContext(declaration: TsDeclaration, checker: ts.TypeChecker): TsTypeContext {
  return createTsTypeContext({
    declaration,
    checker,
    memberReflections: new Map<string, DeclarationReflection>()
  });
}

function isOptionalSymbol(symbol: ts.Symbol, declaration: ts.Declaration | undefined): boolean {
  if (symbol.flags & ts.SymbolFlags.Optional) {
    return true;
  }

  return Boolean(declaration && 'questionToken' in declaration && declaration.questionToken);
}

function stripUndefinedFromOptionalType(typeText: string): string {
  return typeText
    .replace(/\s*\|\s*undefined/g, '')
    .replace(/undefined\s*\|\s*/g, '')
    .trim();
}

function getTsTypeText(
  type: ts.Type,
  checker: ts.TypeChecker,
  contextNode: ts.Node,
  optional: boolean = false
): string {
  const typeText = checker.typeToString(type, contextNode, tsTypeFormatFlags);

  return optional ? stripUndefinedFromOptionalType(typeText) : typeText;
}

function formatApiPropertyName(name: string): string {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name) ? name : JSON.stringify(name);
}

function getTsDeclarationKind(declaration: ts.Declaration): ApiTypeReference['kind'] {
  if (ts.isInterfaceDeclaration(declaration)) {
    return 'interface';
  }

  if (ts.isTypeAliasDeclaration(declaration)) {
    return 'typeAlias';
  }

  if (ts.isTypeLiteralNode(declaration)) {
    return 'typeLiteral';
  }

  return 'unknown';
}

function getTsDeclarationTypeParameters(declaration: ts.Declaration): string[] {
  if (!('typeParameters' in declaration) || !declaration.typeParameters) {
    return [];
  }

  // @ts-expect-error
  return declaration.typeParameters.map(typeParameter => typeParameter.getText());
}

function getSymbolDescription(
  symbol: ts.Symbol,
  checker: ts.TypeChecker,
  fallbackReflection?: DeclarationReflection
): string {
  if (fallbackReflection) {
    return getCommentText(fallbackReflection.comment);
  }

  return ts.displayPartsToString(symbol.getDocumentationComment(checker)).trim();
}

function getSymbolDefaultValue(symbol: ts.Symbol, fallbackReflection?: DeclarationReflection): string | null {
  if (fallbackReflection?.defaultValue) {
    return fallbackReflection.defaultValue;
  }

  const defaultTag = symbol.getJsDocTags().find(tag => tag.name === 'default' || tag.name === 'defaultValue');

  if (!defaultTag?.text?.length) {
    return null;
  }

  return (
    defaultTag.text
      .map(part => part.text)
      .join('')
      .trim() || null
  );
}

function shouldSkipPropertySymbol(symbol: ts.Symbol, context: TsTypeContext): boolean {
  const declaration = getSymbolDeclaration(symbol);
  const sourcePath = getDeclarationSourcePath(declaration);

  if (isDependencySourcePath(sourcePath)) {
    return true;
  }

  return context.ignoredPropertyNames.has(symbol.name) && context.ignoredSourcePaths.has(sourcePath ?? '');
}

function getSectionPropertySymbols(context: TsTypeContext): ts.Symbol[] {
  return context.checker
    .getApparentType(context.type)
    .getProperties()
    .filter(symbol => !shouldSkipPropertySymbol(symbol, context));
}

function getSignatureParameters(signature: ts.Signature, checker: ts.TypeChecker, contextNode: ts.Node): string | null {
  if (!signature.parameters.length) {
    return null;
  }

  return signature.parameters
    .map(parameter => {
      const declaration = getSymbolDeclaration(parameter);
      const optionalMark = isOptionalSymbol(parameter, declaration) ? '?' : '';
      const parameterType = checker.getTypeOfSymbolAtLocation(parameter, declaration ?? contextNode);

      return `${parameter.name}${optionalMark}: ${getTsTypeText(parameterType, checker, declaration ?? contextNode)}`;
    })
    .join(', ');
}

function getCallableParameters(type: ts.Type, checker: ts.TypeChecker, contextNode: ts.Node): string | null {
  const signatures = type.getCallSignatures();

  if (signatures.length) {
    return (
      signatures
        .map(signature => getSignatureParameters(signature, checker, contextNode))
        .filter(Boolean)
        .join(' | ') || null
    );
  }

  const typeText = getTsTypeText(type, checker, contextNode);

  if (typeText === '[]') {
    return null;
  }

  if (typeText.startsWith('[') && typeText.endsWith(']')) {
    return typeText.slice(1, -1) || null;
  }

  return typeText.includes('=>') ? typeText : null;
}

function isPrimitiveLikeType(type: ts.Type): boolean {
  return Boolean(
    type.flags &
    (ts.TypeFlags.Any |
      ts.TypeFlags.Unknown |
      ts.TypeFlags.Never |
      ts.TypeFlags.Void |
      ts.TypeFlags.Undefined |
      ts.TypeFlags.Null |
      ts.TypeFlags.Boolean |
      ts.TypeFlags.BooleanLiteral |
      ts.TypeFlags.Number |
      ts.TypeFlags.NumberLiteral |
      ts.TypeFlags.BigInt |
      ts.TypeFlags.BigIntLiteral |
      ts.TypeFlags.String |
      ts.TypeFlags.StringLiteral |
      ts.TypeFlags.ESSymbol |
      ts.TypeFlags.UniqueESSymbol |
      ts.TypeFlags.TypeParameter)
  );
}

function createTypeKey(typeName: string, sourcePath: string | null): string {
  return `${sourcePath ?? 'unknown'}:${typeName}`;
}

function createApiTypeReference(
  symbol: ts.Symbol,
  declaration: ts.Declaration,
  type: ts.Type,
  checker: ts.TypeChecker,
  contextNode: ts.Node,
  typeText: string = getTsTypeText(type, checker, contextNode),
  name: string = symbol.name
): ApiTypeReference {
  const sourcePath = getDeclarationSourcePath(declaration);
  const isExternal = isDependencySourcePath(sourcePath);

  return {
    name,
    kind: getTsDeclarationKind(declaration),
    type: typeText,
    resolvedType: null,
    description: isExternal ? '' : getSymbolDescription(symbol, checker),
    descriptionKey: isExternal ? null : createDescriptionKey(sourcePath, name),
    sourcePath,
    typeParameters: getTsDeclarationTypeParameters(declaration),
    external: isExternal,
    members: [],
    callables: []
  };
}

function mergeReferencedTypes(...referencedTypeGroups: ApiTypeReference[][]): ApiTypeReference[] {
  const merged = new Map<string, ApiTypeReference>();

  for (const referencedTypes of referencedTypeGroups) {
    for (const referencedType of referencedTypes) {
      merged.set(createTypeKey(referencedType.name, referencedType.sourcePath), referencedType);
    }
  }

  return Array.from(merged.values()).sort((left, right) => left.name.localeCompare(right.name));
}

function getReferenceTypeName(typeName: ts.EntityName): string {
  if (ts.isIdentifier(typeName)) {
    return typeName.text;
  }

  return typeName.right.text;
}

function collectDirectDependencyReferencedTypes(
  typeNode: ts.TypeNode,
  checker: ts.TypeChecker,
  seen: Set<string>
): ApiTypeReference[] {
  const collected = new Map<string, ApiTypeReference>();

  function addDirectReference(currentTypeNode: ts.TypeReferenceNode): void {
    const symbol = checker.getSymbolAtLocation(currentTypeNode.typeName);

    if (!symbol) {
      return;
    }
    const resolvedSymbol = getResolvedSymbol(symbol, checker);
    const declaration = getTypeDeclaration(resolvedSymbol);
    const sourcePath = getDeclarationSourcePath(declaration);
    const referenceName = getReferenceTypeName(currentTypeNode.typeName);
    const key = createTypeKey(referenceName, sourcePath);

    if (
      !declaration ||
      !isDependencySourcePath(sourcePath) ||
      seen.has(key) ||
      builtInTypeNames.has(referenceName) ||
      referenceName.startsWith('__')
    ) {
      return;
    }

    seen.add(key);
    collected.set(
      key,
      createApiTypeReference(
        resolvedSymbol,
        declaration,
        checker.getTypeAtLocation(currentTypeNode),
        checker,
        currentTypeNode,
        currentTypeNode.getText(),
        referenceName
      )
    );
  }

  function visit(node: ts.Node): void {
    if (ts.isTypeReferenceNode(node)) {
      addDirectReference(node);
    }

    ts.forEachChild(node, visit);
  }

  visit(typeNode);

  return Array.from(collected.values()).sort((left, right) => left.name.localeCompare(right.name));
}

function collectReferencedTypes(
  type: ts.Type,
  checker: ts.TypeChecker,
  contextNode: ts.Node,
  seen: Set<string>,
  depth: number = 0
): ApiTypeReference[] {
  const collected = new Map<string, ApiTypeReference>();

  function addType(currentType: ts.Type, currentDepth: number): void {
    if (isPrimitiveLikeType(currentType)) {
      return;
    }

    if (currentType.aliasTypeArguments?.length) {
      for (const typeArgument of currentType.aliasTypeArguments) {
        addType(typeArgument, currentDepth + 1);
      }
    }

    const symbol = currentType.aliasSymbol ?? currentType.getSymbol();
    const declaration = getTypeDeclaration(symbol);

    if (symbol && declaration) {
      const sourcePath = getDeclarationSourcePath(declaration);
      const external = isDependencySourcePath(sourcePath);

      if (symbol.name.startsWith('__') && external) {
        return;
      }

      if (sourcePath?.includes('/typescript/lib/')) {
        return;
      }

      if (external) {
        return;
      }

      const key = createTypeKey(symbol.name, sourcePath);

      if (!seen.has(key) && !builtInTypeNames.has(symbol.name)) {
        seen.add(key);

        const detail = createApiTypeReference(symbol, declaration, currentType, checker, contextNode);

        if (currentDepth < 1 && (ts.isInterfaceDeclaration(declaration) || ts.isTypeAliasDeclaration(declaration))) {
          const nestedContext = createNestedTsTypeContext(declaration, checker);
          const symbols = getSectionPropertySymbols(nestedContext);

          detail.resolvedType = buildResolvedType(nestedContext);
          detail.members = symbols
            .filter(
              symbolItem =>
                getCallableParameters(
                  checker.getTypeOfSymbolAtLocation(
                    symbolItem,
                    getSymbolDeclaration(symbolItem) ?? nestedContext.declaration
                  ),
                  checker,
                  getSymbolDeclaration(symbolItem) ?? nestedContext.declaration
                ) === null
            )
            .map(symbolItem => toApiMember(symbolItem, nestedContext, false, seen));
          detail.callables = symbols
            .filter(
              symbolItem =>
                getCallableParameters(
                  checker.getTypeOfSymbolAtLocation(
                    symbolItem,
                    getSymbolDeclaration(symbolItem) ?? nestedContext.declaration
                  ),
                  checker,
                  getSymbolDeclaration(symbolItem) ?? nestedContext.declaration
                ) !== null
            )
            .map(symbolItem => toApiCallable(symbolItem, nestedContext, false, seen));
        }

        collected.set(key, detail);
      }

      return;
    }

    if (currentType.isUnionOrIntersection()) {
      for (const childType of currentType.types) {
        addType(childType, currentDepth);
      }

      return;
    }

    if (currentDepth >= 2) {
      return;
    }

    for (const property of currentType.getProperties()) {
      const declarationNode = getSymbolDeclaration(property);
      const propertyType = checker.getTypeOfSymbolAtLocation(property, declarationNode ?? contextNode);

      addType(propertyType, currentDepth + 1);
    }

    for (const signature of currentType.getCallSignatures()) {
      for (const parameter of signature.parameters) {
        const parameterDeclaration = getSymbolDeclaration(parameter);
        const parameterType = checker.getTypeOfSymbolAtLocation(parameter, parameterDeclaration ?? contextNode);

        addType(parameterType, currentDepth + 1);
      }

      addType(signature.getReturnType(), currentDepth + 1);
    }
  }

  addType(type, depth);

  return Array.from(collected.values()).sort((left, right) => left.name.localeCompare(right.name));
}

function buildResolvedType(context: TsTypeContext): string | null {
  const propertySymbols = getSectionPropertySymbols(context);

  if (propertySymbols.length) {
    const parts = propertySymbols.map(symbol => {
      const declaration = getSymbolDeclaration(symbol);
      const optional = isOptionalSymbol(symbol, declaration);
      const type = context.checker.getTypeOfSymbolAtLocation(symbol, declaration ?? context.declaration);

      return `${formatApiPropertyName(symbol.name)}${optional ? '?' : ''}: ${getTsTypeText(type, context.checker, declaration ?? context.declaration, optional)}`;
    });

    return `{ ${parts.join('; ')} }`;
  }

  const signatures = context.type.getCallSignatures();

  if (signatures.length) {
    return signatures
      .map(signature => {
        const parameters = getSignatureParameters(signature, context.checker, context.declaration) ?? '';
        const returnType = getTsTypeText(signature.getReturnType(), context.checker, context.declaration);

        return `(${parameters}) => ${returnType}`;
      })
      .join(' | ');
  }

  const typeText = getTsTypeText(context.type, context.checker, context.declaration);

  return typeText === context.declaration.name.text ? null : typeText;
}

function getDeclarationTypeNode(declaration: ts.Declaration | undefined): ts.TypeNode | undefined {
  if (!declaration || !('type' in declaration)) {
    return undefined;
  }

  return declaration.type as ts.TypeNode;
}

function collectDeclarationReferencedTypes(
  declaration: ts.Declaration | undefined,
  checker: ts.TypeChecker,
  seen: Set<string>
): ApiTypeReference[] {
  const typeNode = getDeclarationTypeNode(declaration);

  if (!typeNode) {
    return [];
  }

  return mergeReferencedTypes(
    collectDirectDependencyReferencedTypes(typeNode, checker, new Set(seen)),
    collectReferencedTypes(checker.getTypeAtLocation(typeNode), checker, typeNode, new Set(seen))
  );
}

function toApiMember(
  symbol: ts.Symbol,
  context: TsTypeContext,
  includeReferencedTypes: boolean,
  seen: Set<string>
): ApiMember {
  const declaration = getSymbolDeclaration(symbol);
  const type = context.checker.getTypeOfSymbolAtLocation(symbol, declaration ?? context.declaration);
  const optional = isOptionalSymbol(symbol, declaration);
  const reflection = context.memberReflections.get(symbol.name);

  return {
    name: symbol.name,
    type: getTsTypeText(type, context.checker, declaration ?? context.declaration, optional),
    required: !optional,
    description: getSymbolDescription(symbol, context.checker, reflection),
    descriptionKey: createDescriptionKey(
      getDeclarationSourcePath(context.declaration),
      context.declaration.name.text,
      'members',
      symbol.name
    ),
    default: getSymbolDefaultValue(symbol, reflection),
    inheritedFrom: reflection?.inheritedFrom?.toString() ?? null,
    sourcePath: reflection ? getSourcePath(reflection) : getDeclarationSourcePath(declaration),
    referencedTypes: includeReferencedTypes
      ? mergeReferencedTypes(
          collectReferencedTypes(type, context.checker, declaration ?? context.declaration, new Set(seen)),
          collectDeclarationReferencedTypes(declaration, context.checker, seen)
        )
      : []
  };
}

function toApiCallable(
  symbol: ts.Symbol,
  context: TsTypeContext,
  includeReferencedTypes: boolean,
  seen: Set<string>
): ApiCallable {
  const declaration = getSymbolDeclaration(symbol);
  const type = context.checker.getTypeOfSymbolAtLocation(symbol, declaration ?? context.declaration);
  const reflection = context.memberReflections.get(symbol.name);

  return {
    name: symbol.name,
    type: getTsTypeText(type, context.checker, declaration ?? context.declaration),
    parameters: getCallableParameters(type, context.checker, declaration ?? context.declaration),
    required: !isOptionalSymbol(symbol, declaration),
    description: getSymbolDescription(symbol, context.checker, reflection),
    descriptionKey: createDescriptionKey(
      getDeclarationSourcePath(context.declaration),
      context.declaration.name.text,
      'callables',
      symbol.name
    ),
    sourcePath: reflection ? getSourcePath(reflection) : getDeclarationSourcePath(declaration),
    referencedTypes: includeReferencedTypes
      ? mergeReferencedTypes(
          collectReferencedTypes(type, context.checker, declaration ?? context.declaration, new Set(seen)),
          collectDeclarationReferencedTypes(declaration, context.checker, seen)
        )
      : []
  };
}

function buildSection(kind: ApiSectionKind, reflection: DeclarationReflection, componentKey: string): ApiSection {
  const typeContext = getTsTypeContext(reflection);
  const symbols = typeContext ? getSectionPropertySymbols(typeContext) : [];
  const seenTypeKeys = new Set<string>([createTypeKey(reflection.name, getSourcePath(reflection))]);
  const sectionType = typeContext?.type;
  const sourcePath = getSourcePath(reflection);

  return normalizeApiSection(
    {
      kind,
      name: reflection.name,
      type: reflection.toString(),
      resolvedType: typeContext ? buildResolvedType(typeContext) : null,
      description: getCommentText(reflection.comment),
      descriptionKey: createDescriptionKey(sourcePath, reflection.name, kind),
      sourcePath,
      typeParameters: getTypeParameters(reflection),
      members:
        (kind === 'props' || kind === 'slotProps') && typeContext
          ? symbols.map(symbol => toApiMember(symbol, typeContext, true, seenTypeKeys))
          : [],
      callables:
        (kind === 'emits' || kind === 'slots') && typeContext
          ? symbols.map(symbol => toApiCallable(symbol, typeContext, true, seenTypeKeys))
          : [],
      referencedTypes:
        typeContext && sectionType
          ? collectReferencedTypes(sectionType, typeContext.checker, typeContext.declaration, new Set(seenTypeKeys))
          : []
    },
    componentKey
  );
}

function getDeclarationCommentText(declaration: TsDeclaration, checker: ts.TypeChecker): string {
  const symbol = checker.getSymbolAtLocation(declaration.name);

  if (!symbol) {
    return '';
  }

  return getSymbolDescription(symbol, checker);
}

function getDeclarationDisplayText(declaration: TsDeclaration): string {
  const declarationKind = ts.isInterfaceDeclaration(declaration) ? 'Interface' : 'TypeAlias';
  const typeParameters = declaration.typeParameters?.length
    ? `<${declaration.typeParameters.map(typeParameter => typeParameter.name.text).join(', ')}>`
    : '';

  return `${declarationKind} ${declaration.name.text}${typeParameters}`;
}

function buildSectionFromDeclaration(
  kind: ApiSectionKind,
  declaration: TsDeclaration,
  componentKey: string
): ApiSection {
  const { checker } = getTsProgramContext();
  const typeContext = createNestedTsTypeContext(declaration, checker);
  const symbols = getSectionPropertySymbols(typeContext);
  const sourcePath = getDeclarationSourcePath(declaration);
  const seenTypeKeys = new Set<string>([createTypeKey(declaration.name.text, sourcePath)]);

  return normalizeApiSection(
    {
      kind,
      name: declaration.name.text,
      type: getDeclarationDisplayText(declaration),
      resolvedType: buildResolvedType(typeContext),
      description: getDeclarationCommentText(declaration, checker),
      descriptionKey: createDescriptionKey(sourcePath, declaration.name.text, kind),
      sourcePath,
      typeParameters: getTsDeclarationTypeParameters(declaration),
      members:
        kind === 'props' || kind === 'slotProps'
          ? symbols.map(symbol => toApiMember(symbol, typeContext, true, seenTypeKeys))
          : [],
      callables:
        kind === 'emits' || kind === 'slots'
          ? symbols.map(symbol => toApiCallable(symbol, typeContext, true, seenTypeKeys))
          : [],
      referencedTypes: collectReferencedTypes(typeContext.type, checker, declaration, new Set(seenTypeKeys))
    },
    componentKey
  );
}

function sortEntries<T>(record: Record<string, T>): Record<string, T> {
  return Object.fromEntries(Object.entries(record).sort(([left], [right]) => left.localeCompare(right)));
}

function getComponentTypeFilePaths(componentKey: string): string[] {
  return getCurrentComponentRoots().map(componentRoot => path.join(rootDir, componentRoot, componentKey, 'types.ts'));
}

function getComponentSymbolDeclaration(
  componentKey: string,
  symbolName: string,
  kind: ApiSectionKind
): TsDeclaration | null {
  const declarationName = `${symbolName}${apiSectionSuffixes[kind]}`;

  for (const filePath of getComponentTypeFilePaths(componentKey)) {
    const declaration = getTsDeclaration(filePath, declarationName);

    if (declaration) {
      return declaration;
    }
  }

  return null;
}

function completeSymbolApi(
  componentKey: string,
  symbolName: string,
  symbolApi: ComponentSymbolApi
): ComponentSymbolApi {
  const completedSymbolApi: ComponentSymbolApi = { ...symbolApi };

  for (const kind of ['props', 'emits', 'slots', 'slotProps'] as ApiSectionKind[]) {
    if (completedSymbolApi[kind]) {
      continue;
    }

    const declaration = getComponentSymbolDeclaration(componentKey, symbolName, kind);

    if (!declaration) {
      continue;
    }

    completedSymbolApi[kind] = buildSectionFromDeclaration(kind, declaration, componentKey);
  }

  return completedSymbolApi;
}

function completeComponentSymbols(componentKey: string, componentApi: ComponentApi): ComponentApi {
  const symbolNames = new Set([...Object.keys(componentApi.symbols), ...(componentSymbolsByKey[componentKey] ?? [])]);

  return {
    ...componentApi,
    symbols: sortEntries(
      Object.fromEntries(
        Array.from(symbolNames).map(symbolName => [
          symbolName,
          completeSymbolApi(componentKey, symbolName, componentApi.symbols[symbolName] ?? {})
        ])
      )
    )
  };
}

function collectComponentApis(
  project: ProjectReflection,
  isSourceIncluded: (sourcePath: string | null) => boolean
): Record<string, ComponentApi> {
  const reflections = project
    .getReflectionsByKind(ReflectionKind.Interface | ReflectionKind.TypeAlias)
    .filter(reflection => reflection.isDeclaration());

  const components: Record<string, ComponentApi> = {};

  for (const reflection of reflections) {
    const sectionMeta = getSectionMeta(reflection.name);

    if (!sectionMeta) {
      continue;
    }

    const sourcePath = getSourcePath(reflection);

    if (!isSourceIncluded(sourcePath)) {
      continue;
    }

    const componentKey = getComponentKeyForSymbol(sectionMeta.sectionName) ?? getComponentKeyFromPath(sourcePath);

    if (!componentKey) {
      continue;
    }

    components[componentKey] ??= {
      component: componentKey,
      symbols: {}
    };

    components[componentKey].symbols[sectionMeta.sectionName] ??= {};
    components[componentKey].symbols[sectionMeta.sectionName][sectionMeta.kind] = buildSection(
      sectionMeta.kind,
      reflection,
      componentKey
    );
  }

  return Object.fromEntries(
    Object.entries(components)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([componentKey, componentApi]) => [componentKey, completeComponentSymbols(componentKey, componentApi)])
  );
}

function createComponentApiIndex(generatedAt: string, components: Record<string, ComponentApi>): ComponentApiIndex {
  return {
    generatedAt,
    schemaVersion: 4,
    components: Object.fromEntries(
      Object.entries(components).map(([componentKey, componentApi]) => [
        componentKey,
        {
          component: componentApi.component,
          file: `${componentKey}.json`,
          symbols: Object.keys(componentApi.symbols)
        }
      ])
    )
  };
}

async function writeOutputs(
  pkg: ApiPackageConfig,
  generatedAt: string,
  components: Record<string, ComponentApi>,
  resetPaths: string[]
): Promise<{ index: ComponentApiIndex; writeResult: GeneratedJsonDirectoryWriteResult }> {
  const index = createComponentApiIndex(generatedAt, components);

  const writeResult = await writeGeneratedJsonDirectory({
    outputDir: pkg.outputDir,
    resetPaths,
    documents: [
      {
        fileName: 'index.json',
        value: index
      },
      ...Object.entries(components).map(([componentKey, componentApi]) => ({
        fileName: `${componentKey}.json`,
        value: componentApi
      }))
    ]
  });

  return { index, writeResult };
}

/** Local cache path, one entry per docs target's API output directory. */
function createApiCacheFilePath(apiRootDir: string): string {
  const slug = path.relative(rootDir, apiRootDir).replace(/[^a-zA-Z0-9]+/gu, '-');

  return path.join(rootDir, 'node_modules/.cache/sui', `gen-api-${slug}.json`);
}

/**
 * Extract component API JSON into `apiRootDir` (a docs target's
 * `<generated>/api` directory).
 *
 * Extraction is a TypeDoc conversion of both packages, so it is skipped
 * entirely when the recorded fingerprint proves the run would reproduce the
 * committed data byte for byte. `force` bypasses the check.
 */
export async function generateApiData(apiRootDir: string, options: { force?: boolean } = {}): Promise<void> {
  const cacheFilePath = createApiCacheFilePath(apiRootDir);
  const inputHash = await hashGenerationInputs(apiInputPaths, rootDir);

  if (
    !options.force &&
    (await isGenerationUpToDate({ cacheFilePath, inputHash, outputDirectory: apiRootDir, rootDir }))
  ) {
    console.log(
      `API data is already up to date (${path.relative(rootDir, apiRootDir)}): skipped extraction.` +
        ` Pass --force to regenerate anyway.`
    );
    return;
  }

  const generatedAt = new Date().toISOString();
  const packages: Record<string, { file: string; components: ComponentApiIndex['components'] }> = {};
  const apiPackages = createApiPackages(apiRootDir);
  const generatedComponentKeys = new Map<string, Set<string>>();
  const documentCounts = { written: 0, total: 0 };

  currentApiPackages = apiPackages;

  for (const pkg of apiPackages) {
    resetProgramState();

    const parsedTypedocConfig = getTypedocParsedConfig(pkg);
    const app = await Application.bootstrap(
      {
        entryPoints: [pkg.entryPoint],
        logLevel: 'Warn'
      },
      []
    );

    // The entry point plus the shim is all each program needs — everything else
    // is reached through imports. Listing every source file as a root name made
    // the program (and its diagnostics) span the whole package, which dominated
    // the run time without changing a single extracted symbol.
    app.options.setCompilerOptions(
      [vueModuleShimPath, pkg.entryPoint],
      parsedTypedocConfig.options,
      parsedTypedocConfig.projectReferences
    );

    const project = await app.convert();

    if (!project) {
      throw new Error(`TypeDoc failed to create a project reflection for ${pkg.key}.`);
    }

    const isSourceIncluded = (sourcePath: string | null): boolean =>
      sourcePath !== null && pkg.sourceRoots.some(sourceRoot => sourcePath.startsWith(sourceRoot));

    const coveredComponentKeys = pkg.onlyMissingFrom ? generatedComponentKeys.get(pkg.onlyMissingFrom) : undefined;
    const components = Object.fromEntries(
      Object.entries(collectComponentApis(project, isSourceIncluded)).filter(
        ([componentKey]) => !coveredComponentKeys?.has(componentKey)
      )
    );

    const { index, writeResult } = await writeOutputs(
      pkg,
      generatedAt,
      components,
      pkg.key === 'ui' ? [path.join(apiRootDir, 'component-api')] : []
    );

    documentCounts.written += writeResult.written.length;
    documentCounts.total += writeResult.written.length + writeResult.unchanged.length;

    generatedComponentKeys.set(pkg.key, new Set(Object.keys(components)));

    packages[pkg.key] = {
      file: `${pkg.key}/index.json`,
      components: index.components
    };
  }

  const rootIndexWritten = await writeJsonFile(
    path.join(apiRootDir, 'index.json'),
    {
      generatedAt,
      schemaVersion: 4,
      packages
    },
    { sort: true, preserveGeneratedAt: true }
  );

  documentCounts.written += Number(rootIndexWritten);
  documentCounts.total += 1;

  await writeGenerationFingerprint(cacheFilePath, {
    inputs: inputHash,
    outputs: (await hashGenerationOutputs(apiRootDir, rootDir)) ?? ''
  });

  console.log(
    `Generated API data (${path.relative(rootDir, apiRootDir)}) for packages: ${Object.keys(packages).join(', ')}.` +
      ` Updated ${documentCounts.written} of ${documentCounts.total} files.`
  );
}
