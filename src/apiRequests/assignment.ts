import http from "@/lib/http";
import {
    AssignmentListResType,
    AssignmentResType,
    AssignmentDetailResType,
    CreateAssignmentBodyType,
    UpdateAssignmentBodyType,
    FilterAssignmentType,
    GetAllAssignmentsResType,
    AssignmentOperationResType,
} from "@/schemaValidations/assignment.schema";

const buildUrlWithParams = (baseUrl: string, params: Record<string, any>) => {
    const queryString = new URLSearchParams(params).toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

// Assignment API endpoints based on api.json
const assignmentApiRequest = {
    // Create assignment
    create: (body: CreateAssignmentBodyType) =>
        http.post<AssignmentOperationResType>(
            "/api/v1/assignments/create",
            body
        ),

    // Update assignment
    update: (id: number, body: UpdateAssignmentBodyType) =>
        http.post<AssignmentOperationResType>(
            `/api/v1/assignments/update/${id}`,
            body
        ),

    // Delete assignment
    delete: (id: number) =>
        http.post<AssignmentOperationResType>(
            `/api/v1/assignments/delete/${id}`,
            null
        ),

    // Get assignment by ID (with questions)
    getById: (id: number) =>
        http.get<AssignmentDetailResType>(`/api/v1/assignments/${id}`),

    // Get all assignments (simple list)
    getAll: () =>
        http.get<GetAllAssignmentsResType>("/api/v1/assignments/get-all"),

    // Get assignments with pagination and filters
    list: (filters: {
        pageNumber: number;
        pageSize: number;
        keyword?: string;
        lessonId?: number;
        dueDateFrom?: string;
        dueDateTo?: string;
        minScore?: number;
        maxScore?: number;
    }) => {
        const params = Object.fromEntries(
            Object.entries(filters).filter(
                ([_, value]) => value !== undefined && value !== ""
            )
        );
        return http.get<AssignmentListResType>(
            buildUrlWithParams("/api/v1/assignments/get-pagination", params)
        );
    },

    // Get assignments by lesson ID
    getByLesson: (lessonId: number) =>
        http.get<GetAllAssignmentsResType>(
            `/api/v1/assignments/lesson/${lessonId}`
        ),
};

export default assignmentApiRequest;
