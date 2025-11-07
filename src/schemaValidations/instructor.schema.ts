import z from "zod";

// Instructor Application Schemas
export const InstructorApplicationBody = z.object({
    fullName: z.string().min(1, { message: "Họ và tên không được để trống" }),
    email: z.string().email({ message: "Email không hợp lệ" }),
    phone: z
        .string()
        .min(10, { message: "Số điện thoại phải có ít nhất 10 ký tự" }),
    bio: z
        .string()
        .min(100, { message: "Giới thiệu bản thân phải có ít nhất 100 ký tự" }),
    experience: z
        .string()
        .min(50, { message: "Kinh nghiệm làm việc phải có ít nhất 50 ký tự" }),
    education: z
        .string()
        .min(20, { message: "Trình độ học vấn phải có ít nhất 20 ký tự" }),
    expertise: z
        .array(z.string())
        .min(1, { message: "Vui lòng chọn ít nhất một lĩnh vực chuyên môn" }),
    portfolio: z
        .string()
        .url({ message: "Portfolio phải là URL hợp lệ" })
        .optional()
        .or(z.literal("")),
    linkedin: z
        .string()
        .url({ message: "LinkedIn phải là URL hợp lệ" })
        .optional()
        .or(z.literal("")),
});

export const InstructorApplicationRes = z.object({
    id: z.string(),
    fullName: z.string(),
    email: z.string(),
    phone: z.string(),
    bio: z.string(),
    experience: z.string(),
    education: z.string(),
    expertise: z.array(z.string()),
    portfolio: z.string().nullable(),
    linkedin: z.string().nullable(),
    status: z.enum(["pending", "approved", "rejected"]),
    reviewNote: z.string().nullable(),
    createdAt: z.string().transform((val) => new Date(val)),
    updatedAt: z.string().transform((val) => new Date(val)),
});

export const InstructorApplicationsListRes = z.object({
    data: z.array(InstructorApplicationRes),
    message: z.string(),
});

// Course Creation with Enhanced Schema
export const EnhancedCourseCreateBody = z.object({
    title: z.string().min(1, { message: "Tiêu đề không được để trống" }),
    description: z
        .string()
        .min(50, { message: "Mô tả phải có ít nhất 50 ký tự" }),
    instructor: z
        .string()
        .min(1, { message: "Giảng viên không được để trống" }),
    categoryId: z.string().min(1, { message: "Danh mục không được để trống" }),
    courseTypeId: z
        .string()
        .min(1, { message: "Loại khóa học không được để trống" }),
    level: z.number().int().min(1).max(3),
    price: z.number().min(0, { message: "Giá không được âm" }),
    duration: z
        .number()
        .min(0, { message: "Thời lượng không được âm" })
        .optional(),
    videoUrl: z
        .string()
        .url({ message: "Video URL phải hợp lệ" })
        .optional()
        .or(z.literal("")),
    isPublished: z.boolean().default(false),
    tags: z.array(z.string()),
    modules: z
        .array(
            z.object({
                title: z
                    .string()
                    .min(1, { message: "Tiêu đề module không được để trống" }),
                description: z
                    .string()
                    .min(10, {
                        message: "Mô tả module phải có ít nhất 10 ký tự",
                    }),
                order: z.number().int().min(1),
                lessons: z.array(
                    z.object({
                        title: z
                            .string()
                            .min(1, {
                                message: "Tiêu đề bài học không được để trống",
                            }),
                        description: z.string().optional(),
                        duration: z
                            .number()
                            .min(0, {
                                message: "Thời lượng bài học không được âm",
                            }),
                        videoUrl: z
                            .string()
                            .url({ message: "Video URL phải hợp lệ" })
                            .optional()
                            .or(z.literal("")),
                        order: z.number().int().min(1),
                    })
                ),
            })
        )
        .min(1, { message: "Phải có ít nhất một module" }),
});

export const EnhancedCourseUpdateBody = EnhancedCourseCreateBody.partial();

export type InstructorApplicationBodyType = z.infer<
    typeof InstructorApplicationBody
>;
export type InstructorApplicationResType = z.infer<
    typeof InstructorApplicationRes
>;
export type EnhancedCourseCreateBodyType = z.infer<
    typeof EnhancedCourseCreateBody
>;
