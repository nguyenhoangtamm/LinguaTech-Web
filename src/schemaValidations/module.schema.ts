import { z } from "zod";

// Module entity schema
export const ModuleSchema = z.object({
    id: z.number(),
    title: z.string(),
    description: z.string().optional(),
    order: z.number(),
    courseId: z.number(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    // Additional fields for display
    courseTitle: z.string().optional(),
    lessonsCount: z.number().optional(),
});

// Create module request
export const CreateModuleBodySchema = z.object({
    title: z
        .string({ required_error: "Tiêu đề là bắt buộc" })
        .min(1, "Tiêu đề không được để trống"),
    description: z.string().optional(),
    order: z
        .number({ required_error: "Thứ tự là bắt buộc" })
        .min(1, "Thứ tự phải lớn hơn 0"),
    courseId: z.number({ required_error: "Course ID là bắt buộc" }),
});

// Update module request
export const UpdateModuleBodySchema = CreateModuleBodySchema.partial().extend({
    id: z.number(),
});

// Filter modules
export const FilterModuleSchema = z.object({
    pageNumber: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(100).default(10),
    keyword: z.string().optional(),
    courseId: z.number().optional(),
});

// API Response types
export const ModuleListResSchema = z.object({
    succeeded: z.boolean(),
    message: z.string(),
    code: z.number(),
    data: z.object({
        data: z.array(ModuleSchema),
        totalCount: z.number(),
        pageNumber: z.number(),
        pageSize: z.number(),
        totalPages: z.number(),
    }),
});

export const ModuleResSchema = z.object({
    succeeded: z.boolean(),
    message: z.string(),
    code: z.number(),
    data: ModuleSchema,
});

export const ModuleOperationResSchema = z.object({
    succeeded: z.boolean(),
    message: z.string(),
    code: z.number(),
    data: z.number(), // Returns ID
});

// Type definitions
export type ModuleType = z.infer<typeof ModuleSchema>;
export type CreateModuleBodyType = z.infer<typeof CreateModuleBodySchema>;
export type UpdateModuleBodyType = z.infer<typeof UpdateModuleBodySchema>;
export type FilterModuleType = z.infer<typeof FilterModuleSchema>;
export type ModuleListResType = z.infer<typeof ModuleListResSchema>;
export type ModuleResType = z.infer<typeof ModuleResSchema>;
export type ModuleOperationResType = z.infer<typeof ModuleOperationResSchema>;
