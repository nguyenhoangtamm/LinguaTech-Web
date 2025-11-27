import { z } from "zod";

// Course level enum
export enum CourseLevel {
    BEGINNER = 1,
    INTERMEDIATE = 2,
    ADVANCED = 3,
}

// Course status enum
export enum CourseStatus {
    DRAFT = 0,
    PUBLISHED = 1,
    ARCHIVED = 2,
}

// Base course schemas
export const CourseSchema = z.object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
    instructor: z.string(),
    duration: z.number(),
    level: z.number().optional(),
    price: z.number(),
    categoryId: z.number(),
    tags: z.array(z.string()),
    thumbnailUrl: z.string().optional(),
    videoUrl: z.string().optional(),
    rating: z.number().optional(),
    totalEnrollments: z.number().optional(),
    isPublished: z.boolean().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

// Create course request schema
export const CreateCourseBodySchema = z.object({
    title: z.string().min(1, "Tên khóa học là bắt buộc"),
    description: z.string().min(1, "Mô tả là bắt buộc"),
    instructor: z.string().min(1, "Giảng viên là bắt buộc"),
    duration: z.number().min(1, "Thời lượng phải lớn hơn 0"),
    level: z.number().min(1).max(3),
    price: z.number().min(0, "Giá không được âm"),
    categoryId: z.number().min(1, "Danh mục là bắt buộc"),
    tags: z.array(z.number()).optional(),
    thumbnailUrl: z.string().optional(),
    videoUrl: z.string().optional(),
    detailedDescription: z.string().optional(),

});

// Update course request schema
export const UpdateCourseBodySchema = z.object({
    id: z.number(),
    title: z.string().optional(),
    description: z.string().optional(),
    instructor: z.string().optional(),
    duration: z.number().optional(),
    level: z.number().optional(),
    price: z.number().optional(),
    categoryId: z.number().optional(),
    tags: z.array(z.number()).optional(),
    thumbnailUrl: z.string().optional(),
    videoUrl: z.string().optional(),
    detailedDescription: z.string().optional(),
});

// Course category schema
export const CourseCategorySchema = z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    isActive: z.boolean(),
});

// Get courses with pagination query schema
export const GetCoursesWithPaginationQuerySchema = z.object({
    pageNumber: z.number().min(1),
    pageSize: z.number().min(1),
    search: z.string().optional(),
    category: z.string().optional(),
    level: z.number().optional(),
    priceMin: z.number().optional(),
    priceMax: z.number().optional(),
    rating: z.number().optional(),
    tags: z.array(z.string()).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.string().optional(),
});

// Course list response schemas
export const CourseListResSchema = z.object({
    data: z.array(CourseSchema),
    totalPages: z.number(),
    totalCount: z.number(),
    pageSize: z.number(),
});

export const CourseResSchema = z.object({
    message: z.string(),
    succeeded: z.boolean(),
    data: CourseSchema,
    code: z.number(),
});

export const GetAllCoursesResSchema = z.object({
    message: z.string(),
    succeeded: z.boolean(),
    data: z.array(CourseSchema),
    code: z.number(),
});

export const CourseCategoriesResSchema = z.object({
    message: z.string(),
    succeeded: z.boolean(),
    data: z.array(CourseCategorySchema),
    code: z.number(),
});

export const CourseOperationResSchema = z.object({
    message: z.string(),
    succeeded: z.boolean(),
    data: z.number(),
    code: z.number(),
});

// Type exports
export type Course = z.infer<typeof CourseSchema>;
export type CreateCourseBodyType = z.infer<typeof CreateCourseBodySchema>;
export type UpdateCourseBodyType = z.infer<typeof UpdateCourseBodySchema>;
export type CourseCategory = z.infer<typeof CourseCategorySchema>;
export type GetCoursesWithPaginationQueryType = z.infer<
    typeof GetCoursesWithPaginationQuerySchema
>;
export type CourseListResType = z.infer<typeof CourseListResSchema>;
export type CourseResType = z.infer<typeof CourseResSchema>;
export type GetAllCoursesResType = z.infer<typeof GetAllCoursesResSchema>;
export type CourseCategoriesResType = z.infer<typeof CourseCategoriesResSchema>;
export type CourseOperationResType = z.infer<typeof CourseOperationResSchema>;
