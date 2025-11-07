import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import questionApiRequest from "@/apiRequests/question";
import {
    FilterQuestionType,
    CreateQuestionBodyType,
    UpdateQuestionBodyType
} from "@/schemaValidations/question.schema";

// Question-related hooks
export const useGetAllQuestionQuery = () => {
    return useQuery({
        queryKey: ['questions', 'all'],
        queryFn: () => questionApiRequest.getAll()
    });
};

export const useGetQuestionQuery = ({ id, enabled }: { id: number; enabled: boolean }) => {
    return useQuery({
        queryKey: ['questions', id],
        queryFn: () => questionApiRequest.getById(id),
        enabled
    });
};

export const useQuestionListQuery = ({
    pageSize,
    pageNumber,
    ...filter
}: {
    pageSize: number;
    pageNumber: number;
} & Partial<FilterQuestionType>) => {
    const params = { pageSize, pageNumber, ...filter };
    return useQuery({
        queryKey: ['questions', 'list', params.pageNumber, params.pageSize, params.keyword, params.assignmentId],
        queryFn: () => questionApiRequest.list(params)
    });
};

export const useGetQuestionsByAssignmentQuery = (assignmentId: number) => {
    return useQuery({
        queryKey: ['questions', 'assignment', assignmentId],
        queryFn: () => questionApiRequest.getByAssignment(assignmentId),
        enabled: !!assignmentId
    });
};

export const useCreateQuestionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: questionApiRequest.create,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['questions']
            });
        }
    });
};

export const useUpdateQuestionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...body }: { id: number } & Omit<UpdateQuestionBodyType, 'id'>) =>
            questionApiRequest.update(id, { id, ...body }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['questions']
            });
        }
    });
};

export const useDeleteQuestionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: questionApiRequest.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['questions']
            });
        }
    });
};