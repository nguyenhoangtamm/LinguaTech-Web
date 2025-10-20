import { routes } from "@/config/routes";

export const pageLinks = [
  {
    name: "Bảng điều khiển",
  },
  {
    name: "Quản trị hệ thống",
  },
  {
    name: "Người dùng",
    href: routes.manage.system.users,
  },
  {
    name: "Vai trò",
    href: "#",

    dropdownItems: [
      {
        name: "Danh sách Vai trò",
        href: routes.manage.system.roles,
      },
      {
        name: "Cấu hình quyền",
        href: routes.manage.system.rolePermission,
      },
      {
        name: "Cấu hình Menu",
        href: routes.manage.system.roleMenu,
      },
    ],
  },
  {
    name: "Quyền",
    href: routes.manage.system.permissions,
  },
  {
    name: "Menu",
    href: routes.manage.system.menu,
  },
];
