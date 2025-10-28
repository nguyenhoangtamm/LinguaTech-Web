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
import { Course, CourseCategory } from "@/types/course";
import Link from "next/link";
import { routes } from "@/config/routes";
import { cn } from "@/utils/class-names";
import { useCoursesQuery, useCategoriesQuery } from "@/queries/useCourse";
import { CourseFilterParamsType } from "@/schemaValidations/course.schema";

type ViewMode = "grid" | "list";

const getLevelLabel = (level: number): string => {
    switch (Number(level)) {
        case 1: return "Cơ bản";
        case 2: return "Trung cấp";
        case 3: return "Nâng cao";
        default: return "Không xác định";
    }
};

export default function CoursesPage() {
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [filter, setFilter] = useState<Partial<CourseFilterParamsType>>({});
    const [searchQuery, setSearchQuery] = useState("");

    // Build API filter params (match CourseFilterParams from schema)
    const apiFilterParams: CourseFilterParamsType = {
        pageNumber: currentPage,
        pageSize,
        sortOrder: (filter.sortOrder as string) || "desc",
        sortBy: filter.sortBy || undefined,
        search: searchQuery || undefined,
        category: filter.category || undefined,
        level: filter.level as number | undefined,
        priceMin: filter.priceMin || undefined,
        priceMax: filter.priceMax || undefined,
        rating: filter.rating || undefined,
        tags: filter.tags || undefined,
    };

    // API queries
    const { data: coursesData, isLoading: coursesLoading, error: coursesError } = useCoursesQuery(apiFilterParams);
    const { data: categoriesData, isLoading: categoriesLoading } = useCategoriesQuery();

    // According to schema: response shape is { data: Course[], message, meta: { pageNumber, pageSize, total, totalPages } }
    const courses = coursesData?.data.data || [];
    const categories = Array.isArray(categoriesData) ? categoriesData : categoriesData?.data || [];
    const pagination = coursesData?.data || { pageNumber: 1, pageSize: pageSize, total: 0, totalPages: 1 };

    // Derived values
    const filteredCourses = courses;
    const currentCourses = courses;
    const totalPages = pagination.totalPages;

    const handleFilterChange = (key: keyof Partial<CourseFilterParamsType>, value: any) => {
        setFilter(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1); // Reset to first page when filter changes
    };

    const clearFilters = () => {
        setFilter({});
        setSearchQuery("");
        setCurrentPage(1);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const renderCourseCard = (course: Course): React.ReactNode => {
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
                                        {getLevelLabel(course.level)}
                                    </Badge>
                                </div>
                                <p className="text-gray-700 text-sm line-clamp-2 mb-3">{course.description}</p>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {course.tags.slice(0, 3).map((tag: string) => (
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
                            <Badge variant="outline">{getLevelLabel(course.level)}</Badge>
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
                                {categories.map((category: any) => (
                                    <SelectItem key={category.id} value={category.slug}>
                                        {category.icon} {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={filter.level?.toString() || "all"} onValueChange={(value) => handleFilterChange("level", value === "all" ? undefined : parseInt(value))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Cấp độ" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả cấp độ</SelectItem>
                                {/* NOTE: backend expects numeric level. Mapping: 1=beginner, 2=intermediate, 3=advanced */}
                                <SelectItem value="1">Cơ bản</SelectItem>
                                <SelectItem value="2">Trung cấp</SelectItem>
                                <SelectItem value="3">Nâng cao</SelectItem>
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
                {categories.map((category: any) => {
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