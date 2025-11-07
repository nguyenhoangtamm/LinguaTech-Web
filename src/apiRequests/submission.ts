import http from "@/lib/http";
import {
    SubmissionListResType,
    SubmissionResType,
    CreateSubmissionBodyType,
    UpdateSubmissionBodyType,
    GetSubmissionsWithPaginationQueryType,
    GetAllSubmissionsResType,
    SubmissionOperationResType,
} from "@/schemaValidations/submission.schema";

const buildUrlWithParams = (baseUrl: string, params: Record<string, any>) => {
    const queryString = new URLSearchParams(params).toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

// Submission API endpoints based on api.json
const submissionApiRequest = {
    // Create submission
    create: (body: CreateSubmissionBodyType) =>
        http.post<SubmissionOperationResType>(
            "/api/v1/submissions/create",
            body
        ),

    // Update submission
    update: (id: number, body: UpdateSubmissionBodyType) =>
        http.post<SubmissionOperationResType>(
            `/api/v1/submissions/update/${id}`,
            body
        ),

    // Delete submission
    delete: (id: number) =>
        http.post<SubmissionOperationResType>(
            `/api/v1/submissions/delete/${id}`,
            {}
        ),

    // Get submission by ID
    getById: (id: number) =>
        http.get<SubmissionResType>(`/api/v1/submissions/${id}`),

    // Get all submissions
    getAll: () =>
        http.get<GetAllSubmissionsResType>("/api/v1/submissions/get-all"),

    // Get submissions by assignment ID
    getByAssignment: (assignmentId: number) =>
        http.get<GetAllSubmissionsResType>(
            `/api/v1/submissions/by-assignment/${assignmentId}`
        ),

    // Get submissions by user ID
    getByUser: (userId: number) =>
        http.get<GetAllSubmissionsResType>(
            `/api/v1/submissions/by-user/${userId}`
        ),

    // Get submissions with pagination
    getWithPagination: (params: GetSubmissionsWithPaginationQueryType) => {
        const url = buildUrlWithParams(
            "/api/v1/submissions/get-pagination",
            params
        );
        return http.get<SubmissionListResType>(url);
    },

    // Get current user submission for assignment
    getCurrentUserSubmission: (assignmentId: number) =>
        http.get<SubmissionResType>(
            `/api/v1/submissions/current-user-submission/${assignmentId}`
        ),
};

export default submissionApiRequest;
