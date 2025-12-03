import z from "zod";
import { CourseLevel } from "@/config/enums";

// Course Category Schemas
export const CourseCategoryBody = z.object({
    name: z.string().min(1, { message: "Tên danh mục không được để trống" }),
    slug: z.string().min(1, { message: "Slug không được để trống" }),
    description: z.string().optional(),
    icon: z.string().optional(),
});

export const CourseCategoryRes = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
    icon: z.string().nullable(),
    createdAt: z.string().transform((val) => new Date(val)),
    updatedAt: z.string().transform((val) => new Date(val)),
});

export const CourseCategoriesListRes = z.object({
    data: z.array(CourseCategoryRes),
    message: z.string(),
});

// Course Schemas
export const CourseCreateBody = z.object({
    title: z.string().min(1, { message: "Tiêu đề không được để trống" }),
    description: z.string().min(1, { message: "Mô tả không được để trống" }),
    instructor: z
        .string()
        .min(1, { message: "Giảng viên không được để trống" }),
    duration: z.number().min(1, { message: "Thời lượng phải lớn hơn 0" }),
    level: z.number().int().min(1).max(3),
    price: z.number().min(0, { message: "Giá không được âm" }),
    categoryId: z.string().min(1, { message: "Danh mục không được để trống" }),
    tags: z.array(z.string()),
    thumbnail: z.string().optional(),
    videoUrl: z.string().optional(),
});

export const CourseUpdateBody = CourseCreateBody.partial();

export const CourseRes = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    detailedDescription: z.string().optional(),
    instructor: z.string(),
    duration: z.number(),
    level: z.number().int().min(1).max(3),
    price: z.number(),
    rating: z.number(),
    studentsCount: z.number(),
    category: CourseCategoryRes,
    tags: z.array(z.string()),
    thumbnailUrl: z.string(),
    videoUrl: z.string().nullable(),
    createdAt: z.string().transform((val) => new Date(val)),
    updatedAt: z.string().transform((val) => new Date(val)),
    isPublished: z.boolean(),
});

export const CoursesListRes = z.object({
    data: z.array(CourseRes),
    message: z.string(),
    meta: z.object({
        pageNumber: z.number(),
        pageSize: z.number(),
        total: z.number(),
        totalPages: z.number(),
    }),
});

export const CourseDetailRes = z.object({
    data: CourseRes,
    message: z.string(),
});

// Course Filter
export const CourseFilterParams = z.object({
    pageNumber: z.number().optional(),
    pageSize: z.number().optional(),
    search: z.string().optional(),
    category: z.string().optional(),
    level: z.number().optional(),
    priceMin: z.number().optional(),
    priceMax: z.number().optional(),
    rating: z.number().optional(),
    tags: z.array(z.number()).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.string().optional(),
});

// Lesson Schemas
export const LessonRes = z.object({
    id: z.string(),
    title: z.string(),
    duration: z.number(),
    completed: z.boolean(),
    materials: z.array(z.string()),
    contentType: z.enum(["video", "reading", "quiz", "assignment"]),
    order: z.number(),
});

// Module Schemas
export const ModuleRes = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    order: z.number(),
    lessons: z.array(LessonRes),
});

// Material Schemas
export const MaterialRes = z.object({
    id: z.string(),
    fileName: z.string(),
    fileUrl: z.string(),
    fileType: z.string(),
    size: z.number(),
});

// Course Detail with modules
export const CourseDetailWithModulesRes = z.object({
    data: z.object({
        course: CourseRes,
        modules: z.array(ModuleRes),
        materials: z.array(MaterialRes),
        instructor: z.object({
            name: z.string(),
            avatar: z.string(),
            title: z.string(),
            company: z.string(),
            experience: z.string(),
            students: z.number(),
            courses: z.number(),
            rating: z.number(),
            bio: z.string(),
        }),
        reviews: z.array(
            z.object({
                id: z.string(),
                userName: z.string(),
                avatar: z.string(),
                rating: z.number(),
                comment: z.string(),
                date: z.string(),
                helpful: z.number().optional(),
            })
        ),
        faqs: z
            .array(
                z.object({
                    id: z.string(),
                    question: z.string(),
                    answer: z.string(),
                })
            )
            .optional(),
    }),
    message: z.string(),
});

// Enrollment Schemas
export const EnrollmentCreateBody = z.object({
    courseId: z.string().min(1, { message: "ID khóa học không được để trống" }),
});

export const EnrollmentRes = z.object({
    id: z.string(),
    userId: z.string(),
    courseId: z.string(),
    enrolledAt: z.string().transform((val) => new Date(val)),
    status: z.enum(["active", "completed", "paused", "cancelled"]),
    progress: z.object({
        courseId: z.string(),
        userId: z.string(),
        completedLessons: z.number(),
        totalLessons: z.number(),
        progressPercentage: z.number(),
        lastAccessedAt: z.string().transform((val) => new Date(val)),
        startedAt: z.string().transform((val) => new Date(val)),
        completedAt: z
            .string()
            .transform((val) => new Date(val))
            .nullable(),
    }),
});

export const UserEnrollmentsRes = z.object({
    data: z.array(
        z.object({
            enrollment: EnrollmentRes,
            course: CourseRes,
        })
    ),
    message: z.string(),
});

// Dashboard Stats
export const UserDashboardStatsRes = z.object({
    data: z.object({
        totalCourses: z.number(),
        completedCourses: z.number(),
        inProgressCourses: z.number(),
        totalStudyHours: z.number(),
        streak: z.number(),
        achievements: z.array(
            z.object({
                id: z.string(),
                title: z.string(),
                description: z.string(),
                icon: z.string(),
                unlockedAt: z.string().transform((val) => new Date(val)),
                type: z.enum([
                    "course_completion",
                    "streak",
                    "study_hours",
                    "skill",
                    "other",
                ]),
            })
        ),
    }),
    message: z.string(),
});

// Course Progress Update
export const UpdateProgressBody = z.object({
    lessonId: z.string(),
    completed: z.boolean(),
    timeSpent: z.number().optional(),
});

export const UpdateProgressRes = z.object({
    data: z.object({
        progressPercentage: z.number(),
        completedLessons: z.number(),
        totalLessons: z.number(),
    }),
    message: z.string(),
});

// Type exports
export type CourseCategoryBodyType = z.TypeOf<typeof CourseCategoryBody>;
export type CourseCategoryResType = z.TypeOf<typeof CourseCategoryRes>;
export type CourseCategoriesListResType = z.TypeOf<
    typeof CourseCategoriesListRes
>;

export type CourseCreateBodyType = z.TypeOf<typeof CourseCreateBody>;
export type CourseUpdateBodyType = z.TypeOf<typeof CourseUpdateBody>;
export type CourseResType = z.TypeOf<typeof CourseRes>;
export type CoursesListResType = z.TypeOf<typeof CoursesListRes>;
export type CourseDetailResType = z.TypeOf<typeof CourseDetailRes>;
export type CourseFilterParamsType = z.TypeOf<typeof CourseFilterParams>;

export type LessonResType = z.TypeOf<typeof LessonRes>;
export type ModuleResType = z.TypeOf<typeof ModuleRes>;
export type MaterialResType = z.TypeOf<typeof MaterialRes>;
export type CourseDetailWithModulesResType = z.TypeOf<
    typeof CourseDetailWithModulesRes
>;

export type EnrollmentCreateBodyType = z.TypeOf<typeof EnrollmentCreateBody>;
export type EnrollmentResType = z.TypeOf<typeof EnrollmentRes>;
export type UserEnrollmentsResType = z.TypeOf<typeof UserEnrollmentsRes>;

export type UserDashboardStatsResType = z.TypeOf<typeof UserDashboardStatsRes>;
export type UpdateProgressBodyType = z.TypeOf<typeof UpdateProgressBody>;
export type UpdateProgressResType = z.TypeOf<typeof UpdateProgressRes>;
