import { z } from "zod";

// Section entity schema
export const SectionSchema = z.object({
    id: z.number(),
    title: z.string(),
    content: z.string(),
    order: z.number(),
    lessonId: z.number(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    // Additional fields for display
    lessonTitle: z.string().optional(),
    moduleTitle: z.string().optional(),
});

// Create section request
export const CreateSectionBodySchema = z.object({
    title: z
        .string({ required_error: "Tiêu đề là bắt buộc" })
        .min(1, "Tiêu đề không được để trống"),
    content: z
        .string({ required_error: "Nội dung là bắt buộc" })
        .min(1, "Nội dung không được để trống"),
    order: z
        .number({ required_error: "Thứ tự là bắt buộc" })
        .min(1, "Thứ tự phải lớn hơn 0"),
    lessonId: z.number({ required_error: "Lesson ID là bắt buộc" }),
});

// Update section request
export const UpdateSectionBodySchema = CreateSectionBodySchema.partial().extend(
    {
        id: z.number(),
    }
);

// Filter sections
export const FilterSectionSchema = z.object({
    pageNumber: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(100).default(10),
    keyword: z.string().optional(),
    lessonId: z.number().optional(),
});

// API Response types
export const SectionListResSchema = z.object({
    succeeded: z.boolean(),
    message: z.string(),
    code: z.number(),
    data: z.object({
        data: z.array(SectionSchema),
        totalCount: z.number(),
        pageNumber: z.number(),
        pageSize: z.number(),
        totalPages: z.number(),
    }),
});

export const SectionResSchema = z.object({
    succeeded: z.boolean(),
    message: z.string(),
    code: z.number(),
    data: SectionSchema,
});

export const SectionOperationResSchema = z.object({
    succeeded: z.boolean(),
    message: z.string(),
    code: z.number(),
    data: z.number(), // Returns ID
});

// Type definitions
export type SectionType = z.infer<typeof SectionSchema>;
export type CreateSectionBodyType = z.infer<typeof CreateSectionBodySchema>;
export type UpdateSectionBodyType = z.infer<typeof UpdateSectionBodySchema>;
export type FilterSectionType = z.infer<typeof FilterSectionSchema>;
export type SectionListResType = z.infer<typeof SectionListResSchema>;
export type SectionResType = z.infer<typeof SectionResSchema>;
export type SectionOperationResType = z.infer<typeof SectionOperationResSchema>;
