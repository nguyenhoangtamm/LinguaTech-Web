import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import userApiRequest from "@/apiRequests/user";
import {
    FilterUserType,
    CreateUserBodyType,
    UpdateUserBodyType
} from "@/schemaValidations/user.schema";

// User-related hooks
export const useGetAllUserQuery = () => {
    return useQuery({
        queryKey: ['users', 'all'],
        queryFn: () => userApiRequest.getAll()
    });
};

export const useGetUserQuery = ({ id, enabled }: { id: number; enabled: boolean }) => {
    return useQuery({
        queryKey: ['users', id],
        queryFn: () => userApiRequest.getById(id),
        enabled
    });
};

export const useUserListQuery = ({
    pageSize,
    pageNumber,
    ...filter
}: {
    pageSize: number;
    pageNumber: number;
} & Partial<FilterUserType>) => {
    const params = { pageSize, pageNumber, ...filter };
    return useQuery({
        queryKey: ['users', 'list', params.pageNumber, params.pageSize, params.keyword],
        queryFn: () => userApiRequest.list(params)
    });
};

export const useGetMeQuery = () => {
    return useQuery({
        queryKey: ['users', 'me'],
        queryFn: () => userApiRequest.getMe()
    });
};

export const useGetUserDashboardStatsQuery = () => {
    return useQuery({
        queryKey: ['users', 'dashboard-stats'],
        queryFn: () => userApiRequest.getDashboardStats()
    });
};

export const useCreateUserMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: userApiRequest.create,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['users']
            });
        }
    });
};

export const useUpdateUserMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...body }: { id: number } & Omit<UpdateUserBodyType, 'id'>) =>
            userApiRequest.update(id, { id, ...body }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['users']
            });
        }
    });
};

export const useDeleteUserMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: userApiRequest.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['users']
            });
        }
    });
};