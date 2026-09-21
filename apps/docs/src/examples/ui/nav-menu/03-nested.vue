<script setup lang="ts">
import { SNavMenu } from '@vean/ui';
import type { NavMenuOptionData } from '@vean/ui';

const menus: NavMenuOptionData[] = [
  {
    value: 'docs',
    label: 'Docs',
    icon: 'lucide:book-open',
    href: '/docs',
    children: [
      {
        value: 'getting-started',
        label: 'Getting Started',
        description: 'Install and configure the library.',
        icon: 'lucide:rocket',
        href: '/docs/getting-started',
        children: [
          {
            value: 'installation',
            label: 'Installation',
            href: '/docs/getting-started/installation'
          },
          {
            value: 'configuration',
            label: 'Configuration',
            href: '/docs/getting-started/configuration'
          }
        ]
      },
      {
        value: 'components',
        label: 'Components',
        description: 'Browse the component catalog.',
        icon: 'lucide:box',
        href: '/docs/components',
        children: [
          {
            value: 'navigation',
            label: 'Navigation',
            href: '/docs/components/navigation',
            children: [
              { value: 'nav-menu', label: 'NavMenu', href: '/docs/components/nav-menu' },
              {
                value: 'dropdown-menu',
                label: 'DropdownMenu',
                href: '/docs/components/dropdown-menu'
              }
            ]
          },
          { value: 'feedback', label: 'Feedback', href: '/docs/components/feedback' }
        ]
      },
      { value: 'changelog', label: 'Changelog', href: '/docs/changelog' }
    ]
  },
  {
    value: 'github',
    label: 'GitHub',
    icon: 'lucide:github',
    href: 'https://github.com/soybeanjs/vean-ui'
  }
];
</script>

<template>
  <div class="flex justify-center w-full">
    <SNavMenu :items="menus" class="w-max" />
  </div>
</template>
