// 📄 src/components/SidebarItems.js
import {
  LayoutDashboard, Users, Boxes, Warehouse, Route,
  BarChart3, ClipboardList, Bell, Pencil, Truck, Tags
} from 'lucide-react';

export const SidebarItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['admin'] },
  { label: 'Manage Users', path: '/dashboard/users', icon: Users, roles: ['admin'] },
  { label: 'Manage Products', path: '/dashboard/products', icon: Boxes, roles: ['admin', 'warehouse'] },

  // ✅ เพิ่มหมวดหมู่สินค้า (Categories)
  { label: 'Manage Categories', path: '/dashboard/categories', icon: Tags, roles: ['admin', 'warehouse'] },

  { label: 'Manage Inventories', path: '/dashboard/inventories', icon: ClipboardList, roles: ['admin', 'warehouse'] },
  { label: 'Manage Receivings', path: '/dashboard/receivings', icon: ClipboardList, roles: ['admin', 'warehouse'] },
  { label: 'Manage Shipping', path: '/dashboard/shipping', icon: Truck, roles: ['admin', 'delivery planning'] },
  { label: 'Manage Warehouses', path: '/dashboard/warehouses', icon: Warehouse, roles: ['admin', 'warehouse'] },
  { label: 'Route Planning', path: '/dashboard/routes', icon: Route, roles: ['admin', 'delivery planning', 'driver'] },
  { label: 'Reports & Analytics', path: '/dashboard/reports', icon: BarChart3, roles: ['admin', 'warehouse','delivery planning', 'driver'] },
  { label: 'System Logs & Activities', path: '/dashboard/logs', icon: ClipboardList, roles: ['admin'] },
  { label: 'User Logs', path: '/dashboard/user-logs', icon: Pencil, roles: ['admin'] },
  { label: 'Notification Settings', path: '/dashboard/notifications', icon: Bell, roles: ['admin', 'warehouse', 'delivery planning', 'driver'] },
];
