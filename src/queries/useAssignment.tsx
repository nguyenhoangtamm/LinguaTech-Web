import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import assignmentApiRequest, {
    Assignment,
    UserSubmission,
    SubmitAssignmentRequest,
    SaveDraftRequest,
    GradeSubmissionRequest,
} from "@/apiRequests/assignment";
import { toast } from "@/hooks/use-toast";

// Query keys
export const assignmentKeys = {
    all: ['assignments'] as const,
    assignment: (id: string) => [...assignmentKeys.all, 'detail', id] as const,
    submission: (assignmentId: string) => [...assignmentKeys.all, 'submission', assignmentId] as const,
    lessonAssignments: (lessonId: string) => [...assignmentKeys.all, 'lesson', lessonId] as const,
    submissions: (assignmentId: string) => [...assignmentKeys.all, 'submissions', assignmentId] as const,
};

// Get assignment by ID
export const useAssignment = (assignmentId: string) => {
    return useQuery({
        queryKey: assignmentKeys.assignment(assignmentId),
        queryFn: async () => {
            const response = await assignmentApiRequest.getAssignmentById(assignmentId);
            // Handle both direct data and wrapped AxiosResponse
            return (response as any)?.data || response;
        },
        enabled: !!assignmentId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Get assignments by lesson
export const useAssignmentsByLesson = (lessonId: string) => {
    return useQuery({
        queryKey: assignmentKeys.lessonAssignments(lessonId),
        queryFn: async () => {
            const response = await assignmentApiRequest.getAssignmentsByLesson(lessonId);
            // Handle both direct data and wrapped AxiosResponse
            const data = (response as any)?.data || response;
            return Array.isArray(data) ? data : data?.data || [];
        },
        enabled: !!lessonId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Get user submission for assignment
export const useUserSubmission = (assignmentId: string) => {
    return useQuery({
        queryKey: assignmentKeys.submission(assignmentId),
        queryFn: async () => {
            const response = await assignmentApiRequest.getUserSubmission(assignmentId);
            // Handle both direct data and wrapped AxiosResponse
            return (response as any)?.data || response;
        },
        enabled: !!assignmentId,
        retry: false, // Don't retry if user hasn't submitted yet
    });
};

// Submit assignment
export const useSubmitAssignment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ assignmentId, data }: { assignmentId: string; data: SubmitAssignmentRequest }) =>
            assignmentApiRequest.submitAssignment(assignmentId, data),
        onSuccess: (data, variables) => {
            toast({
                title: "Thành công",
                description: "Bài tập đã được nộp thành công!",
            });

            // Invalidate and refetch related queries
            queryClient.invalidateQueries({
                queryKey: assignmentKeys.submission(variables.assignmentId),
            });
            queryClient.invalidateQueries({
                queryKey: assignmentKeys.assignment(variables.assignmentId),
            });
        },
        onError: (error: any) => {
            toast({
                title: "Lỗi",
                description: error?.message || "Không thể nộp bài tập. Vui lòng thử lại.",
                variant: "destructive",
            });
        },
    });
};

// Save draft answers
export const useSaveDraftAnswers = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ assignmentId, data }: { assignmentId: string; data: SaveDraftRequest }) =>
            assignmentApiRequest.saveDraftAnswers(assignmentId, data),
        onSuccess: (data, variables) => {
            toast({
                title: "Đã lưu",
                description: "Câu trả lời đã được lưu tạm thời.",
            });

            // Update the submission cache
            queryClient.invalidateQueries({
                queryKey: assignmentKeys.submission(variables.assignmentId),
            });
        },
        onError: (error: any) => {
            toast({
                title: "Lỗi",
                description: error?.message || "Không thể lưu câu trả lời. Vui lòng thử lại.",
                variant: "destructive",
            });
        },
    });
};

// Get assignment submissions (for teachers)
export const useAssignmentSubmissions = (assignmentId: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: assignmentKeys.submissions(assignmentId),
        queryFn: () => assignmentApiRequest.getAssignmentSubmissions(assignmentId),
        enabled: !!assignmentId && enabled,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

// Grade submission
export const useGradeSubmission = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ submissionId, data }: { submissionId: string; data: GradeSubmissionRequest }) =>
            assignmentApiRequest.gradeSubmission(submissionId, data),
        onSuccess: (data, variables) => {
            toast({
                title: "Thành công",
                description: "Bài tập đã được chấm điểm!",
            });

            // Invalidate related queries
            queryClient.invalidateQueries({
                queryKey: assignmentKeys.submissions,
            });
        },
        onError: (error: any) => {
            toast({
                title: "Lỗi",
                description: error?.message || "Không thể chấm điểm bài tập. Vui lòng thử lại.",
                variant: "destructive",
            });
        },
    });
};

// Auto-save hook for draft answers
export const useAutoSaveDraft = (assignmentId: string, debounceMs: number = 2000) => {
    const saveDraftMutation = useSaveDraftAnswers();

    const autoSave = (answers: { questionId: string; answer: string; selectedOptionId?: string }[]) => {
        if (answers.length > 0) {
            saveDraftMutation.mutate({
                assignmentId,
                data: { answers },
            });
        }
    };

    return {
        autoSave,
        isSaving: saveDraftMutation.isPending,
    };
};

const assignmentHooks = {
    useAssignment,
    useAssignmentsByLesson,
    useUserSubmission,
    useSubmitAssignment,
    useSaveDraftAnswers,
    useAssignmentSubmissions,
    useGradeSubmission,
    useAutoSaveDraft,
};

export default assignmentHooks;