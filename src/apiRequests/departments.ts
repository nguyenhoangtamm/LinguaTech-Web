import http from "@/lib/http";
import {
    CreateDepartmentBodyType,
    DepartmentListResType,
    DepartmentResType,
    UpdateDepartmentBodyType,
} from "@/schemaValidations/department.schema";

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

const departmentApiRequest = {
    getAll: () => http.get<DepartmentListResType>(`/departments/get-all`),
    list: (filters: { pageNumber: number; pageSize: number }) =>
        http.get<DepartmentListResType>(
            buildUrlWithParams("/departments/get-pagination", filters)
        ),
    getDepartment: (id: number) =>
        http.get<DepartmentResType>(`departments/get-by-id/${id}`),
    create: (body: CreateDepartmentBodyType) =>
        http.post<DepartmentResType>("/departments/create", body),
    updateDepartment: (id: number, body: UpdateDepartmentBodyType) =>
        http.post<DepartmentResType>(`departments/update/${id}`, body),
    deleteDepartment: (id: number) =>
        http.post<DepartmentResType>(`departments/delete/${id}`, null),
};

export default departmentApiRequest;
