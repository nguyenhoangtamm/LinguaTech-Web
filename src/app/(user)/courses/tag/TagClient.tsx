"use client";

import { useState } from "react";
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
    List,
    Loader2
} from "lucide-react";
import { Course } from "@/types/course";
import Link from "next/link";
import { routes } from "@/config/routes";
import { cn } from "@/utils/class-names";
import { useCoursesQuery } from "@/queries/useCourse";
import { useGetAllCourseTags } from "@/queries/useCourseTag";
import { CourseFilterParamsType } from "@/schemaValidations/course.schema";
import { Image } from "rsuite";

type ViewMode = "grid" | "list";

const getLevelLabel = (level: number): string => {
    switch (Number(level)) {
        case 1: return "Cơ bản";
        case 2: return "Trung cấp";
        case 3: return "Nâng cao";
        default: return "Không xác định";
    }
};

const getTagName = (tagId: number, courseTagsData: any): string => {
    const tag = courseTagsData?.data?.find((t: any) => t.id === tagId);
    return tag?.name || `Tag ${tagId}`;
};

export default function TagClient() {
    const searchParams = useSearchParams();
    const tagName = searchParams.get("tag") || "";
    const tagId = searchParams.get("tagId") ? parseInt(searchParams.get("tagId") || "0") : null;

    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [levelFilter, setLevelFilter] = useState<string>("");

    // Get all course tags data
    const { data: courseTagsData, isLoading: tagsLoading } = useGetAllCourseTags();

    // API queries - filter by tag ID
    const { data: coursesData, isLoading: coursesLoading } = useCoursesQuery(
        {
            pageNumber: 1,
            pageSize: 20,
            tags: tagId ? [tagId] : undefined,
            level: levelFilter ? (levelFilter === "beginner" ? 1 : levelFilter === "intermediate" ? 2 : 3) : undefined,
        },
        !!tagId // Only enable if tagId exists
    );

    // Use API data
    const courses = (coursesData?.data as Course[]) || [];

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
                                <Image
                                    src={course.thumbnailUrl || ""}
                                    alt={course.title}
                                    className="w-full h-full object-cover rounded-lg"
                                />
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
                                    {course.tags.slice(0, 3).map((tagId: number) => (
                                        <Badge key={tagId} variant="secondary" className="text-xs">
                                            {getTagName(tagId, courseTagsData)}
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
                        <Image
                            src={course.thumbnailUrl || ""}
                            alt={course.title}
                            className="w-full h-full object-cover rounded-lg"
                        />
                    </div>
                    <div className="p-6">
                        <div className="flex items-start justify-between mb-2">
                            <Badge variant="outline">
                                {getLevelLabel(course.level)}
                            </Badge>
                        </div>
                        <h3 className="text-lg font-semibold line-clamp-2 mb-2">{course.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">Giảng viên: {course.instructor}</p>
                        <p className="text-gray-700 text-sm line-clamp-3 mb-4">{course.description}</p>

                        <div className="flex flex-wrap gap-1 mb-4">
                            {course.tags.slice(0, 2).map((tagId: number) => (
                                <Badge key={tagId} variant="secondary" className="text-xs">
                                    {getTagName(tagId, courseTagsData)}
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

    if (!tagName) {
        return (
            <div className="text-center py-12">
                <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Không có tag được chỉ định</h2>
                <p className="text-gray-600 mb-4">Vui lòng chọn một tag để xem các khóa học liên quan.</p>
                <Button asChild>
                    <Link href={routes.user.courses}>Xem tất cả khóa học</Link>
                </Button>
            </div>
        );
    }

    // Find tag name from courseTagsData
    const currentTagName = tagId ? getTagName(tagId, courseTagsData) : tagName;

    // Show loading state
    if (tagsLoading || coursesLoading) {
        return (
            <div className="text-center py-12">
                <Loader2 className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Đang tải dữ liệu...</h2>
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
                                <Tag className="w-8 h-8 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <CardTitle className="text-2xl mb-2">#{currentTagName}</CardTitle>
                                <CardDescription className="text-base">
                                    Khám phá các khóa học liên quan đến tag {currentTagName}
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
                    ].map((level: { value: string; label: string }) => (
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
                {courses.map(renderCourseCard)}
            </div>

            {/* Empty State */}
            {courses.length === 0 && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có khóa học</h3>
                        <p className="text-gray-600 mb-4">
                            {levelFilter
                                ? `Chưa có khóa học ${levelFilter === "beginner" ? "cơ bản" : levelFilter === "intermediate" ? "trung cấp" : "nâng cao"} với tag "${tagName}".`
                                : `Chưa có khóa học nào với tag "${tagName}".`
                            }
                        </p>
                        {levelFilter && (
                            <Button onClick={() => setLevelFilter("")}>Xóa bộ lọc</Button>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
