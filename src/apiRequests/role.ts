import http from "@/lib/http";
import {
    RoleListResType,
    RoleResType,
    CreateRoleBodyType,
    UpdateRoleBodyType,
    ConfigMenuWithRoleResType,
    ActionConfigMenuWithRoleType,
    RolePermissionListResType,
    RolePermissionsByRoleIdResType,
    ActionConfigPermissionWithRoleType,
} from "@/schemaValidations/role.schema";
import {
    AssignRoleToUserResType,
    AssignRoleToUserType,
} from "@/schemaValidations/user.schema";
import { get } from "lodash";

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

const roleApiRequest = {
    getAll: () => http.get<RoleListResType>(`/roles/get-all`),
    list: (filters: {
        pageNumber: number;
        pageSize: number;
        keyword?: string;
    }) =>
        http.get<RoleListResType>(
            buildUrlWithParams("/roles/get-pagination", filters)
        ),
    getRole: (id: number) => http.get<RoleResType>(`roles/get-by-id/${id}`),
    create: (body: CreateRoleBodyType) =>
        http.post<RoleResType>("/roles/create", body),
    updateRole: (id: number, body: UpdateRoleBodyType) =>
        http.post<RoleResType>(`roles/update/${id}`, body),
    configMenu: (id: number, body: ActionConfigMenuWithRoleType) =>
        http.post<RoleResType>(`roles/assign-role-menus/${id}`, body),
    deleteRole: (id: number) =>
        http.post<RoleResType>(`roles/delete/${id}`, null),
    getConfigMenuIds: (id: number) =>
        http.get<ConfigMenuWithRoleResType>(`/roles/get-config-menu/${id}`),
    assignRoleToUser: (body: AssignRoleToUserType) =>
        http.post<AssignRoleToUserResType>("roles/config-user", body),
    getAllConfigPermissions: () =>
        http.get<RolePermissionListResType>(`/roles/get-permissions`),
    getConfigPermissionsByRoleId: (id: number) =>
        http.get<RolePermissionsByRoleIdResType>(
            `/roles/get-permissions-by-role/${id}`
        ),
    configPermission: (id: number, body: ActionConfigPermissionWithRoleType) =>
        http.post<RoleResType>(`/roles/config-permission-role/${id}`, body),
};

export default roleApiRequest;
