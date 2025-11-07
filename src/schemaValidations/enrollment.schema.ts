import { z } from "zod";

// Enrollment entity schema
export const EnrollmentSchema = z.object({
    id: z.number(),
    userId: z.number(),
    courseId: z.number(),
    enrolledDate: z.string().datetime(),
    progress: z.number().min(0).max(100),
    completedLessons: z.number(),
    totalLessons: z.number(),
    status: z.enum(["active", "completed", "dropped", "suspended"]),
    completedDate: z.string().datetime().optional(),
    // Additional fields for display
    userName: z.string().optional(),
    userEmail: z.string().optional(),
    courseTitle: z.string().optional(),
    courseInstructor: z.string().optional(),
});

// Create enrollment request
export const CreateEnrollmentBodySchema = z.object({
    courseId: z.number({ required_error: "Course ID là bắt buộc" }),
});

// Update enrollment request
export const UpdateEnrollmentBodySchema = z.object({
    userId: z.number().optional(),
    courseId: z.number().optional(),
    progress: z.number().min(0).max(100).optional(),
    completedLessons: z.number().optional(),
    totalLessons: z.number().optional(),
    status: z.enum(["active", "completed", "dropped", "suspended"]).optional(),
    completedDate: z.string().datetime().optional(),
});

// Filter enrollments
export const FilterEnrollmentSchema = z.object({
    pageNumber: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(100).default(10),
    userId: z.number().optional(),
    courseId: z.number().optional(),
    status: z.enum(["active", "completed", "dropped", "suspended"]).optional(),
    keyword: z.string().optional(),
});

// Update progress request
export const UpdateProgressBodySchema = z.object({
    lessonId: z.number(),
    completed: z.boolean(),
    timeSpent: z.number().optional(),
});

// API Response types
export const EnrollmentListResSchema = z.object({
    succeeded: z.boolean(),
    message: z.string(),
    code: z.number(),
    data: z.object({
        data: z.array(EnrollmentSchema),
        totalCount: z.number(),
        pageNumber: z.number(),
        pageSize: z.number(),
        totalPages: z.number(),
    }),
});

export const EnrollmentResSchema = z.object({
    succeeded: z.boolean(),
    message: z.string(),
    code: z.number(),
    data: EnrollmentSchema,
});

export const EnrollmentOperationResSchema = z.object({
    succeeded: z.boolean(),
    message: z.string(),
    code: z.number(),
    data: z.number(), // Returns ID
});

export const UserEnrollmentResSchema = z.object({
    succeeded: z.boolean(),
    message: z.string(),
    code: z.number(),
    data: z.array(EnrollmentSchema),
});

export const CheckEnrollmentResSchema = z.object({
    succeeded: z.boolean(),
    message: z.string(),
    code: z.number(),
    data: z.object({
        isEnrolled: z.boolean(),
        enrollment: EnrollmentSchema.optional(),
    }),
});

export const UpdateProgressResSchema = z.object({
    succeeded: z.boolean(),
    message: z.string(),
    code: z.number(),
    data: z.object({
        progress: z.number(),
        completedLessons: z.number(),
        totalLessons: z.number(),
    }),
});

// Type definitions
export type EnrollmentType = z.infer<typeof EnrollmentSchema>;
export type CreateEnrollmentBodyType = z.infer<
    typeof CreateEnrollmentBodySchema
>;
export type UpdateEnrollmentBodyType = z.infer<
    typeof UpdateEnrollmentBodySchema
>;
export type FilterEnrollmentType = z.infer<typeof FilterEnrollmentSchema>;
export type UpdateProgressBodyType = z.infer<typeof UpdateProgressBodySchema>;
export type EnrollmentListResType = z.infer<typeof EnrollmentListResSchema>;
export type EnrollmentResType = z.infer<typeof EnrollmentResSchema>;
export type EnrollmentOperationResType = z.infer<
    typeof EnrollmentOperationResSchema
>;
export type UserEnrollmentResType = z.infer<typeof UserEnrollmentResSchema>;
export type CheckEnrollmentResType = z.infer<typeof CheckEnrollmentResSchema>;
export type UpdateProgressResType = z.infer<typeof UpdateProgressResSchema>;
