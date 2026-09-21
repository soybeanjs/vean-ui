import type { SourceFile } from 'typescript';
import { camelCase, pascalCase } from '../../../aria/src/shared/string';
import { getExportModuleSpecifier, getNamedExportNames } from './ast';

export interface CatalogGroup {
  /** camelCase component directory, e.g. `configProvider` */
  key: string;
  /** PascalCase family name derived from the directory, e.g. `ConfigProvider` */
  name: string;
  /** component exports collected from the family barrel */
  exports: string[];
}

export type IsGroupExport = (exportName: string, groupName: string) => boolean;

function isPascalIdentifier(name: string): boolean {
  return /^[A-Z][A-Za-z0-9]*$/.test(name) && !/^[A-Z0-9_]+$/.test(name);
}

/** Aria families: every component export repeats the family name (`Button`, `ButtonGroup`). */
export function isFamilyExport(exportName: string, groupName: string): boolean {
  return isPascalIdentifier(exportName) && (exportName === groupName || exportName.startsWith(groupName));
}

/** Styled wrappers: every component export carries the `S` Styled prefix (`SButton`). */
export function isStyledExport(exportName: string): boolean {
  return isPascalIdentifier(exportName) && exportName.startsWith('S');
}

/** Component directories re-exported by a package barrel (`export * from './components/button'`). */
export function getBarrelComponentDirectories(sourceFile: SourceFile): string[] {
  return sourceFile.statements.flatMap(statement => {
    const componentDir = getExportModuleSpecifier(statement)?.match(/^\.\/components\/([^/]+)$/)?.[1];

    return componentDir && !componentDir.startsWith('_') ? [componentDir] : [];
  });
}

export async function collectCatalogGroups(options: {
  index: SourceFile;
  readComponentIndex: (componentDir: string) => Promise<SourceFile>;
  isGroupExport: IsGroupExport;
}): Promise<CatalogGroup[]> {
  const { index, readComponentIndex, isGroupExport } = options;
  const groups = await Promise.all(
    getBarrelComponentDirectories(index).map(async componentDir => {
      const name = pascalCase(componentDir);
      const exports = getNamedExportNames(await readComponentIndex(componentDir)).filter(exportName =>
        isGroupExport(exportName, name)
      );

      return exports.length ? { key: camelCase(componentDir), name, exports } : null;
    })
  );

  return groups.filter(group => group !== null);
}

function formatExportList(values: string[]): string {
  if (values.length === 1) {
    return `['${values[0]}']`;
  }

  return `[\n${values.map(value => `    '${value}'`).join(',\n')}\n  ]`;
}

/** `export const components = { button: ['Button', ...], ... };` — the catalog consumed by resolvers/docs. */
export function emitComponentsModule(groups: CatalogGroup[]): string {
  const entries = [...groups]
    .sort((left, right) => left.key.localeCompare(right.key))
    .map(group => `  ${group.key}: ${formatExportList(group.exports)}`);

  return `export const components = {\n${entries.join(',\n')}\n};\n`;
}

function getNamespaceMemberName(groupName: string, exportName: string): string {
  if (exportName === groupName) {
    return 'Root';
  }

  const suffix = exportName.startsWith(groupName) ? exportName.slice(groupName.length) : '';

  return suffix && /^[A-Z]/.test(suffix) ? suffix : exportName;
}

/** `export const Button = { ... }` would collide with the imported root `Button`, so such groups skip namespacing. */
function hasRootCollision(group: CatalogGroup): boolean {
  return group.exports.includes(group.name);
}

function emitNamespaceObject(group: CatalogGroup): string {
  // Emit the shorthand when the member keeps its exported name: that is what the
  // repo's `object-shorthand` lint rule rewrites it to, and generated files must
  // survive `pnpm lint` unchanged.
  const members = group.exports.map(exportName => {
    const memberName = getNamespaceMemberName(group.name, exportName);

    return memberName === exportName ? `  ${exportName}` : `  ${memberName}: ${exportName}`;
  });
  const types = group.exports.map(
    exportName => `  ${getNamespaceMemberName(group.name, exportName)}: typeof ${exportName};`
  );

  return `export const ${group.name} = {\n${members.join(',\n')}\n} as {\n${types.join('\n')}\n};`;
}

/** Namespaced re-exports (`import { ... } from '../index'`), mirroring the public namespaced surface. */
export function emitNamespacedModule(groups: CatalogGroup[], options?: { from?: string }): string {
  const from = options?.from ?? '../index';
  const exportNames = [...new Set(groups.flatMap(group => group.exports))].sort((left, right) =>
    left.localeCompare(right)
  );
  const importBlock = `import {\n${exportNames.map(name => `  ${name}`).join(',\n')}\n} from '${from}';`;
  const exports = groups.map(group =>
    group.exports.length === 1 || hasRootCollision(group)
      ? `export { ${group.exports.join(', ')} };`
      : emitNamespaceObject(group)
  );

  return `${importBlock}\n\n${exports.join('\n\n')}\n`;
}
