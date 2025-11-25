import z from "zod";

// Assignment Schema based on API structure
export const AssignmentSchema = z.object({
    id: z.number(),
    lessonId: z.number(),
    title: z.string(),
    description: z.string(),
    dueDate: z.string(), // DateTime as string from API
    maxScore: z.number(),
    lessonTitle: z.string().optional(),
    moduleTitle: z.string().optional(),
    courseTitle: z.string().optional(),
    createdDate: z.string().optional(),
    updatedDate: z.string().optional(),
    createdBy: z.string().optional(),
    updatedBy: z.string().optional(),
});

export type AssignmentType = z.TypeOf<typeof AssignmentSchema>;

// Question Detail Schema (for assignment detail response)
export const QuestionDetailDto = z.object({
    id: z.number(),
    assignmentId: z.number(),
    questionTypeId: z.number(),
    content: z.string(),
    score: z.number(),
    questionTypeName: z.string().optional(),
    instructions: z.string().optional(),
    options: z
        .array(
            z.object({
                id: z.string().or(z.number()),
                content: z.string(),
                isCorrect: z.boolean().optional(),
            })
        )
        .optional(),
});

// Assignment Detail Schema (with questions)
export const AssignmentDetailSchema = AssignmentSchema.extend({
    questions: z.array(QuestionDetailDto),
});

export type AssignmentDetailType = z.TypeOf<typeof AssignmentDetailSchema>;

// Paginated Assignment Response
export const AssignmentPaginatedData = z.object({
    data: z.array(AssignmentSchema),
    totalPages: z.number(),
    totalCount: z.number(),
    pageSize: z.number(),
});

// Assignment List Response
export const AssignmentListRes = z.object({
    message: z.string(),
    succeeded: z.boolean(),
    data: AssignmentPaginatedData,
    code: z.number(),
});

export type AssignmentListResType = z.TypeOf<typeof AssignmentListRes>;

// Assignment Single Response
export const AssignmentRes = z.object({
    message: z.string(),
    succeeded: z.boolean(),
    data: AssignmentSchema,
    code: z.number(),
});

export type AssignmentResType = z.TypeOf<typeof AssignmentRes>;

// Assignment Detail Response
export const AssignmentDetailRes = z.object({
    message: z.string(),
    succeeded: z.boolean(),
    data: AssignmentDetailSchema,
    code: z.number(),
});

export type AssignmentDetailResType = z.TypeOf<typeof AssignmentDetailRes>;

// Create Assignment Body
export const CreateAssignmentBody = z
    .object({
        lessonId: z.number({ required_error: "Vui lòng chọn bài học" }),
        title: z
            .string({ required_error: "Vui lòng nhập tiêu đề" })
            .trim()
            .min(1, { message: "Tiêu đề không được để trống" })
            .max(500, { message: "Tiêu đề không được vượt quá 500 ký tự" }),
        description: z
            .string({ required_error: "Vui lòng nhập mô tả" })
            .trim()
            .min(1, { message: "Mô tả không được để trống" }),
        dueDate: z
            .string({ required_error: "Vui lòng chọn hạn nộp" })
            .min(1, { message: "Hạn nộp không được để trống" }),
        maxScore: z
            .number({ required_error: "Vui lòng nhập điểm tối đa" })
            .positive({ message: "Điểm tối đa phải lớn hơn 0" }),
    })
    .strict();

export type CreateAssignmentBodyType = z.TypeOf<typeof CreateAssignmentBody>;

// Update Assignment Body
export const UpdateAssignmentBody = z
    .object({
        id: z.number(),
        title: z
            .string()
            .trim()
            .min(1, { message: "Tiêu đề không được để trống" })
            .max(500, { message: "Tiêu đề không được vượt quá 500 ký tự" })
            .optional(),
        description: z
            .string()
            .trim()
            .min(1, { message: "Mô tả không được để trống" })
            .optional(),
        dueDate: z
            .string()
            .min(1, { message: "Hạn nộp không được để trống" })
            .optional(),
        maxScore: z
            .number()
            .positive({ message: "Điểm tối đa phải lớn hơn 0" })
            .optional(),
    })
    .strict();

export type UpdateAssignmentBodyType = z.TypeOf<typeof UpdateAssignmentBody>;

// Filter Assignment Type
export const FilterAssignmentSchema = z.object({
    keyword: z.string().optional(),
    lessonId: z.number().optional(),
    dueDateFrom: z.string().optional(),
    dueDateTo: z.string().optional(),
    minScore: z.number().optional(),
    maxScore: z.number().optional(),
});

export type FilterAssignmentType = z.TypeOf<typeof FilterAssignmentSchema>;

// Simple Assignment DTO for lists/dropdowns
export const GetAllAssignmentsDto = z.object({
    id: z.number(),
    title: z.string(),
    description: z.string().optional(),
    dueDate: z.string(),
    maxScore: z.number(),
    lessonTitle: z.string().optional(),
});

export const GetAllAssignmentsRes = z.object({
    message: z.string(),
    succeeded: z.boolean(),
    data: z.array(GetAllAssignmentsDto),
    code: z.number(),
});

export type GetAllAssignmentsResType = z.TypeOf<typeof GetAllAssignmentsRes>;

// Result type for create/update/delete operations
export const AssignmentOperationRes = z.object({
    message: z.string(),
    succeeded: z.boolean(),
    data: z.number(), // Returns ID
    code: z.number(),
});

export type AssignmentOperationResType = z.TypeOf<
    typeof AssignmentOperationRes
>;
