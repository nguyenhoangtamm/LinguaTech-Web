import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import courseTagApiRequest, {
    CreateCourseTagRequest,
    UpdateCourseTagRequest,
} from "@/apiRequests/courseTag";

// Query keys
const COURSE_TAG_QUERY_KEYS = {
    all: ["courseTags"] as const,
    lists: () => [...COURSE_TAG_QUERY_KEYS.all, "list"] as const,
    list: (filters: any) => [...COURSE_TAG_QUERY_KEYS.lists(), { filters }] as const,
    details: () => [...COURSE_TAG_QUERY_KEYS.all, "detail"] as const,
    detail: (id: number) => [...COURSE_TAG_QUERY_KEYS.details(), id] as const,
};

// Get all course tags
export const useGetAllCourseTags = () => {
    return useQuery({
        queryKey: COURSE_TAG_QUERY_KEYS.lists(),
        queryFn: courseTagApiRequest.getAllCourseTags,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Get course tag by ID
export const useGetCourseTag = (id: number, enabled = true) => {
    return useQuery({
        queryKey: COURSE_TAG_QUERY_KEYS.detail(id),
        queryFn: () => courseTagApiRequest.getCourseTag(id),
        enabled: enabled && !!id,
    });
};

// Create course tag mutation
export const useCreateCourseTag = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: courseTagApiRequest.createCourseTag,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: COURSE_TAG_QUERY_KEYS.lists(),
            });
        },
    });
};

// Update course tag mutation
export const useUpdateCourseTag = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, body }: { id: number; body: UpdateCourseTagRequest }) =>
            courseTagApiRequest.updateCourseTag(id, body),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: COURSE_TAG_QUERY_KEYS.all,
            });
        },
    });
};

// Delete course tag mutation
export const useDeleteCourseTag = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: courseTagApiRequest.deleteCourseTag,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: COURSE_TAG_QUERY_KEYS.lists(),
            });
        },
    });
};