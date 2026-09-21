import fs from 'fs/promises';
import path from 'path';
import * as v from 'valibot';
import { Command } from 'commander';
import { BUILTIN_REGISTRIES } from '../registry/constants';
import { createDefaultConfig, getConfig, writeConfig } from '../utils/get-config';
import { readRegistryWithIncludes } from '../registry/loader';

const registryAddOptionsSchema = v.object({
  registries: v.array(v.string()),
  cwd: v.string()
});

const registryValidateOptionsSchema = v.object({
  registryFile: v.string(),
  cwd: v.string()
});

function parseRegistryArg(arg: string): { namespace: string; url: string | null } {
  const [namespace, ...rest] = arg.split('=');

  if (!namespace?.startsWith('@')) {
    throw new Error(`Invalid registry namespace: ${namespace || arg}. Expected format @namespace=url.`);
  }

  const url = rest.length > 0 ? rest.join('=').trim() : null;

  if (url && !url.includes('{name}')) {
    throw new Error(`Registry URL for ${namespace} must include the {name} placeholder.`);
  }

  return { namespace, url };
}

async function readOrCreateConfig(cwd: string) {
  const existing = await getConfig(cwd);

  if (existing) {
    return existing;
  }

  return createDefaultConfig(cwd);
}

const registryAdd = new Command()
  .name('add')
  .description('add registries to vean.json')
  .argument('[registries...]', 'registries (@namespace=url)')
  .option('-c, --cwd <cwd>', 'the working directory', process.cwd())
  .action(async (registries: string[], opts) => {
    const options = v.parse(registryAddOptionsSchema, {
      registries,
      cwd: path.resolve(opts.cwd)
    });

    if (!options.registries.length) {
      console.log('Usage: vean registry add @acme=https://example.com/r/{name}.json');
      process.exit(0);
    }

    const config = await readOrCreateConfig(options.cwd);
    const nextRegistries = { ...config.registries };
    const added: string[] = [];
    const skipped: string[] = [];

    for (const arg of options.registries) {
      const { namespace, url } = parseRegistryArg(arg);

      if (namespace in BUILTIN_REGISTRIES && !url) {
        skipped.push(namespace);
        continue;
      }

      if (!url) {
        throw new Error(`Missing URL for ${namespace}. Expected format @namespace=url.`);
      }

      if (nextRegistries[namespace] === url) {
        skipped.push(namespace);
        continue;
      }

      nextRegistries[namespace] = url;
      added.push(namespace);
    }

    await writeConfig(options.cwd, {
      ...config,
      registries: nextRegistries
    });

    if (added.length) {
      console.log(`✔ Added ${added.length} registr${added.length === 1 ? 'y' : 'ies'} to vean.json`);
      for (const name of added) {
        console.log(`  ${name} -> ${nextRegistries[name]}`);
      }
    }

    if (skipped.length) {
      console.log(`⚠ Skipped ${skipped.join(', ')}`);
    }
  });

const registryValidate = new Command()
  .name('validate')
  .description('validate a registry.json file')
  .argument('[registry]', 'path to registry.json', './registry.json')
  .option('-c, --cwd <cwd>', 'the working directory', process.cwd())
  .action(async (registryFile: string, opts) => {
    const options = v.parse(registryValidateOptionsSchema, {
      registryFile,
      cwd: path.resolve(opts.cwd)
    });

    const resolvedRegistryFile = path.resolve(options.cwd, options.registryFile);

    try {
      await fs.access(resolvedRegistryFile);
    } catch {
      console.error(`Registry file not found: ${resolvedRegistryFile}`);
      process.exit(1);
    }

    const result = await readRegistryWithIncludes(resolvedRegistryFile, {
      cwd: options.cwd
    });

    console.log(`✔ Registry is valid`);
    console.log(`  Name: ${result.registry.name}`);
    console.log(`  Items: ${result.registry.items.length}`);
    console.log(`  Includes: ${result.usesInclude ? 'yes' : 'no'}`);
  });

export const registry = new Command()
  .name('registry')
  .description('manage registries')
  .addCommand(registryAdd)
  .addCommand(registryValidate);
