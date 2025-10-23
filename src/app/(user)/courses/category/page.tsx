"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    BookOpen,
    ArrowLeft,
    Star,
    Clock,
    Users,
    Filter,
    Grid,
    List
} from "lucide-react";
import { Course, CourseCategory } from "@/types/course";
import Link from "next/link";
import { routes } from "@/config/routes";
import { cn } from "@/utils/class-names";

// Mock data (same as courses page)
const mockCategories: CourseCategory[] = [
    { id: "1", name: "Frontend", slug: "frontend", description: "Phát triển giao diện người dùng với React, Vue, Angular", icon: "💻" },
    { id: "2", name: "Backend", slug: "backend", description: "Phát triển server và API với Node.js, Python, Java", icon: "⚙️" },
    { id: "3", name: "Mobile", slug: "mobile", description: "Phát triển ứng dụng di động với React Native, Flutter", icon: "📱" },
    { id: "4", name: "DevOps", slug: "devops", description: "Vận hành và triển khai với Docker, Kubernetes, CI/CD", icon: "🚀" },
    { id: "5", name: "Design", slug: "design", description: "Thiết kế UI/UX với Figma, Adobe Creative Suite", icon: "🎨" },
    { id: "6", name: "Data Science", slug: "data-science", description: "Khoa học dữ liệu với Python, R, Machine Learning", icon: "📊" }
];

const mockCourses: Course[] = [
    {
        id: "1",
        title: "React Advanced Patterns và Performance Optimization",
        description: "Học các pattern nâng cao trong React và tối ưu hóa hiệu suất ứng dụng. Khóa học bao gồm Context API, Custom Hooks, Memoization và nhiều kỹ thuật khác.",
        instructor: "Nguyễn Văn A",
        duration: 40,
        level: "advanced",
        price: 1500000,
        rating: 4.8,
        studentsCount: 234,
        category: mockCategories[0],
        tags: ["React", "JavaScript", "TypeScript", "Performance"],
        thumbnail: "/images/course1.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: true
    },
    {
        id: "7",
        title: "Vue.js 3 Composition API Masterclass",
        description: "Học Vue.js 3 từ cơ bản đến nâng cao với Composition API. Xây dựng ứng dụng thực tế với Pinia state management.",
        instructor: "Lê Thị G",
        duration: 32,
        level: "intermediate",
        price: 1300000,
        rating: 4.7,
        studentsCount: 187,
        category: mockCategories[0],
        tags: ["Vue.js", "JavaScript", "Composition API", "Pinia"],
        thumbnail: "/images/course7.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: true
    },
    {
        id: "8",
        title: "Angular 16 Complete Guide với Standalone Components",
        description: "Khóa học Angular toàn diện với các tính năng mới nhất như Standalone Components, Signals và Angular CLI.",
        instructor: "Phạm Văn H",
        duration: 45,
        level: "intermediate",
        price: 1400000,
        rating: 4.6,
        studentsCount: 156,
        category: mockCategories[0],
        tags: ["Angular", "TypeScript", "RxJS", "Components"],
        thumbnail: "/images/course8.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: true
    },
    {
        id: "2",
        title: "Node.js Backend Development từ Zero đến Hero",
        description: "Xây dựng API RESTful và GraphQL với Node.js, Express, và MongoDB. Học cách deploy production-ready applications.",
        instructor: "Trần Thị B",
        duration: 35,
        level: "intermediate",
        price: 1200000,
        rating: 4.6,
        studentsCount: 189,
        category: mockCategories[1],
        tags: ["Node.js", "Express", "MongoDB", "API"],
        thumbnail: "/images/course2.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: true
    }
];

type ViewMode = "grid" | "list";

export default function CoursesByCategoryPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const categorySlug = searchParams.get("category");

    const [courses, setCourses] = useState<Course[]>([]);
    const [category, setCategory] = useState<CourseCategory | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [levelFilter, setLevelFilter] = useState<string>("");

    useEffect(() => {
        if (categorySlug) {
            // Find category
            const foundCategory = mockCategories.find(cat => cat.slug === categorySlug);
            setCategory(foundCategory || null);

            // Filter courses by category
            const filteredCourses = mockCourses.filter(course => course.category.slug === categorySlug);
            setCourses(filteredCourses);
        }
    }, [categorySlug]);

    const filteredCourses = levelFilter
        ? courses.filter(course => course.level === levelFilter)
        : courses;

    const handleLevelFilter = (level: string) => {
        setLevelFilter(levelFilter === level ? "" : level);
    };

    const renderCourseCard = (course: Course) => {
        const courseUrl = `${routes.user.courseDetail}/${course.id}`;

        if (viewMode === "list") {
            return (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex gap-6">
                            <div className="w-48 h-32 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                                <BookOpen className="w-12 h-12 text-gray-400" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="text-lg font-semibold line-clamp-2 mb-1">{course.title}</h3>
                                        <p className="text-gray-600 text-sm mb-2">Giảng viên: {course.instructor}</p>
                                    </div>
                                    <Badge variant="outline" className="ml-2">
                                        {course.level === "beginner" ? "Cơ bản" :
                                            course.level === "intermediate" ? "Trung cấp" : "Nâng cao"}
                                    </Badge>
                                </div>
                                <p className="text-gray-700 text-sm line-clamp-2 mb-3">{course.description}</p>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {course.tags.slice(0, 3).map(tag => (
                                        <Badge key={tag} variant="secondary" className="text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                    {course.tags.length > 3 && (
                                        <Badge variant="secondary" className="text-xs">
                                            +{course.tags.length - 3}
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span>{course.rating}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{course.duration}h</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            <span>{course.studentsCount}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg font-bold text-blue-600">
                                            {course.price.toLocaleString('vi-VN')}đ
                                        </span>
                                        <Button asChild>
                                            <Link href={courseUrl}>Xem chi tiết</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            );
        }

        return (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                    <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-gray-400" />
                    </div>
                    <div className="p-6">
                        <div className="flex items-start justify-between mb-2">
                            <Badge variant="outline">
                                {course.level === "beginner" ? "Cơ bản" :
                                    course.level === "intermediate" ? "Trung cấp" : "Nâng cao"}
                            </Badge>
                        </div>
                        <h3 className="text-lg font-semibold line-clamp-2 mb-2">{course.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">Giảng viên: {course.instructor}</p>
                        <p className="text-gray-700 text-sm line-clamp-3 mb-4">{course.description}</p>

                        <div className="flex flex-wrap gap-1 mb-4">
                            {course.tags.slice(0, 2).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                            {course.tags.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                    +{course.tags.length - 2}
                                </Badge>
                            )}
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span>{course.rating}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{course.duration}h</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{course.studentsCount}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-blue-600">
                                {course.price.toLocaleString('vi-VN')}đ
                            </span>
                            <Button size="sm" asChild>
                                <Link href={courseUrl}>Xem chi tiết</Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    if (!category) {
        return (
            <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy danh mục</h2>
                <p className="text-gray-600 mb-4">Danh mục bạn đang tìm kiếm không tồn tại.</p>
                <Button asChild>
                    <Link href={routes.user.courses}>Xem tất cả khóa học</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4">
                <Button variant="ghost" size="sm" className="w-fit" asChild>
                    <Link href={routes.user.courses}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Quay lại danh sách khóa học
                    </Link>
                </Button>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl">
                                {category.icon}
                            </div>
                            <div className="flex-1">
                                <CardTitle className="text-2xl mb-2">{category.name}</CardTitle>
                                <CardDescription className="text-base">
                                    {category.description}
                                </CardDescription>
                                <div className="mt-2">
                                    <Badge variant="secondary">
                                        {filteredCourses.length} khóa học
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                </Card>
            </div>

            {/* Filters and View Mode */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                        <Filter className="w-4 h-4 mr-2" />
                        Lọc theo cấp độ:
                    </span>
                    {[
                        { value: "beginner", label: "Cơ bản" },
                        { value: "intermediate", label: "Trung cấp" },
                        { value: "advanced", label: "Nâng cao" }
                    ].map(level => (
                        <Button
                            key={level.value}
                            variant={levelFilter === level.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleLevelFilter(level.value)}
                        >
                            {level.label}
                        </Button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant={viewMode === "grid" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                    >
                        <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                        variant={viewMode === "list" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                    >
                        <List className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Course Grid/List */}
            <div className={cn(
                "grid gap-6",
                viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            )}>
                {filteredCourses.map(renderCourseCard)}
            </div>

            {/* Empty State */}
            {filteredCourses.length === 0 && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có khóa học</h3>
                        <p className="text-gray-600 mb-4">
                            {levelFilter
                                ? `Chưa có khóa học ${levelFilter === "beginner" ? "cơ bản" : levelFilter === "intermediate" ? "trung cấp" : "nâng cao"} trong danh mục này.`
                                : "Chưa có khóa học nào trong danh mục này."
                            }
                        </p>
                        {levelFilter && (
                            <Button onClick={() => setLevelFilter("")}>Xóa bộ lọc</Button>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Related Categories */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh mục khác</CardTitle>
                    <CardDescription>Khám phá các danh mục khóa học khác</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {mockCategories.filter(cat => cat.slug !== categorySlug).map(relatedCategory => (
                            <Link
                                key={relatedCategory.id}
                                href={`${routes.user.coursesByCategory}?category=${relatedCategory.slug}`}
                                className="block p-4 border rounded-lg hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                                        {relatedCategory.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-medium">{relatedCategory.name}</h4>
                                        <p className="text-sm text-gray-600 line-clamp-1">
                                            {relatedCategory.description}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}