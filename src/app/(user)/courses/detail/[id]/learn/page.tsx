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
import { Course } from "@/types/course";
import Link from "next/link";
import { routes } from "@/config/routes";

// Mock data - same as overview page but with more detail
const mockCourse: Course = {
    id: "1",
    title: "React Advanced Patterns và Performance Optimization",
    description: "Khóa học chuyên sâu về React với các pattern nâng cao và kỹ thuật tối ưu hóa hiệu suất. Bạn sẽ học cách xây dựng ứng dụng React có hiệu suất cao, dễ maintain và scalable.",
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
};

const mockMaterials = [
    { id: "m1", fileName: "slides-intro.pdf", fileUrl: "/files/slides-intro.pdf", fileType: "pdf", size: 1200 },
    { id: "m2", fileName: "code-samples.zip", fileUrl: "/files/code-samples.zip", fileType: "zip", size: 20480 },
    { id: "m3", fileName: "reading-advanced.md", fileUrl: "/files/reading-advanced.md", fileType: "md", size: 48 },
    { id: "m4", fileName: "final-project.zip", fileUrl: "/files/final-project.zip", fileType: "zip", size: 15360 }
];

const mockModules = [
    {
        id: "mod1",
        title: "Phần 1: Cơ sở và pattern",
        order: 1,
        description: "Tìm hiểu về các pattern cơ bản và nâng cao trong React",
        lessons: [
            { id: "l1", title: "Giới thiệu về Advanced Patterns", duration: 45, completed: true, materials: ["m1"], contentType: "reading" },
            { id: "l2", title: "Custom Hooks và Logic Reuse", duration: 52, completed: true, materials: ["m2"], contentType: "reading" },
            { id: "l3", title: "Context API và Provider Pattern", duration: 38, completed: false, materials: [], contentType: "reading" }
        ]
    },
    {
        id: "mod2",
        title: "Phần 2: Performance và Production",
        order: 2,
        description: "Tối ưu hóa hiệu suất và triển khai ứng dụng React",
        lessons: [
            { id: "l4", title: "Performance Optimization với React.memo", duration: 41, completed: false, materials: ["m3"], contentType: "reading" },
            { id: "l5", title: "Code Splitting và Lazy Loading", duration: 35, completed: false, materials: [], contentType: "reading" },
            { id: "l6", title: "Testing Advanced Components", duration: 47, completed: false, materials: [], contentType: "reading" },
            { id: "l7", title: "Production Deployment Best Practices", duration: 33, completed: false, materials: ["m4"], contentType: "reading" }
        ]
    }
];

const mockCourseMaterials = [
    { id: "cm1", courseId: "1", materialId: "m2", title: "Source Code Repository" },
    { id: "cm2", courseId: "1", materialId: "m1", title: "Course Slides" },
    { id: "cm3", courseId: "1", materialId: "m4", title: "Final Project Template" }
];

const mockCourseType = { id: "ct1", name: "Professional" };

const mockReviews = [
    {
        id: "1",
        userName: "Trần Văn B",
        avatar: "TB",
        rating: 5,
        comment: "Khóa học rất hay, giảng viên giải thích rõ ràng và có nhiều ví dụ thực tế. Đáng tiền!",
        date: "2 ngày trước",
        helpful: 12
    },
    {
        id: "2",
        userName: "Lê Thị C",
        avatar: "LC",
        rating: 4,
        comment: "Nội dung chất lượng, tuy nhiên một số phần hơi khó hiểu với người mới bắt đầu.",
        date: "1 tuần trước",
        helpful: 8
    },
    {
        id: "3",
        userName: "Phạm Minh D",
        avatar: "PD",
        rating: 5,
        comment: "Excellent course! Đã áp dụng được nhiều kỹ thuật vào dự án thực tế.",
        date: "2 tuần trước",
        helpful: 15
    }
];

const mockFAQs = [
    {
        id: "1",
        question: "Tôi có thể truy cập khóa học bao lâu?",
        answer: "Bạn có thể truy cập khóa học trọn đời sau khi đăng ký. Không có giới hạn thời gian."
    },
    {
        id: "2",
        question: "Có chứng chỉ sau khi hoàn thành không?",
        answer: "Có, bạn sẽ nhận được chứng chỉ hoàn thành sau khi hoàn thành tất cả bài học và bài tập."
    },
    {
        id: "3",
        question: "Tôi có thể hoàn tiền không?",
        answer: "Có, chúng tôi có chính sách hoàn tiền 100% trong 30 ngày đầu tiên nếu bạn không hài lòng."
    },
    {
        id: "4",
        question: "Khóa học có hỗ trợ tiếng Việt không?",
        answer: "Có, tất cả nội dung khóa học đều được dịch và thuyết minh bằng tiếng Việt."
    }
];

export default function CourseLearnPage() {
    const params = useParams();
    const courseId = params.id as string;

    const [course, setCourse] = useState<Course | null>(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [progress, setProgress] = useState(25);

    useEffect(() => {
        if (courseId) {
            setCourse(mockCourse);
            setIsEnrolled(Math.random() > 0.3);
        }
    }, [courseId]);

    if (!course) {
        return (
            <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Đang tải khóa học...</h2>
            </div>
        );
    }

    const allLessons = mockModules.flatMap(m => m.lessons);
    const completedLessons = allLessons.filter(lesson => lesson.completed).length;
    const totalLessons = allLessons.length;

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
                        <TabsList className="grid w-full grid-cols-6">
                            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                            <TabsTrigger value="curriculum">Mục lục</TabsTrigger>
                            <TabsTrigger value="materials">Tài liệu</TabsTrigger>
                            <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
                            <TabsTrigger value="discussions">Thảo luận</TabsTrigger>
                            <TabsTrigger value="faq">FAQ</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="mt-6">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Mô tả khóa học</h3>
                                    <p className="text-gray-700 leading-relaxed">{course.description}</p>
                                </div>

                                <div>
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
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="curriculum" className="mt-6">
                            <h3 className="text-lg font-semibold mb-4">Mục lục khóa học</h3>
                            <div className="space-y-4">
                                {mockModules.map((mod, mIndex) => (
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
                                                {mod.lessons.length} bài • {mod.lessons.reduce((s, l) => s + l.duration, 0)} phút
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            {mod.lessons.map((lesson, lIndex) => (
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
                                                            {isEnrolled ? (
                                                                <Link href={`/courses/detail/${courseId}/lessons/${lesson.id}`}>
                                                                    <Button size="sm" variant={lesson.completed ? "outline" : "default"}>
                                                                        {lesson.completed ? "Xem lại" : "Học ngay"}
                                                                    </Button>
                                                                </Link>
                                                            ) : (
                                                                <Button size="sm" disabled>
                                                                    Đăng ký để học
                                                                </Button>
                                                            )}
                                                            {lesson.completed && (
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
                                {mockCourseMaterials.map(cm => {
                                    const mat = mockMaterials.find(m => m.id === cm.materialId);
                                    if (!mat) return null;
                                    return (
                                        <div key={cm.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-8 h-8 text-blue-500" />
                                                <div>
                                                    <p className="font-medium">{cm.title}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {mat.fileType.toUpperCase()} • {Math.round(mat.size / 1024)} KB
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm">
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Tải xuống
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
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
                                    {mockReviews.map(review => (
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
                                                        <span>{review.helpful} người thấy hữu ích</span>
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

                        <TabsContent value="discussions" className="mt-6">
                            <div className="text-center py-12">
                                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Khu vực thảo luận</h3>
                                <p className="text-gray-600 mb-4">Tham gia thảo luận với giảng viên và học viên khác</p>
                                <Button>Bắt đầu thảo luận</Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="faq" className="mt-6">
                            <h3 className="text-lg font-semibold mb-4">Câu hỏi thường gặp</h3>
                            <div className="space-y-4">
                                {mockFAQs.map(faq => (
                                    <div key={faq.id} className="border rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-medium mb-2">{faq.question}</h4>
                                                <p className="text-gray-700">{faq.answer}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}