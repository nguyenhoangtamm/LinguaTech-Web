import http from "@/lib/http";
import {
    AreaListResType,
    AreaResType,
    CreateAreaBodyType,
    UpdateAreaBodyType,
} from "@/schemaValidations/area.schema";
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
const areaApiRequest = {
    getAll: () => http.get<AreaListResType>(`/areas/getAll`),
    list: (filters: { pageNumber: number; pageSize: number }) =>
        http.get<AreaListResType>(
            buildUrlWithParams("/areas/GetDevicesWithPaging", filters)
        ),
    getArea: (id: number) => http.get<AreaResType>(`areas/get-by-id/${id}`),
    create: (body: CreateAreaBodyType) =>
        http.post<AreaResType>("/areas/create", body),
    updateArea: (id: number, body: UpdateAreaBodyType) =>
        http.post<AreaResType>(`areas/update/${id}`, body),
    deleteArea: (id: number) =>
        http.post<AreaResType>(`areas/delete/${id}`, null),
};

export default areaApiRequest;
