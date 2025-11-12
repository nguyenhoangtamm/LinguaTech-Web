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
                ([_, value]) =>
                    value !== undefined && value !== null && value !== ""
            )
        )
    ).toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

// Class Management API endpoints based on api.json
const classApiRequest = {
    // Create class
    create: (body: CreateClassBodyType) =>
        http.post<ClassOperationResType>("/classes/create", body),

    // Update class
    update: (id: number, body: UpdateClassBodyType) =>
        http.post<ClassOperationResType>(`/classes/update/${id}`, body),

    // Delete class
    delete: (id: number) =>
        http.post<ClassOperationResType>(`/classes/delete/${id}`, {}),

    // Get class by ID
    getById: (id: number) => http.get<ClassResType>(`/classes/${id}`),

    // Get all classes (simple list)
    getAll: () => http.get<GetAllClassesResType>("/classes/get-all"),

    // Get classes with pagination and filters
    list: (filters: FilterClassType) => {
        const params = Object.fromEntries(
            Object.entries(filters).filter(
                ([_, value]) => value !== undefined && value !== ""
            )
        );
        return http.get<ClassListResType>(
            buildUrlWithParams("/classes/get-pagination", params)
        );
    },

    // Get classes by course ID
    getByCourse: (courseId: number) =>
        http.get<GetAllClassesResType>(`/classes/by-course/${courseId}`),
};

export default classApiRequest;
