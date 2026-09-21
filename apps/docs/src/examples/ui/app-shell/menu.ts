import type { AppShellMenuItem } from '@vean/ui';

export const appShellItems: AppShellMenuItem[] = [
  {
    label: 'Overview',
    value: 'overview',
    icon: 'lucide:layout-dashboard'
  },
  {
    label: 'Workbench',
    value: 'workbench',
    icon: 'lucide:layout-grid',
    children: [
      {
        label: 'Projects',
        value: 'projects',
        icon: 'lucide:folder-kanban',
        children: [
          {
            label: 'Vean UI',
            value: 'vean-ui',
            icon: 'lucide:book-open'
          },
          {
            label: 'Soybean Admin',
            value: 'soybean-admin',
            icon: 'lucide:shield-check'
          }
        ]
      },
      {
        label: 'Tasks',
        value: 'tasks',
        icon: 'lucide:list-todo',
        badge: '3'
      },
      {
        label: 'Draft Board',
        value: 'draft',
        icon: 'lucide:file-pen',
        hidden: true
      }
    ]
  },
  {
    label: 'Components',
    value: 'components',
    icon: 'lucide:component'
  },
  {
    label: 'Settings',
    value: 'settings',
    icon: 'lucide:settings',
    children: [
      {
        label: 'Profile',
        value: 'profile',
        icon: 'lucide:user-round'
      },
      {
        label: 'Security',
        value: 'security',
        icon: 'lucide:shield-check'
      }
    ]
  }
];
