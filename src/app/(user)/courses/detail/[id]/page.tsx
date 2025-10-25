"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
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
    Download
} from "lucide-react";
import { Course } from "@/types/course";
import Link from "next/link";
import { routes } from "@/config/routes";

// Mock course data
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

// Mock data aligned with DB layout: Modules -> Lessons -> LessonMaterials -> Materials
const mockMaterials = [
    { id: "m1", fileName: "slides-intro.pdf", fileUrl: "/files/slides-intro.pdf", fileType: "pdf", size: 1200 },
    { id: "m2", fileName: "code-samples.zip", fileUrl: "/files/code-samples.zip", fileType: "zip", size: 20480 },
    { id: "m3", fileName: "reading-advanced.md", fileUrl: "/files/reading-advanced.md", fileType: "md", size: 48 }
];

const mockModules = [
    {
        id: "mod1",
        title: "Phần 1: Cơ sở và pattern",
        order: 1,
        lessons: [
            { id: "l1", title: "Giới thiệu về Advanced Patterns", duration: 45, completed: true, materials: ["m1"] },
            { id: "l2", title: "Custom Hooks và Logic Reuse", duration: 52, completed: true, materials: ["m2"] }
        ]
    },
    {
        id: "mod2",
        title: "Phần 2: Performance và Production",
        order: 2,
        lessons: [
            { id: "l3", title: "Performance Optimization với React.memo", duration: 41, completed: false, materials: ["m3"] },
            { id: "l4", title: "Code Splitting và Lazy Loading", duration: 35, completed: false, materials: [] },
            { id: "l5", title: "Testing Advanced Components", duration: 47, completed: false, materials: [] }
        ]
    }
];

// Flattened list of lessons (for legacy places that expect mockLessons)
const mockLessons = mockModules.flatMap((m) =>
    m.lessons.map((l) => ({ id: l.id, title: l.title, duration: l.duration, completed: l.completed }))
);

const mockCourseMaterials = [
    { id: "cm1", courseId: "1", materialId: "m2" },
    { id: "cm2", courseId: "1", materialId: "m1" }
];

const mockCourseType = { id: "ct1", name: "Professional" };

const mockReviews = [
    {
        id: "1",
        userName: "Trần Văn B",
        avatar: "TB",
        rating: 5,
        comment: "Khóa học rất hay, giảng viên giải thích rõ ràng và có nhiều ví dụ thực tế. Đáng tiền!",
        date: "2 ngày trước"
    },
    {
        id: "2",
        userName: "Lê Thị C",
        avatar: "LC",
        rating: 4,
        comment: "Nội dung chất lượng, tuy nhiên một số phần hơi khó hiểu với người mới bắt đầu.",
        date: "1 tuần trước"
    },
    {
        id: "3",
        userName: "Phạm Minh D",
        avatar: "PD",
        rating: 5,
        comment: "Excellent course! Đã áp dụng được nhiều kỹ thuật vào dự án thực tế.",
        date: "2 tuần trước"
    }
];

const mockInstructor = {
    name: "Nguyễn Văn A",
    avatar: "NA",
    title: "Senior Frontend Developer",
    company: "TechCorp",
    experience: "5+ năm",
    students: 1250,
    courses: 8,
    rating: 4.9,
    bio: "Senior Frontend Developer với hơn 5 năm kinh nghiệm phát triển ứng dụng web với React, Vue.js và Angular. Đã tham gia nhiều dự án lớn tại các công ty công nghệ hàng đầu."
};

export default function CourseDetailPage() {
    const params = useParams();
    const courseId = params.id as string;

    const [course, setCourse] = useState<Course | null>(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [progress, setProgress] = useState(25); // Mock progress

    useEffect(() => {
        // Mock API call to fetch course details
        if (courseId) {
            setCourse(mockCourse);
            // Mock check if user is enrolled
            setIsEnrolled(Math.random() > 0.5);
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

    const completedLessons = mockLessons.filter(lesson => lesson.completed).length;
    const totalLessons = mockLessons.length;

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Button variant="ghost" size="sm" className="w-fit" asChild>
                <Link href={routes.user.courses}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại danh sách khóa học
                </Link>
            </Button>

            {/* Course Header */}
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Card>
                        <CardContent className="p-0">
                            {/* Course Thumbnail Image */}
                            <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden relative group">
                                <Image
                                    src={course.thumbnail || "/images/course-placeholder.jpg"}
                                    alt={course.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>

                            <div className="p-6">
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <Badge variant="outline">{course.category.name}</Badge>
                                    <Badge variant="secondary">
                                        {course.level === "beginner" ? "Cơ bản" :
                                            course.level === "intermediate" ? "Trung cấp" : "Nâng cao"}
                                    </Badge>
                                    {/* Course Type from DB */}
                                    <Badge variant="default">{mockCourseType.name}</Badge>
                                </div>

                                <h1 className="text-2xl font-bold text-gray-900 mb-3">{course.title}</h1>
                                <p className="text-gray-600 mb-4">{course.description}</p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {course.tags.map(tag => (
                                        <Link
                                            key={tag}
                                            href={`${routes.user.coursesByTag}?tag=${encodeURIComponent(tag)}`}
                                        >
                                            <Badge variant="secondary" className="hover:bg-gray-300 cursor-pointer">
                                                #{tag}
                                            </Badge>
                                        </Link>
                                    ))}
                                </div>

                                <div className="flex items-center gap-6 text-sm text-gray-600">
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
                        </CardContent>
                    </Card>
                </div>

                {/* Enrollment Card */}
                <div>
                    <Card className="sticky top-4">
                        <CardContent className="p-6">
                            <div className="text-center mb-6">
                                <div className="text-3xl font-bold text-blue-600 mb-2">
                                    {course.price.toLocaleString('vi-VN')}đ
                                </div>
                                <p className="text-gray-600">Trọn đời</p>
                            </div>

                            {isEnrolled ? (
                                <div className="space-y-4">
                                    <div className="text-center">
                                        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                        <p className="font-medium text-green-700">Đã đăng ký</p>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Tiến độ</span>
                                            <span>{progress}%</span>
                                        </div>
                                        <Progress value={progress} className="h-2" />
                                        <p className="text-sm text-gray-600 mt-1">
                                            {completedLessons}/{totalLessons} bài học
                                        </p>
                                    </div>

                                    <Button className="w-full" size="lg">
                                        <Play className="w-4 h-4 mr-2" />
                                        Tiếp tục học
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <Button className="w-full" size="lg">
                                        Đăng ký ngay
                                    </Button>
                                    <Button variant="outline" className="w-full">
                                        <Heart className="w-4 h-4 mr-2" />
                                        Yêu thích
                                    </Button>
                                </div>
                            )}

                            <div className="flex gap-2 mt-4">
                                <Button variant="outline" size="sm" className="flex-1">
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Chia sẻ
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1">
                                    <Download className="w-4 h-4 mr-2" />
                                    Tải về
                                </Button>
                            </div>

                            {/* Course includes */}
                            <div className="border-t pt-4 mt-6">
                                <h4 className="font-medium mb-3">Khóa học bao gồm:</h4>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span>{course.duration} giờ video</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span>{totalLessons} bài học</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span>Tài liệu tham khảo</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span>Truy cập trọn đời</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span>Chứng chỉ hoàn thành</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Course Overview Summary */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Basic Course Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tổng quan khóa học</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-medium mb-2">Mô tả</h4>
                                <p className="text-gray-700 text-sm">{course.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">Cấp độ:</span>
                                    <p className="font-medium">
                                        {course.level === "beginner" ? "Cơ bản" :
                                            course.level === "intermediate" ? "Trung cấp" : "Nâng cao"}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-600">Thời lượng:</span>
                                    <p className="font-medium">{course.duration} giờ</p>
                                </div>
                                <div>
                                    <span className="text-gray-600">Học viên:</span>
                                    <p className="font-medium">{course.studentsCount} người</p>
                                </div>
                                <div>
                                    <span className="text-gray-600">Đánh giá:</span>
                                    <p className="font-medium flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        {course.rating}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-medium">Nội dung khóa học</h4>
                                    <span className="text-sm text-gray-600">{mockModules.length} phần</span>
                                </div>
                                <div className="space-y-2">
                                    {mockModules.map((mod, index) => (
                                        <div key={mod.id} className="flex justify-between items-center text-sm">
                                            <span className="text-gray-700">{mod.title}</span>
                                            <span className="text-gray-500">{mod.lessons.length} bài</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Instructor Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Giảng viên</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold">
                                {mockInstructor.avatar}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold">{mockInstructor.name}</h3>
                                <p className="text-gray-600 text-sm mb-2">{mockInstructor.title}</p>

                                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                    <div>
                                        <span className="font-medium text-gray-900">{mockInstructor.students}</span> học viên
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-900">{mockInstructor.courses}</span> khóa học
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-700 text-sm mt-4">{mockInstructor.bio}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <Button size="lg" asChild>
                    <Link href={`/courses/detail/${courseId}/learn`}>
                        <BookOpen className="w-4 h-4 mr-2" />
                        Xem chi tiết khóa học
                    </Link>
                </Button>
                <Button variant="outline" size="lg">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Xem đánh giá
                </Button>
            </div>
        </div>
    );
}