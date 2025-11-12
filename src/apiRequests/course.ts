import http from "@/lib/http";
import {
    CourseCreateBodyType,
    CourseUpdateBodyType,
    CourseDetailResType,
    CoursesListResType,
    CourseDetailWithModulesResType,
    CourseFilterParamsType,
    CourseCategoriesListResType,
    EnrollmentCreateBodyType,
    EnrollmentResType,
    UserEnrollmentsResType,
    UserDashboardStatsResType,
    UpdateProgressBodyType,
    UpdateProgressResType,
} from "@/schemaValidations/course.schema";
import { MessageResType } from "@/schemaValidations/common.schema";

function toPascalCase(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const courseApiRequest = {
    // Courses CRUD
    getCourses: (params?: CourseFilterParamsType) => {
        const defaults = { pageNumber: 1, pageSize: 10, sortOrder: "desc" };
        const mergedParams = params ? { ...defaults, ...params } : defaults;

        const searchParams = new URLSearchParams();

        Object.entries(mergedParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                if (Array.isArray(value)) {
                    value.forEach((v) =>
                        searchParams.append(toPascalCase(key), v.toString())
                    );
                } else {
                    searchParams.append(toPascalCase(key), value.toString());
                }
            }
        });

        return http.get<CoursesListResType>(
            `/courses/search?${searchParams.toString()}`,
            {
                baseUrl: "http://localhost:5013/api/v1",
            }
        );
    },

    getCourse: (id: number) =>
        http.get<CourseDetailResType>(`/courses/${id}`, {
            baseUrl: "http://localhost:5013/api/v1",
        }),

    getCourseDetail: (id: number) =>
        http.get<CourseDetailWithModulesResType>(`/courses/${id}/detail`, {
            baseUrl: "http://localhost:5013/api/v1",
        }),

    createCourse: (body: CourseCreateBodyType) =>
        http.post<CourseDetailResType>("/courses/create", body, {
            baseUrl: "http://localhost:5013/api/v1",
        }),

    updateCourse: ({ id, ...body }: { id: number } & CourseUpdateBodyType) =>
        http.post<CourseDetailResType>(`/courses/update/${id}`, body, {
            baseUrl: "http://localhost:5013/api/v1",
        }),

    deleteCourse: (id: number) =>
        http.post<MessageResType>(
            `/courses/delete/${id}`,
            {},
            {
                baseUrl: "http://localhost:5013/api/v1",
            }
        ),

    // Course Categories
    getCategories: () =>
        http.get<CourseCategoriesListResType>("/courses/categories", {
            baseUrl: "http://localhost:5013/api/v1",
        }),

    getCoursesByCategory: (
        categorySlug: string,
        params?: CourseFilterParamsType
    ) => {
        const defaults = { pageNumber: 1, pageSize: 10, sortOrder: "desc" };
        const mergedParams = params ? { ...defaults, ...params } : defaults;

        const searchParams = new URLSearchParams();

        Object.entries(mergedParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                if (Array.isArray(value)) {
                    value.forEach((v) =>
                        searchParams.append(toPascalCase(key), v.toString())
                    );
                } else {
                    searchParams.append(toPascalCase(key), value.toString());
                }
            }
        });

        return http.get<CoursesListResType>(
            `/courses/category/${categorySlug}?${searchParams.toString()}`,
            {
                baseUrl: "http://localhost:5013/api/v1",
            }
        );
    },

    // Enrollments
    enrollCourse: (body: EnrollmentCreateBodyType) =>
        http.post<EnrollmentResType>("/enrollments/create", body, {
            baseUrl: "http://localhost:5013/api/v1",
        }),

    getUserEnrollments: () =>
        http.get<UserEnrollmentsResType>("/enrollments/my-courses", {
            baseUrl: "http://localhost:5013/api/v1",
        }),

    checkEnrollment: (courseId: number) =>
        http.get<{
            data: { isEnrolled: boolean; enrollment?: EnrollmentResType };
        }>(`/enrollments/check/${courseId}`, {
            baseUrl: "http://localhost:5013/api/v1",
        }),

    // Progress
    updateProgress: ({
        courseId,
        ...body
    }: { courseId: number } & UpdateProgressBodyType) =>
        http.post<UpdateProgressResType>(
            `/enrollments/update-progress/${courseId}`,
            body,
            {
                baseUrl: "http://localhost:5013/api/v1",
            }
        ),

    // Dashboard
    getDashboardStats: () =>
        http.get<UserDashboardStatsResType>("/users/dashboard-stats", {
            baseUrl: "http://localhost:5013/api/v1",
        }),

    getRecentCourses: () =>
        http.get<CoursesListResType>("/courses/recent", {
            baseUrl: "http://localhost:5013/api/v1",
        }),

    getContinueCourses: () =>
        http.get<UserEnrollmentsResType>("/enrollments/continue", {
            baseUrl: "http://localhost:5013/api/v1",
        }),

    // Search and Filter
    searchCourses: (
        query: string,
        params?: Omit<CourseFilterParamsType, "search">
    ) => {
        const defaults = { pageNumber: 1, pageSize: 10, sortOrder: "desc" };
        const mergedParams = { ...defaults, search: query, ...params };

        const searchParams = new URLSearchParams();

        Object.entries(mergedParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                if (Array.isArray(value)) {
                    value.forEach((v) =>
                        searchParams.append(toPascalCase(key), v.toString())
                    );
                } else {
                    searchParams.append(toPascalCase(key), value.toString());
                }
            }
        });

        return http.get<CoursesListResType>(
            `/courses/search?${searchParams.toString()}`,
            {
                baseUrl: "http://localhost:5013/api/v1",
            }
        );
    },

    // Mock API endpoints for development (cho đến khi có API thật)
    getMockCourses: (params?: CourseFilterParamsType) =>
        http.get<CoursesListResType>("/api/courses", { baseUrl: "" }),

    getMockCourse: (id: number) =>
        http.get<CourseDetailResType>(`/api/courses/${id}`, { baseUrl: "" }),

    getMockCourseDetail: (id: number) =>
        http.get<CourseDetailWithModulesResType>(`/api/courses/${id}/detail`, {
            baseUrl: "",
        }),

    getMockCategories: () =>
        http.get<CourseCategoriesListResType>("/api/courses/categories", {
            baseUrl: "",
        }),

    getMockDashboardStats: () =>
        http.get<UserDashboardStatsResType>("/api/users/dashboard-stats", {
            baseUrl: "",
        }),

    getMockUserEnrollments: () =>
        http.get<UserEnrollmentsResType>("/api/enrollments/my-courses", {
            baseUrl: "",
        }),
};

export default courseApiRequest;
