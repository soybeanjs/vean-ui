import type { TreeMenuBaseOptionData, TreeMenuOptionData } from '@vean/ui';

interface TreeMenuExtendedOptionData extends TreeMenuBaseOptionData {
  customProp?: string;
}

export const treeMenuItems: TreeMenuOptionData<TreeMenuExtendedOptionData>[] = [
  {
    label: 'Platform',
    value: 'platform',
    isGroup: true,
    children: [
      {
        label: 'Playground',
        value: 'playground',
        icon: 'lucide:square-terminal',
        children: [
          {
            label: 'Starred',
            value: 'starred',
            icon: 'lucide:star'
          },
          {
            label: 'History',
            value: 'history',
            icon: 'lucide:history'
          },
          {
            label: 'Trending',
            value: 'trending',
            icon: 'lucide:trending-up'
          }
        ]
      },
      {
        label: 'Models',
        value: 'models',
        icon: 'lucide:bot',
        children: [
          {
            label: 'DeepSeek',
            value: 'deepseek',
            icon: 'lucide:bot',
            children: [
              {
                label: 'DeepSeek Coder',
                value: 'deepseek-coder'
              },
              {
                label: 'DeepSeek Coder Plus',
                value: 'deepseek-coder-plus'
              }
            ]
          },
          {
            label: 'ChatGPT',
            value: 'chatgpt',
            icon: 'lucide:bot',
            children: [
              {
                label: 'ChatGPT 3.5',
                value: 'chatgpt-3.5'
              },
              {
                label: 'ChatGPT 4',
                value: 'chatgpt-4'
              }
            ]
          },
          {
            label: 'Claude',
            value: 'claude',
            icon: 'lucide:bot',
            children: [
              {
                label: 'Claude 3.5',
                value: 'claude-3.5'
              },
              {
                label: 'Claude 3.5 Sonnet',
                value: 'claude-3.5-sonnet'
              }
            ]
          },
          {
            label: 'Gemini',
            value: 'gemini',
            icon: 'lucide:bot',
            children: [
              {
                label: 'Gemini 1.5',
                value: 'gemini-1.5'
              },
              {
                label: 'Gemini 1.5 Pro',
                value: 'gemini-1.5-pro'
              }
            ]
          }
        ]
      },
      {
        label: 'Documentation',
        value: 'documentation',
        icon: 'lucide:book-open',
        children: [
          {
            label: 'Introduction',
            value: 'introduction',
            icon: 'lucide:book-open'
          },
          {
            label: 'Get Started',
            value: 'get-started',
            icon: 'lucide:book-open'
          },
          {
            label: 'Tutorials',
            value: 'tutorials',
            icon: 'lucide:book-open'
          },
          {
            label: 'Changelog',
            value: 'changelog',
            icon: 'lucide:book-open'
          }
        ]
      },
      {
        label: 'Settings',
        value: 'settings',
        icon: 'lucide:settings',
        children: [
          {
            label: 'General',
            value: 'general',
            icon: 'lucide:settings'
          },
          {
            label: 'Team',
            value: 'team',
            icon: 'lucide:users'
          },
          {
            label: 'Billing',
            value: 'billing',
            icon: 'lucide:credit-card'
          },
          {
            label: 'Limits',
            value: 'limits',
            icon: 'lucide:credit-card'
          }
        ]
      }
    ]
  },
  {
    label: 'Projects',
    value: 'projects',
    isGroup: true,
    children: [
      {
        label: 'Design Engineering',
        value: 'design-engineering',
        icon: 'lucide:frame',
        actions: [
          {
            label: 'Edit',
            value: 'edit',
            icon: 'lucide:pencil'
          },
          {
            label: 'Delete',
            value: 'delete',
            icon: 'lucide:trash'
          }
        ]
      },
      {
        label: 'Sales & Marketing',
        value: 'sales-marketing',
        icon: 'lucide:pie-chart',
        tag: 'New'
      },
      {
        label: 'Travel',
        value: 'travel',
        icon: 'lucide:map',
        badge: 'Hot'
      }
    ]
  },
  {
    label: 'Links',
    value: 'links',
    isGroup: true,
    children: [
      {
        label: 'VeanUI',
        value: 'vean-ui',
        icon: 'lucide:book-open',
        href: 'https://veanui.com'
      },
      {
        label: 'Route About',
        value: 'route-about',
        icon: 'lucide:route',
        to: '/about'
      }
    ]
  }
];
