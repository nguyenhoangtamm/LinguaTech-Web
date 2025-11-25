import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moduleApiRequest from "@/apiRequests/module";
import { FilterModuleType, UpdateModuleBodyType, CreateModuleBodyType } from "@/schemaValidations/module.schema";

// Query keys
export const moduleKeys = {
    all: ['modules'] as const,
    lists: () => [...moduleKeys.all, 'list'] as const,
    list: (filters: string) => [...moduleKeys.lists(), { filters }] as const,
    details: () => [...moduleKeys.all, 'detail'] as const,
    detail: (id: number) => [...moduleKeys.details(), id] as const,
};

// Get module by ID
export const useGetModuleQuery = ({ id, enabled }: { id: number; enabled: boolean }) => {
    return useQuery({
        queryKey: moduleKeys.detail(id),
        queryFn: () => moduleApiRequest.getById(id),
        enabled
    });
};

// Get modules with pagination
export const useModuleListQuery = ({ pageSize, pageNumber, ...filter }: {
    pageSize: number,
    pageNumber: number
} & Partial<FilterModuleType>) => {
    const params = { pageSize, pageNumber, ...filter };
    return useQuery({
        queryKey: moduleKeys.list(JSON.stringify(params)),
        queryFn: () => moduleApiRequest.list(params)
    });
};

// Create module mutation
export const useCreateModuleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateModuleBodyType) => moduleApiRequest.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: moduleKeys.all });
        }
    });
};

// Update module mutation
export const useUpdateModuleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateModuleBodyType) =>
            moduleApiRequest.update(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: moduleKeys.all });
            queryClient.invalidateQueries({ queryKey: moduleKeys.detail(variables.id) });
        }
    });
};

// Delete module mutation
export const useDeleteModuleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => moduleApiRequest.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: moduleKeys.all });
        }
    });
};