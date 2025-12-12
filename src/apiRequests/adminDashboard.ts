import http from "@/lib/http";
import {
    AdminDashboardStatsType,
    CourseAnalyticsType,
    UserGrowthStatsType,
} from "@/schemaValidations/adminDashboard.schema";

const adminDashboardApiRequest = {
    // Get dashboard statistics
    getDashboardStats: () =>
        http.get<{
            succeeded: boolean;
            message: string;
            data: AdminDashboardStatsType;
            code: number;
        }>(`admindashboard/stats`),

    // Get all course analytics
    getCourseAnalytics: () =>
        http.get<{
            succeeded: boolean;
            message: string;
            data: CourseAnalyticsType[];
            code: number;
        }>(`admindashboard/courses/analytics`),

    // Get top courses by enrollment
    getTopCoursesByEnrollment: (limit: number = 10) =>
        http.get<{
            succeeded: boolean;
            message: string;
            data: CourseAnalyticsType[];
            code: number;
        }>(`admindashboard/courses/top-by-enrollment`, { params: { limit } }),

    // Get top courses by rating
    getTopCoursesByRating: (limit: number = 10) =>
        http.get<{
            succeeded: boolean;
            message: string;
            data: CourseAnalyticsType[];
            code: number;
        }>(`admindashboard/courses/top-by-rating`, { params: { limit } }),

    // Get user growth statistics
    getUserGrowthStats: (days: number = 30) =>
        http.get<{
            succeeded: boolean;
            message: string;
            data: UserGrowthStatsType[];
            code: number;
        }>(`admindashboard/users/growth-stats`, { params: { days } }),
};

export default adminDashboardApiRequest;
