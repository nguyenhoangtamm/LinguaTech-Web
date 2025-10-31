import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lessonApiRequest, moduleApiRequest, materialApiRequest, sectionApiRequest } from '@/apiRequests/lesson';
import {
    LessonQueryParamsType,
    MaterialQueryParamsType,
    CreateLessonBodyType,
    UpdateLessonBodyType,
    CreateModuleBodyType,
    UpdateModuleBodyType,
    CreateMaterialBodyType,
    UpdateMaterialBodyType,
    SectionType,
} from '@/schemaValidations/lesson.schema';

// Lesson queries
export const useLessonsQuery = (params?: LessonQueryParamsType) => {
    return useQuery({
        queryKey: ['lessons', params],
        queryFn: () => lessonApiRequest.getLessons(params),
        select: (data) => data.data,
    });
};

export const useLessonQuery = (id?: number, enabled = true) => {
    return useQuery({
        queryKey: ['lesson', id],
        queryFn: () => lessonApiRequest.getLesson(id as number),
        select: (data) => data,
        enabled: id != null && enabled,
    });
};

// Module queries
export const useModulesByCourseQuery = (courseId?: number, enabled = true) => {
    return useQuery({
        queryKey: ['modules', 'course', courseId],
        queryFn: () => moduleApiRequest.getModulesByCourse(courseId as number),
        select: (data) => data.data,
        enabled: courseId != null && enabled,
    });
};

export const useModuleQuery = (id: number, enabled = true) => {
    return useQuery({
        queryKey: ['module', id],
        queryFn: () => moduleApiRequest.getModule(id),
        select: (data) => data.data,
        enabled: id != null && enabled,
    });
};

// Material queries
export const useMaterialsByLessonQuery = (lessonId?: number, params?: MaterialQueryParamsType, enabled = true) => {
    return useQuery({
        queryKey: ['materials', 'lesson', lessonId, params],
        queryFn: () => materialApiRequest.getMaterialsByLesson(lessonId as number, params),
        select: (data) => data.data,
        enabled: lessonId != null && enabled,
    });
};

export const useMaterialQuery = (id?: number, enabled = true) => {
    return useQuery({
        queryKey: ['material', id],
        queryFn: () => materialApiRequest.getMaterial(id as number),
        select: (data) => data.data,
        enabled: id != null && enabled,
    });
};

// Section queries
export const useSectionsByLessonQuery = (lessonId?: number, enabled = true) => {
    return useQuery({
        queryKey: ['sections', 'lesson', lessonId],
        queryFn: () => sectionApiRequest.getSectionsByLesson(lessonId as number),
        select: (data) => data.data,
        enabled: lessonId != null && enabled,
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
        mutationFn: ({ id, data }: { id: number; data: UpdateLessonBodyType }) =>
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
        mutationFn: (id: number) => lessonApiRequest.deleteLesson(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lessons'] });
            queryClient.invalidateQueries({ queryKey: ['modules'] });
        },
    });
};

export const useCompleteLessonMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => lessonApiRequest.completeLesson(id),
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
        mutationFn: ({ id, data }: { id: number; data: UpdateModuleBodyType }) =>
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
        mutationFn: (id: number) => moduleApiRequest.deleteModule(id),
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
        mutationFn: ({ id, data }: { id: number; data: UpdateMaterialBodyType }) =>
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
        mutationFn: (id: number) => materialApiRequest.deleteMaterial(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['materials'] });
        },
    });
};