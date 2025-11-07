"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    MoreVertical,
    Users,
    BarChart3,
    Clock,
    DollarSign,
    Grid,
    List as ListIcon
} from "lucide-react";
import Link from "next/link";
import { routes } from "@/config/routes";
import { cn } from "@/utils/class-names";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ViewMode = "grid" | "list";

interface TeacherCourse {
    id: string;
    title: string;
    description: string;
    category: string;
    students: number;
    enrollment: number;
    price: number;
    thumbnail: string;
    level: "beginner" | "intermediate" | "advanced";
    status: "draft" | "published" | "archived";
    lessonsCount: number;
    completionRate: number;
    createdAt: Date;
    updatedAt: Date;
}

// Mock data - replace with API calls
const mockCourses: TeacherCourse[] = [
    {
        id: "1",
        title: "React Advanced Patterns",
        description: "Master advanced patterns and optimization techniques in React",
        category: "Frontend",
        students: 324,
        enrollment: 450,
        price: 1500000,
        thumbnail: "/images/course1.jpg",
        level: "advanced",
        status: "published",
        lessonsCount: 24,
        completionRate: 65,
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
        id: "2",
        title: "Node.js Backend Development",
        description: "Build scalable backend applications with Node.js and Express",
        category: "Backend",
        students: 189,
        enrollment: 280,
        price: 1200000,
        thumbnail: "/images/course2.jpg",
        level: "intermediate",
        status: "published",
        lessonsCount: 18,
        completionRate: 48,
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
        id: "3",
        title: "TypeScript Masterclass",
        description: "Learn TypeScript from basics to advanced level",
        category: "Programming",
        students: 0,
        enrollment: 0,
        price: 800000,
        thumbnail: "/images/course3.jpg",
        level: "beginner",
        status: "draft",
        lessonsCount: 0,
        completionRate: 0,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
];

export default function TeacherCoursesPage() {
    const [courses, setCourses] = useState<TeacherCourse[]>(mockCourses);
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; courseId?: string }>({
        show: false,
    });

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || course.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleDeleteCourse = (courseId: string) => {
        setCourses(courses.filter(c => c.id !== courseId));
        setDeleteConfirm({ show: false });
    };

    const getLevelLabel = (level: string): string => {
        const labels: Record<string, string> = {
            beginner: "Cơ bản",
            intermediate: "Trung bình",
            advanced: "Nâng cao",
        };
        return labels[level] || level;
    };

    const getLevelColor = (level: string): string => {
        const colors: Record<string, string> = {
            beginner: "bg-green-100 text-green-800",
            intermediate: "bg-blue-100 text-blue-800",
            advanced: "bg-purple-100 text-purple-800",
        };
        return colors[level] || "bg-gray-100 text-gray-800";
    };

    const getStatusLabel = (status: string): string => {
        const labels: Record<string, string> = {
            draft: "Bản nháp",
            published: "Đã xuất bản",
            archived: "Đã lưu trữ",
        };
        return labels[status] || status;
    };

    const getStatusColor = (status: string): string => {
        const colors: Record<string, string> = {
            draft: "bg-yellow-100 text-yellow-800",
            published: "bg-green-100 text-green-800",
            archived: "bg-gray-100 text-gray-800",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    const renderGridView = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
                <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Thumbnail */}
                    <div className="aspect-video bg-gray-200 overflow-hidden relative group">
                        <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                            <Button
                                size="sm"
                                variant="secondary"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                asChild
                            >
                                <Link href={routes.teacher.courseDetail(course.id)}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Xem
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <CardContent className="p-4">
                        {/* Status Badge */}
                        <div className="flex items-start justify-between mb-2">
                            <Badge className={cn(getStatusColor(course.status), "text-xs")}>
                                {getStatusLabel(course.status)}
                            </Badge>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link href={routes.teacher.editCourse(course.id)}>
                                            <Edit className="w-4 h-4 mr-2" />
                                            Chỉnh sửa
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={routes.teacher.courseModules(course.id)}>
                                            Quản lý module
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={routes.teacher.courseStudents(course.id)}>
                                            <Users className="w-4 h-4 mr-2" />
                                            Học viên
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => setDeleteConfirm({ show: true, courseId: course.id })}
                                        className="text-red-600"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Xóa
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Title */}
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>

                        {/* Level Badge */}
                        <Badge className={cn(getLevelColor(course.level), "text-xs mb-3")}>
                            {getLevelLabel(course.level)}
                        </Badge>

                        {/* Stats */}
                        <div className="space-y-3 mb-4 pb-4 border-b">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Users className="w-4 h-4" />
                                <span>{course.students} học viên</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span>{course.lessonsCount} bài học</span>
                            </div>
                        </div>

                        {/* Completion Rate */}
                        {course.status === "published" && (
                            <div className="mb-3">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-gray-600">Hoàn thành</span>
                                    <span className="text-xs font-medium text-gray-900">
                                        {course.completionRate}%
                                    </span>
                                </div>
                                <Progress value={course.completionRate} className="h-1.5" />
                            </div>
                        )}

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-4">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="font-semibold text-green-600">
                                {course.price.toLocaleString("vi-VN")}đ
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1" asChild>
                                <Link href={routes.teacher.editCourse(course.id)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Chỉnh sửa
                                </Link>
                            </Button>
                            <Button size="sm" className="flex-1" asChild>
                                <Link href={routes.teacher.courseDetail(course.id)}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Chi tiết
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    const renderListView = () => (
        <div className="space-y-3">
            {filteredCourses.map(course => (
                <Card key={course.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex gap-4">
                            {/* Thumbnail */}
                            <div className="w-32 h-20 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="font-semibold text-base mb-1 line-clamp-1">
                                            {course.title}
                                        </h3>
                                        <div className="flex gap-2 flex-wrap">
                                            <Badge className={cn(getStatusColor(course.status), "text-xs")}>
                                                {getStatusLabel(course.status)}
                                            </Badge>
                                            <Badge className={cn(getLevelColor(course.level), "text-xs")}>
                                                {getLevelLabel(course.level)}
                                            </Badge>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={routes.teacher.editCourse(course.id)}>
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Chỉnh sửa
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={routes.teacher.courseModules(course.id)}>
                                                    Quản lý module
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={routes.teacher.courseStudents(course.id)}>
                                                    <Users className="w-4 h-4 mr-2" />
                                                    Học viên
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => setDeleteConfirm({ show: true, courseId: course.id })}
                                                className="text-red-600"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Xóa
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Stats */}
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        <span>{course.students} học viên</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{course.lessonsCount} bài học</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <DollarSign className="w-4 h-4" />
                                        <span className="font-semibold text-green-600">
                                            {course.price.toLocaleString("vi-VN")}đ
                                        </span>
                                    </div>
                                </div>

                                {/* Completion Rate */}
                                {course.status === "published" && (
                                    <div className="mt-2 flex items-center gap-2 text-sm">
                                        <span className="text-gray-600 min-w-fit">Hoàn thành:</span>
                                        <div className="flex-1 max-w-xs">
                                            <Progress value={course.completionRate} className="h-1.5" />
                                        </div>
                                        <span className="font-medium text-gray-900 min-w-fit">
                                            {course.completionRate}%
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Khóa học của tôi</h1>
                    <p className="text-gray-600 text-sm mt-1">
                        Quản lý và theo dõi các khóa học của bạn
                    </p>
                </div>
                <div className="flex space-x-3">
                    <Button variant="outline" asChild>
                        <Link href={routes.teacher.createCourse}>
                            <Plus className="w-4 h-4 mr-2" />
                            Tạo khóa học (Cũ)
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href={routes.teacher.createCourseNew}>
                            <Plus className="w-4 h-4 mr-2" />
                            Tạo khóa học mới
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Tổng khóa học</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {courses.length}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Grid className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Đã xuất bản</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {courses.filter(c => c.status === "published").length}
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <BarChart3 className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Tổng học viên</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {courses.reduce((acc, c) => acc + c.students, 0)}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Users className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Tổng doanh thu</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {(courses.reduce((acc, c) => acc + c.price * c.students, 0) / 1000000).toFixed(1)}M
                                </p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <DollarSign className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and View Toggle */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-3 md:flex-row md:items-center flex-1">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Tìm kiếm khóa học..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex gap-2">
                        {["all", "published", "draft"].map(status => (
                            <Button
                                key={status}
                                variant={statusFilter === status ? "default" : "outline"}
                                size="sm"
                                onClick={() => setStatusFilter(status)}
                            >
                                {status === "all"
                                    ? "Tất cả"
                                    : status === "published"
                                        ? "Đã xuất bản"
                                        : "Bản nháp"}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* View Toggle */}
                <div className="flex gap-2 border rounded-lg p-1 bg-gray-100">
                    <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className="h-8 w-8 p-0"
                    >
                        <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className="h-8 w-8 p-0"
                    >
                        <ListIcon className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Courses List/Grid */}
            {filteredCourses.length > 0 ? (
                viewMode === "grid" ? (
                    renderGridView()
                ) : (
                    renderListView()
                )
            ) : (
                <Card>
                    <CardContent className="p-12 text-center">
                        <Grid className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Không có khóa học nào
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {searchQuery || statusFilter !== "all"
                                ? "Không tìm thấy khóa học phù hợp với bộ lọc của bạn"
                                : "Bạn chưa tạo khóa học nào. Hãy bắt đầu bằng cách tạo khóa học mới"}
                        </p>
                        {!searchQuery && statusFilter === "all" && (
                            <Button asChild>
                                <Link href={routes.teacher.createCourseNew}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Tạo khóa học mới
                                </Link>
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteConfirm.show} onOpenChange={() => setDeleteConfirm({ show: false })}>
                <AlertDialogContent>
                    <AlertDialogTitle>Xóa khóa học</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bạn có chắc chắn muốn xóa khóa học này? Hành động này không thể hoàn tác và
                        sẽ xóa tất cả dữ liệu liên quan.
                    </AlertDialogDescription>
                    <div className="flex justify-end gap-4">
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() =>
                                deleteConfirm.courseId && handleDeleteCourse(deleteConfirm.courseId)
                            }
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Xóa
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
