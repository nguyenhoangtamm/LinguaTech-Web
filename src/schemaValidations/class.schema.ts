import { z } from "zod";

// Class entity schema
export const ClassSchema = z.object({
    id: z.number(),
    courseId: z.number(),
    name: z.string(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    schedule: z.string(),
    location: z.string(),
    maxStudents: z.number(),
    teacherName: z.string(),
    status: z.string(),
    currentStudents: z.number().optional(),
    createdDate: z.string().datetime(),
    updatedDate: z.string().datetime().optional(),
});

// Create class request
export const CreateClassBodySchema = z.object({
    courseId: z.number({ required_error: "Course ID là bắt buộc" }),
    name: z
        .string({ required_error: "Tên lớp là bắt buộc" })
        .min(1, "Tên lớp không được để trống"),
    startDate: z.string({ required_error: "Ngày bắt đầu là bắt buộc" }),
    endDate: z.string({ required_error: "Ngày kết thúc là bắt buộc" }),
    schedule: z
        .string({ required_error: "Lịch học là bắt buộc" })
        .min(1, "Lịch học không được để trống"),
    location: z
        .string({ required_error: "Địa điểm là bắt buộc" })
        .min(1, "Địa điểm không được để trống"),
    maxStudents: z
        .number({ required_error: "Số học viên tối đa là bắt buộc" })
        .min(1, "Số học viên tối đa phải lớn hơn 0"),
    teacherName: z
        .string({ required_error: "Tên giáo viên là bắt buộc" })
        .min(1, "Tên giáo viên không được để trống"),
    status: z.string({ required_error: "Trạng thái là bắt buộc" }),
});

// Update class request
export const UpdateClassBodySchema = CreateClassBodySchema.partial().extend({
    id: z.number(),
});

// Filter classes
export const FilterClassSchema = z.object({
    pageNumber: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(100).default(10),
    searchTerm: z.string().optional(),
    courseId: z.number().optional(),
    status: z.string().optional(),
});

// API Response types
export const ClassListResSchema = z.object({
    succeeded: z.boolean(),
    message: z.string(),
    code: z.number(),
    data: z.object({
        data: z.array(ClassSchema),
        totalCount: z.number(),
        pageNumber: z.number(),
        pageSize: z.number(),
        totalPages: z.number(),
    }),
});

export const ClassResSchema = z.object({
    succeeded: z.boolean(),
    message: z.string(),
    code: z.number(),
    data: ClassSchema,
});

export const ClassOperationResSchema = z.object({
    succeeded: z.boolean(),
    message: z.string(),
    code: z.number(),
    data: z.number(), // Returns ID
});

export const GetAllClassesResSchema = z.object({
    succeeded: z.boolean(),
    message: z.string(),
    code: z.number(),
    data: z.array(ClassSchema),
});

// Type definitions
export type ClassType = z.infer<typeof ClassSchema>;
export type CreateClassBodyType = z.infer<typeof CreateClassBodySchema>;
export type UpdateClassBodyType = z.infer<typeof UpdateClassBodySchema>;
export type FilterClassType = z.infer<typeof FilterClassSchema>;
export type ClassListResType = z.infer<typeof ClassListResSchema>;
export type ClassResType = z.infer<typeof ClassResSchema>;
export type ClassOperationResType = z.infer<typeof ClassOperationResSchema>;
export type GetAllClassesResType = z.infer<typeof GetAllClassesResSchema>;
