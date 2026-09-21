<script setup lang="ts">
import { STable } from '@vean/ui';
import type { TableColumn } from '@vean/ui';

interface EmployeeTableData {
  id: number;
  employeeId: string;
  name: string;
  role: string;
  team: string;
  status: string;
  location: string;
  timezone: string;
  email: string;
  phone: string;
  projects: number;
  utilization: string;
  lastUpdated: string;
  score: number;
}

const employeeTableData: EmployeeTableData[] = [
  {
    id: 1,
    employeeId: 'ENG-001',
    name: 'Ada Lovelace',
    role: 'Architect',
    team: 'Core Platform',
    status: 'Active',
    location: 'London',
    timezone: 'UTC+0',
    email: 'ada.lovelace@soybean.dev',
    phone: '+44 20 7946 001',
    projects: 4,
    utilization: '91%',
    lastUpdated: '2026-04-10',
    score: 96
  },
  {
    id: 2,
    employeeId: 'ENG-014',
    name: 'Linus Torvalds',
    role: 'Maintainer',
    team: 'Kernel Systems',
    status: 'Reviewing',
    location: 'Helsinki',
    timezone: 'UTC+2',
    email: 'linus.torvalds@soybean.dev',
    phone: '+358 9 1234 014',
    projects: 6,
    utilization: '84%',
    lastUpdated: '2026-04-12',
    score: 88
  },
  {
    id: 3,
    employeeId: 'ENG-021',
    name: 'Grace Hopper',
    role: 'Scientist',
    team: 'Developer Experience',
    status: 'Active',
    location: 'New York',
    timezone: 'UTC-4',
    email: 'grace.hopper@soybean.dev',
    phone: '+1 212 555 0021',
    projects: 5,
    utilization: '89%',
    lastUpdated: '2026-04-14',
    score: 92
  },
  {
    id: 4,
    employeeId: 'ENG-037',
    name: 'Margaret Hamilton',
    role: 'Tech Lead',
    team: 'Design Systems',
    status: 'Planning',
    location: 'Boston',
    timezone: 'UTC-4',
    email: 'margaret.hamilton@soybean.dev',
    phone: '+1 617 555 0037',
    projects: 3,
    utilization: '76%',
    lastUpdated: '2026-04-09',
    score: 94
  },
  {
    id: 5,
    employeeId: 'ENG-052',
    name: 'Katherine Johnson',
    role: 'Analyst',
    team: 'Data Intelligence',
    status: 'Active',
    location: 'Hampton',
    timezone: 'UTC-4',
    email: 'katherine.johnson@soybean.dev',
    phone: '+1 757 555 0052',
    projects: 7,
    utilization: '93%',
    lastUpdated: '2026-04-13',
    score: 98
  }
];

const fixedColumns: TableColumn<EmployeeTableData>[] = [
  { header: 'Employee ID', accessorKey: 'employeeId', size: 140, fixed: 'start' },
  { header: 'Name', accessorKey: 'name', size: 180, fixed: 'start' },
  { header: 'Role', accessorKey: 'role', size: 180 },
  { header: 'Team', accessorKey: 'team', size: 160 },
  { header: 'Status', accessorKey: 'status', size: 140, align: 'center' },
  { header: 'Location', accessorKey: 'location', size: 180 },
  { header: 'Timezone', accessorKey: 'timezone', size: 140 },
  { header: 'Email', accessorKey: 'email', size: 240 },
  { header: 'Phone', accessorKey: 'phone', size: 160 },
  { header: 'Projects', accessorKey: 'projects', size: 120, align: 'center' },
  { header: 'Utilization', accessorKey: 'utilization', size: 140, align: 'center' },
  { header: 'Last Updated', accessorKey: 'lastUpdated', size: 160 },
  { header: 'Score', accessorKey: 'score', size: 120, align: 'center', fixed: 'end' }
];
</script>

<template>
  <p class="mb-3 text-sm text-muted-foreground">
    Two columns stay pinned on the left and the score stays pinned on the right while the table scrolls horizontally.
  </p>
  <STable :columns="fixedColumns" :data="employeeTableData" :row-key="row => row.id" />
</template>
