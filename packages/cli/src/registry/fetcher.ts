import * as v from 'valibot';
import type { Config } from './config';
import { BUILTIN_REGISTRIES, DEFAULT_REGISTRY_NAMESPACE } from './constants';
import {
  getCachedRegistryItem,
  getCachedRegistryItemEtag,
  getCachedRegistryItemRaw,
  setCachedRegistryItem,
  getCachedRegistryCatalog,
  getCachedRegistryCatalogEtag,
  getCachedRegistryCatalogRaw,
  setCachedRegistryCatalog
} from './cache';
import { getItemBasename, getItemPackage, AmbiguousComponentNameError, PackageNamespaceRequiredError } from './loader';
import { registryItemSchema } from './schema';
import type { RegistryItem } from './schema';

type RegistryConfigSource = Pick<Config, 'registries'> | null | undefined;

function parseRegistrySpecifier(specifier: string): { namespace: string | null; name: string } {
  if (specifier.startsWith('@')) {
    const slashIndex = specifier.indexOf('/');

    if (slashIndex > 0) {
      return {
        namespace: specifier.slice(0, slashIndex),
        name: specifier.slice(slashIndex + 1)
      };
    }
  }

  return {
    namespace: null,
    name: specifier
  };
}

function getRegistrySources(config?: RegistryConfigSource): Record<string, string> {
  return {
    ...BUILTIN_REGISTRIES,
    ...config?.registries
  };
}

function buildRegistryItemUrl(registryUrl: string, name: string): string {
  if (registryUrl.includes('{name}')) {
    return registryUrl.replace('{name}', name);
  }

  return `${registryUrl.replace(/\/$/, '')}/${name}.json`;
}

function buildRegistryCatalogUrl(registryUrl: string): string {
  if (registryUrl.includes('{name}')) {
    return registryUrl.replace('{name}', 'registry');
  }

  return `${registryUrl.replace(/\/$/, '')}/registry.json`;
}

function resolveRegistryTargets(specifier: string, config?: RegistryConfigSource) {
  const parsed = parseRegistrySpecifier(specifier);
  const sources = getRegistrySources(config);

  if (parsed.namespace) {
    const registryUrl = sources[parsed.namespace];

    if (!registryUrl) {
      return [];
    }

    return [
      {
        namespace: parsed.namespace,
        registryUrl,
        itemName: parsed.name,
        displayName: specifier
      }
    ];
  }

  return Object.entries(sources).map(([namespace, registryUrl]) => ({
    namespace,
    registryUrl,
    itemName: parsed.name,
    displayName:
      namespace === DEFAULT_REGISTRY_NAMESPACE || namespace === '@soybean' || namespace === '@sbean'
        ? parsed.name
        : `${namespace}/${parsed.name}`
  }));
}

function attachRegistryMeta(
  item: RegistryItem,
  namespace: string,
  registryUrl: string,
  displayName: string
): RegistryItem {
  return {
    ...item,
    name: displayName,
    meta: {
      ...item.meta,
      registryNamespace: namespace,
      registryUrl
    }
  };
}

/**
 * Fetch a single registry item from the remote registry.
 * Checks local cache first, falls back to network if not cached.
 *
 * URL pattern: `https://veanui.com/r/{name}.json`, where `{name}` is the
 * namespace-qualified item name (`ui/button`, served from `r/ui/button.json`);
 * the catalog index lives at `https://veanui.com/r/registry.json`.
 */
export async function fetchRegistryItem(
  name: string,
  config?: RegistryConfigSource,
  registryUrl?: string
): Promise<RegistryItem | null> {
  const targets = registryUrl
    ? [
        {
          namespace: DEFAULT_REGISTRY_NAMESPACE,
          registryUrl,
          itemName: parseRegistrySpecifier(name).name,
          displayName: name
        }
      ]
    : resolveRegistryTargets(name, config);

  for (const target of targets) {
    // Check cache first (non-ETag path)
    const cached = await getCachedRegistryItem<RegistryItem>(target.namespace, target.itemName);
    if (cached) {
      return attachRegistryMeta(cached, target.namespace, target.registryUrl, target.displayName);
    }

    const url = buildRegistryItemUrl(target.registryUrl, target.itemName);

    try {
      // Build conditional request headers with ETag if available
      const headers: Record<string, string> = {};
      const cachedEtag = await getCachedRegistryItemEtag(target.namespace, target.itemName);
      if (cachedEtag) {
        headers['If-None-Match'] = cachedEtag;
      }

      const response = await fetch(url, { headers });

      // 304 Not Modified — use cached version even if expired
      if (response.status === 304 && cachedEtag) {
        const raw = await getCachedRegistryItemRaw<RegistryItem>(target.namespace, target.itemName);
        if (raw) {
          // Re-cache with fresh timestamp
          await setCachedRegistryItem(target.namespace, target.itemName, raw.data, raw.etag ?? cachedEtag);
          return attachRegistryMeta(raw.data, target.namespace, target.registryUrl, target.displayName);
        }
      }

      if (!response.ok) {
        if (response.status === 404) {
          continue;
        }

        throw new Error(`Registry fetch failed: ${response.status} ${response.statusText}`);
      }

      const json = await response.json();
      const item = v.parse(registryItemSchema, json);

      // Cache the result with ETag
      const responseEtag = response.headers.get('etag') || undefined;
      await setCachedRegistryItem(target.namespace, target.itemName, item, responseEtag);

      return attachRegistryMeta(item, target.namespace, target.registryUrl, target.displayName);
    } catch (error) {
      if (error instanceof v.ValiError) {
        console.warn(`  ⚠ Invalid registry item for "${name}": validation failed`);
        return null;
      }

      if (targets.length === 1) {
        throw error;
      }
    }
  }

  // Bare-name alias resolution (EC-E04/E05): direct lookup missed (e.g. `button`
  // vs the namespaced `ui/button`). Bare names resolve ONLY to the core `ui`
  // package — non-core packages require the `<package>/` prefix.
  if (!name.includes('/') && !name.startsWith('@')) {
    const catalog = await fetchRegistryCatalog(config, registryUrl);
    const matches = catalog.filter(item => getItemBasename(item.name) === name);
    const uiMatches = matches.filter(item => getItemPackage(item.name) === 'ui');

    if (uiMatches.length === 1) {
      return fetchRegistryItem(uiMatches[0].name, config, registryUrl);
    }

    if (matches.length === 1) {
      throw new PackageNamespaceRequiredError(name, getItemPackage(matches[0].name));
    }

    if (matches.length > 1) {
      throw new AmbiguousComponentNameError(name, matches.map(match => match.name).sort());
    }
  }

  return null;
}

/**
 * Fetch the remote registry catalog (registry.json).
 */
export async function fetchRegistryCatalog(
  config?: RegistryConfigSource,
  registryUrl?: string
): Promise<RegistryItem[]> {
  const sources = registryUrl ? { [DEFAULT_REGISTRY_NAMESPACE]: registryUrl } : getRegistrySources(config);
  const entries = Object.entries(sources);
  const items: RegistryItem[] = [];
  const seen = new Set<string>();

  for (const [namespace, sourceUrl] of entries) {
    // Check catalog cache first
    const cachedCatalog = await getCachedRegistryCatalog<RegistryItem[]>(namespace);
    if (cachedCatalog) {
      for (const item of cachedCatalog) {
        const displayName =
          namespace === DEFAULT_REGISTRY_NAMESPACE || namespace === '@soybean' || namespace === '@sbean'
            ? item.name
            : `${namespace}/${item.name}`;

        if (seen.has(displayName)) {
          continue;
        }

        seen.add(displayName);
        items.push(attachRegistryMeta(item, namespace, sourceUrl, displayName));
      }
      continue;
    }

    const url = buildRegistryCatalogUrl(sourceUrl);

    try {
      // Build conditional request headers with ETag if available
      const headers: Record<string, string> = {};
      const cachedEtag = await getCachedRegistryCatalogEtag(namespace);
      if (cachedEtag) {
        headers['If-None-Match'] = cachedEtag;
      }

      const response = await fetch(url, { headers });

      const responseEtag = response.headers.get('etag') || undefined;

      // 304 Not Modified — try stale cache
      if (response.status === 304 && cachedEtag) {
        const rawCatalog = await getCachedRegistryCatalogRaw<RegistryItem[]>(namespace);
        if (rawCatalog) {
          // Re-cache with fresh timestamp
          await setCachedRegistryCatalog(namespace, rawCatalog.data, rawCatalog.etag ?? cachedEtag);

          for (const item of rawCatalog.data) {
            const displayName =
              namespace === DEFAULT_REGISTRY_NAMESPACE || namespace === '@soybean' || namespace === '@sbean'
                ? item.name
                : `${namespace}/${item.name}`;

            if (seen.has(displayName)) {
              continue;
            }

            seen.add(displayName);
            items.push(attachRegistryMeta(item, namespace, sourceUrl, displayName));
          }
        }
        continue;
      }

      if (!response.ok) {
        if (response.status === 404) {
          continue;
        }

        throw new Error(`Registry fetch failed: ${response.status} ${response.statusText}`);
      }

      const json = await response.json();
      const catalogItems = Array.isArray(json)
        ? (json as unknown[])
        : Array.isArray((json as Record<string, unknown>).items)
          ? (((json as Record<string, unknown>).items as unknown[]) ?? [])
          : [];

      // Parse and cache catalog items
      const parsedItems: RegistryItem[] = [];

      for (const entry of catalogItems) {
        const item = v.parse(registryItemSchema, entry);
        const displayName =
          namespace === DEFAULT_REGISTRY_NAMESPACE || namespace === '@soybean' || namespace === '@sbean'
            ? item.name
            : `${namespace}/${item.name}`;

        if (seen.has(displayName)) {
          continue;
        }

        seen.add(displayName);
        const itemWithMeta = attachRegistryMeta(item, namespace, sourceUrl, displayName);
        items.push(itemWithMeta);
        parsedItems.push(item);
      }

      // Cache the catalog
      await setCachedRegistryCatalog(namespace, parsedItems, responseEtag);
    } catch (error) {
      if (error instanceof v.ValiError) {
        console.warn(`  ⚠ Remote registry catalog validation failed for ${namespace}`);
        continue;
      }

      console.warn(`  ⚠ Failed to fetch remote registry ${namespace}: ${(error as Error).message}`);
    }
  }

  return items;
}
