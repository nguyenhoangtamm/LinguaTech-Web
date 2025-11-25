import { z } from "zod";

// Submission status enum
export enum SubmissionStatus {
    DRAFT = 0,
    SUBMITTED = 1,
    GRADED = 2,
    RETURNED = 3,
}

// Base submission schemas
export const SubmissionSchema = z.object({
    id: z.number(),
    assignmentId: z.number(),
    userId: z.number(),
    fileUrl: z.string(),
    score: z.number().nullable(),
    feedback: z.string(),
    status: z.number(),
    submittedAt: z.string().optional(),
    gradedAt: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

// Create submission request schema
export const CreateSubmissionBodySchema = z.object({
    assignmentId: z.number(),
    userId: z.number(),
    fileUrl: z.string(),
    score: z.number().optional(),
    feedback: z.string(),
    status: z.number(),
});

// Answer schema for assignment submissions
export const SubmissionAnswerSchema = z.object({
    questionId: z.string().or(z.number()),
    answer: z.string().optional(),
    selectedOptionId: z.string().or(z.number()).optional(),
});

// Update submission request schema
export const UpdateSubmissionBodySchema = z.object({
    id: z.number(),
    assignmentId: z.number(),
    userId: z.number(),
    fileUrl: z.string(),
    score: z.number().optional(),
    feedback: z.string(),
    status: z.number(),
});

// Get submissions with pagination query schema
export const GetSubmissionsWithPaginationQuerySchema = z.object({
    pageNumber: z.number().min(1),
    pageSize: z.number().min(1),
    searchTerm: z.string().optional(),
    assignmentId: z.number().optional(),
    userId: z.number().optional(),
    minScore: z.number().optional(),
    maxScore: z.number().optional(),
});

// Submission list response schemas
export const SubmissionListResSchema = z.object({
    message: z.string(),
    succeeded: z.boolean(),
    data: z.object({
        data: z.array(SubmissionSchema),
        totalPages: z.number(),
        totalCount: z.number(),
        pageSize: z.number(),
    }),
    code: z.number(),
});

export const SubmissionResSchema = z.object({
    message: z.string(),
    succeeded: z.boolean(),
    data: SubmissionSchema,
    code: z.number(),
});

export const GetAllSubmissionsResSchema = z.object({
    message: z.string(),
    succeeded: z.boolean(),
    data: z.array(SubmissionSchema),
    code: z.number(),
});

export const SubmissionOperationResSchema = z.object({
    message: z.string(),
    succeeded: z.boolean(),
    data: z.number(),
    code: z.number(),
});

// Type exports
export type Submission = z.infer<typeof SubmissionSchema>;
export type SubmissionAnswer = z.infer<typeof SubmissionAnswerSchema>;
export type CreateSubmissionBodyType = z.infer<
    typeof CreateSubmissionBodySchema
>;
export type UpdateSubmissionBodyType = z.infer<
    typeof UpdateSubmissionBodySchema
>;
export type GetSubmissionsWithPaginationQueryType = z.infer<
    typeof GetSubmissionsWithPaginationQuerySchema
>;
export type SubmissionListResType = z.infer<typeof SubmissionListResSchema>;
export type SubmissionResType = z.infer<typeof SubmissionResSchema>;
export type GetAllSubmissionsResType = z.infer<
    typeof GetAllSubmissionsResSchema
>;
export type SubmissionOperationResType = z.infer<
    typeof SubmissionOperationResSchema
>;
