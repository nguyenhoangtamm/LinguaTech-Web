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
    const filteredParams = Object.fromEntries(
        Object.entries(params).filter(
            ([_, value]) =>
                value !== undefined && value !== null && value !== ""
        )
    );
    const queryString = new URLSearchParams(filteredParams).toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

// Course Management API endpoints based on api.json
const courseManagementApiRequest = {
    // Create course
    create: (body: CreateCourseBodyType) =>
        http.post<CourseOperationResType>("/courses/create", body),

    // Update course
    update: (id: number, body: UpdateCourseBodyType) =>
        http.post<CourseOperationResType>(`/courses/update/${id}`, body),
    // Delete course
    delete: (id: number) =>
        http.post<CourseOperationResType>(`/courses/delete/${id}`, {}),

    // Get course by ID
    getById: (id: number) => http.get<CourseResType>(`/courses/${id}`),

    // Get course detail
    getDetail: (id: number) => http.get<CourseResType>(`/courses/${id}/detail`),

    // Get courses with pagination and filters
    getWithPagination: (params: GetCoursesWithPaginationQueryType) => {
        const url = buildUrlWithParams("/courses", params);
        return http.get<CourseListResType>(url);
    },

    // Search courses
    search: (params: GetCoursesWithPaginationQueryType) => {
        const url = buildUrlWithParams("/courses/search", params);
        return http.get<CourseListResType>(url);
    },

    // Get recent courses
    getRecent: () => http.get<CourseListResType>("/courses/recent"),

    // Get courses by category
    getByCategory: (
        categorySlug: string,
        params?: GetCoursesWithPaginationQueryType
    ) => {
        const url = buildUrlWithParams(
            `/courses/category/${categorySlug}`,
            params || {}
        );
        return http.get<CourseListResType>(url);
    },

    // Get course categories
    getCategories: () =>
        http.get<CourseCategoriesResType>("/courses/categories"),

    // Get course modules
    getModules: (courseId: number) =>
        http.get<any>(`/courses/${courseId}/modules`),
};

export default courseManagementApiRequest;
