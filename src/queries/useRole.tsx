import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import roleApiRequest from "@/apiRequests/role"; // Assuming you have a role API request module
import { ActionConfigMenuWithRoleType, ActionConfigPermissionWithRoleType, FilterRoleType, UpdateRoleBodyType } from "@/schemaValidations/role.schema";

// Role-related hooks
export const useGetAllRoleQuery = () => {
    return useQuery({
        queryKey: ['roles', 'all'],
        queryFn: () => roleApiRequest.getAll()
    })
}

export const useGetConfigMenuWithRoleQuery = ({id}: { id: string | undefined }) => {
    const shouldFetch = Boolean(id) && parseInt(id as string, 10) !== 0;
    return useQuery({
        queryKey: ['roles-config-menu', id],
        queryFn: () => roleApiRequest.getConfigMenuIds(parseInt(id ?? "")),
        enabled: shouldFetch
    })
}

export const useGetRoleQuery = ({id, enabled}: { id: number; enabled: boolean }) => {
    return useQuery({
        queryKey: ['roles', id],
        queryFn: () => roleApiRequest.getRole(id),
        enabled
    })
}

export const useRoleListQuery = ({pageSize, pageNumber, ...filter}: {
    pageSize: number,
    pageNumber: number
} & Partial<FilterRoleType>) => {
    const params = {pageSize, pageNumber, ...filter}
    return useQuery({
        queryKey: ['roles', params.pageNumber, params.pageSize],
        queryFn: () => roleApiRequest.list(params)
    })
}

export const useCreateRoleMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: roleApiRequest.create,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['roles']
            })
        }
    })
}

export const useConfigMenuWithRole = () => {
    return useMutation({
        mutationFn: (body: ActionConfigMenuWithRoleType & { id: number }) =>
            roleApiRequest.configMenu(body.id, body)
    })
}
export const useUpdateRoleMutation = () => {
    return useMutation({
        mutationFn: (body: UpdateRoleBodyType & { id: number }) =>
            roleApiRequest.updateRole(body.id, body)
    })
}

export const useDeleteRoleMutation = () => {
    return useMutation({
        mutationFn: roleApiRequest.deleteRole,
    })
}

export const useAssignRoleToUserMutation = () => {
    return useMutation({
        mutationFn: roleApiRequest.assignRoleToUser,
    });
}
export const useGetAllConfigPermissionsQuery = () => {
    return useQuery({
        queryKey: ['config-permissions'],
        queryFn: () => roleApiRequest.getAllConfigPermissions()
    })
}
export const useGetConfigPermissionsByRoleIdQuery = ({id}: { id: string | undefined }) => {
    const shouldFetch = Boolean(id) && parseInt(id as string, 10) !== 0;
    return useQuery({
        queryKey: ['config-permissions', id],
        queryFn: () => roleApiRequest.getConfigPermissionsByRoleId(parseInt(id ?? "")),
        enabled: shouldFetch
    })
}
export const useConfigPermissionWithRole = () => {
    return useMutation({
        mutationFn: (body: ActionConfigPermissionWithRoleType & { id: number }) =>
            roleApiRequest.configPermission(body.id, body)
    })
}