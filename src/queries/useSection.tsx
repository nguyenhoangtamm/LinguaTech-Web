import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import sectionApiRequest from "@/apiRequests/section";
import { FilterSectionType, UpdateSectionBodyType, CreateSectionBodyType } from "@/schemaValidations/section.schema";

// Query keys
export const sectionKeys = {
    all: ['sections'] as const,
    lists: () => [...sectionKeys.all, 'list'] as const,
    list: (filters: string) => [...sectionKeys.lists(), { filters }] as const,
    details: () => [...sectionKeys.all, 'detail'] as const,
    detail: (id: number) => [...sectionKeys.details(), id] as const,
};

// Get section by ID
export const useGetSectionQuery = ({ id, enabled }: { id: number; enabled: boolean }) => {
    return useQuery({
        queryKey: sectionKeys.detail(id),
        queryFn: () => sectionApiRequest.getById(id),
        enabled
    });
};

// Get sections with pagination
export const useSectionListQuery = ({ pageSize, pageNumber, ...filter }: {
    pageSize: number,
    pageNumber: number
} & Partial<FilterSectionType>) => {
    const params = { pageSize, pageNumber, ...filter };
    return useQuery({
        queryKey: sectionKeys.list(JSON.stringify(params)),
        queryFn: () => sectionApiRequest.list(params)
    });
};

// Create section mutation
export const useCreateSectionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateSectionBodyType) => sectionApiRequest.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sectionKeys.all });
        }
    });
};

// Update section mutation
export const useUpdateSectionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...data }: { id: number } & Partial<CreateSectionBodyType>) =>
            sectionApiRequest.update(id, { id, ...data }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: sectionKeys.all });
            queryClient.invalidateQueries({ queryKey: sectionKeys.detail(variables.id) });
        }
    });
};

// Delete section mutation
export const useDeleteSectionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => sectionApiRequest.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sectionKeys.all });
        }
    });
};