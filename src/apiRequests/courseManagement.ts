import http from "@/lib/http";
import {
    CourseListResType,
    CourseResType,
    CreateCourseBodyType,
    UpdateCourseBodyType,
    GetCoursesWithPaginationQueryType,
    GetAllCoursesResType,
    CourseOperationResType,
    CourseCategoriesResType,
} from "@/schemaValidations/courseManagement.schema";

const buildUrlWithParams = (baseUrl: string, params: Record<string, any>) => {
    const queryString = new URLSearchParams(params).toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

// Course Management API endpoints based on api.json
const courseManagementApiRequest = {
    // Create course
    create: (body: CreateCourseBodyType) =>
        http.post<CourseOperationResType>("/api/v1/courses/create", body),

    // Update course
    update: (id: number, body: UpdateCourseBodyType) =>
        http.post<CourseOperationResType>(`/api/v1/courses/update/${id}`, body),

    // Delete course
    delete: (id: number) =>
        http.post<CourseOperationResType>(`/api/v1/courses/delete/${id}`, {}),

    // Get course by ID
    getById: (id: number) => http.get<CourseResType>(`/api/v1/courses/${id}`),

    // Get course detail
    getDetail: (id: number) =>
        http.get<CourseResType>(`/api/v1/courses/${id}/detail`),

    // Get courses with pagination and filters
    getWithPagination: (params: GetCoursesWithPaginationQueryType) => {
        const url = buildUrlWithParams("/api/v1/courses", params);
        return http.get<CourseListResType>(url);
    },

    // Search courses
    search: (params: GetCoursesWithPaginationQueryType) => {
        const url = buildUrlWithParams("/api/v1/courses/search", params);
        return http.get<CourseListResType>(url);
    },

    // Get recent courses
    getRecent: () => http.get<CourseListResType>("/api/v1/courses/recent"),

    // Get courses by category
    getByCategory: (
        categorySlug: string,
        params?: GetCoursesWithPaginationQueryType
    ) => {
        const url = buildUrlWithParams(
            `/api/v1/courses/category/${categorySlug}`,
            params || {}
        );
        return http.get<CourseListResType>(url);
    },

    // Get course categories
    getCategories: () =>
        http.get<CourseCategoriesResType>("/api/v1/courses/categories"),

    // Get course modules
    getModules: (courseId: number) =>
        http.get<any>(`/api/v1/courses/${courseId}/modules`),
};

export default courseManagementApiRequest;
