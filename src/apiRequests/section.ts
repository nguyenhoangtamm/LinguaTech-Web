import http from "@/lib/http";
import {
    SectionListResType,
    SectionResType,
    CreateSectionBodyType,
    UpdateSectionBodyType,
    FilterSectionType,
    SectionOperationResType,
} from "@/schemaValidations/section.schema";

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

// Section API endpoints based on api.json
const sectionApiRequest = {
    // Create section
    create: (body: CreateSectionBodyType) =>
        http.post<SectionOperationResType>("/sections/create", body),

    // Update section
    update: (id: number, body: UpdateSectionBodyType) =>
        http.post<SectionOperationResType>(`/sections/update/${id}`, body),

    // Delete section
    delete: (id: number) =>
        http.post<SectionOperationResType>(`/sections/delete/${id}`, {}),

    // Get section by ID
    getById: (id: number) => http.get<SectionResType>(`/sections/${id}`),

    // Get sections with pagination and filters
    list: (filters: FilterSectionType) => {
        const params = Object.fromEntries(
            Object.entries(filters).filter(
                ([_, value]) => value !== undefined && value !== ""
            )
        );
        return http.get<SectionListResType>(
            buildUrlWithParams("/sections", params)
        );
    },
};

export default sectionApiRequest;
