import type { AnchorOptionData, ThemeSize } from '@vean/ui';

export const anchorItems: AnchorOptionData[] = [
  {
    href: '#overview',
    title: 'Overview'
  },
  {
    href: '#usage',
    title: 'Usage',
    children: [
      {
        href: '#usage-installation',
        title: 'Installation'
      },
      {
        href: '#usage-configuration',
        title: 'Configuration'
      }
    ]
  },
  {
    href: '#api',
    title: 'API'
  }
];

export const anchorSections = [
  {
    id: 'overview',
    title: 'Overview'
  },
  {
    id: 'usage',
    title: 'Usage'
  },
  {
    id: 'usage-installation',
    title: 'Installation'
  },
  {
    id: 'usage-configuration',
    title: 'Configuration'
  },
  {
    id: 'api',
    title: 'API'
  }
] as const;

export const anchorSizes: ThemeSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

export function createAnchorItems(prefix = ''): AnchorOptionData[] {
  const hash = (id: string) => `#${prefix}${id}`;

  return [
    {
      href: hash('overview'),
      title: 'Overview'
    },
    {
      href: hash('usage'),
      title: 'Usage',
      children: [
        {
          href: hash('usage-installation'),
          title: 'Installation'
        },
        {
          href: hash('usage-configuration'),
          title: 'Configuration'
        }
      ]
    },
    {
      href: hash('api'),
      title: 'API'
    }
  ];
}

export function createAnchorSections(prefix = '') {
  return anchorSections.map(section => ({
    ...section,
    id: `${prefix}${section.id}`
  }));
}
