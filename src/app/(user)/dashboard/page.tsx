"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    BookOpen,
    Clock,
    TrendingUp,
    Award,
    Play,
    Calendar,
    Target,
    Users
} from "lucide-react";
import { UserDashboardStats, Course, Enrollment } from "@/types/course";
import Link from "next/link";
import { routes } from "@/config/routes";

// Mock data - thay thế bằng API calls thực tế
const mockStats: UserDashboardStats = {
    totalCourses: 12,
    completedCourses: 4,
    inProgressCourses: 3,
    totalStudyHours: 127,
    streak: 7,
    achievements: [
        {
            id: "1",
            title: "Học viên tích cực",
            description: "Hoàn thành 5 khóa học",
            icon: "🎓",
            unlockedAt: new Date(),
            type: "course_completion"
        },
        {
            id: "2",
            title: "Streak Master",
            description: "Học 7 ngày liên tiếp",
            icon: "🔥",
            unlockedAt: new Date(),
            type: "streak"
        }
    ]
};

const mockContinueCourses: (Course & { progress: number })[] = [
    {
        id: "1",
        title: "React Advanced Patterns",
        description: "Học các pattern nâng cao trong React",
        instructor: "Nguyễn Văn A",
        duration: 40,
        level: "advanced",
        price: 1500000,
        rating: 4.8,
        studentsCount: 234,
        category: { id: "1", name: "Frontend", slug: "frontend" },
        tags: ["React", "JavaScript", "TypeScript"],
        thumbnail: "/images/course1.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: true,
        progress: 65
    },
    {
        id: "2",
        title: "Node.js Backend Development",
        description: "Xây dựng API với Node.js và Express",
        instructor: "Trần Thị B",
        duration: 35,
        level: "intermediate",
        price: 1200000,
        rating: 4.6,
        studentsCount: 189,
        category: { id: "2", name: "Backend", slug: "backend" },
        tags: ["Node.js", "Express", "MongoDB"],
        thumbnail: "/images/course2.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: true,
        progress: 30
    }
];

const mockRecentCourses: Course[] = [
    {
        id: "3",
        title: "UI/UX Design Fundamentals",
        description: "Học thiết kế giao diện người dùng cơ bản",
        instructor: "Lê Văn C",
        duration: 25,
        level: "beginner",
        price: 900000,
        rating: 4.7,
        studentsCount: 145,
        category: { id: "3", name: "Design", slug: "design" },
        tags: ["UI", "UX", "Figma"],
        thumbnail: "/images/course3.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: true
    }
];

export default function UserDashboard() {
    const [stats, setStats] = useState<UserDashboardStats>(mockStats);
    const [continueCourses, setContinueCourses] = useState(mockContinueCourses);
    const [recentCourses, setRecentCourses] = useState(mockRecentCourses);

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600">Chào mừng bạn trở lại! Tiếp tục hành trình học tập của bạn.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href={routes.user.courses}>
                            <BookOpen className="w-4 h-4 mr-2" />
                            Khám phá khóa học
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng khóa học</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalCourses}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.completedCourses} đã hoàn thành
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Giờ học</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalStudyHours}h</div>
                        <p className="text-xs text-muted-foreground">
                            Tổng thời gian học
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Streak</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.streak} ngày</div>
                        <p className="text-xs text-muted-foreground">
                            Liên tiếp học tập
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Thành tích</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.achievements.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Đã đạt được
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Continue Learning */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Play className="w-5 h-5" />
                            Tiếp tục học
                        </CardTitle>
                        <CardDescription>
                            Các khóa học bạn đang theo dõi
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {continueCourses.map((course) => (
                            <div key={course.id} className="border rounded-lg p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h4 className="font-medium">{course.title}</h4>
                                        <p className="text-sm text-gray-600">{course.instructor}</p>
                                    </div>
                                    <Badge variant="secondary">{course.level}</Badge>
                                </div>
                                <div className="space-y-2">
                                    <Progress value={course.progress} className="h-2" />
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>{course.progress}% hoàn thành</span>
                                        <span>{course.duration}h</span>
                                    </div>
                                </div>
                                <Button size="sm" className="w-full mt-3">
                                    Tiếp tục học
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Recent Achievements */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="w-5 h-5" />
                            Thành tích gần đây
                        </CardTitle>
                        <CardDescription>
                            Những thành tích bạn vừa đạt được
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {stats.achievements.map((achievement) => (
                            <div key={achievement.id} className="flex items-center gap-3 p-3 border rounded-lg">
                                <div className="text-2xl">{achievement.icon}</div>
                                <div className="flex-1">
                                    <h4 className="font-medium">{achievement.title}</h4>
                                    <p className="text-sm text-gray-600">{achievement.description}</p>
                                </div>
                                <Badge variant="outline">Mới</Badge>
                            </div>
                        ))}

                        {/* Placeholder for more achievements */}
                        <div className="text-center py-4">
                            <p className="text-gray-500">Tiếp tục học để mở khóa thêm thành tích!</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Courses */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Khóa học mới nhất
                    </CardTitle>
                    <CardDescription>
                        Khám phá những khóa học mới được thêm vào
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {recentCourses.map((course) => (
                            <div key={course.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="aspect-video bg-gray-200 rounded-md mb-3 flex items-center justify-center">
                                    <BookOpen className="w-8 h-8 text-gray-400" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-medium line-clamp-2">{course.title}</h4>
                                    <p className="text-sm text-gray-600">{course.instructor}</p>
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline">{course.category.name}</Badge>
                                        <span className="text-sm font-medium">
                                            {course.price.toLocaleString('vi-VN')}đ
                                        </span>
                                    </div>
                                    <Button size="sm" className="w-full">
                                        Xem chi tiết
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}