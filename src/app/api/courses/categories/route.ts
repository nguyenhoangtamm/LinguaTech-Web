import { NextRequest, NextResponse } from "next/server";

// Mock data
const mockCategories = [
    {
        id: "1",
        name: "Frontend",
        slug: "frontend",
        description: "Phát triển giao diện người dùng với React, Vue, Angular",
        icon: "💻",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "2",
        name: "Backend",
        slug: "backend",
        description: "Phát triển server và API",
        icon: "⚙️",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "3",
        name: "Mobile",
        slug: "mobile",
        description: "Phát triển ứng dụng di động",
        icon: "📱",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "4",
        name: "DevOps",
        slug: "devops",
        description: "Vận hành và triển khai",
        icon: "🚀",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "5",
        name: "Design",
        slug: "design",
        description: "Thiết kế UI/UX",
        icon: "🎨",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "6",
        name: "Data Science",
        slug: "data-science",
        description: "Khoa học dữ liệu",
        icon: "📊",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export async function GET() {
    try {
        return NextResponse.json({
            data: mockCategories,
            message: "Lấy danh sách danh mục thành công",
        });
    } catch (error) {
        return NextResponse.json(
            { message: "Có lỗi xảy ra khi lấy danh sách danh mục" },
            { status: 500 }
        );
    }
}
