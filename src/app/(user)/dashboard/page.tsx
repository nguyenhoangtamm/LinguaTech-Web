"use client";

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
import Link from "next/link";
import { routes } from "@/config/routes";
import { useDashboardStatsQuery, useUserEnrollmentsQuery, useRecentCoursesQuery } from "@/queries/useCourse";

export default function UserDashboard() {
    const { data: statsData, isLoading: statsLoading, error: statsError } = useDashboardStatsQuery();
    const { data: enrollmentsData, isLoading: enrollmentsLoading, error: enrollmentsError } = useUserEnrollmentsQuery();

    const stats = statsData?.data;
    const enrollments = enrollmentsData?.data || [];

    // Lấy khóa học đang học (có progress > 0 và < 100)
    const continueCourses = enrollments
        .filter((item: any) => item.enrollment.progress.progressPercentage > 0 && item.enrollment.progress.progressPercentage < 100)
        .map((item: any) => ({
            ...item.course,
            progress: item.enrollment.progress.progressPercentage
        }));

    const { data: recentData, isLoading: recentLoading } = useRecentCoursesQuery();
    const recentCourses = recentData?.data || [];

    if (statsLoading || enrollmentsLoading) {
        return (
            <div className="space-y-8">
                <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Đang tải dashboard...</h2>
                </div>
            </div>
        );
    }

    if (statsError || enrollmentsError) {
        return (
            <div className="space-y-8">
                <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h2>
                    <p className="text-gray-600">Vui lòng thử lại sau</p>
                </div>
            </div>
        );
    }

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
                        {continueCourses.map((course: any) => (
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
                        {stats.achievements.map((achievement: any) => (
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
                        {recentCourses.map((course: any) => (
                            <div key={course.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="aspect-video bg-gray-200 rounded-md mb-3 flex items-center justify-center">
                                    <BookOpen className="w-8 h-8 text-gray-400" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-medium line-clamp-2">{course.title}</h4>
                                    <p className="text-sm text-gray-600">{course.instructor}</p>
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline">{course.category?.name}</Badge>
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