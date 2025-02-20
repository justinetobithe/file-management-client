import React from 'react';
import {
  Home,
  User,
  UserSquare,
  Users,
  Route,
  Database,
  FileText,
  FileArchive,
  File,
  Folder
} from 'lucide-react';

interface Route {
  route: string;
  title: string;
  icon: React.ReactElement | null;
  roles: string[];
  isSidebarVisible: boolean;
  child_routes: Route[] | [];
}
const routes: Route[] = [
  {
    route: '/home',
    title: 'Home',
    icon: <Home />,
    roles: ['admin', 'user'],
    isSidebarVisible: true,
    child_routes: [],
  },
  {
    route: '/departments',
    title: 'Departments',
    icon: <UserSquare />,
    roles: ['admin'],
    isSidebarVisible: true,
    child_routes: [],
  },
  {
    route: '/files',
    title: 'Files',
    icon: <Folder />,
    roles: ['admin', 'user'],
    isSidebarVisible: true,
    child_routes: [],
  },
  {
    route: '/reports',
    title: 'Reports',
    icon: <FileArchive />,
    roles: ['admin'],
    isSidebarVisible: true,
    child_routes: [],
  },
  {
    route: '/audit-logs',
    title: 'Audit Logs',
    icon: <FileText />,
    roles: ['admin'],
    isSidebarVisible: true,
    child_routes: [],
  },
  {
    route: '/users-list',
    title: 'Users List',
    icon: <Users />,
    roles: ['admin'],
    isSidebarVisible: true,
    child_routes: [],
  },
  {
    route: '/profile',
    title: 'Profile',
    icon: <User />,
    roles: ['admin', 'user'],
    isSidebarVisible: true,
    child_routes: [],
  },
];

export default routes;
