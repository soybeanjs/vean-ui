#!/usr/bin/env node
import { Command } from 'commander';
import pkg from '../package.json' with { type: 'json' };
import { add } from './commands/add';
import { apply } from './commands/apply';
import { build } from './commands/build';
import { diff } from './commands/diff';
import { docs } from './commands/docs';
import { info } from './commands/info';
import { init } from './commands/init';
import { list } from './commands/list';
import { mcp } from './commands/mcp';
import { migrate } from './commands/migrate';
import { preset } from './commands/preset';
import { registry } from './commands/registry';
import { scan } from './commands/scan';
import { search } from './commands/search';
import { template } from './commands/template';
import { view } from './commands/view';

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));

async function main() {
  const program = new Command()
    .name('vean')
    .description('add Vean components to your Vue apps')
    .version(pkg.version || '0.1.0', '-v, --version', 'display the version number');

  program
    .addCommand(init)
    .addCommand(apply)
    .addCommand(add)
    .addCommand(build)
    .addCommand(diff)
    .addCommand(docs)
    .addCommand(view)
    .addCommand(search)
    .addCommand(template)
    .addCommand(info)
    .addCommand(list)
    .addCommand(mcp)
    .addCommand(registry)
    .addCommand(preset)
    .addCommand(scan)
    .addCommand(migrate);
  await program.parseAsync();
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
