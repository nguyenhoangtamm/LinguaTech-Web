import { z } from "zod";

export const SystemOverviewSchema = z.object({
    lastUpdated: z.string().datetime(),
    averageEnrollmentPerCourse: z.number(),
    totalStorageUsedMB: z.number(),
    courseCompletionRate: z.number(),
    averageCourseRating: z.number(),
});

export const UsersByRoleSchema = z.object({
    "Active Learners": z.number(),
    "Total Registered": z.number(),
});

export const CoursesByStatusSchema = z.object({
    Active: z.number(),
    Draft: z.number(),
    Archived: z.number(),
});

export const AdminDashboardStatsSchema = z.object({
    totalUsers: z.number(),
    totalCourses: z.number(),
    publishedCourses: z.number(),
    totalLessons: z.number(),
    totalMaterials: z.number(),
    totalAssignments: z.number(),
    totalEnrollments: z.number(),
    activeUsers: z.number(),
    activeCourses: z.number(),
    totalMaterialsSize: z.number(),
    usersByRole: UsersByRoleSchema,
    coursesByStatus: CoursesByStatusSchema,
    systemOverview: SystemOverviewSchema,
});

export const CourseAnalyticsSchema = z.object({
    id: z.number(),
    title: z.string(),
    enrollmentCount: z.number(),
    rating: z.number(),
    status: z.string(),
    isPublished: z.boolean(),
    createdDate: z.string().datetime(),
});

export const UserGrowthStatsSchema = z.object({
    date: z.string().datetime(),
    newUsers: z.number(),
    totalUsers: z.number(),
    activeUsers: z.number(),
});

export type SystemOverviewType = z.infer<typeof SystemOverviewSchema>;
export type UsersByRoleType = z.infer<typeof UsersByRoleSchema>;
export type CoursesByStatusType = z.infer<typeof CoursesByStatusSchema>;
export type AdminDashboardStatsType = z.infer<typeof AdminDashboardStatsSchema>;
export type CourseAnalyticsType = z.infer<typeof CourseAnalyticsSchema>;
export type UserGrowthStatsType = z.infer<typeof UserGrowthStatsSchema>;
