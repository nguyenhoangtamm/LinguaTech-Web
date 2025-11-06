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
        login: "/login",
        register: "/register",
        accounts: "/accounts",
    },
    user: {
        dashboard: "/dashboard",
        profile: "/profile",
        courses: "/courses",
        coursesByCategory: "/courses/category",
        coursesByTag: "/courses/tag",
        courseDetail: "/courses/detail",
        courseLearn: (courseId: string) => `/courses/detail/${courseId}/learn`,
        lesson: (courseId: string, lessonId: string) =>
            `/courses/detail/${courseId}/lessons/${lessonId}`,
        assignment: (
            courseId: string,
            lessonId: string,
            assignmentId: string
        ) =>
            `/courses/detail/${courseId}/lessons/${lessonId}/assignments/${assignmentId}`,
    },
    teacher: {
        dashboard: "/my-courses",
        myCourses: "/my-courses",
        createCourse: "/my-courses/create",
        editCourse: (courseId: string) => `/my-courses/${courseId}/edit`,
        courseDetail: (courseId: string) => `/my-courses/${courseId}`,
        courseModules: (courseId: string) => `/my-courses/${courseId}/modules`,
        createModule: (courseId: string) => `/my-courses/${courseId}/modules/create`,
        editModule: (courseId: string, moduleId: string) => `/my-courses/${courseId}/modules/${moduleId}/edit`,
        courseLessons: (courseId: string, moduleId: string) => `/my-courses/${courseId}/modules/${moduleId}/lessons`,
        createLesson: (courseId: string, moduleId: string) => `/my-courses/${courseId}/modules/${moduleId}/lessons/create`,
        editLesson: (courseId: string, moduleId: string, lessonId: string) => `/my-courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/edit`,
        courseAssignments: (courseId: string) => `/my-courses/${courseId}/assignments`,
        createAssignment: (courseId: string) => `/my-courses/${courseId}/assignments/create`,
        editAssignment: (courseId: string, assignmentId: string) => `/my-courses/${courseId}/assignments/${assignmentId}/edit`,
        courseStudents: (courseId: string) => `/my-courses/${courseId}/students`,
        courseSettings: (courseId: string) => `/my-courses/${courseId}/settings`,
    },
};

