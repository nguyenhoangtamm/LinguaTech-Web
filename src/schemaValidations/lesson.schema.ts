import { z } from "zod";

// Base lesson schema
export const LessonSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    content: z.string().optional(),
    duration: z.number(), // in minutes
    order: z.number(),
    isPublished: z.boolean().default(false),
    isCompleted: z.boolean().default(false),
    moduleId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

// Module schema
export const ModuleSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    order: z.number(),
    courseId: z.string(),
    lessons: z.array(LessonSchema).optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

// Material schema
export const MaterialSchema = z.object({
    id: z.string(),
    title: z.string(),
    fileName: z.string(),
    fileUrl: z.string(),
    fileType: z.enum(["pdf", "video", "image", "document", "audio"]),
    size: z.number(), // in bytes
    lessonId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

// Lesson with materials
export const LessonWithMaterialsSchema = LessonSchema.extend({
    materials: z.array(MaterialSchema).optional(),
});

// Section schema
export const SectionSchema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    order: z.number(),
    lessonId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

// Module with lessons and materials
export const ModuleWithLessonsSchema = ModuleSchema.extend({
    lessons: z.array(LessonWithMaterialsSchema).optional(),
});

// Query params
export const LessonQuerySchema = z.object({
    courseId: z.string().optional(),
    moduleId: z.string().optional(),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
});

export const MaterialQuerySchema = z.object({
    lessonId: z.string().optional(),
    type: z.enum(["pdf", "video", "image", "document", "audio"]).optional(),
});

// Create/Update schemas
export const CreateLessonSchema = z.object({
    title: z.string().min(1, "Tiêu đề không được để trống"),
    description: z.string().optional(),
    content: z.string().optional(),
    duration: z.number().min(1, "Thời lượng phải lớn hơn 0"),
    order: z.number(),
    moduleId: z.string(),
    isPublished: z.boolean().default(false),
});

export const UpdateLessonSchema = CreateLessonSchema.partial();

export const CreateModuleSchema = z.object({
    title: z.string().min(1, "Tiêu đề không được để trống"),
    description: z.string().optional(),
    order: z.number(),
    courseId: z.string(),
});

export const UpdateModuleSchema = CreateModuleSchema.partial();

export const CreateMaterialSchema = z.object({
    title: z.string().min(1, "Tiêu đề không được để trống"),
    fileName: z.string(),
    fileUrl: z.string(),
    fileType: z.enum(["pdf", "video", "image", "document", "audio"]),
    size: z.number(),
    lessonId: z.string(),
});

export const UpdateMaterialSchema = CreateMaterialSchema.partial();

// Type exports
export type LessonType = z.infer<typeof LessonSchema>;
export type ModuleType = z.infer<typeof ModuleSchema>;
export type MaterialType = z.infer<typeof MaterialSchema>;
export type LessonWithMaterialsType = z.infer<typeof LessonWithMaterialsSchema>;
export type SectionType = z.infer<typeof SectionSchema>;
export type ModuleWithLessonsType = z.infer<typeof ModuleWithLessonsSchema>;
export type LessonQueryParamsType = z.infer<typeof LessonQuerySchema>;
export type MaterialQueryParamsType = z.infer<typeof MaterialQuerySchema>;
export type CreateLessonBodyType = z.infer<typeof CreateLessonSchema>;
export type UpdateLessonBodyType = z.infer<typeof UpdateLessonSchema>;
export type CreateModuleBodyType = z.infer<typeof CreateModuleSchema>;
export type UpdateModuleBodyType = z.infer<typeof UpdateModuleSchema>;
export type CreateMaterialBodyType = z.infer<typeof CreateMaterialSchema>;
export type UpdateMaterialBodyType = z.infer<typeof UpdateMaterialSchema>;
