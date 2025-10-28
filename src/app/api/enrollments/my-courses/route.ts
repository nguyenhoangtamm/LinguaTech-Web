import { NextRequest, NextResponse } from "next/server";

// Mock user enrollments data
const mockUserEnrollments = [
    {
        enrollment: {
            id: "e1",
            userId: "user1",
            courseId: "1",
            enrolledAt: new Date().toISOString(),
            status: "active" as const,
            progress: {
                courseId: "1",
                userId: "user1",
                completedLessons: 3,
                totalLessons: 7,
                progressPercentage: 43,
                lastAccessedAt: new Date().toISOString(),
                startedAt: new Date(
                    Date.now() - 7 * 24 * 60 * 60 * 1000
                ).toISOString(),
                completedAt: null,
            },
        },
        course: {
            id: "1",
            title: "React Advanced Patterns",
            description: "Học các pattern nâng cao trong React",
            instructor: "Nguyễn Văn A",
            duration: 40,
            level: "advanced" as const,
            price: 1500000,
            rating: 4.8,
            studentsCount: 234,
            category: {
                id: "1",
                name: "Frontend",
                slug: "frontend",
                description: "Phát triển giao diện người dùng",
                icon: "💻",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            tags: ["React", "JavaScript", "TypeScript"],
            thumbnail: "/images/course1.jpg",
            videoUrl: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isPublished: true,
        },
    },
    {
        enrollment: {
            id: "e2",
            userId: "user1",
            courseId: "2",
            enrolledAt: new Date(
                Date.now() - 3 * 24 * 60 * 60 * 1000
            ).toISOString(),
            status: "active" as const,
            progress: {
                courseId: "2",
                userId: "user1",
                completedLessons: 2,
                totalLessons: 6,
                progressPercentage: 33,
                lastAccessedAt: new Date().toISOString(),
                startedAt: new Date(
                    Date.now() - 3 * 24 * 60 * 60 * 1000
                ).toISOString(),
                completedAt: null,
            },
        },
        course: {
            id: "2",
            title: "Node.js Backend Development",
            description: "Xây dựng API với Node.js và Express",
            instructor: "Trần Thị B",
            duration: 35,
            level: "intermediate" as const,
            price: 1200000,
            rating: 4.6,
            studentsCount: 189,
            category: {
                id: "2",
                name: "Backend",
                slug: "backend",
                description: "Phát triển server và API",
                icon: "⚙️",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            tags: ["Node.js", "Express", "MongoDB"],
            thumbnail: "/images/course2.jpg",
            videoUrl: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isPublished: true,
        },
    },
];

export async function GET() {
    try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 400));

        return NextResponse.json({
            data: mockUserEnrollments,
            message: "Lấy danh sách khóa học đã đăng ký thành công",
        });
    } catch (error) {
        return NextResponse.json(
            { message: "Có lỗi xảy ra khi lấy danh sách khóa học đã đăng ký" },
            { status: 500 }
        );
    }
}
