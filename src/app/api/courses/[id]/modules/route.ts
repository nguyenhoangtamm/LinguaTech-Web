import { NextRequest, NextResponse } from "next/server";
import {
    ModuleWithLessonsType,
    LessonWithMaterialsType,
    MaterialType,
} from "@/schemaValidations/lesson.schema";

// Mock data for development
const mockMaterials: MaterialType[] = [
    {
        id: "m1",
        title: "Slides giới thiệu",
        fileName: "slides-intro.pdf",
        fileUrl: "/files/slides-intro.pdf",
        fileType: "pdf",
        size: 1200000,
        lessonId: "l1",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "m2",
        title: "Video bài giảng",
        fileName: "lesson-1.mp4",
        fileUrl: "/videos/lesson-1.mp4",
        fileType: "video",
        size: 50000000,
        lessonId: "l1",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "m3",
        title: "Bài tập thực hành",
        fileName: "exercises.pdf",
        fileUrl: "/files/exercises.pdf",
        fileType: "pdf",
        size: 800000,
        lessonId: "l2",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

const mockLessons: LessonWithMaterialsType[] = [
    {
        id: "l1",
        title: "Giới thiệu về React Hooks",
        description: "Tìm hiểu về useState, useEffect và các hooks cơ bản",
        content: "Nội dung chi tiết về React Hooks...",
        duration: 45,
        order: 1,
        isPublished: true,
        isCompleted: false,
        moduleId: "mod1",
        materials: mockMaterials.filter((m) => m.lessonId === "l1"),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "l2",
        title: "Custom Hooks",
        description: "Tạo và sử dụng custom hooks",
        content: "Hướng dẫn tạo custom hooks...",
        duration: 60,
        order: 2,
        isPublished: true,
        isCompleted: false,
        moduleId: "mod1",
        materials: mockMaterials.filter((m) => m.lessonId === "l2"),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "l3",
        title: "Context API và useContext",
        description: "Quản lý state toàn cục với Context",
        content: "Chi tiết về Context API...",
        duration: 50,
        order: 3,
        isPublished: true,
        isCompleted: false,
        moduleId: "mod1",
        materials: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "l4",
        title: "Performance Optimization Techniques",
        description: "Các kỹ thuật tối ưu hiệu suất React",
        content: "Techniques for optimizing React performance...",
        duration: 75,
        order: 1,
        isPublished: true,
        isCompleted: false,
        moduleId: "mod2",
        materials: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "l5",
        title: "Memoization với React.memo và useMemo",
        description: "Sử dụng memoization để tối ưu render",
        content: "Detailed explanation of memoization...",
        duration: 55,
        order: 2,
        isPublished: true,
        isCompleted: false,
        moduleId: "mod2",
        materials: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

const mockModules: ModuleWithLessonsType[] = [
    {
        id: "mod1",
        title: "React Hooks Fundamentals",
        description: "Nắm vững các concepts cơ bản về React Hooks",
        order: 1,
        courseId: "1",
        lessons: mockLessons.filter((l) => l.moduleId === "mod1"),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "mod2",
        title: "Performance Optimization",
        description: "Tối ưu hóa hiệu suất ứng dụng React",
        order: 2,
        courseId: "1",
        lessons: mockLessons.filter((l) => l.moduleId === "mod2"),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "mod3",
        title: "Advanced Patterns",
        description: "Các pattern nâng cao trong React",
        order: 3,
        courseId: "1",
        lessons: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        const modules = mockModules.filter(
            (module) => module.id === id
        );

        return NextResponse.json({
            success: true,
            data: modules,
            message: "Modules retrieved successfully",
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch modules",
                data: null,
            },
            { status: 500 }
        );
    }
}
