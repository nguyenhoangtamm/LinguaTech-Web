import http from "@/lib/http";
import {
    ModuleListResType,
    ModuleResType,
    CreateModuleBodyType,
    UpdateModuleBodyType,
    FilterModuleType,
    ModuleOperationResType,
} from "@/schemaValidations/module.schema";

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

// Module API endpoints based on api.json
const moduleApiRequest = {
    // Create module
    create: (body: CreateModuleBodyType) =>
        http.post<ModuleOperationResType>("/api/v1/modules/create", body),

    // Update module
    update: (id: number, body: UpdateModuleBodyType) =>
        http.post<ModuleOperationResType>(`/api/v1/modules/update/${id}`, body),

    // Delete module
    delete: (id: number) =>
        http.post<ModuleOperationResType>(`/api/v1/modules/delete/${id}`, {}),

    // Get module by ID (with lessons)
    getById: (id: number) => http.get<ModuleResType>(`/api/v1/modules/${id}`),

    // Get modules with pagination and filters
    list: (filters: FilterModuleType) => {
        const params = Object.fromEntries(
            Object.entries(filters).filter(
                ([_, value]) => value !== undefined && value !== ""
            )
        );
        return http.get<ModuleListResType>(
            buildUrlWithParams("/api/v1/modules/get-pagination", params)
        );
    },
};

export default moduleApiRequest;
