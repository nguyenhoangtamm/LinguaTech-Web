import http from "@/lib/http";
import {
    EnrollmentListResType,
    EnrollmentResType,
    CreateEnrollmentBodyType,
    UpdateEnrollmentBodyType,
    FilterEnrollmentType,
    UserEnrollmentResType,
    EnrollmentOperationResType,
    CheckEnrollmentResType,
    UpdateProgressBodyType,
    UpdateProgressResType,
} from "@/schemaValidations/enrollment.schema";

const buildUrlWithParams = (baseUrl: string, params: Record<string, any>) => {
    const queryString = new URLSearchParams(
        Object.fromEntries(
            Object.entries(params).filter(
                ([_, value]) => value !== undefined && value !== ""
            )
        )
    ).toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

// Enrollment API endpoints based on api.json
const enrollmentApiRequest = {
    // Create enrollment (enroll in a course)
    create: (body: CreateEnrollmentBodyType) =>
        http.post<EnrollmentOperationResType>(
            "/enrollments/create",
            body
        ),

    // Get my enrolled courses
    getMyCourses: () =>
        http.get<UserEnrollmentResType>("/enrollments/my-courses"),

    // Check enrollment status for a course
    checkEnrollment: (courseId: number) =>
        http.get<CheckEnrollmentResType>(
            `/enrollments/check/${courseId}`
        ),

    // Update progress for a course
    updateProgress: (courseId: number, body: UpdateProgressBodyType) =>
        http.post<UpdateProgressResType>(
            `/enrollments/update-progress/${courseId}`,
            body
        ),

    // Get courses to continue learning
    getContinueCourses: () =>
        http.get<UserEnrollmentResType>("/enrollments/continue"),

    // Admin functions - Get enrollments with pagination (for management)
    list: (filters: FilterEnrollmentType) => {
        const params = Object.fromEntries(
            Object.entries(filters).filter(
                ([_, value]) => value !== undefined && value !== ""
            )
        );
        return http.get<EnrollmentListResType>(
            buildUrlWithParams("/enrollments/get-pagination", params)
        );
    },

    // Get enrollment by ID (admin function)
    getById: (id: number) =>
        http.get<EnrollmentResType>(`/enrollments/${id}`),

    // Update enrollment (admin function)
    update: (id: number, body: UpdateEnrollmentBodyType) =>
        http.put<EnrollmentOperationResType>(
            `/enrollments/update/${id}`,
            body
        ),

    // Delete enrollment (admin function)
    delete: (id: number) =>
        http.delete<EnrollmentOperationResType>(
            `/enrollments/delete/${id}`
        ),
};

export default enrollmentApiRequest;
