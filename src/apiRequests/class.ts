import http from "@/lib/http";
import {
    ClassListResType,
    ClassResType,
    CreateClassBodyType,
    UpdateClassBodyType,
    FilterClassType,
    GetAllClassesResType,
    ClassOperationResType,
} from "@/schemaValidations/class.schema";

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

// Class Management API endpoints based on api.json
const classApiRequest = {
    // Create class
    create: (body: CreateClassBodyType) =>
        http.post<ClassOperationResType>("/api/v1/classes/create", body),

    // Update class
    update: (id: number, body: UpdateClassBodyType) =>
        http.post<ClassOperationResType>(`/api/v1/classes/update/${id}`, body),

    // Delete class
    delete: (id: number) =>
        http.post<ClassOperationResType>(`/api/v1/classes/delete/${id}`, {}),

    // Get class by ID
    getById: (id: number) => http.get<ClassResType>(`/api/v1/classes/${id}`),

    // Get all classes (simple list)
    getAll: () => http.get<GetAllClassesResType>("/api/v1/classes/get-all"),

    // Get classes with pagination and filters
    list: (filters: FilterClassType) => {
        const params = Object.fromEntries(
            Object.entries(filters).filter(
                ([_, value]) => value !== undefined && value !== ""
            )
        );
        return http.get<ClassListResType>(
            buildUrlWithParams("/api/v1/classes/get-pagination", params)
        );
    },

    // Get classes by course ID
    getByCourse: (courseId: number) =>
        http.get<GetAllClassesResType>(`/api/v1/classes/by-course/${courseId}`),
};

export default classApiRequest;
