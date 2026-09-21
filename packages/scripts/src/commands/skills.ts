/// <reference types="node" />

import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { generateSkillDocs } from './skills-docs';

type PackageAuthor = {
  email?: string;
  name?: string;
  url?: string;
};

type PackageRepository = {
  url?: string;
};

type RootPackageManifest = {
  author?: PackageAuthor;
  description?: string;
  homepage?: string;
  license?: string;
  repository?: PackageRepository;
  version: string;
};

type DistributionPackageManifest = {
  author?: PackageAuthor;
  description: string;
  files: string[];
  homepage?: string;
  keywords: string[];
  license: string;
  name: string;
  private: true;
  publishConfig: {
    access: 'public';
    registry: 'https://registry.npmjs.org/';
  };
  repository?: PackageRepository;
  type: 'module';
  version: string;
};

type ClaudePluginManifest = {
  author?: Pick<PackageAuthor, 'email' | 'name'>;
  description: string;
  homepage?: string;
  keywords: string[];
  license?: string;
  name: string;
  repository?: string;
  version: string;
};

type ClaudeMarketplaceManifest = {
  metadata: {
    description: string;
  };
  name: string;
  owner?: Pick<PackageAuthor, 'email' | 'name'>;
  plugins: Array<{
    category: 'frontend';
    description: string;
    keywords: string[];
    name: string;
    source: './';
    version: string;
  }>;
};

const repoRoot = process.cwd();
const rootPackageJsonPath = path.resolve(repoRoot, 'package.json');
const skillsDistributionRootDir = path.resolve(repoRoot, 'skills');
const skillsSourceRootDir = path.resolve(skillsDistributionRootDir, 'skills-source');
const skillsDistributionSkillsDir = path.resolve(skillsDistributionRootDir, 'skills');
const claudePluginDir = path.resolve(skillsDistributionRootDir, '.claude-plugin');
const distributionPackageName = '@vean/skills';
const distributionPluginName = 'vean-skills';
const distributionDescription = 'Agent skills for Vean and Vean Aria.';
const distributionKeywords = ['agentskills', 'vean-ui', 'vean-aria', 'vue', 'github-copilot', 'claude-code'];
const distributedSkillDirs = ['vean-ui', 'vean-aria'];

export async function generateSkillsDistribution(): Promise<void> {
  const rootPackage = await readRootPackageManifest();

  await mkdir(skillsDistributionRootDir, { recursive: true });
  await rm(skillsDistributionSkillsDir, { force: true, recursive: true });
  await rm(claudePluginDir, { force: true, recursive: true });
  await mkdir(skillsDistributionSkillsDir, { recursive: true });
  await mkdir(claudePluginDir, { recursive: true });

  await Promise.all(
    distributedSkillDirs.map(async skillDir => {
      await cp(path.resolve(skillsSourceRootDir, skillDir), path.resolve(skillsDistributionSkillsDir, skillDir), {
        recursive: true
      });
    })
  );

  await generateSkillDocs({ skillsRootDir: skillsDistributionSkillsDir });

  await Promise.all([
    writeFile(path.resolve(skillsDistributionRootDir, 'README.md'), createDistributionReadme(), 'utf8'),
    writeFile(
      path.resolve(skillsDistributionRootDir, 'package.json'),
      `${JSON.stringify(createDistributionPackageManifest(rootPackage), null, 2)}\n`,
      'utf8'
    ),
    writeFile(
      path.resolve(claudePluginDir, 'plugin.json'),
      `${JSON.stringify(createClaudePluginManifest(rootPackage), null, 2)}\n`,
      'utf8'
    ),
    writeFile(
      path.resolve(claudePluginDir, 'marketplace.json'),
      `${JSON.stringify(createClaudeMarketplaceManifest(rootPackage), null, 2)}\n`,
      'utf8'
    )
  ]);

  console.log(`Generated skills distribution in ${path.relative(repoRoot, skillsDistributionRootDir)}.`);
}

async function readRootPackageManifest(): Promise<RootPackageManifest> {
  const source = await readFile(rootPackageJsonPath, 'utf8');

  return JSON.parse(source) as RootPackageManifest;
}

function createDistributionPackageManifest(rootPackage: RootPackageManifest): DistributionPackageManifest {
  return {
    author: rootPackage.author,
    description: distributionDescription,
    files: ['skills', '.claude-plugin', 'README.md'],
    homepage: `${rootPackage.homepage}/tree/main/skills`,
    keywords: distributionKeywords,
    license: rootPackage.license ?? 'MIT',
    name: distributionPackageName,
    private: true,
    publishConfig: {
      access: 'public',
      registry: 'https://registry.npmjs.org/'
    },
    repository: rootPackage.repository,
    type: 'module',
    version: rootPackage.version
  };
}

function createClaudePluginManifest(rootPackage: RootPackageManifest): ClaudePluginManifest {
  return {
    author: rootPackage.author ? { email: rootPackage.author.email, name: rootPackage.author.name } : undefined,
    description: distributionDescription,
    homepage: `${rootPackage.homepage}/tree/main/skills`,
    keywords: distributionKeywords,
    license: rootPackage.license,
    name: distributionPluginName,
    repository: rootPackage.repository?.url,
    version: rootPackage.version
  };
}

function createClaudeMarketplaceManifest(rootPackage: RootPackageManifest): ClaudeMarketplaceManifest {
  return {
    metadata: {
      description: distributionDescription
    },
    name: distributionPluginName,
    owner: rootPackage.author ? { email: rootPackage.author.email, name: rootPackage.author.name } : undefined,
    plugins: [
      {
        category: 'frontend',
        description: distributionDescription,
        keywords: distributionKeywords,
        name: distributionPluginName,
        source: './',
        version: rootPackage.version
      }
    ]
  };
}

function createDistributionReadme(): string {
  return [
    '# Vean Skills',
    '',
    'Agent skills for `@vean/ui` and `@vean/aria`.',
    '',
    '## Installation',
    '',
    '```bash',
    `npx skills add soybeanjs/vean-ui/skills`,
    '```',
    '',
    'The `skills` CLI installs every skill shipped in the package and places them into the correct agent-specific skills directory.',
    '',
    '## Included Skills',
    '',
    '- `vean-ui`: Styled Vean usage, theming, docs, and component references',
    '- `vean-aria`: Aria primitives, Compact patterns, and composition guidance',
    '',
    '## Claude Code Marketplace',
    '',
    '```bash',
    `/plugin marketplace add ${distributionPluginName}`,
    `/plugin install ${distributionPluginName}@${distributionPluginName}`,
    '```',
    '',
    '## Development',
    '',
    'Generate the publishable package contents from the source repository:',
    '',
    '```bash',
    'pnpm sui gen skills',
    '```',
    ''
  ].join('\n');
}
