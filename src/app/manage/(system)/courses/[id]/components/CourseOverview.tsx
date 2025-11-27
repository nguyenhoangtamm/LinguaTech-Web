"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, Users, BookOpen, FileText, DollarSign, Calendar, Tag } from "lucide-react";
import { Image } from "rsuite";

interface Course {
    id: number;
    title: string;
    description: string;
    instructor: string;
    duration: number;
    level: number;
    price: number;
    categoryId: number;
    thumbnailUrl?: string;
    videoUrl?: string;
    tags: string[];
    createdAt?: string;
    updatedAt?: string;
    lessonsCount?: number;
    modulesCount?: number;
}

interface CourseOverviewProps {
    course: Course;
}

const courseLevels = [
    { value: 1, label: "Cơ bản", color: "bg-green-100 text-green-800" },
    { value: 2, label: "Trung cấp", color: "bg-yellow-100 text-yellow-800" },
    { value: 3, label: "Nâng cao", color: "bg-red-100 text-red-800" },
];

export default function CourseOverview({ course }: CourseOverviewProps) {
    const levelInfo = courseLevels.find(l => l.value === course.level);

    const stats = [
        { label: "Số module", value: course.modulesCount, icon: BookOpen, color: "text-blue-600" },
        { label: "Số bài học", value: course.lessonsCount, icon: FileText, color: "text-green-600" },
        { label: "Tổng thời lượng", value: `${course.duration}h`, icon: Clock, color: "text-purple-600" },
        { label: "Học viên", value: "0", icon: Users, color: "text-orange-600" },
    ];

    return (
        <div className="space-y-6">
            {/* Course Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Course Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Information */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin khóa học</CardTitle>
                            <CardDescription>Chi tiết về nội dung và cấu trúc khóa học</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-medium text-sm text-gray-700 mb-2">Mô tả</h4>
                                <p className="text-gray-600 leading-relaxed">{course.description}</p>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium text-sm text-gray-700 mb-1">Giảng viên</h4>
                                    <p className="text-gray-900">{course.instructor}</p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm text-gray-700 mb-1">Mức độ</h4>
                                    {levelInfo && (
                                        <Badge className={levelInfo.color}>
                                            {levelInfo.label}
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {course.tags && course.tags.length > 0 && (
                                <>
                                    <Separator />
                                    <div>
                                        <h4 className="font-medium text-sm text-gray-700 mb-2">Tags</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {course.tags.map((tag, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    <Tag className="w-3 h-3 mr-1" />
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Course Thumbnail/Video */}
                    {(course.thumbnailUrl || course.videoUrl) && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Media</CardTitle>
                                <CardDescription>Hình ảnh và video của khóa học</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {course.thumbnailUrl && (
                                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                        <Image
                                            src={course.thumbnailUrl || ""}
                                            alt={course.title}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    </div>
                                )}
                                {course.videoUrl && (
                                    <div className="mt-4">
                                        <Button variant="outline" size="sm" asChild>
                                            <a href={course.videoUrl} target="_blank" rel="noopener noreferrer">
                                                Xem video giới thiệu
                                            </a>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar Information */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Thông tin cơ bản</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-green-600" />
                                    <span className="text-sm font-medium">Giá khóa học</span>
                                </div>
                                <Badge variant="outline" className="font-semibold">
                                    {course.price ? `${course.price.toLocaleString("vi-VN")}đ` : "Miễn phí"}
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-medium">Thời lượng</span>
                                </div>
                                <span className="text-sm font-semibold">{course.duration} giờ</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-purple-600" />
                                    <span className="text-sm font-medium">ID khóa học</span>
                                </div>
                                <Badge variant="secondary">#{course.id}</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Hoạt động gần đây</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="text-sm">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="font-medium">Khóa học được tạo</span>
                                    </div>
                                    <p className="text-gray-500 text-xs ml-4">
                                        {course.createdAt ? new Date(course.createdAt).toLocaleDateString("vi-VN") : "Không có dữ liệu"}
                                    </p>
                                </div>
                                {course.updatedAt && course.updatedAt !== course.createdAt && (
                                    <div className="text-sm">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <span className="font-medium">Cập nhật lần cuối</span>
                                        </div>
                                        <p className="text-gray-500 text-xs ml-4">
                                            {new Date(course.updatedAt).toLocaleDateString("vi-VN")}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Hành động nhanh</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="outline" size="sm" className="w-full justify-start">
                                <BookOpen className="w-4 h-4 mr-2" />
                                Thêm Module mới
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start">
                                <FileText className="w-4 h-4 mr-2" />
                                Thêm Bài học
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start">
                                <Users className="w-4 h-4 mr-2" />
                                Xem học viên
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}