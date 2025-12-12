"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    BookOpen,
    ArrowLeft,
    Star,
    Clock,
    Users,
    Play,
    CheckCircle,
    Award,
    MessageCircle,
    Share2,
    Heart,
    Download,
    FileText,
    HelpCircle
} from "lucide-react";
import Link from "next/link";
import { routes } from "@/config/routes";
import { useCourseDetailQuery } from "@/queries/useCourse";
import { Course } from "@/types/course";



export default function CourseLearnPage() {
    const params = useParams();
    const courseIdParam = params.courseId as string | undefined;

    const courseId = Number(courseIdParam);

    const [isEnrolled, setIsEnrolled] = useState(false);
    const [progress, setProgress] = useState(25);

    // API queries
    const { data: courseDetail, isLoading: courseLoading, error: courseError } = useCourseDetailQuery(courseId);

    useEffect(() => {
        if (courseDetail?.data?.course) {
            setIsEnrolled(Math.random() > 0.3);
        }
    }, [courseDetail]);

    if (!courseIdParam) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">Không tìm thấy courseId trong đường dẫn</p>
            </div>
        );
    }

    if (courseLoading) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-4 text-gray-600">Đang tải khóa học...</p>
            </div>
        );
    }

    if (courseError || !courseDetail) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">Không thể tải thông tin khóa học</p>
            </div>
        );
    }

    const { course, modules, materials, reviews, faqs, instructor } = courseDetail.data;

    // Calculate progress from modules/lessons
    const totalLessons = modules.reduce((acc: number, module: any) =>
        acc + (module.lessons?.length || 0), 0);
    const completedLessons = modules.reduce((acc: number, module: any) =>
        acc + (module.lessons?.filter((lesson: any) => lesson.isCompleted).length || 0), 0);

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <Link href={routes.user.courses} className="hover:text-gray-900">
                    Khóa học
                </Link>
                <span>/</span>
                <Link href={`/courses/detail/${courseId}`} className="hover:text-gray-900">
                    {course.title}
                </Link>
                <span>/</span>
                <span className="text-gray-900">Chi tiết khóa học</span>
            </div>

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="font-medium">{course.rating}</span>
                            <span>({course.studentsCount} đánh giá)</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{course.duration} giờ</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{course.studentsCount} học viên</span>
                        </div>
                    </div>
                </div>
                <Button variant="outline" asChild>
                    <Link href={`/courses/detail/${courseId}`}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Quay lại tổng quan
                    </Link>
                </Button>
            </div>

            {/* Progress Bar (if enrolled) */}
            {isEnrolled && (
                <Card>
                    <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Tiến độ học tập</span>
                            <span className="text-sm text-gray-600">{completedLessons}/{totalLessons} bài học</span>
                        </div>
                        <Progress value={(completedLessons / totalLessons) * 100} className="h-2" />
                    </CardContent>
                </Card>
            )}

            {/* Main Content Tabs */}
            <Card>
                <CardContent className="p-6">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                            <TabsTrigger value="curriculum">Mục lục</TabsTrigger>
                            <TabsTrigger value="materials">Tài liệu</TabsTrigger>
                            <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
                            <TabsTrigger value="faq">FAQ</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="mt-6">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Mô tả khóa học</h3>
                                    <p className="text-gray-700 leading-relaxed">{course.description}</p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Chi tiết khóa học</h3>
                                    <div
                                        className="prose max-w-none text-gray-700 break-words"
                                        dangerouslySetInnerHTML={{
                                            __html: course.detailedDescription || "<p class='text-gray-500'>Chưa có mô tả chi tiết.</p>"
                                        }}
                                    />
                                </div>

                                {/* <div>
                                    <h3 className="text-lg font-semibold mb-3">Bạn sẽ học được gì?</h3>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>Nắm vững các advanced patterns trong React</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>Tối ưu hóa hiệu suất ứng dụng React</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>Xây dựng ứng dụng scalable và maintainable</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>Testing và deployment best practices</span>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Yêu cầu</h3>
                                    <ul className="space-y-2 text-gray-700">
                                        <li>• Kiến thức cơ bản về React và JavaScript</li>
                                        <li>• Hiểu biết về ES6+ features</li>
                                        <li>• Có kinh nghiệm xây dựng ứng dụng web</li>
                                    </ul>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-medium mb-3">Thông tin khóa học</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Cấp độ:</span>
                                                <span className="font-medium">Nâng cao</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Thời lượng đọc:</span>
                                                <span className="font-medium">{course.duration} giờ</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Bài học:</span>
                                                <span className="font-medium">{totalLessons} bài</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Định dạng:</span>
                                                <span className="font-medium">Văn bản + Thực hành</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-medium mb-3">Chứng chỉ</h4>
                                        <div className="p-4 border rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Award className="w-5 h-5 text-yellow-500" />
                                                <span className="font-medium">Chứng chỉ hoàn thành</span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Nhận chứng chỉ sau khi hoàn thành 100% khóa học
                                            </p>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        </TabsContent>

                        <TabsContent value="curriculum" className="mt-6">
                            <h3 className="text-lg font-semibold mb-4">Mục lục khóa học</h3>
                            <div className="space-y-4">
                                {modules.map((mod: any, mIndex: number) => (
                                    <div key={mod.id} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-600">
                                                    {mIndex + 1}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{mod.title}</p>
                                                    <p className="text-sm text-gray-600">{mod.description}</p>
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {(mod.lessons?.length || 0)} bài • {(mod.lessons?.reduce((s: number, l: any) => s + l.duration, 0) || 0)} phút
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            {mod.lessons?.map((lesson: any, lIndex: number) => (
                                                <div key={lesson.id} className="p-3 border rounded-lg hover:bg-gray-50">
                                                    <div className="flex items-center justify-between gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-xs font-medium">
                                                                {mIndex + 1}.{lIndex + 1}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <FileText className="w-4 h-4 text-gray-400" />
                                                                <span className="font-medium">{lesson.title}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-sm text-gray-600">{lesson.duration} phút</span>
                                                            {/* {isEnrolled ? (
                                                                <Link href={`/courses/detail/${courseId}/lessons/${lesson.id}`}>
                                                                    <Button size="sm" variant={lesson.isCompleted ? "outline" : "default"}>
                                                                        {lesson.isCompleted ? "Xem lại" : "Học ngay"}
                                                                    </Button>
                                                                </Link>
                                                            ) : (
                                                                <Button size="sm" disabled>
                                                                    Đăng ký để học
                                                                </Button>
                                                            )} */}
                                                            <Link href={`/courses/detail/${courseId}/lessons/${lesson.id}`}>
                                                                <Button size="sm" variant={lesson.isCompleted ? "outline" : "default"}>
                                                                    {lesson.isCompleted ? "Xem lại" : "Học ngay"}
                                                                </Button>
                                                            </Link>
                                                            {lesson.isCompleted && (
                                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="materials" className="mt-6">
                            <h3 className="text-lg font-semibold mb-4">Tài liệu khóa học</h3>
                            <div className="grid gap-4">
                                {materials.map((mat: any) => (
                                    <div key={mat.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-8 h-8 text-blue-500" />
                                            <div>
                                                <p className="font-medium">{mat.fileName}</p>
                                                <p className="text-sm text-gray-600">
                                                    {mat.fileType.toUpperCase()} • {Math.round(mat.size / 1024)} KB
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    const link = document.createElement('a');
                                                    link.href = mat.fileUrl;
                                                    link.download = mat.fileName;
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    document.body.removeChild(link);
                                                }}
                                            >
                                                <Download className="w-4 h-4 mr-2" />
                                                Tải xuống
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="reviews" className="mt-6">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">Đánh giá từ học viên</h3>
                                    <div className="flex items-center gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold">{course.rating}</div>
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < Math.floor(course.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-sm text-gray-600">{course.studentsCount} đánh giá</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {reviews.map((review: any) => (
                                        <div key={review.id} className="border-b pb-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                                                    {review.avatar}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-medium">{review.userName}</span>
                                                        <div className="flex items-center">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-sm text-gray-500">{review.date}</span>
                                                    </div>
                                                    <p className="text-gray-700 mb-2">{review.comment}</p>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                                        <span>{review.helpful || 0} người thấy hữu ích</span>
                                                        <Button variant="ghost" size="sm">
                                                            Hữu ích
                                                        </Button>
                                                        <Button variant="ghost" size="sm">
                                                            Trả lời
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="faq" className="mt-6">
                            <h3 className="text-lg font-semibold mb-4">Câu hỏi thường gặp</h3>
                            <div className="space-y-4">
                                {faqs?.map((faq: any) => (
                                    <div key={faq.id} className="border rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-medium mb-2">{faq.question}</h4>
                                                <p className="text-gray-700">{faq.answer}</p>
                                            </div>
                                        </div>
                                    </div>
                                )) || <p className="text-gray-600">Chưa có câu hỏi nào.</p>}
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}