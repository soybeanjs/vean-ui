export interface GeneratedApiReferencedType {
  name: string;
  kind: string;
  type: string;
  resolvedType: string | null;
  description: string;
  descriptionKey: string | null;
  sourcePath: string;
  typeParameters: string[];
  external: boolean;
  members: GeneratedApiMember[];
  callables: GeneratedApiCallable[];
}

export interface GeneratedApiMember {
  name: string;
  type: string;
  required: boolean;
  description: string;
  descriptionKey: string | null;
  default: string | boolean | number | null;
  inheritedFrom: string | null;
  sourcePath: string;
  referencedTypes: GeneratedApiReferencedType[];
}

export interface GeneratedApiCallable {
  name: string;
  type: string;
  parameters: string;
  required: boolean;
  description: string;
  descriptionKey: string | null;
  sourcePath: string;
  referencedTypes: GeneratedApiReferencedType[];
}

export interface GeneratedApiEntity {
  kind: string;
  name: string;
  type: string;
  resolvedType: string | null;
  description: string;
  descriptionKey: string | null;
  sourcePath: string;
  typeParameters: string[];
  members: GeneratedApiMember[];
  callables: GeneratedApiCallable[];
  referencedTypes: GeneratedApiReferencedType[];
}

export interface GeneratedApiSymbol {
  props?: GeneratedApiEntity;
  emits?: GeneratedApiEntity;
  slots?: GeneratedApiEntity;
  [key: string]: GeneratedApiEntity | undefined;
}

export interface GeneratedApiDocument {
  component: string;
  symbols: Record<string, GeneratedApiSymbol>;
}

export interface GeneratedApiRow {
  name: string;
  required?: boolean;
  default?: string;
  type?: string;
  parameters?: string;
  description: string;
  descriptionKey?: string | null;
}

export interface GeneratedApiTypeField {
  name: string;
  required?: boolean;
  type: string;
  description?: string;
  descriptionKey?: string | null;
}

export interface GeneratedApiTypeTable {
  name: string;
  displayName?: string;
  description?: string;
  descriptionKey?: string | null;
  fields: GeneratedApiTypeField[];
}

export interface GeneratedApiUnionType {
  name: string;
  displayName?: string;
  description?: string;
  descriptionKey?: string | null;
  type: string;
  code?: string;
}

export interface GeneratedApiCallableType {
  name: string;
  displayName?: string;
  description?: string;
  descriptionKey?: string | null;
  preset: 'emits' | 'slots';
  rows: GeneratedApiRow[];
}

export type GeneratedApiTypePreview =
  | ({ kind: 'table' } & GeneratedApiTypeTable)
  | ({ kind: 'callable' } & GeneratedApiCallableType)
  | ({ kind: 'union' } & GeneratedApiUnionType);

export interface GeneratedApiSymbolSection {
  key: string;
  name: string;
  displayName: string;
  propsRows: GeneratedApiRow[];
  emitsRows: GeneratedApiRow[];
  slotsRows: GeneratedApiRow[];
}

export interface GeneratedApiLayerSection {
  key: string;
  symbols: GeneratedApiSymbolSection[];
}

const generatedApiModules = import.meta.glob<GeneratedApiDocument>('../../generated/api/*/*.json', {
  eager: true,
  import: 'default'
});

const sourceTypeModules = {
  ...import.meta.glob<string>('../../../../aria/src/**/*.ts', {
    eager: true,
    query: '?raw',
    import: 'default'
  }),
  ...import.meta.glob<string>('../../../../src/**/*.ts', {
    eager: true,
    query: '?raw',
    import: 'default'
  })
};

/** `../../generated/api/<pkg>/<component>.json` -> `<pkg>`. */
function resolveApiPackageKey(filePath: string): string {
  return filePath.split('/').at(-2) ?? 'ui';
}

const componentApiEntries = Object.fromEntries(
  Object.entries(generatedApiModules)
    .filter(([filePath]) => !filePath.endsWith('/index.json'))
    .map(([filePath, document]) => [document.component, { pkg: resolveApiPackageKey(filePath), document }])
) as Record<string, { pkg: string; document: GeneratedApiDocument }>;

const componentApiDocuments = Object.fromEntries(
  Object.entries(componentApiEntries).map(([component, entry]) => [component, entry.document])
) as Record<string, GeneratedApiDocument>;

const packageByComponent = Object.fromEntries(
  Object.entries(componentApiEntries).map(([component, entry]) => [component, entry.pkg])
) as Record<string, string>;

const packagePrefixMap: Record<string, string> = {
  ui: 'S',
  chart: 'S',
  admin: 'S'
};

const sourceTypeFiles = Object.fromEntries(
  Object.entries(sourceTypeModules).map(([path, content]) => [normalizeSourceModulePath(path), content])
) as Record<string, string>;
const sourceTypePreviewCache = new Map<string, GeneratedApiTypePreview | null>();
const externalTypeImportRegistry = buildExternalTypeImportRegistry();

const workspaceTypePathPattern = /^(aria|src)\//u;
const componentScopedTypePathPattern = /^(aria|src)\/src\/components\//u;

const commonTypeRegistry = buildCommonTypeRegistry();
const componentLocalTypePreviewRegistry = buildComponentLocalTypePreviewRegistry();
const commonTypePreviewRegistry = buildTypePreviewRegistry(Array.from(commonTypeRegistry.values()));
const generatedTypePreviewRegistry = buildGeneratedTypePreviewRegistry();

function buildCommonTypeRegistry() {
  const usage = new Map<string, { type: GeneratedApiReferencedType; components: Set<string> }>();

  for (const [component, document] of Object.entries(componentApiDocuments)) {
    const componentTypes = new Map<string, GeneratedApiReferencedType>();

    for (const symbol of Object.values(document.symbols)) {
      for (const type of collectSymbolTypes(symbol)) {
        componentTypes.set(type.name, type);
      }
    }

    for (const type of componentTypes.values()) {
      if (!isEligibleCommonType(type)) {
        continue;
      }

      const existing = usage.get(type.name);

      if (existing) {
        existing.components.add(component);
        continue;
      }

      usage.set(type.name, {
        type,
        components: new Set([component])
      });
    }
  }

  return new Map(
    Array.from(usage.entries())
      .filter(([, entry]) => entry.components.size > 1)
      .map(([name, entry]) => [name, entry.type])
  );
}

function isEligibleCommonType(type: GeneratedApiReferencedType) {
  return isResolvableWorkspaceType(type) && !componentScopedTypePathPattern.test(type.sourcePath);
}

function isResolvableWorkspaceType(type: GeneratedApiReferencedType) {
  return !type.external || workspaceTypePathPattern.test(type.sourcePath);
}

function collectSymbolTypes(symbol: GeneratedApiSymbol) {
  const collected = new Map<string, GeneratedApiReferencedType>();

  for (const [key, entry] of Object.entries(symbol)) {
    if (!entry) {
      continue;
    }

    if (key !== 'props' && key !== 'emits' && key !== 'slots') {
      setCollectedType(collected, toReferencedType(entry));
    }

    for (const type of collectEntityTypes(entry)) {
      setCollectedType(collected, type);
    }
  }

  return Array.from(collected.values());
}

function setCollectedType(collected: Map<string, GeneratedApiReferencedType>, type: GeneratedApiReferencedType) {
  const existingType = collected.get(type.name);

  if (!existingType || isRicherType(type, existingType)) {
    collected.set(type.name, type);
  }
}

function isRicherType(candidate: GeneratedApiReferencedType, current: GeneratedApiReferencedType) {
  const candidateScore = getTypeRichnessScore(candidate);
  const currentScore = getTypeRichnessScore(current);

  return candidateScore > currentScore;
}

function getTypeRichnessScore(type: GeneratedApiReferencedType) {
  return type.members.length + type.callables.length + (type.resolvedType ? 1 : 0);
}

function toReferencedType(entity: GeneratedApiEntity): GeneratedApiReferencedType {
  return {
    name: entity.name,
    kind: entity.kind,
    type: entity.type,
    resolvedType: entity.resolvedType,
    description: entity.description,
    descriptionKey: entity.descriptionKey,
    sourcePath: entity.sourcePath,
    typeParameters: entity.typeParameters,
    external: false,
    members: entity.members,
    callables: entity.callables
  };
}

function collectEntityTypes(entity: GeneratedApiEntity) {
  const collected = new Map<string, GeneratedApiReferencedType>();

  const visit = (type: GeneratedApiReferencedType) => {
    if (!isResolvableWorkspaceType(type) || collected.has(type.name)) {
      return;
    }

    collected.set(type.name, type);

    for (const member of type.members) {
      member.referencedTypes.forEach(visit);
    }

    for (const callable of type.callables) {
      callable.referencedTypes.forEach(visit);
    }
  };

  entity.referencedTypes.forEach(visit);
  entity.members.flatMap(member => member.referencedTypes).forEach(visit);
  entity.callables.flatMap(callable => callable.referencedTypes).forEach(visit);

  return Array.from(collected.values());
}

function createEntityRows(entity: GeneratedApiEntity | undefined): GeneratedApiRow[] {
  if (!entity) {
    return [];
  }

  if (entity.kind === 'props') {
    if (!entity.members.length) {
      const ignoredExtendsType = getIgnoredExtendsType(entity.sourcePath, entity.name);

      if (ignoredExtendsType) {
        return [createIgnoredExtendsSummaryRow(ignoredExtendsType)];
      }
    }

    return entity.members.map(member => ({
      name: member.name,
      required: member.required,
      default: formatDefaultValue(member.default),
      type: getDisplayMemberType(entity, member),
      description: member.description || '—',
      descriptionKey: member.descriptionKey
    }));
  }

  return entity.callables.map(callable => ({
    name: callable.name,
    required: callable.required,
    parameters: getDisplayCallableParameters(entity, callable),
    description: callable.description || '—',
    descriptionKey: callable.descriptionKey
  }));
}

function getDisplayCallableParameters(entity: GeneratedApiEntity, callable: GeneratedApiCallable) {
  const formattedParameters = formatCallableParameters(entity.kind, callable.parameters);

  if (!formattedParameters.includes('import(')) {
    return formattedParameters;
  }

  const sourceParameters = getSourceCallableParameters(entity, callable);

  if (sourceParameters) {
    return sourceParameters;
  }

  return formattedParameters;
}

function getDisplayMemberType(entity: GeneratedApiEntity, member: GeneratedApiMember) {
  const referencedTypeDisplayName = getEquivalentReferencedTypeDisplayName(member.type, member.referencedTypes);

  if (referencedTypeDisplayName) {
    return referencedTypeDisplayName;
  }

  if (!member.type.includes('import(')) {
    return member.type;
  }

  const sourceMemberType = getSourceMemberType(entity, member);

  if (sourceMemberType) {
    return sourceMemberType;
  }

  return member.type;
}

function getEquivalentReferencedTypeDisplayName(typeValue: string, referencedTypes: GeneratedApiReferencedType[]) {
  const matchedType = referencedTypes.find(referencedType => isEquivalentReferencedType(typeValue, referencedType));

  if (!matchedType) {
    return null;
  }

  return formatDisplayName(
    matchedType.name,
    resolveTypeParameters(matchedType.sourcePath, matchedType.name, matchedType.typeParameters)
  );
}

function isEquivalentReferencedType(typeValue: string, referencedType: GeneratedApiReferencedType) {
  const normalizedTypeValue = normalizeComparableType(typeValue);

  if (!normalizedTypeValue) {
    return false;
  }

  const comparableReferencedTypes = [referencedType.resolvedType, referencedType.type]
    .filter(Boolean)
    .map(candidateType => normalizeComparableType(candidateType!));

  return comparableReferencedTypes.includes(normalizedTypeValue);
}

function normalizeComparableType(typeValue: string) {
  return typeValue
    .replace(/\s+/gu, ' ')
    .replace(/\s*\|\s*undefined/gu, '')
    .trim();
}

function formatCallableParameters(kind: GeneratedApiEntity['kind'], parameters: string) {
  if (!parameters) {
    return '—';
  }

  if (kind === 'emits') {
    const normalizedParameters = parameters.replace(/^\[(.+)\]$/u, '$1');
    const match = normalizedParameters.match(/^[^:]+:\s*(.+)$/);

    return match?.[1] ?? normalizedParameters;
  }

  const slotMatch = parameters.match(/^\(\(props:\s*(.+?)\)\s*=>\s*any\)\s*\|\s*undefined$/);

  if (slotMatch) {
    return slotMatch[1];
  }

  if (parameters === '(() => any) | undefined') {
    return '—';
  }

  return parameters.replace(/\s*\|\s*undefined$/, '');
}

function formatDefaultValue(value: GeneratedApiMember['default']) {
  if (value === null || value === undefined) {
    return '—';
  }

  return String(value);
}

function buildExternalTypeImportRegistry() {
  const importsByTypeName = new Map<string, Set<string>>();

  for (const source of Object.values(sourceTypeFiles)) {
    for (const importedType of collectExternalImportedTypes(source)) {
      const importEntries = importsByTypeName.get(importedType.localName) ?? new Set<string>();

      importEntries.add(`${importedType.packageName}::${importedType.importedName}`);
      importsByTypeName.set(importedType.localName, importEntries);
    }
  }

  return new Map(
    Array.from(importsByTypeName.entries())
      .filter(([, importEntries]) => importEntries.size === 1)
      .map(([typeName, importEntries]) => {
        const [packageName, importedName] = Array.from(importEntries)[0].split('::');

        return [typeName, { packageName, importedName }] as const;
      })
  );
}

function collectExternalImportedTypes(source: string) {
  const importedTypes: Array<{ importedName: string; localName: string; packageName: string }> = [];
  const importTypePattern = /import\s+type\s+\{([\s\S]*?)\}\s+from\s+['"]([^'"]+)['"]/gu;
  let importTypeMatch: RegExpExecArray | null;

  while ((importTypeMatch = importTypePattern.exec(source))) {
    const [, specifiersBlock, packageName] = importTypeMatch;

    if (!isExternalImportSource(packageName)) {
      continue;
    }

    for (const specifier of splitTopLevelCommaSegments(specifiersBlock)) {
      const normalizedSpecifier = specifier.trim().replace(/^type\s+/u, '');

      if (!normalizedSpecifier) {
        continue;
      }

      const [importedName, localName = importedName] = normalizedSpecifier
        .split(/\s+as\s+/u)
        .map(value => value.trim());

      if (!importedName || !localName) {
        continue;
      }

      importedTypes.push({
        importedName,
        localName,
        packageName
      });
    }
  }

  const defaultImportPattern = /import\s+type\s+([A-Za-z_$][\w$]*)\s+from\s+['"]([^'"]+)['"]/gu;
  let defaultImportMatch: RegExpExecArray | null;

  while ((defaultImportMatch = defaultImportPattern.exec(source))) {
    const [, localName, packageName] = defaultImportMatch;

    if (!isExternalImportSource(packageName)) {
      continue;
    }

    importedTypes.push({
      importedName: 'default',
      localName,
      packageName
    });
  }

  return importedTypes;
}

function isExternalImportSource(importSource: string) {
  return (
    !importSource.startsWith('.') &&
    !importSource.startsWith('~/') &&
    !importSource.startsWith('@vean/') &&
    !importSource.startsWith('@soybeanjs/')
  );
}

function normalizeSourceModulePath(path: string) {
  return path.replace(/^\.\.\/\.\.\/\.\.\/\.\.\//u, '');
}

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
}

function getIgnoredExtendsType(sourcePath: string, typeName: string) {
  const source = sourceTypeFiles[sourcePath];

  if (!source) {
    return null;
  }

  const interfacePattern = new RegExp(
    `export\\s+interface\\s+${escapeRegExp(typeName)}(?:<[^>]+>)?\\s+extends\\s+([^\\{]+)\\{`,
    'u'
  );
  const extendsClause = source.match(interfacePattern)?.[1];

  if (!extendsClause) {
    return null;
  }

  const ignoredExtendsMatch = extendsClause.match(/\/\*\*\s*@vue-ignore\s*\*\/\s*([^,]+)/u);

  return ignoredExtendsMatch?.[1]?.trim() ?? null;
}

function createIgnoredExtendsSummaryRow(typeName: string): GeneratedApiRow {
  return {
    name: 'attrs',
    required: false,
    default: '—',
    type: typeName,
    description: `Inherited from ${typeName}.`,
    descriptionKey: null
  };
}

function normalizeGeneratedTypeParameter(typeParameter: string) {
  return typeParameter.replace(/^TypeParameter\s+/u, '').trim();
}

function splitTopLevelCommaSegments(typeValue: string) {
  const segments: string[] = [];
  let current = '';
  let roundDepth = 0;
  let squareDepth = 0;
  let curlyDepth = 0;
  let angleDepth = 0;
  let quote: '"' | "'" | null = null;

  for (const character of typeValue) {
    current += character;

    if (quote) {
      if (character === quote) {
        quote = null;
      }

      continue;
    }

    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }

    if (character === '(') {
      roundDepth += 1;
      continue;
    }

    if (character === ')') {
      roundDepth -= 1;
      continue;
    }

    if (character === '[') {
      squareDepth += 1;
      continue;
    }

    if (character === ']') {
      squareDepth -= 1;
      continue;
    }

    if (character === '{') {
      curlyDepth += 1;
      continue;
    }

    if (character === '}') {
      curlyDepth -= 1;
      continue;
    }

    if (character === '<') {
      angleDepth += 1;
      continue;
    }

    if (character === '>') {
      angleDepth -= 1;
      continue;
    }

    if (character === ',' && roundDepth === 0 && squareDepth === 0 && curlyDepth === 0 && angleDepth === 0) {
      const segment = current.slice(0, -1).trim();

      if (segment) {
        segments.push(segment);
      }

      current = '';
    }
  }

  const trailingSegment = current.trim();

  if (trailingSegment) {
    segments.push(trailingSegment);
  }

  return segments;
}

function readBalancedAngleBlock(source: string, openAngleIndex: number) {
  let depth = 0;
  let quote: '"' | "'" | null = null;

  for (let index = openAngleIndex; index < source.length; index += 1) {
    const character = source[index];

    if (quote) {
      if (character === quote && source[index - 1] !== '\\') {
        quote = null;
      }

      continue;
    }

    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }

    if (character === '<') {
      depth += 1;
      continue;
    }

    if (character === '>') {
      depth -= 1;

      if (depth === 0) {
        return source.slice(openAngleIndex + 1, index).trim();
      }
    }
  }

  return null;
}

function getSourceTypeParameters(sourcePath: string, typeName: string) {
  const source = sourceTypeFiles[sourcePath];

  if (!source) {
    return [] as string[];
  }

  const match = new RegExp(`export\\s+(?:interface|type)\\s+${escapeRegExp(typeName)}`, 'u').exec(source);

  if (!match) {
    return [] as string[];
  }

  let index = match.index + match[0].length;

  while (index < source.length && /\s/u.test(source[index])) {
    index += 1;
  }

  if (source[index] !== '<') {
    return [] as string[];
  }

  const typeParameterBlock = readBalancedAngleBlock(source, index);

  if (!typeParameterBlock) {
    return [] as string[];
  }

  return splitTopLevelCommaSegments(typeParameterBlock);
}

function resolveTypeParameters(sourcePath: string, typeName: string, typeParameters: string[]) {
  const sourceTypeParameters = getSourceTypeParameters(sourcePath, typeName);

  if (sourceTypeParameters.length) {
    return sourceTypeParameters;
  }

  return typeParameters.map(normalizeGeneratedTypeParameter).filter(Boolean);
}

function formatDisplayName(name: string, typeParameters: string[]) {
  if (!typeParameters.length) {
    return name;
  }

  return `${name}<${typeParameters.join(', ')}>`;
}

function getSourceTypePreview(typeName: string) {
  const cachedPreview = sourceTypePreviewCache.get(typeName);

  if (cachedPreview !== undefined) {
    return cachedPreview;
  }

  for (const [sourcePath, source] of Object.entries(sourceTypeFiles)) {
    const preview = extractSourceTypePreview(sourcePath, source, typeName);

    if (preview) {
      sourceTypePreviewCache.set(typeName, preview);

      return preview;
    }
  }

  sourceTypePreviewCache.set(typeName, null);

  return null;
}

function extractSourceTypePreview(sourcePath: string, source: string, typeName: string) {
  const typeParameters = resolveTypeParameters(sourcePath, typeName, []);

  const interfaceBody = getExportInterfaceBody(source, typeName);

  if (interfaceBody !== null) {
    const normalizedInterfaceBody = stripSourceComments(interfaceBody);
    const fields = parseObjectLiteralFields(`{ ${normalizedInterfaceBody} }`);

    if (fields.length) {
      return {
        kind: 'table',
        name: typeName,
        displayName: formatDisplayName(typeName, typeParameters),
        fields
      } satisfies GeneratedApiTypePreview;
    }

    const ignoredExtendsType = getIgnoredExtendsType(sourcePath, typeName);

    if (ignoredExtendsType) {
      const interfaceDeclaration = getExportInterfaceDeclaration(source, typeName) ?? undefined;

      return {
        kind: 'union',
        name: typeName,
        displayName: formatDisplayName(typeName, typeParameters),
        type: ignoredExtendsType,
        code: interfaceDeclaration
      } satisfies GeneratedApiTypePreview;
    }
  }

  const typeAliasValue = getExportTypeAliasValue(source, typeName);

  if (!typeAliasValue) {
    return null;
  }

  return toTypePreview({
    name: typeName,
    kind: 'typeAlias',
    type: typeAliasValue,
    resolvedType: typeAliasValue,
    description: '',
    descriptionKey: null,
    sourcePath,
    typeParameters,
    external: false,
    members: [],
    callables: []
  });
}

function stripSourceComments(source: string) {
  return source
    .replace(/\/\*\*[\s\S]*?\*\//gu, '')
    .replace(/\/\*[\s\S]*?\*\//gu, '')
    .replace(/^\s*\/\/.*$/gmu, '')
    .trim();
}

function getExportInterfaceBody(source: string, typeName: string) {
  const match = getExportInterfaceMatch(source, typeName);

  if (!match) {
    return null;
  }

  return readBalancedCurlyBlock(source, match.index + match[0].length - 1);
}

function getExportInterfaceDeclaration(source: string, typeName: string) {
  const match = getExportInterfaceMatch(source, typeName);

  if (!match) {
    return null;
  }

  const openBraceIndex = match.index + match[0].length - 1;
  const closeBraceIndex = findBalancedCurlyBlockEnd(source, openBraceIndex);

  if (closeBraceIndex === -1) {
    return null;
  }

  return source
    .slice(match.index, closeBraceIndex + 1)
    .trim()
    .replace(/^export\s+/u, '');
}

function getExportInterfaceMatch(source: string, typeName: string) {
  return new RegExp(
    `export\\s+interface\\s+${escapeRegExp(typeName)}(?:<[^>]+>)?(?:\\s+extends\\s+[^\\{]+)?\\s*\\{`,
    'u'
  ).exec(source);
}

function getExportTypeAliasBody(source: string, typeName: string) {
  const match = new RegExp(`export\\s+type\\s+${escapeRegExp(typeName)}(?:<[^>]+>)?\\s*=\\s*\\{`, 'u').exec(source);

  if (!match) {
    return null;
  }

  return readBalancedCurlyBlock(source, match.index + match[0].length - 1);
}

function getSourceMemberType(entity: GeneratedApiEntity, member: GeneratedApiMember) {
  const source = sourceTypeFiles[member.sourcePath];

  if (!source) {
    return null;
  }

  const ownerTypeName = getMemberOwnerTypeName(entity, member);
  const declarationBody =
    getExportInterfaceBody(source, ownerTypeName) ?? getExportTypeAliasBody(source, ownerTypeName) ?? source;
  const propertyPattern = new RegExp(
    `(?:^|[;\\n])\\s*['"]?${escapeRegExp(member.name)}['"]?(?<optional>\\?)?:\\s*(?<type>[^;\\n]+)`,
    'u'
  );
  const matchedType = stripSourceComments(declarationBody).match(propertyPattern)?.groups?.type?.trim();

  return matchedType ?? null;
}

function getSourceCallableParameters(entity: GeneratedApiEntity, callable: GeneratedApiCallable) {
  const source = sourceTypeFiles[callable.sourcePath];

  if (!source) {
    return null;
  }

  const ownerTypeName = getCallableOwnerTypeName(entity, callable);
  const declarationBody =
    getExportTypeAliasBody(source, ownerTypeName) ?? getExportInterfaceBody(source, ownerTypeName) ?? source;
  const callablePattern = new RegExp(
    `(?:^|[;\\n])\\s*['"]?${escapeRegExp(callable.name)}['"]?(?<optional>\\?)?:\\s*(?<type>[^;\\n]+)`,
    'u'
  );
  const matchedType = stripSourceComments(declarationBody).match(callablePattern)?.groups?.type?.trim();

  if (!matchedType) {
    return null;
  }

  return formatCallableParameters(entity.kind as 'props' | 'emits' | 'slots', matchedType);
}

function getMemberOwnerTypeName(entity: GeneratedApiEntity, member: GeneratedApiMember) {
  if (member.inheritedFrom?.includes('.')) {
    return member.inheritedFrom.split('.')[0];
  }

  return entity.name;
}

function getCallableOwnerTypeName(entity: GeneratedApiEntity, callable: GeneratedApiCallable) {
  const referencedOwner = entity.referencedTypes.find(type => {
    return (
      type.sourcePath === callable.sourcePath &&
      type.callables.some(typeCallable => typeCallable.name === callable.name)
    );
  });

  return referencedOwner?.name ?? entity.name;
}

function getExportTypeAliasValue(source: string, typeName: string) {
  const match = new RegExp(`export\\s+type\\s+${escapeRegExp(typeName)}(?:<[^>]+>)?\\s*=`, 'u').exec(source);

  if (!match) {
    return null;
  }

  const startIndex = match.index + match[0].length;
  const endIndex = findTopLevelStatementEnd(source, startIndex);

  if (endIndex === -1) {
    return null;
  }

  return source.slice(startIndex, endIndex).trim();
}

function readBalancedCurlyBlock(source: string, openBraceIndex: number) {
  const closeBraceIndex = findBalancedCurlyBlockEnd(source, openBraceIndex);

  if (closeBraceIndex === -1) {
    return null;
  }

  return source.slice(openBraceIndex + 1, closeBraceIndex).trim();
}

function findBalancedCurlyBlockEnd(source: string, openBraceIndex: number) {
  let depth = 0;

  for (let index = openBraceIndex; index < source.length; index += 1) {
    const character = source[index];

    if (character === '{') {
      depth += 1;
      continue;
    }

    if (character === '}') {
      depth -= 1;

      if (depth === 0) {
        return index;
      }
    }
  }

  return -1;
}

function findTopLevelStatementEnd(source: string, startIndex: number) {
  let roundDepth = 0;
  let squareDepth = 0;
  let curlyDepth = 0;
  let angleDepth = 0;
  let quote: '"' | "'" | null = null;

  for (let index = startIndex; index < source.length; index += 1) {
    const character = source[index];

    if (quote) {
      if (character === quote && source[index - 1] !== '\\') {
        quote = null;
      }

      continue;
    }

    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }

    if (character === '(') {
      roundDepth += 1;
      continue;
    }

    if (character === ')') {
      roundDepth -= 1;
      continue;
    }

    if (character === '[') {
      squareDepth += 1;
      continue;
    }

    if (character === ']') {
      squareDepth -= 1;
      continue;
    }

    if (character === '{') {
      curlyDepth += 1;
      continue;
    }

    if (character === '}') {
      curlyDepth -= 1;
      continue;
    }

    if (character === '<') {
      angleDepth += 1;
      continue;
    }

    if (character === '>') {
      angleDepth -= 1;
      continue;
    }

    if (character === ';' && roundDepth === 0 && squareDepth === 0 && curlyDepth === 0 && angleDepth === 0) {
      return index;
    }
  }

  return -1;
}

function isUiSymbol(symbol: GeneratedApiSymbol) {
  return [symbol.props, symbol.emits, symbol.slots].filter(Boolean).some(entry => entry?.sourcePath.startsWith('src/'));
}

function toPackageDisplayName(symbolName: string, pkg: string) {
  const prefix = packagePrefixMap[pkg];

  if (!prefix || symbolName.startsWith(prefix)) {
    return symbolName;
  }

  return `${prefix}${symbolName}`;
}

function toTypeTable(type: GeneratedApiReferencedType): GeneratedApiTypeTable | null {
  if (type.callables.length) {
    return null;
  }

  const fields = type.members.length
    ? toMemberFields(type.members)
    : parseObjectLiteralFields(type.resolvedType ?? type.type);

  if (!fields.length) {
    return null;
  }

  return {
    name: type.name,
    displayName: formatDisplayName(type.name, resolveTypeParameters(type.sourcePath, type.name, type.typeParameters)),
    description: type.description,
    descriptionKey: type.descriptionKey,
    fields
  };
}

function toMemberFields(members: GeneratedApiMember[]): GeneratedApiTypeField[] {
  return members.map(member => ({
    name: member.name,
    required: member.required,
    type: member.type,
    description: member.description,
    descriptionKey: member.descriptionKey
  }));
}

function parseObjectLiteralFields(typeValue: string | null) {
  const content = unwrapObjectLiteral(typeValue);

  if (!content) {
    return [] as GeneratedApiTypeField[];
  }

  return splitTopLevelTypeSegments(content).map(parseObjectLiteralField).filter(Boolean) as GeneratedApiTypeField[];
}

function unwrapObjectLiteral(typeValue: string | null) {
  const trimmedType = typeValue?.trim();

  if (!trimmedType?.startsWith('{') || !trimmedType.endsWith('}')) {
    return null;
  }

  return trimmedType.slice(1, -1).trim();
}

function splitTopLevelTypeSegments(typeValue: string) {
  const segments: string[] = [];
  let current = '';
  let roundDepth = 0;
  let squareDepth = 0;
  let curlyDepth = 0;
  let angleDepth = 0;
  let quote: '"' | "'" | null = null;

  for (const character of typeValue) {
    current += character;

    if (quote) {
      if (character === quote) {
        quote = null;
      }

      continue;
    }

    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }

    if (character === '(') {
      roundDepth += 1;
      continue;
    }

    if (character === ')') {
      roundDepth -= 1;
      continue;
    }

    if (character === '[') {
      squareDepth += 1;
      continue;
    }

    if (character === ']') {
      squareDepth -= 1;
      continue;
    }

    if (character === '{') {
      curlyDepth += 1;
      continue;
    }

    if (character === '}') {
      curlyDepth -= 1;
      continue;
    }

    if (character === '<') {
      angleDepth += 1;
      continue;
    }

    if (character === '>') {
      angleDepth -= 1;
      continue;
    }

    if (character === ';' && roundDepth === 0 && squareDepth === 0 && curlyDepth === 0 && angleDepth === 0) {
      const segment = current.slice(0, -1).trim();

      if (segment) {
        segments.push(segment);
      }

      current = '';
    }
  }

  const trailingSegment = current.trim();

  if (trailingSegment) {
    segments.push(trailingSegment);
  }

  return segments;
}

function parseObjectLiteralField(segment: string): GeneratedApiTypeField | null {
  const match = segment.match(/^(?<name>(?:'[^']+'|"[^"]+"|[^?:]+?))(?<optional>\?)?:\s*(?<type>.+)$/u);

  if (!match?.groups) {
    return null;
  }

  return {
    name: match.groups.name.replace(/^['"]|['"]$/gu, '').trim(),
    required: !match.groups.optional,
    type: match.groups.type.trim(),
    description: '',
    descriptionKey: null
  };
}

function toCallableType(type: GeneratedApiReferencedType): GeneratedApiCallableType | null {
  if (!type.callables.length) {
    return null;
  }

  const preset = inferCallablePreset(type.name);

  return {
    name: type.name,
    displayName: formatDisplayName(type.name, resolveTypeParameters(type.sourcePath, type.name, type.typeParameters)),
    description: type.description,
    descriptionKey: type.descriptionKey,
    preset,
    rows: type.callables.map(callable => ({
      name: callable.name,
      required: callable.required,
      parameters: formatCallableParameters(preset, callable.parameters),
      description: callable.description || '—',
      descriptionKey: callable.descriptionKey
    }))
  };
}

function inferCallablePreset(typeName: string): 'emits' | 'slots' {
  return typeName.endsWith('Slots') ? 'slots' : 'emits';
}

function toTypePreview(type: GeneratedApiReferencedType): GeneratedApiTypePreview | null {
  const table = toTypeTable(type);

  if (table) {
    return {
      kind: 'table',
      ...table
    };
  }

  const callable = toCallableType(type);

  if (callable) {
    return {
      kind: 'callable',
      ...callable
    };
  }

  const union = toUnionType(type);

  if (union) {
    return {
      kind: 'union',
      ...union
    };
  }

  const ignoredExtendsType = getIgnoredExtendsType(type.sourcePath, type.name);

  if (ignoredExtendsType) {
    const interfaceDeclaration =
      getExportInterfaceDeclaration(sourceTypeFiles[type.sourcePath] ?? '', type.name) ?? undefined;

    return {
      kind: 'union',
      name: type.name,
      displayName: formatDisplayName(type.name, resolveTypeParameters(type.sourcePath, type.name, type.typeParameters)),
      description: type.description,
      descriptionKey: type.descriptionKey,
      type: ignoredExtendsType,
      code: interfaceDeclaration
    };
  }

  return null;
}

function buildTypePreviewRegistry(types: GeneratedApiReferencedType[]) {
  const registry = new Map<string, GeneratedApiTypePreview>();

  for (const type of types) {
    const preview = toTypePreview(type);

    if (preview) {
      registry.set(type.name, preview);
    }
  }

  return registry;
}

function buildComponentLocalTypePreviewRegistry() {
  const registry = new Map<string, Map<string, GeneratedApiTypePreview>>();

  for (const [component, document] of Object.entries(componentApiDocuments)) {
    const allTypes = new Map<string, GeneratedApiReferencedType>();

    for (const symbol of Object.values(document.symbols)) {
      for (const type of collectSymbolTypes(symbol)) {
        allTypes.set(type.name, type);
      }
    }

    const localTypes = Array.from(allTypes.values()).filter(type => !commonTypeRegistry.has(type.name));
    registry.set(component, buildTypePreviewRegistry(localTypes));
  }

  return registry;
}

function buildGeneratedTypePreviewRegistry() {
  const collected = new Map<string, GeneratedApiReferencedType>();

  for (const document of Object.values(componentApiDocuments)) {
    for (const symbol of Object.values(document.symbols)) {
      for (const type of collectSymbolTypes(symbol)) {
        setCollectedType(collected, type);
      }
    }
  }

  return buildTypePreviewRegistry(Array.from(collected.values()));
}

function toUnionType(type: GeneratedApiReferencedType): GeneratedApiUnionType | null {
  const resolvedType = type.resolvedType ?? type.type;

  if (!resolvedType || resolvedType === type.name) {
    return null;
  }

  return {
    name: type.name,
    displayName: formatDisplayName(type.name, resolveTypeParameters(type.sourcePath, type.name, type.typeParameters)),
    description: type.description,
    descriptionKey: type.descriptionKey,
    type: resolvedType
  };
}

function sortTypes<T extends { name: string }>(types: T[]) {
  return [...types].sort((left, right) => left.name.localeCompare(right.name));
}

export function getGeneratedApiDocument(component: string) {
  return componentApiDocuments[component];
}

export function getComponentApiSections(component: string): GeneratedApiLayerSection[] {
  const document = getGeneratedApiDocument(component);

  if (!document) {
    return [];
  }

  const pkg = packageByComponent[component] ?? 'ui';
  const orderedSymbols = Object.keys(document.symbols);
  const symbolSections: GeneratedApiSymbolSection[] = [];

  for (const symbolName of orderedSymbols) {
    const symbol = document.symbols[symbolName];

    if (!symbol) {
      continue;
    }

    const displayName = isUiSymbol(symbol) || pkg !== 'ui' ? toPackageDisplayName(symbolName, pkg) : symbolName;

    symbolSections.push({
      key: symbolName,
      name: symbolName,
      displayName: formatDisplayName(
        displayName,
        resolveTypeParameters(
          (symbol.props ?? symbol.emits ?? symbol.slots)?.sourcePath ?? '',
          (symbol.props ?? symbol.emits ?? symbol.slots)?.name ?? symbolName,
          (symbol.props ?? symbol.emits ?? symbol.slots)?.typeParameters ?? []
        )
      ),
      propsRows: createEntityRows(symbol.props),
      emitsRows: createEntityRows(symbol.emits),
      slotsRows: createEntityRows(symbol.slots)
    });
  }

  if (pkg === 'ui') {
    const uiSymbols = symbolSections.filter((_, index) => isUiSymbol(document.symbols[orderedSymbols[index]]));
    const ariaSymbols = symbolSections.filter((_, index) => !isUiSymbol(document.symbols[orderedSymbols[index]]));

    return [
      {
        key: 'ui',
        symbols: uiSymbols
      },
      {
        key: 'aria',
        symbols: ariaSymbols
      }
    ].filter(layer => layer.symbols.length);
  }

  // Peripheral packages (admin, chart, ...) are single-package: render one layer.
  return [
    {
      key: pkg,
      symbols: symbolSections
    }
  ];
}

export function getCommonTypes() {
  const commonTypes = Array.from(commonTypeRegistry.values());
  const tables = sortTypes(commonTypes.map(toTypeTable).filter(Boolean) as GeneratedApiTypeTable[]);
  const callables = sortTypes(commonTypes.map(toCallableType).filter(Boolean) as GeneratedApiCallableType[]);
  const unions = sortTypes(commonTypes.map(toUnionType).filter(Boolean) as GeneratedApiUnionType[]).filter(
    union =>
      !tables.some(table => table.name === union.name) && !callables.some(callable => callable.name === union.name)
  );

  return {
    tables,
    callables,
    unions
  };
}

export function isCommonTypeName(typeName: string) {
  return commonTypeRegistry.has(typeName);
}

export function getExternalTypeImportSignature(typeName: string) {
  const importInfo = externalTypeImportRegistry.get(typeName);

  if (!importInfo) {
    return null;
  }

  return `import('${importInfo.packageName}').${importInfo.importedName}`;
}

export function getComponentTypePreview(component: string, typeName: string) {
  return (
    componentLocalTypePreviewRegistry.get(component)?.get(typeName) ??
    commonTypePreviewRegistry.get(typeName) ??
    generatedTypePreviewRegistry.get(typeName) ??
    getSourceTypePreview(typeName) ??
    null
  );
}

export function getCommonTypePreview(typeName: string) {
  return (
    commonTypePreviewRegistry.get(typeName) ??
    generatedTypePreviewRegistry.get(typeName) ??
    getSourceTypePreview(typeName) ??
    null
  );
}
