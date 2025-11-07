import http from "@/lib/http";
import {
    QuestionListResType,
    QuestionResType,
    CreateQuestionBodyType,
    UpdateQuestionBodyType,
    FilterQuestionType,
    GetAllQuestionsResType,
    QuestionOperationResType,
} from "@/schemaValidations/question.schema";

const buildUrlWithParams = (baseUrl: string, params: Record<string, any>) => {
    const queryString = new URLSearchParams(params).toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

// Question API endpoints based on api.json
const questionApiRequest = {
    // Create question
    create: (body: CreateQuestionBodyType) =>
        http.post<QuestionOperationResType>("/api/v1/questions/create", body),

    // Update question
    update: (id: number, body: UpdateQuestionBodyType) =>
        http.post<QuestionOperationResType>(
            `/api/v1/questions/update/${id}`,
            body
        ),

    // Delete question
    delete: (id: number) =>
        http.post<QuestionOperationResType>(
            `/api/v1/questions/delete/${id}`,
            null
        ),

    // Get question by ID
    getById: (id: number) =>
        http.get<QuestionResType>(`/api/v1/questions/${id}`),

    // Get all questions (simple list)
    getAll: () => http.get<GetAllQuestionsResType>("/api/v1/questions/get-all"),

    // Get questions with pagination and filters
    list: (filters: {
        pageNumber: number;
        pageSize: number;
        keyword?: string;
        assignmentId?: number;
        questionTypeId?: number;
        minScore?: number;
        maxScore?: number;
    }) => {
        const params = Object.fromEntries(
            Object.entries(filters).filter(
                ([_, value]) => value !== undefined && value !== ""
            )
        );
        return http.get<QuestionListResType>(
            buildUrlWithParams("/api/v1/questions/get-pagination", params)
        );
    },

    // Get questions by assignment ID
    getByAssignment: (assignmentId: number) =>
        http.get<GetAllQuestionsResType>(
            `/api/v1/questions/assignment/${assignmentId}`
        ),
};

export default questionApiRequest;
