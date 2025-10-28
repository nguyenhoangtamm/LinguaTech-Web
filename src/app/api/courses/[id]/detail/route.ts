import { NextRequest, NextResponse } from "next/server";

// Mock detailed course data with modules
const mockCourseDetailWithModules = {
    course: {
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
    },
    modules: [
        {
            id: "mod1",
            title: "Phần 1: Cơ sở và pattern",
            description:
                "Tìm hiểu về các pattern cơ bản và nâng cao trong React",
            order: 1,
            lessons: [
                {
                    id: "l1",
                    title: "Giới thiệu về Advanced Patterns",
                    duration: 45,
                    completed: true,
                    materials: ["m1"],
                    contentType: "video" as const,
                    order: 1,
                },
                {
                    id: "l2",
                    title: "Custom Hooks và Logic Reuse",
                    duration: 52,
                    completed: true,
                    materials: ["m2"],
                    contentType: "video" as const,
                    order: 2,
                },
                {
                    id: "l3",
                    title: "Context API Deep Dive",
                    duration: 38,
                    completed: false,
                    materials: [],
                    contentType: "video" as const,
                    order: 3,
                },
                {
                    id: "l4",
                    title: "Compound Components Pattern",
                    duration: 41,
                    completed: false,
                    materials: ["m3"],
                    contentType: "reading" as const,
                    order: 4,
                },
            ],
        },
        {
            id: "mod2",
            title: "Phần 2: Performance và Optimization",
            description: "Học các kỹ thuật tối ưu hóa hiệu suất React",
            order: 2,
            lessons: [
                {
                    id: "l5",
                    title: "Code Splitting và Lazy Loading",
                    duration: 35,
                    completed: false,
                    materials: [],
                    contentType: "reading" as const,
                    order: 1,
                },
                {
                    id: "l6",
                    title: "Testing Advanced Components",
                    duration: 47,
                    completed: false,
                    materials: [],
                    contentType: "reading" as const,
                    order: 2,
                },
                {
                    id: "l7",
                    title: "Production Deployment Best Practices",
                    duration: 33,
                    completed: false,
                    materials: ["m4"],
                    contentType: "reading" as const,
                    order: 3,
                },
            ],
        },
    ],
    materials: [
        {
            id: "m1",
            fileName: "slides-intro.pdf",
            fileUrl: "/files/slides-intro.pdf",
            fileType: "pdf",
            size: 1200,
        },
        {
            id: "m2",
            fileName: "code-samples.zip",
            fileUrl: "/files/code-samples.zip",
            fileType: "zip",
            size: 20480,
        },
        {
            id: "m3",
            fileName: "reading-advanced.md",
            fileUrl: "/files/reading-advanced.md",
            fileType: "md",
            size: 48,
        },
        {
            id: "m4",
            fileName: "final-project.zip",
            fileUrl: "/files/final-project.zip",
            fileType: "zip",
            size: 15360,
        },
    ],
    instructor: {
        name: "Nguyễn Văn A",
        avatar: "NA",
        title: "Senior Frontend Developer",
        company: "TechCorp",
        experience: "5+ năm",
        students: 1250,
        courses: 8,
        rating: 4.9,
        bio: "Senior Frontend Developer với hơn 5 năm kinh nghiệm phát triển ứng dụng web với React, Vue.js và Angular. Đã tham gia nhiều dự án lớn tại các công ty công nghệ hàng đầu.",
    },
    reviews: [
        {
            id: "1",
            userName: "Trần Văn B",
            avatar: "TB",
            rating: 5,
            comment:
                "Khóa học rất hay, giảng viên giải thích rõ ràng và có nhiều ví dụ thực tế. Đáng tiền!",
            date: "2 ngày trước",
            helpful: 12,
        },
        {
            id: "2",
            userName: "Lê Thị C",
            avatar: "LC",
            rating: 4,
            comment:
                "Nội dung chất lượng, tuy nhiên một số phần hơi khó hiểu với người mới bắt đầu.",
            date: "1 tuần trước",
            helpful: 8,
        },
        {
            id: "3",
            userName: "Phạm Minh D",
            avatar: "PD",
            rating: 5,
            comment:
                "Excellent course! Đã áp dụng được nhiều kỹ thuật vào dự án thực tế.",
            date: "2 tuần trước",
            helpful: 15,
        },
    ],
    faqs: [
        {
            id: "1",
            question: "Tôi có thể truy cập khóa học bao lâu?",
            answer: "Bạn có thể truy cập khóa học trọn đời sau khi đăng ký. Không có giới hạn thời gian.",
        },
        {
            id: "2",
            question: "Có chứng chỉ sau khi hoàn thành không?",
            answer: "Có, bạn sẽ nhận được chứng chỉ hoàn thành sau khi hoàn thành tất cả bài học và bài tập.",
        },
        {
            id: "3",
            question: "Khóa học có hỗ trợ tiếng Việt không?",
            answer: "Có, toàn bộ khóa học được thực hiện bằng tiếng Việt với phụ đề tiếng Anh.",
        },
    ],
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
                data: mockCourseDetailWithModules,
                message: "Lấy thông tin chi tiết khóa học thành công",
            });
        }

        // Generate mock data for other IDs
        const mockDetailData = {
            ...mockCourseDetailWithModules,
            course: {
                ...mockCourseDetailWithModules.course,
                id,
                title: `Mock Course Detail ${id}`,
                description: `Mô tả chi tiết khóa học mock ${id}`,
            },
        };

        return NextResponse.json({
            data: mockDetailData,
            message: "Lấy thông tin chi tiết khóa học thành công",
        });
    } catch (error) {
        return NextResponse.json(
            { message: "Có lỗi xảy ra khi lấy thông tin chi tiết khóa học" },
            { status: 500 }
        );
    }
}
