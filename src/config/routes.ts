export const routes = {
    manage: {
        dashboard: "/manage/dashboard",
        regional: "/manage/dashboard/regional-statistics",
        areaMap: "/manage/dashboard/area-map",
        users: "/manage/users",
        roles: "/manage/roles",
        configs: "/manage/configs",
        logging: "/manage/logging",
        areas: "/manage/areas",
        devices: "/manage/devices",
        projects: "/manage/projects",
        deviceTracking: "/manage/device-tracking",
        attendanceHistory: "/manage/attendance-history",
        attendanceTracking: "/manage/attendance-tracking",
        permissions: "/manage/permissions",
        joinedProjects: "/manage/dashboard/joined-projects",
        overallProgress: "/manage/dashboard/overall-progress",
        // project
        project: "/manage/projects",
        projectList: "/manage/projects/project-list",
        myProjects: "/manage/projects/my-projects",
        createProject: "/manage/projects/create-projects",

        // celendar
        calendar: "/manage/calendar",
        system: {
            users: "/manage/users",
            roles: "/manage/roles",
            roleMenu: "/manage/roles/config-menu",
            rolePermission: "/manage/roles/config-permissions",
            permissions: "/manage/permissions",
            menu: "/manage/menus",
        },
    },
    auth: {
        login: "/auth/login",
        accounts: "/accounts",
    },
    user: {
        dashboard: "/dashboard",
        courses: "/courses",
        coursesByCategory: "/courses/category",
        coursesByTag: "/courses/tag",
        courseDetail: "/courses/detail",
    },
};
