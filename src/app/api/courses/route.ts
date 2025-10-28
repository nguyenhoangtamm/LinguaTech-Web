import { NextRequest, NextResponse } from "next/server";

// Mock data
const mockCategories = [
    {
        id: "1",
        name: "Frontend",
        slug: "frontend",
        description: "Phát triển giao diện người dùng",
        icon: "💻",
    },
    {
        id: "2",
        name: "Backend",
        slug: "backend",
        description: "Phát triển server và API",
        icon: "⚙️",
    },
    {
        id: "3",
        name: "Mobile",
        slug: "mobile",
        description: "Phát triển ứng dụng di động",
        icon: "📱",
    },
    {
        id: "4",
        name: "DevOps",
        slug: "devops",
        description: "Vận hành và triển khai",
        icon: "🚀",
    },
    {
        id: "5",
        name: "Design",
        slug: "design",
        description: "Thiết kế UI/UX",
        icon: "🎨",
    },
    {
        id: "6",
        name: "Data Science",
        slug: "data-science",
        description: "Khoa học dữ liệu",
        icon: "📊",
    },
];

const mockCourses = [
    {
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
        category: mockCategories[0],
        tags: ["React", "JavaScript", "TypeScript", "Performance"],
        thumbnail: "/images/course1.jpg",
        videoUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublished: true,
    },
    {
        id: "2",
        title: "Node.js Backend Development Complete Guide",
        description:
            "Xây dựng RESTful API mạnh mẽ với Node.js, Express và MongoDB. Học về authentication, authorization, security best practices và deployment.",
        instructor: "Trần Thị B",
        duration: 35,
        level: "intermediate" as const,
        price: 1200000,
        rating: 4.6,
        studentsCount: 189,
        category: mockCategories[1],
        tags: ["Node.js", "Express", "MongoDB", "API"],
        thumbnail: "/images/course2.jpg",
        videoUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublished: true,
    },
    {
        id: "3",
        title: "UI/UX Design Fundamentals với Figma",
        description:
            "Học thiết kế giao diện người dùng từ cơ bản đến nâng cao. Thực hành với các dự án thực tế và xây dựng portfolio.",
        instructor: "Lê Văn C",
        duration: 25,
        level: "beginner" as const,
        price: 900000,
        rating: 4.7,
        studentsCount: 145,
        category: mockCategories[4],
        tags: ["UI", "UX", "Figma", "Design"],
        thumbnail: "/images/course3.jpg",
        videoUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublished: true,
    },
    {
        id: "4",
        title: "Flutter Mobile Development Complete Course",
        description:
            "Phát triển ứng dụng di động đa nền tảng với Flutter và Dart. Từ cơ bản đến nâng cao với state management và native features.",
        instructor: "Phạm Thị D",
        duration: 50,
        level: "intermediate" as const,
        price: 1800000,
        rating: 4.9,
        studentsCount: 312,
        category: mockCategories[2],
        tags: ["Flutter", "Dart", "Mobile", "Cross-platform"],
        thumbnail: "/images/course4.jpg",
        videoUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublished: true,
    },
    {
        id: "5",
        title: "Python Data Science và Machine Learning",
        description:
            "Khám phá thế giới Data Science với Python. Học pandas, numpy, scikit-learn và các thuật toán Machine Learning cơ bản.",
        instructor: "Hoàng Văn E",
        duration: 45,
        level: "intermediate" as const,
        price: 1600000,
        rating: 4.5,
        studentsCount: 298,
        category: mockCategories[5],
        tags: ["Python", "Data Science", "Machine Learning", "Pandas"],
        thumbnail: "/images/course5.jpg",
        videoUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublished: true,
    },
    {
        id: "6",
        title: "DevOps với Docker, Kubernetes và CI/CD",
        description:
            "Học containerization, orchestration và automation. Xây dựng pipeline CI/CD hiện đại cho các dự án thực tế.",
        instructor: "Võ Thị F",
        duration: 38,
        level: "advanced" as const,
        price: 2000000,
        rating: 4.8,
        studentsCount: 167,
        category: mockCategories[3],
        tags: ["Docker", "Kubernetes", "CI/CD", "DevOps"],
        thumbnail: "/images/course6.jpg",
        videoUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublished: true,
    },
];

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Parse query parameters
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const search = searchParams.get("search");
        const category = searchParams.get("category");
        const level = searchParams.get("level");
        const priceMin = searchParams.get("priceMin")
            ? parseInt(searchParams.get("priceMin")!)
            : undefined;
        const priceMax = searchParams.get("priceMax")
            ? parseInt(searchParams.get("priceMax")!)
            : undefined;
        const rating = searchParams.get("rating")
            ? parseFloat(searchParams.get("rating")!)
            : undefined;
        const sortBy = searchParams.get("sortBy") || "createdAt";
        const sortOrder = searchParams.get("sortOrder") || "desc";

        let filteredCourses = [...mockCourses];

        // Apply filters
        if (search) {
            filteredCourses = filteredCourses.filter(
                (course) =>
                    course.title.toLowerCase().includes(search.toLowerCase()) ||
                    course.description
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                    course.instructor
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                    course.tags.some((tag) =>
                        tag.toLowerCase().includes(search.toLowerCase())
                    )
            );
        }

        if (category) {
            filteredCourses = filteredCourses.filter(
                (course) =>
                    course.category.slug === category ||
                    course.category.id === category
            );
        }

        if (level) {
            filteredCourses = filteredCourses.filter(
                (course) => course.level === level
            );
        }

        if (priceMin !== undefined) {
            filteredCourses = filteredCourses.filter(
                (course) => course.price >= priceMin
            );
        }

        if (priceMax !== undefined) {
            filteredCourses = filteredCourses.filter(
                (course) => course.price <= priceMax
            );
        }

        if (rating !== undefined) {
            filteredCourses = filteredCourses.filter(
                (course) => course.rating >= rating
            );
        }

        // Apply sorting
        filteredCourses.sort((a, b) => {
            let aValue: any, bValue: any;

            switch (sortBy) {
                case "title":
                    aValue = a.title;
                    bValue = b.title;
                    break;
                case "price":
                    aValue = a.price;
                    bValue = b.price;
                    break;
                case "rating":
                    aValue = a.rating;
                    bValue = b.rating;
                    break;
                case "studentsCount":
                    aValue = a.studentsCount;
                    bValue = b.studentsCount;
                    break;
                case "createdAt":
                default:
                    aValue = new Date(a.createdAt);
                    bValue = new Date(b.createdAt);
                    break;
            }

            if (sortOrder === "asc") {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        // Pagination
        const total = filteredCourses.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

        return NextResponse.json({
            data: paginatedCourses,
            message: "Lấy danh sách khóa học thành công",
            meta: {
                page,
                limit,
                total,
                totalPages,
            },
        });
    } catch (error) {
        return NextResponse.json(
            { message: "Có lỗi xảy ra khi lấy danh sách khóa học" },
            { status: 500 }
        );
    }
}
