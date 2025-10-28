import { NextRequest, NextResponse } from "next/server";
import { MaterialType } from "@/schemaValidations/lesson.schema";

// Mock materials data
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
    {
        id: "m4",
        title: "Code examples",
        fileName: "examples.zip",
        fileUrl: "/files/examples.zip",
        fileType: "document",
        size: 2500000,
        lessonId: "l2",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

export async function GET(
    request: NextRequest,
    { params }: { params: { lessonId: string } }
) {
    try {
        const lessonId = params.lessonId;
        const url = new URL(request.url);
        const type = url.searchParams.get("type");

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 200));

        let materials = mockMaterials.filter(
            (material) => material.lessonId === lessonId
        );

        if (type) {
            materials = materials.filter(
                (material) => material.fileType === type
            );
        }

        return NextResponse.json({
            success: true,
            data: materials,
            message: "Materials retrieved successfully",
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch materials",
                data: null,
            },
            { status: 500 }
        );
    }
}
