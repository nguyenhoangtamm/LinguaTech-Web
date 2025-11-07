import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import assignmentApiRequest from "@/apiRequests/assignment";
import {
    FilterAssignmentType,
    CreateAssignmentBodyType,
    UpdateAssignmentBodyType
} from "@/schemaValidations/assignment.schema";

// Assignment-related hooks
export const useGetAllAssignmentQuery = () => {
    return useQuery({
        queryKey: ['assignments', 'all'],
        queryFn: () => assignmentApiRequest.getAll()
    });
};

export const useGetAssignmentQuery = ({ id, enabled }: { id: number; enabled: boolean }) => {
    return useQuery({
        queryKey: ['assignments', id],
        queryFn: () => assignmentApiRequest.getById(id),
        enabled
    });
};

export const useAssignmentListQuery = ({
    pageSize,
    pageNumber,
    ...filter
}: {
    pageSize: number;
    pageNumber: number;
} & Partial<FilterAssignmentType>) => {
    const params = { pageSize, pageNumber, ...filter };
    return useQuery({
        queryKey: ['assignments', 'list', params.pageNumber, params.pageSize, params.keyword, params.lessonId],
        queryFn: () => assignmentApiRequest.list(params)
    });
};

export const useGetAssignmentsByLessonQuery = (lessonId: number) => {
    return useQuery({
        queryKey: ['assignments', 'lesson', lessonId],
        queryFn: () => assignmentApiRequest.getByLesson(lessonId),
        enabled: !!lessonId
    });
};

export const useCreateAssignmentMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: assignmentApiRequest.create,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['assignments']
            });
        }
    });
};

export const useUpdateAssignmentMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...body }: UpdateAssignmentBodyType & { id: number }) =>
            assignmentApiRequest.update(id, body),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['assignments']
            });
        }
    });
};

export const useDeleteAssignmentMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: assignmentApiRequest.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['assignments']
            });
        }
    });
};