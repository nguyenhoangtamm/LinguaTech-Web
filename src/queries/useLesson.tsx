import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lessonApiRequest, moduleApiRequest, materialApiRequest } from '@/apiRequests/lesson';
import {
    LessonQueryParamsType,
    MaterialQueryParamsType,
    CreateLessonBodyType,
    UpdateLessonBodyType,
    CreateModuleBodyType,
    UpdateModuleBodyType,
    CreateMaterialBodyType,
    UpdateMaterialBodyType
} from '@/schemaValidations/lesson.schema';

// Lesson queries
export const useLessonsQuery = (params?: LessonQueryParamsType) => {
    return useQuery({
        queryKey: ['lessons', params],
        queryFn: () => lessonApiRequest.getLessons(params),
        select: (data) => data.data,
    });
};

export const useLessonQuery = (id: string, enabled = true) => {
    return useQuery({
        queryKey: ['lesson', id],
        queryFn: () => lessonApiRequest.getLesson(id),
        select: (data) => data.data,
        enabled: !!id && enabled,
    });
};

// Module queries
export const useModulesByCourseQuery = (courseId: string, enabled = true) => {
    return useQuery({
        queryKey: ['modules', 'course', courseId],
        queryFn: () => moduleApiRequest.getModulesByCourse(courseId),
        select: (data) => data.data,
        enabled: !!courseId && enabled,
    });
};

export const useModuleQuery = (id: string, enabled = true) => {
    return useQuery({
        queryKey: ['module', id],
        queryFn: () => moduleApiRequest.getModule(id),
        select: (data) => data.data,
        enabled: !!id && enabled,
    });
};

// Material queries
export const useMaterialsByLessonQuery = (lessonId: string, params?: MaterialQueryParamsType, enabled = true) => {
    return useQuery({
        queryKey: ['materials', 'lesson', lessonId, params],
        queryFn: () => materialApiRequest.getMaterialsByLesson(lessonId, params),
        select: (data) => data.data,
        enabled: !!lessonId && enabled,
    });
};

export const useMaterialQuery = (id: string, enabled = true) => {
    return useQuery({
        queryKey: ['material', id],
        queryFn: () => materialApiRequest.getMaterial(id),
        select: (data) => data.data,
        enabled: !!id && enabled,
    });
};

// Lesson mutations
export const useCreateLessonMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateLessonBodyType) => lessonApiRequest.createLesson(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lessons'] });
            queryClient.invalidateQueries({ queryKey: ['modules'] });
        },
    });
};

export const useUpdateLessonMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateLessonBodyType }) =>
            lessonApiRequest.updateLesson(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['lesson', id] });
            queryClient.invalidateQueries({ queryKey: ['lessons'] });
            queryClient.invalidateQueries({ queryKey: ['modules'] });
        },
    });
};

export const useDeleteLessonMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => lessonApiRequest.deleteLesson(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lessons'] });
            queryClient.invalidateQueries({ queryKey: ['modules'] });
        },
    });
};

export const useCompleteLessonMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => lessonApiRequest.completeLesson(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['lesson', id] });
            queryClient.invalidateQueries({ queryKey: ['lessons'] });
        },
    });
};

// Module mutations
export const useCreateModuleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateModuleBodyType) => moduleApiRequest.createModule(data),
        onSuccess: (_, data) => {
            queryClient.invalidateQueries({ queryKey: ['modules', 'course', data.courseId] });
        },
    });
};

export const useUpdateModuleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateModuleBodyType }) =>
            moduleApiRequest.updateModule(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['module', id] });
            queryClient.invalidateQueries({ queryKey: ['modules'] });
        },
    });
};

export const useDeleteModuleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => moduleApiRequest.deleteModule(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['modules'] });
        },
    });
};

// Material mutations
export const useCreateMaterialMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateMaterialBodyType) => materialApiRequest.createMaterial(data),
        onSuccess: (_, data) => {
            queryClient.invalidateQueries({ queryKey: ['materials', 'lesson', data.lessonId] });
        },
    });
};

export const useUpdateMaterialMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateMaterialBodyType }) =>
            materialApiRequest.updateMaterial(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['material', id] });
            queryClient.invalidateQueries({ queryKey: ['materials'] });
        },
    });
};

export const useDeleteMaterialMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => materialApiRequest.deleteMaterial(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['materials'] });
        },
    });
};