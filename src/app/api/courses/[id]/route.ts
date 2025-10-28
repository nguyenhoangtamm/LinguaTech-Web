import { NextRequest, NextResponse } from "next/server";

// Mock course detail data
const mockCourseDetail = {
    id: "1",
    title: "React Advanced Patterns và Performance Optimization",
    description:
        "Khóa học chuyên sâu về React với các pattern nâng cao và kỹ thuật tối ưu hóa hiệu suất. Bạn sẽ học cách xây dựng ứng dụng React có hiệu suất cao, dễ maintain và scalable.",
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
    tags: ["React", "JavaScript", "TypeScript", "Performance"],
    thumbnail: "/images/course1.jpg",
    videoUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPublished: true,
};

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (id === "1") {
            return NextResponse.json({
                data: mockCourseDetail,
                message: "Lấy thông tin khóa học thành công",
            });
        }

        // Generate mock data for other IDs
        const mockCourse = {
            ...mockCourseDetail,
            id,
            title: `Mock Course ${id}`,
            description: `Mô tả khóa học mock ${id}`,
        };

        return NextResponse.json({
            data: mockCourse,
            message: "Lấy thông tin khóa học thành công",
        });
    } catch (error) {
        return NextResponse.json(
            { message: "Có lỗi xảy ra khi lấy thông tin khóa học" },
            { status: 500 }
        );
    }
}
