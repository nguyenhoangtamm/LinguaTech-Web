import z from "zod";

// ============================================================================
// Question Schemas
// ============================================================================

export const QuestionOptionSchema = z.object({
    id: z.string(),
    content: z
        .string()
        .min(1, { message: "Nội dung tùy chọn không được để trống" }),
    isCorrect: z.boolean(),
    questionId: z.string(),
});

export const QuestionSchema = z.object({
    id: z.string(),
    content: z
        .string()
        .min(1, { message: "Nội dung câu hỏi không được để trống" }),
    score: z.number().positive({ message: "Điểm phải lớn hơn 0" }),
    createdAt: z.string().transform((val) => new Date(val)),
    updatedAt: z.string().transform((val) => new Date(val)),
    isDeleted: z.boolean().default(false),
    assignmentId: z.string(),
    questionTypeId: z.enum([
        "essay",
        "multiple_choice",
        "true_false",
        "fill_blank",
    ]),
    instructions: z.string().optional(),
    options: z.array(QuestionOptionSchema).optional(),
});

// ============================================================================
// Assignment Schemas
// ============================================================================

export const AssignmentCreateBody = z.object({
    title: z
        .string()
        .min(1, { message: "Tiêu đề không được để trống" })
        .max(255),
    description: z
        .string()
        .min(1, { message: "Mô tả không được để trống" })
        .max(1000),
    dueDate: z
        .string()
        .datetime({ message: "Hạn nộp phải là định dạng ngày tháng hợp lệ" }),
    lessonId: z.string().min(1, { message: "ID bài học không được để trống" }),
    totalScore: z.number().positive({ message: "Tổng điểm phải lớn hơn 0" }),
    questions: z.array(QuestionSchema).optional(),
});

export const AssignmentUpdateBody = AssignmentCreateBody.partial();

export const AssignmentRes = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    dueDate: z.string().transform((val) => new Date(val)),
    completionDate: z
        .string()
        .transform((val) => new Date(val))
        .nullable(),
    isDeleted: z.boolean().default(false),
    lessonId: z.string(),
    createdAt: z.string().transform((val) => new Date(val)),
    updatedAt: z.string().transform((val) => new Date(val)),
    totalScore: z.number(),
    questions: z.array(QuestionSchema),
});

export const AssignmentListRes = z.object({
    data: z.array(AssignmentRes),
    message: z.string(),
    totalCount: z.number().optional(),
    page: z.number().optional(),
    pageSize: z.number().optional(),
});

// ============================================================================
// Submission Answer Schemas
// ============================================================================

export const AnswerRequestSchema = z
    .object({
        questionId: z
            .string()
            .min(1, { message: "ID câu hỏi không được để trống" }),
        answer: z.string().optional(),
        selectedOptionId: z.string().optional(),
    })
    .refine((data) => data.answer || data.selectedOptionId, {
        message: "Phải có câu trả lời hoặc lựa chọn",
        path: ["answer"],
    });

export const SubmitAssignmentRequestBody = z.object({
    answers: z
        .array(AnswerRequestSchema)
        .min(1, { message: "Phải có ít nhất một câu trả lời" }),
});

export const SaveDraftRequestBody = z.object({
    answers: z.array(AnswerRequestSchema).min(0),
});

// ============================================================================
// Submission Answer Response Schemas
// ============================================================================

export const SubmissionAnswerSchema = z.object({
    id: z.string(),
    questionId: z.string(),
    answer: z.string().optional(),
    selectedOptionId: z.string().optional(),
    isCorrect: z.boolean().optional(),
    score: z.number().nonnegative().optional(),
    feedback: z.string().optional(),
});

export const UserSubmissionRes = z.object({
    id: z.string(),
    assignmentId: z.string(),
    userId: z.string(),
    score: z.number().nonnegative().nullable(),
    submittedAt: z
        .string()
        .transform((val) => (val ? new Date(val) : null))
        .nullable(),
    gradedAt: z
        .string()
        .transform((val) => (val ? new Date(val) : null))
        .nullable(),
    status: z.string(), // Allow any string status from API
    answers: z.array(SubmissionAnswerSchema),
    feedback: z.string().optional(),
    createdAt: z
        .string()
        .transform((val) => new Date(val))
        .optional(),
    updatedAt: z
        .string()
        .transform((val) => new Date(val))
        .optional(),
});

export const SubmitAssignmentResponse = z.object({
    submissionId: z.string(),
    score: z.number().nonnegative().nullable(),
    submittedAt: z.string().transform((val) => new Date(val)),
    status: z.string(),
    message: z.string(),
});

export const SaveDraftResponse = z.object({
    message: z.string(),
    savedAt: z.string().transform((val) => new Date(val)),
});

// ============================================================================
// Grading Schemas
// ============================================================================

export const GradeAnswerRequestSchema = z.object({
    answerId: z
        .string()
        .min(1, { message: "ID câu trả lời không được để trống" }),
    score: z.number().nonnegative({ message: "Điểm không được âm" }),
    feedback: z.string().optional(),
});

export const GradeSubmissionRequestBody = z.object({
    answers: z
        .array(GradeAnswerRequestSchema)
        .min(1, { message: "Phải có ít nhất một câu trả lời" }),
    totalScore: z.number().positive({ message: "Tổng điểm phải lớn hơn 0" }),
    feedback: z.string().optional(),
});

export const GradeSubmissionResponse = z.object({
    submissionId: z.string(),
    totalScore: z.number().nonnegative(),
    gradedAt: z.string().transform((val) => new Date(val)),
    message: z.string(),
});

// ============================================================================
// Type Exports
// ============================================================================

export type QuestionOption = z.infer<typeof QuestionOptionSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type Assignment = z.infer<typeof AssignmentRes>;
export type AssignmentList = z.infer<typeof AssignmentListRes>;
export type AnswerRequest = z.infer<typeof AnswerRequestSchema>;
export type SubmitAssignmentRequest = z.infer<
    typeof SubmitAssignmentRequestBody
>;
export type SaveDraftRequest = z.infer<typeof SaveDraftRequestBody>;
export type SubmissionAnswer = z.infer<typeof SubmissionAnswerSchema>;
export type UserSubmission = z.infer<typeof UserSubmissionRes>;
export type GradeAnswerRequest = z.infer<typeof GradeAnswerRequestSchema>;
export type GradeSubmissionRequest = z.infer<typeof GradeSubmissionRequestBody>;
