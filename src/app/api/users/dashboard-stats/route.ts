import { NextRequest, NextResponse } from "next/server";

// Mock dashboard stats
const mockDashboardStats = {
    totalCourses: 12,
    completedCourses: 4,
    inProgressCourses: 3,
    totalStudyHours: 127,
    streak: 7,
    achievements: [
        {
            id: "1",
            title: "Học viên tích cực",
            description: "Hoàn thành 5 khóa học",
            icon: "🎓",
            unlockedAt: new Date().toISOString(),
            type: "course_completion" as const,
        },
        {
            id: "2",
            title: "Streak Master",
            description: "Học 7 ngày liên tiếp",
            icon: "🔥",
            unlockedAt: new Date().toISOString(),
            type: "streak" as const,
        },
    ],
};

export async function GET() {
    try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        return NextResponse.json({
            data: mockDashboardStats,
            message: "Lấy thống kê dashboard thành công",
        });
    } catch (error) {
        return NextResponse.json(
            { message: "Có lỗi xảy ra khi lấy thống kê dashboard" },
            { status: 500 }
        );
    }
}
