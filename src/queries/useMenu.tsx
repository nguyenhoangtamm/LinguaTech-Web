import menuApiRequest from "@/apiRequests/menu"
import { FilterMenuType, UpdateMenuBodyType } from "@/schemaValidations/menu.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
export const useGetAllMenuQuery = () => {
    return useQuery({
        queryKey: ['menu', 'all'],
        queryFn: () => menuApiRequest.getAll()
    })
}

export const useGetMenuQuery = ({ id, enabled }: { id: number; enabled: boolean }) => {
    return useQuery({
        queryKey: ['menu', id],
        queryFn: () => {
            if (id === undefined) return Promise.reject("No id");
            return menuApiRequest.getMenu(id);
        }, enabled
    })
}

export const useMenuListQuery = ({ pageSize, pageNumber, ...filter }: {
    pageSize: number,
    pageNumber: number
} & Partial<FilterMenuType>) => {
    const params = { pageSize, pageNumber, ...filter }
    return useQuery({
        queryKey: ['menu', params.pageNumber, params.pageSize],
        queryFn: () => menuApiRequest.list(params)
    })
}

export const useCreateMenuMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: menuApiRequest.create,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['menu']
            })
        }
    })
}

export const useUpdateMenuMutation = () => {
    return useMutation({
        mutationFn: (body: UpdateMenuBodyType & { id: number }) =>
            menuApiRequest.updateMenu(body.id, body)
    })
}

export const useDeleteMenuMutation = () => {
    return useMutation({
        mutationFn: menuApiRequest.deleteMenu,
    })
}

export const useGetTreeViewMenuQuery = () => {
    return useQuery({
        queryKey: ['menu', 'tree'],
        queryFn: () => menuApiRequest.getTreeViewMenu()
    })
}
export const useGetMenuByRoleQuery = (roleId: number) => {
    return useQuery({
        queryKey: ['menu', 'role', roleId],
        queryFn: () => menuApiRequest.getMenuOfUser(roleId)
    })
}