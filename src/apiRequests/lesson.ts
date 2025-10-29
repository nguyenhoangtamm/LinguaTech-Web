import http from "@/lib/http";
import {
    LessonQueryParamsType,
    MaterialQueryParamsType,
    CreateLessonBodyType,
    UpdateLessonBodyType,
    CreateModuleBodyType,
    UpdateModuleBodyType,
    CreateMaterialBodyType,
    UpdateMaterialBodyType,
    LessonType,
    ModuleType,
    MaterialType,
    ModuleWithLessonsType,
    SectionType,
} from "@/schemaValidations/lesson.schema";
import { ApiResponse, PaginatedResponse } from "@/types/common";

// Lesson APIs
export const lessonApiRequest = {
    // Get all lessons
    getLessons: (params?: LessonQueryParamsType) =>
        http.get<ApiResponse<PaginatedResponse<LessonType>>>(`/lessons`, {
            params,
        }),

    // Get lesson by ID
    getLesson: (id: number) =>
        http.get<ApiResponse<LessonType>>(`/lessons/${id}`),

    // Create lesson
    createLesson: (body: CreateLessonBodyType) =>
        http.post<ApiResponse<LessonType>>(`/lessons/create`, body),

    // Update lesson
    updateLesson: (id: number, body: UpdateLessonBodyType) =>
        http.post<ApiResponse<LessonType>>(`/lessons/update/${id}`, body),

    // Delete lesson
    deleteLesson: (id: number) =>
        http.post<ApiResponse<null>>(`/lessons/delete/${id}`, {}),

    // Mark lesson as completed
    completeLesson: (id: number) =>
        http.post<ApiResponse<LessonType>>(`/lessons/complete/${id}`, {}),
};

// Module APIs
export const moduleApiRequest = {
    // Get modules by course ID
    getModulesByCourse: (courseId: string) =>
        http.get<ApiResponse<ModuleWithLessonsType[]>>(
            `/courses/${courseId}/modules`
        ),

    // Get module by ID
    getModule: (id: number) =>
        http.get<ApiResponse<ModuleWithLessonsType>>(`/modules/${id}`),

    // Create module
    createModule: (body: CreateModuleBodyType) =>
        http.post<ApiResponse<ModuleType>>(`/modules/create`, body),

    // Update module
    updateModule: (id: number, body: UpdateModuleBodyType) =>
        http.post<ApiResponse<ModuleType>>(`/modules/update/${id}`, body),

    // Delete module
    deleteModule: (id: number) =>
        http.post<ApiResponse<null>>(`/modules/delete/${id}`, {}),
};

// Material APIs
export const materialApiRequest = {
    // Get materials by lesson ID
    getMaterialsByLesson: (
        lessonId: string,
        params?: MaterialQueryParamsType
    ) =>
        http.get<ApiResponse<MaterialType[]>>(
            `/lessons/${lessonId}/materials`,
            { params }
        ),

    // Get material by ID
    getMaterial: (id: number) =>
        http.get<ApiResponse<MaterialType>>(`/materials/${id}`),

    // Create material
    createMaterial: (body: CreateMaterialBodyType) =>
        http.post<ApiResponse<MaterialType>>(`/materials/create`, body),

    // Update material
    updateMaterial: (id: number, body: UpdateMaterialBodyType) =>
        http.post<ApiResponse<MaterialType>>(`/materials/update/${id}`, body),

    // Delete material
    deleteMaterial: (id: number) =>
        http.post<ApiResponse<null>>(`/materials/delete/${id}`, {}),

    // Download material
    downloadMaterial: (id: number) =>
        http.get(`/materials/${id}/download`, { responseType: "blob" }),
};

// Section APIs
export const sectionApiRequest = {
    // Get sections by lesson ID
    getSectionsByLesson: (lessonId: string) =>
        http.get<ApiResponse<SectionType[]>>(`/lessons/${lessonId}/sections`),
};
