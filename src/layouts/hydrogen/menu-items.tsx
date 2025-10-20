import { routes } from "@/config/routes";
import {
  ListTodo,
  Folder,
  BarChart,
  Hourglass,
  UserPlus,
  ShieldCheck,
  Lock,
  Grid,
  FolderPlus,
  BookUser,
} from "lucide-react";

// Note: do not add href in the label object, it is rendering as label
export const menuItems = [
  {
    name: "Bảng điều khiển",
  },
  {
    name: "Quản trị hệ thống",
  },
  {
    name: "Người dùng",
    href: routes.manage.system.users,
    icon: <UserPlus />,
  },
  {
    name: "Vai trò",
    href: "#",
    icon: <ShieldCheck />,
    dropdownItems: [
      {
        name: "Danh sách Vai trò",
        href: routes.manage.system.roles,
        icon: <ShieldCheck />,
      },
      {
        name: "Cấu hình quyền",
        href: routes.manage.system.rolePermission,
        icon: <Lock />,
      },
      {
        name: "Cấu hình Menu",
        href: routes.manage.system.roleMenu,
        icon: <Grid />,
      },
    ],
  },
  {
    name: "Quyền",
    href: routes.manage.system.permissions,
    icon: <Lock />,
  },
  {
    name: "Menu",
    href: routes.manage.system.menu,
    icon: <Grid />,
  },
];
