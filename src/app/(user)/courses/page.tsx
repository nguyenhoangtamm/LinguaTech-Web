"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    BookOpen,
    Search,
    Filter,
    Star,
    Clock,
    Users,
    Grid,
    List,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { Course, CourseCategory, CourseFilter } from "@/types/course";
import Link from "next/link";
import { routes } from "@/config/routes";
import { cn } from "@/utils/class-names";

// Mock data
const mockCategories: CourseCategory[] = [
    { id: "1", name: "Frontend", slug: "frontend", description: "Phát triển giao diện người dùng", icon: "💻" },
    { id: "2", name: "Backend", slug: "backend", description: "Phát triển server và API", icon: "⚙️" },
    { id: "3", name: "Mobile", slug: "mobile", description: "Phát triển ứng dụng di động", icon: "📱" },
    { id: "4", name: "DevOps", slug: "devops", description: "Vận hành và triển khai", icon: "🚀" },
    { id: "5", name: "Design", slug: "design", description: "Thiết kế UI/UX", icon: "🎨" },
    { id: "6", name: "Data Science", slug: "data-science", description: "Khoa học dữ liệu", icon: "📊" }
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
    },
    {
        id: "3",
        title: "UI/UX Design Fundamentals với Figma",
        description: "Học thiết kế giao diện người dùng từ cơ bản đến nâng cao. Thực hành với các dự án thực tế và xây dựng portfolio.",
        instructor: "Lê Văn C",
        duration: 25,
        level: "beginner",
        price: 900000,
        rating: 4.7,
        studentsCount: 145,
        category: mockCategories[4],
        tags: ["UI", "UX", "Figma", "Design"],
        thumbnail: "/images/course3.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: true
    },
    {
        id: "4",
        title: "Flutter Mobile Development Complete Course",
        description: "Phát triển ứng dụng di động đa nền tảng với Flutter và Dart. Từ cơ bản đến nâng cao với state management và native features.",
        instructor: "Phạm Thị D",
        duration: 50,
        level: "intermediate",
        price: 1800000,
        rating: 4.9,
        studentsCount: 312,
        category: mockCategories[2],
        tags: ["Flutter", "Dart", "Mobile", "Cross-platform"],
        thumbnail: "/images/course4.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: true
    },
    {
        id: "5",
        title: "Python Data Science và Machine Learning",
        description: "Khám phá thế giới Data Science với Python. Học pandas, numpy, scikit-learn và các thuật toán Machine Learning cơ bản.",
        instructor: "Hoàng Văn E",
        duration: 45,
        level: "intermediate",
        price: 1600000,
        rating: 4.5,
        studentsCount: 298,
        category: mockCategories[5],
        tags: ["Python", "Data Science", "Machine Learning", "Pandas"],
        thumbnail: "/images/course5.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: true
    },
    {
        id: "6",
        title: "DevOps với Docker, Kubernetes và CI/CD",
        description: "Học containerization, orchestration và automation. Xây dựng pipeline CI/CD hiện đại cho các dự án thực tế.",
        instructor: "Võ Thị F",
        duration: 38,
        level: "advanced",
        price: 2000000,
        rating: 4.8,
        studentsCount: 167,
        category: mockCategories[3],
        tags: ["Docker", "Kubernetes", "CI/CD", "DevOps"],
        thumbnail: "/images/course6.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: true
    }
];

type ViewMode = "grid" | "list";

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>(mockCourses);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>(mockCourses);
    const [categories, setCategories] = useState<CourseCategory[]>(mockCategories);
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState<CourseFilter>({});
    const [searchQuery, setSearchQuery] = useState("");

    const coursesPerPage = 6;
    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
    const startIndex = (currentPage - 1) * coursesPerPage;
    const endIndex = startIndex + coursesPerPage;
    const currentCourses = filteredCourses.slice(startIndex, endIndex);

    // Filter courses based on search and filters
    useEffect(() => {
        let filtered = courses;

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(course =>
                course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // Category filter
        if (filter.category) {
            filtered = filtered.filter(course => course.category.slug === filter.category);
        }

        // Level filter
        if (filter.level) {
            filtered = filtered.filter(course => course.level === filter.level);
        }

        // Price filter
        if (filter.priceMin !== undefined) {
            filtered = filtered.filter(course => course.price >= filter.priceMin!);
        }
        if (filter.priceMax !== undefined) {
            filtered = filtered.filter(course => course.price <= filter.priceMax!);
        }

        // Rating filter
        if (filter.rating) {
            filtered = filtered.filter(course => course.rating >= filter.rating!);
        }

        setFilteredCourses(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [searchQuery, filter, courses]);

    const handleFilterChange = (key: keyof CourseFilter, value: any) => {
        setFilter(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilter({});
        setSearchQuery("");
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
                                        {course.level}
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
                            <Badge variant="outline">{course.level}</Badge>
                            <Badge variant="secondary">{course.category.name}</Badge>
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

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Danh sách khóa học</h1>
                    <p className="text-gray-600">Khám phá {filteredCourses.length} khóa học chất lượng cao</p>
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

            {/* Search and Filters */}
            <Card>
                <CardContent className="p-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                        <div className="lg:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Tìm kiếm khóa học..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <Select value={filter.category || "all"} onValueChange={(value) => handleFilterChange("category", value === "all" ? undefined : value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Danh mục" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả danh mục</SelectItem>
                                {categories.map(category => (
                                    <SelectItem key={category.id} value={category.slug}>
                                        {category.icon} {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={filter.level || "all"} onValueChange={(value) => handleFilterChange("level", value === "all" ? undefined : value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Cấp độ" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả cấp độ</SelectItem>
                                <SelectItem value="beginner">Cơ bản</SelectItem>
                                <SelectItem value="intermediate">Trung cấp</SelectItem>
                                <SelectItem value="advanced">Nâng cao</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={clearFilters}>
                                <Filter className="w-4 h-4 mr-2" />
                                Xóa bộ lọc
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Categories Quick Filter */}
            <div className="flex flex-wrap gap-2">
                {categories.map(category => {
                    const isActive = filter.category === category.slug;
                    return (
                        <Button
                            key={category.id}
                            variant={isActive ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleFilterChange("category", isActive ? undefined : category.slug)}
                        >
                            <span className="mr-2">{category.icon}</span>
                            {category.name}
                        </Button>
                    );
                })}
            </div>

            {/* Course Grid/List */}
            <div className={cn(
                "grid gap-6",
                viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            )}>
                {currentCourses.map(renderCourseCard)}
            </div>

            {/* Empty State */}
            {filteredCourses.length === 0 && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy khóa học</h3>
                        <p className="text-gray-600 mb-4">Không có khóa học nào phù hợp với tiêu chí tìm kiếm của bạn.</p>
                        <Button onClick={clearFilters}>Xóa bộ lọc</Button>
                    </CardContent>
                </Card>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Trước
                    </Button>

                    <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </Button>
                        ))}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Sau
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}