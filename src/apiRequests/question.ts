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
    const filteredParams = Object.fromEntries(
        Object.entries(params).filter(
            ([_, value]) =>
                value !== undefined && value !== null && value !== ""
        )
    );
    const queryString = new URLSearchParams(filteredParams).toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

// Question API endpoints based on api.json
const questionApiRequest = {
    // Create question
    create: (body: CreateQuestionBodyType) =>
        http.post<QuestionOperationResType>("/questions/create", body),

    // Update question
    update: (id: number, body: UpdateQuestionBodyType) =>
        http.post<QuestionOperationResType>(`/questions/update/${id}`, body),

    // Delete question
    delete: (id: number) =>
        http.post<QuestionOperationResType>(`/questions/delete/${id}`, null),

    // Get question by ID
    getById: (id: number) => http.get<QuestionResType>(`/questions/${id}`),

    // Get all questions (simple list)
    getAll: () => http.get<GetAllQuestionsResType>("/questions/get-all"),

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
            buildUrlWithParams("/questions/get-pagination", params)
        );
    },

    // Get questions by assignment ID
    getByAssignment: (assignmentId: number) =>
        http.get<GetAllQuestionsResType>(
            `/questions/assignment/${assignmentId}`
        ),
};

export default questionApiRequest;
