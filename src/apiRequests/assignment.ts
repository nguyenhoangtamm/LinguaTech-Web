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
    const filteredParams = Object.fromEntries(
        Object.entries(params).filter(
            ([_, value]) =>
                value !== undefined && value !== null && value !== ""
        )
    );
    const queryString = new URLSearchParams(filteredParams).toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

// Assignment API endpoints based on api.json
const assignmentApiRequest = {
    // Create assignment
    create: (body: CreateAssignmentBodyType) =>
        http.post<AssignmentOperationResType>("/assignments/create", body),

    // Update assignment
    update: (id: number, body: UpdateAssignmentBodyType) =>
        http.post<AssignmentOperationResType>(
            `/assignments/update/${id}`,
            body
        ),

    // Delete assignment
    delete: (id: number) =>
        http.post<AssignmentOperationResType>(
            `/assignments/delete/${id}`,
            null
        ),

    // Get assignment by ID (with questions)
    getById: (id: number) =>
        http.get<AssignmentDetailResType>(`/assignments/${id}`),

    // Get all assignments (simple list)
    getAll: () => http.get<GetAllAssignmentsResType>("/assignments/get-all"),

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
            buildUrlWithParams("/assignments/get-pagination", params)
        );
    },

    // Get assignments by lesson ID
    getByLesson: (lessonId: number) =>
        http.get<GetAllAssignmentsResType>(`/assignments/lesson/${lessonId}`),
};

export default assignmentApiRequest;
