import fs from 'fs/promises';
import path from 'path';
import { Command } from 'commander';
import { startMcpServer } from '../mcp';

const CLIENTS = {
  claude: {
    path: '.mcp.json',
    content: {
      mcpServers: {
        vean: {
          command: 'npx',
          args: ['@vean/cli@latest', 'mcp']
        }
      }
    }
  },
  cursor: {
    path: '.cursor/mcp.json',
    content: {
      mcpServers: {
        vean: {
          command: 'npx',
          args: ['@vean/cli@latest', 'mcp']
        }
      }
    }
  },
  vscode: {
    path: '.vscode/mcp.json',
    content: {
      servers: {
        vean: {
          command: 'npx',
          args: ['@vean/cli@latest', 'mcp']
        }
      }
    }
  },
  codex: {
    path: '.codex/config.toml',
    content: '[mcp_servers.vean]\ncommand = "npx"\nargs = ["@vean/cli@latest", "mcp"]\n'
  },
  opencode: {
    path: 'opencode.json',
    content: {
      $schema: 'https://opencode.ai/config.json',
      mcp: {
        vean: {
          type: 'local',
          command: ['npx', '@vean/cli@latest', 'mcp'],
          enabled: true
        }
      }
    }
  }
} as const;

type ClientName = keyof typeof CLIENTS;

async function writeClientConfig(cwd: string, client: ClientName) {
  const clientInfo = CLIENTS[client];
  const targetPath = path.join(cwd, clientInfo.path);
  await fs.mkdir(path.dirname(targetPath), { recursive: true });

  if (typeof clientInfo.content === 'string') {
    await fs.writeFile(targetPath, clientInfo.content, 'utf-8');
  } else {
    await fs.writeFile(targetPath, `${JSON.stringify(clientInfo.content, null, 2)}\n`, 'utf-8');
  }

  return targetPath;
}

export const mcp = new Command()
  .name('mcp')
  .description('run the Vean MCP server or initialize MCP client config')
  .option('-c, --cwd <cwd>', 'the working directory', process.cwd())
  .action(async opts => {
    process.chdir(path.resolve(opts.cwd));
    await startMcpServer();
  });

mcp
  .command('init')
  .description('initialize MCP configuration for a client')
  .option('--client <client>', 'client name: claude, cursor, vscode, codex, opencode', 'vscode')
  .action(async (opts, command) => {
    const parentOpts = command.parent?.opts() ?? { cwd: process.cwd() };
    const cwd = path.resolve(parentOpts.cwd);
    const client = opts.client as ClientName;

    if (!(client in CLIENTS)) {
      throw new Error(`Unknown MCP client: ${opts.client}`);
    }

    const writtenPath = await writeClientConfig(cwd, client);
    console.log(`✔ Wrote MCP config: ${writtenPath}`);
  });
