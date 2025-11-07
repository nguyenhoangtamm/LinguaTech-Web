import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import enrollmentApiRequest from "@/apiRequests/enrollment";
import {
    FilterEnrollmentType,
    CreateEnrollmentBodyType,
    UpdateEnrollmentBodyType,
    UpdateProgressBodyType
} from "@/schemaValidations/enrollment.schema";

// Query keys
export const enrollmentKeys = {
    all: ['enrollments'] as const,
    lists: () => [...enrollmentKeys.all, 'list'] as const,
    list: (filters: string) => [...enrollmentKeys.lists(), { filters }] as const,
    details: () => [...enrollmentKeys.all, 'detail'] as const,
    detail: (id: number) => [...enrollmentKeys.details(), id] as const,
    myCourses: () => [...enrollmentKeys.all, 'my-courses'] as const,
    continue: () => [...enrollmentKeys.all, 'continue'] as const,
    check: (courseId: number) => [...enrollmentKeys.all, 'check', courseId] as const,
};

// Get my enrolled courses
export const useMyCoursesQuery = (enabled = true) => {
    return useQuery({
        queryKey: enrollmentKeys.myCourses(),
        queryFn: () => enrollmentApiRequest.getMyCourses(),
        enabled
    });
};

// Get courses to continue
export const useContinueCoursesQuery = (enabled = true) => {
    return useQuery({
        queryKey: enrollmentKeys.continue(),
        queryFn: () => enrollmentApiRequest.getContinueCourses(),
        enabled
    });
};

// Check enrollment status
export const useCheckEnrollmentQuery = (courseId: number, enabled = true) => {
    return useQuery({
        queryKey: enrollmentKeys.check(courseId),
        queryFn: () => enrollmentApiRequest.checkEnrollment(courseId),
        enabled: enabled && !!courseId
    });
};

// Get enrollment by ID (admin)
export const useGetEnrollmentQuery = ({ id, enabled }: { id: number; enabled: boolean }) => {
    return useQuery({
        queryKey: enrollmentKeys.detail(id),
        queryFn: () => enrollmentApiRequest.getById(id),
        enabled
    });
};

// Get enrollments with pagination (admin)
export const useEnrollmentListQuery = ({ pageSize, pageNumber, ...filter }: {
    pageSize: number,
    pageNumber: number
} & Partial<FilterEnrollmentType>) => {
    const params = { pageSize, pageNumber, ...filter };
    return useQuery({
        queryKey: enrollmentKeys.list(JSON.stringify(params)),
        queryFn: () => enrollmentApiRequest.list(params)
    });
};

// Create enrollment (enroll in course) mutation
export const useCreateEnrollmentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateEnrollmentBodyType) => enrollmentApiRequest.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: enrollmentKeys.myCourses() });
            queryClient.invalidateQueries({ queryKey: enrollmentKeys.continue() });
            queryClient.invalidateQueries({ queryKey: enrollmentKeys.all });
        }
    });
};

// Update progress mutation
export const useUpdateProgressMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ courseId, ...data }: UpdateProgressBodyType & { courseId: number }) =>
            enrollmentApiRequest.updateProgress(courseId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: enrollmentKeys.myCourses() });
            queryClient.invalidateQueries({ queryKey: enrollmentKeys.continue() });
            queryClient.invalidateQueries({ queryKey: enrollmentKeys.check(variables.courseId) });
        }
    });
};

// Update enrollment (admin) mutation
export const useUpdateEnrollmentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...data }: UpdateEnrollmentBodyType & { id: number }) =>
            enrollmentApiRequest.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: enrollmentKeys.all });
            queryClient.invalidateQueries({ queryKey: enrollmentKeys.detail(variables.id) });
        }
    });
};

// Delete enrollment (admin) mutation
export const useDeleteEnrollmentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => enrollmentApiRequest.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: enrollmentKeys.all });
        }
    });
};