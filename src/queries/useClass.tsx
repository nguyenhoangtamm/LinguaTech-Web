import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import classApiRequest from "@/apiRequests/class";
import { FilterClassType, UpdateClassBodyType, CreateClassBodyType } from "@/schemaValidations/class.schema";

// Query keys
export const classKeys = {
    all: ['classes'] as const,
    lists: () => [...classKeys.all, 'list'] as const,
    list: (filters: string) => [...classKeys.lists(), { filters }] as const,
    details: () => [...classKeys.all, 'detail'] as const,
    detail: (id: number) => [...classKeys.details(), id] as const,
    byCourse: (courseId: number) => [...classKeys.all, 'course', courseId] as const,
};

// Get all classes
export const useGetAllClassQuery = () => {
    return useQuery({
        queryKey: classKeys.lists(),
        queryFn: () => classApiRequest.getAll()
    });
};

// Get class by ID
export const useGetClassQuery = ({ id, enabled }: { id: number; enabled: boolean }) => {
    return useQuery({
        queryKey: classKeys.detail(id),
        queryFn: () => classApiRequest.getById(id),
        enabled
    });
};

// Get classes with pagination
export const useClassListQuery = ({ pageSize, pageNumber, ...filter }: {
    pageSize: number,
    pageNumber: number
} & Partial<FilterClassType>) => {
    const params = { pageSize, pageNumber, ...filter };
    return useQuery({
        queryKey: classKeys.list(JSON.stringify(params)),
        queryFn: () => classApiRequest.list(params)
    });
};

// Get classes by course ID
export const useClassesByCourseQuery = (courseId: number) => {
    return useQuery({
        queryKey: classKeys.byCourse(courseId),
        queryFn: () => classApiRequest.getByCourse(courseId),
        enabled: !!courseId
    });
};

// Create class mutation
export const useCreateClassMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateClassBodyType) => classApiRequest.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: classKeys.all });
        }
    });
};

// Update class mutation
export const useUpdateClassMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...data }: UpdateClassBodyType & { id: number }) =>
            classApiRequest.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: classKeys.all });
            queryClient.invalidateQueries({ queryKey: classKeys.detail(variables.id) });
        }
    });
};

// Delete class mutation
export const useDeleteClassMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => classApiRequest.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: classKeys.all });
        }
    });
};