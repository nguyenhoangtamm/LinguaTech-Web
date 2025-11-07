import z from "zod";

// Question Schema based on API structure
export const QuestionSchema = z.object({
    id: z.number(),
    assignmentId: z.number(),
    questionTypeId: z.number(),
    content: z.string(),
    score: z.number(),
    assignmentTitle: z.string().optional(),
    questionTypeName: z.string().optional(),
    lessonTitle: z.string().optional(),
    moduleTitle: z.string().optional(),
    courseTitle: z.string().optional(),
    createdDate: z.string().optional(),
    updatedDate: z.string().optional(),
    createdBy: z.string().optional(),
    updatedBy: z.string().optional(),
});

export type QuestionType = z.TypeOf<typeof QuestionSchema>;

// Paginated Question Response
export const QuestionPaginatedData = z.object({
    data: z.array(QuestionSchema),
    totalPages: z.number(),
    totalCount: z.number(),
    pageSize: z.number(),
});

// Question List Response
export const QuestionListRes = z.object({
    message: z.string(),
    succeeded: z.boolean(),
    data: QuestionPaginatedData,
    code: z.number(),
});

export type QuestionListResType = z.TypeOf<typeof QuestionListRes>;

// Question Single Response
export const QuestionRes = z.object({
    message: z.string(),
    succeeded: z.boolean(),
    data: QuestionSchema,
    code: z.number(),
});

export type QuestionResType = z.TypeOf<typeof QuestionRes>;

// Create Question Body
export const CreateQuestionBody = z
    .object({
        assignmentId: z.number({ required_error: "Vui lòng chọn bài tập" }),
        questionTypeId: z.number({
            required_error: "Vui lòng chọn loại câu hỏi",
        }),
        content: z
            .string({ required_error: "Vui lòng nhập nội dung câu hỏi" })
            .trim()
            .min(1, { message: "Nội dung câu hỏi không được để trống" }),
        score: z
            .number({ required_error: "Vui lòng nhập điểm" })
            .positive({ message: "Điểm phải lớn hơn 0" }),
    })
    .strict();

export type CreateQuestionBodyType = z.TypeOf<typeof CreateQuestionBody>;

// Update Question Body
export const UpdateQuestionBody = z
    .object({
        id: z.number(),
        content: z
            .string()
            .trim()
            .min(1, { message: "Nội dung câu hỏi không được để trống" })
            .optional(),
        score: z
            .number()
            .positive({ message: "Điểm phải lớn hơn 0" })
            .optional(),
        questionTypeId: z.number().optional(),
    })
    .strict();

export type UpdateQuestionBodyType = z.TypeOf<typeof UpdateQuestionBody>;

// Filter Question Type
export const FilterQuestionSchema = z.object({
    keyword: z.string().optional(),
    assignmentId: z.number().optional(),
    questionTypeId: z.number().optional(),
    minScore: z.number().optional(),
    maxScore: z.number().optional(),
});

export type FilterQuestionType = z.TypeOf<typeof FilterQuestionSchema>;

// Simple Question DTO for lists/dropdowns
export const GetAllQuestionsDto = z.object({
    id: z.number(),
    content: z.string(),
    score: z.number(),
    assignmentTitle: z.string().optional(),
    questionTypeName: z.string().optional(),
});

export const GetAllQuestionsRes = z.object({
    message: z.string(),
    succeeded: z.boolean(),
    data: z.array(GetAllQuestionsDto),
    code: z.number(),
});

export type GetAllQuestionsResType = z.TypeOf<typeof GetAllQuestionsRes>;

// Result type for create/update/delete operations
export const QuestionOperationRes = z.object({
    message: z.string(),
    succeeded: z.boolean(),
    data: z.number(), // Returns ID
    code: z.number(),
});

export type QuestionOperationResType = z.TypeOf<typeof QuestionOperationRes>;
