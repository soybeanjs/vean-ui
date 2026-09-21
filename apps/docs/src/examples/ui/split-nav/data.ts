import type { SplitNavBaseOptionData, SplitNavOptionData } from '@vean/ui';

export const splitNavItems: SplitNavOptionData<SplitNavBaseOptionData>[] = [
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
            label: 'Vean',
            value: 'vean',
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
        icon: 'lucide:list-todo'
      }
    ]
  },
  {
    label: 'Management',
    value: 'management',
    icon: 'lucide:settings',
    children: [
      {
        label: 'Users',
        value: 'users',
        icon: 'lucide:users',
        children: [
          {
            label: 'User List',
            value: 'user-list',
            icon: 'lucide:user-round'
          },
          {
            label: 'Roles',
            value: 'roles',
            icon: 'lucide:badge-check'
          }
        ]
      },
      {
        label: 'Menu',
        value: 'menu',
        icon: 'lucide:menu'
      }
    ]
  },
  {
    label: 'Analytics',
    value: 'analytics',
    icon: 'lucide:line-chart',
    children: [
      {
        label: 'Reports',
        value: 'reports',
        icon: 'lucide:file-chart-column',
        children: [
          {
            label: 'Monthly',
            value: 'monthly',
            icon: 'lucide:calendar'
          },
          {
            label: 'Quarterly',
            value: 'quarterly',
            icon: 'lucide:calendar-range'
          }
        ]
      },
      {
        label: 'Realtime',
        value: 'realtime',
        icon: 'lucide:activity'
      }
    ]
  },
  {
    label: 'Settings',
    value: 'settings',
    icon: 'lucide:sliders-horizontal',
    children: [
      {
        label: 'General',
        value: 'general',
        icon: 'lucide:settings'
      },
      {
        label: 'Profile',
        value: 'profile',
        icon: 'lucide:user-round'
      }
    ]
  }
];
