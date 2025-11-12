import http from "@/lib/http";
import {
    CreateMenuBodyType,
    MenuItemByUserRoleListType,
    MenuListResType,
    MenuResType,
    TreeViewMenuType,
    UpdateMenuBodyType,
} from "@/schemaValidations/menu.schema";

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

const menuApiRequest = {
    getAll: () => http.get<MenuListResType>(`/menus/get-all`),
    list: (filters: { pageNumber: number; pageSize: number }) =>
        http.get<MenuListResType>(
            buildUrlWithParams("/menus/get-pagination", filters)
        ),
    getMenu: (id: number) => http.get<MenuResType>(`menus/get-by-id/${id}`),
    create: (body: CreateMenuBodyType) =>
        http.post<MenuResType>("/menus/create", body),
    updateMenu: (id: number, body: UpdateMenuBodyType) =>
        http.post<MenuResType>(`menus/update/${id}`, body),
    deleteMenu: (id: number) =>
        http.post<MenuResType>(`menus/delete/${id}`, null),
    getTreeViewMenu: () => http.get<TreeViewMenuType>(`/menus/get-tree-view`),
    getMenuOfUser: (roleId: number) =>
        http.get<MenuItemByUserRoleListType>(`/menus/GetMenusByUserRoles`),
};

export default menuApiRequest;
