"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Settings, Users, BookOpen, FileText, HelpCircle, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { routes } from "@/config/routes";
import { usePageHeader } from "@/hooks/use-page-header";
import { useCourseManagement } from "@/queries/useCourseManagement";
import ModuleManagement from "./components/ModuleManagement";
import LessonManagement from "./components/LessonManagement";
import SectionManagement from "./components/SectionManagement";
import QuestionManagement from "./components/QuestionManagement";
import CourseOverview from "./components/CourseOverview";

const courseLevels = [
    { value: 1, label: "Cơ bản", color: "bg-green-100 text-green-800" },
    { value: 2, label: "Trung cấp", color: "bg-yellow-100 text-yellow-800" },
    { value: 3, label: "Nâng cao", color: "bg-red-100 text-red-800" },
];

export default function CourseDetailPage() {
    const params = useParams();
    const courseId = parseInt(params.id as string);
    const [activeTab, setActiveTab] = useState("overview");

    const { data: courseData, isLoading, error } = useCourseManagement(courseId, true);

    const course = courseData?.data;

    // const pageHeader = {
    //     title: course ? `Chi tiết khóa học: ${course.title}` : 'Chi tiết khóa học',
    //     breadcrumb: [
    //         {
    //             name: 'Trang chủ',
    //         },
    //         {
    //             href: routes.manage.system.courses,
    //             name: 'Khóa học',
    //         },
    //         {
    //             name: course?.title || 'Chi tiết',
    //         },
    //     ],
    // };

    // usePageHeader(pageHeader);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-500">Đang tải thông tin khóa học...</p>
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-red-500 mb-4">Không thể tải thông tin khóa học</p>
                    <Button asChild>
                        <Link href={routes.manage.system.courses}>
                            Quay lại danh sách
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    const levelInfo = courseLevels.find(l => l.value === course.level);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={routes.manage.system.courses}>
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">ID: {course.id}</Badge>
                            {levelInfo && (
                                <Badge className={levelInfo.color}>
                                    {levelInfo.label}
                                </Badge>
                            )}
                            <Badge variant="outline">
                                {course.price ? `${course.price.toLocaleString("vi-VN")}đ` : "Miễn phí"}
                            </Badge>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Chỉnh sửa
                    </Button>
                    <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Cài đặt
                    </Button>
                </div>
            </div>

            {/* Course Info Summary */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg">{course.title}</CardTitle>
                            <CardDescription className="mt-1">
                                Giảng viên: {course.instructor} • Thời lượng: {course.duration} giờ
                            </CardDescription>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-500">Trạng thái</div>
                            <Badge variant="default" className="bg-green-100 text-green-800">
                                Đang hoạt động
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>
                </CardContent>
            </Card>

            {/* Tabs for Course Management */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Tổng quan
                    </TabsTrigger>
                    <TabsTrigger value="modules" className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Module
                    </TabsTrigger>
                    <TabsTrigger value="lessons" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Bài học
                    </TabsTrigger>
                    <TabsTrigger value="sections" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Phần
                    </TabsTrigger>
                    <TabsTrigger value="assignments" className="flex items-center gap-2">
                        <CheckSquare className="w-4 h-4" />
                        Bài tập
                    </TabsTrigger>
                    <TabsTrigger value="questions" className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" />
                        Câu hỏi
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                    <CourseOverview course={course} />
                </TabsContent>

                <TabsContent value="modules" className="mt-6">
                    <ModuleManagement courseId={courseId} />
                </TabsContent>

                <TabsContent value="lessons" className="mt-6">
                    <LessonManagement courseId={courseId} />
                </TabsContent>

                <TabsContent value="sections" className="mt-6">
                    <SectionManagement courseId={courseId} />
                </TabsContent>

                <TabsContent value="assignments" className="mt-6">
                    <div className="text-center py-8">
                        <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Quản lý bài tập</h3>
                        <p className="text-gray-500">Tính năng quản lý bài tập đang được phát triển</p>
                    </div>
                </TabsContent>

                <TabsContent value="questions" className="mt-6">
                    <QuestionManagement courseId={courseId} />
                </TabsContent>
            </Tabs>
        </div>
    );
}