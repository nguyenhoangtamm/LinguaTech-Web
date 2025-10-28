"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    BookOpen,
    ArrowLeft,
    Star,
    Clock,
    Users,
    Tag,
    Grid,
    List
} from "lucide-react";
import { Course } from "@/types/course";
import Link from "next/link";
import { routes } from "@/config/routes";
import { cn } from "@/utils/class-names";
import { useCoursesQuery } from "@/queries/useCourse";
import { CourseFilterParamsType } from "@/schemaValidations/course.schema";

// Mock data (same courses from other pages)
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
        category: { id: "1", name: "Frontend", slug: "frontend" },
        tags: ["React", "JavaScript", "TypeScript", "Performance"],
        thumbnail: "/images/course1.jpg",
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
        category: { id: "2", name: "Backend", slug: "backend" },
        tags: ["Node.js", "Express", "MongoDB", "API", "JavaScript"],
        thumbnail: "/images/course2.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: true
    },
    {
        id: "9",
        title: "JavaScript ES6+ Modern Development",
        description: "Nắm vững JavaScript hiện đại với ES6+, async/await, modules và các tính năng mới nhất của JavaScript.",
        instructor: "Nguyễn Thị K",
        duration: 28,
        level: "intermediate",
        price: 1100000,
        rating: 4.7,
        studentsCount: 298,
        category: { id: "1", name: "Frontend", slug: "frontend" },
        tags: ["JavaScript", "ES6", "Modern JS", "Async"],
        thumbnail: "/images/course9.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: true
    },
    {
        id: "10",
        title: "TypeScript Full Stack Development",
        description: "Xây dựng ứng dụng Full Stack với TypeScript từ frontend đến backend. Học type safety và advanced types.",
        instructor: "Đặng Văn L",
        duration: 42,
        level: "advanced",
        price: 1700000,
        rating: 4.9,
        studentsCount: 167,
        category: { id: "1", name: "Frontend", slug: "frontend" },
        tags: ["TypeScript", "Full Stack", "Type Safety", "React"],
        thumbnail: "/images/course10.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: true
    }
];

// Get all unique tags from courses
const getAllTags = (): string[] => {
    const tags = new Set<string>();
    mockCourses.forEach(course => {
        course.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
};

type ViewMode = "grid" | "list";

export default function CoursesByTagPage() {
    const searchParams = useSearchParams();
    const selectedTag = searchParams.get("tag");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // Use API to get courses with tag filter
    const [filterParams, setFilterParams] = useState<CourseFilterParamsType>({
        page: 1,
        limit: 12,
        search: "",
        category: "",
        level: undefined,
        tags: selectedTag ? [selectedTag] : [],
        sortBy: "createdAt",
        sortOrder: "desc"
    });

    const { data: coursesResponse, isLoading, error } = useCoursesQuery(filterParams);
    const courses = (coursesResponse as any)?.data || [];
    const totalCourses = (coursesResponse as any)?.meta?.total || 0;

    // Update filter when tag changes
    useEffect(() => {
        setFilterParams(prev => ({
            ...prev,
            tags: selectedTag ? [selectedTag] : []
        }));
    }, [selectedTag]);

    const handleLevelFilter = (level: "beginner" | "intermediate" | "advanced") => {
        setFilterParams(prev => ({
            ...prev,
            level: prev.level === level ? undefined : level
        }));
    };

    const getRelatedTags = (): string[] => {
        if (!selectedTag) return [];

        // Extract unique tags from current courses
        const relatedTags = new Set<string>();
        courses.forEach((course: any) => {
            course.tags.forEach((tag: string) => {
                if (tag !== selectedTag && !relatedTags.has(tag)) {
                    relatedTags.add(tag);
                }
            });
        });

        return Array.from(relatedTags).slice(0, 6);
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
                                    {course.tags.map(tag => (
                                        <Badge
                                            key={tag}
                                            variant={tag === selectedTag ? "default" : "secondary"}
                                            className="text-xs"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
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
                            <Badge variant="secondary">{course.category.name}</Badge>
                        </div>
                        <h3 className="text-lg font-semibold line-clamp-2 mb-2">{course.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">Giảng viên: {course.instructor}</p>
                        <p className="text-gray-700 text-sm line-clamp-3 mb-4">{course.description}</p>

                        <div className="flex flex-wrap gap-1 mb-4">
                            {course.tags.map(tag => (
                                <Badge
                                    key={tag}
                                    variant={tag === selectedTag ? "default" : "secondary"}
                                    className="text-xs"
                                >
                                    {tag}
                                </Badge>
                            ))}
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

    if (!selectedTag) {
        return (
            <div className="text-center py-12">
                <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Không có tag được chọn</h2>
                <p className="text-gray-600 mb-4">Vui lòng chọn một tag để xem các khóa học liên quan.</p>
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
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                                <Tag className="w-8 h-8 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                                    Khóa học về &ldquo;{selectedTag}&rdquo;
                                </CardTitle>
                                <CardDescription className="text-base">
                                    Tất cả khóa học có chứa tag &ldquo;{selectedTag}&rdquo;
                                </CardDescription>
                                <div className="mt-2">
                                    <Badge variant="secondary">
                                        {courses.length} khóa học
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
                        Lọc theo cấp độ:
                    </span>
                    {[
                        { value: "beginner", label: "Cơ bản" },
                        { value: "intermediate", label: "Trung cấp" },
                        { value: "advanced", label: "Nâng cao" }
                    ].map(level => (
                        <Button
                            key={level.value}
                            variant={filterParams.level === level.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleLevelFilter(level.value as "beginner" | "intermediate" | "advanced")}
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
                {courses.map(renderCourseCard)}
            </div>

            {/* Empty State */}
            {courses.length === 0 && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có khóa học</h3>
                        <p className="text-gray-600 mb-4">
                            {filterParams.level
                                ? `Chưa có khóa học ${filterParams.level === "beginner" ? "cơ bản" : filterParams.level === "intermediate" ? "trung cấp" : "nâng cao"} với tag "${selectedTag}".`
                                : `Chưa có khóa học nào với tag "${selectedTag}".`
                            }
                        </p>
                        {filterParams.level && (
                            <Button onClick={() => setFilterParams(prev => ({ ...prev, level: undefined }))}>Xóa bộ lọc</Button>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Related Tags */}
            {getRelatedTags().length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Tags liên quan</CardTitle>
                        <CardDescription>Khám phá các khóa học với tags khác</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {getRelatedTags().map(tag => (
                                <Button
                                    key={tag}
                                    variant="outline"
                                    size="sm"
                                    asChild
                                >
                                    <Link href={`${routes.user.coursesByTag}?tag=${encodeURIComponent(tag)}`}>
                                        <Tag className="w-3 h-3 mr-2" />
                                        {tag}
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Popular Tags */}
            {getRelatedTags().length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Các tag phổ biến</CardTitle>
                        <CardDescription>Tìm kiếm khóa học theo tag phổ biến</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {getRelatedTags().map((tag: string) => (
                                <Button
                                    key={tag}
                                    variant={tag === selectedTag ? "default" : "outline"}
                                    size="sm"
                                    asChild
                                >
                                    <Link href={`${routes.user.coursesByTag}?tag=${encodeURIComponent(tag)}`}>
                                        <Tag className="w-3 h-3 mr-2" />
                                        {tag}
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}