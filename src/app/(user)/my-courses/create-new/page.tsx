"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    ArrowLeft,
    Upload,
    Loader2,
    Plus,
    X,
    Video,
    FileText,
    BookOpen,
    Edit,
    Trash2,
    GripVertical,
    Play,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import Link from "next/link";
import { routes } from "@/config/routes";
import { toast } from "@/hooks/use-toast";

interface LessonData {
    id: string;
    title: string;
    description: string;
    duration: number;
    videoUrl?: string;
    order: number;
}

interface ModuleData {
    id: string;
    title: string;
    description: string;
    order: number;
    lessons: LessonData[];
}

interface CourseFormData {
    title: string;
    description: string;
    instructor: string;
    categoryId: string;
    courseTypeId: string;
    level: number;
    price: number | "";
    duration: number | "";
    thumbnail: File | null;
    thumbnailPreview: string;
    videoUrl: string;
    isPublished: boolean;
    tags: string[];
    modules: ModuleData[];
}

const courseCategories = [
    { id: "1", name: "Frontend Development", icon: "💻" },
    { id: "2", name: "Backend Development", icon: "⚙️" },
    { id: "3", name: "Full Stack", icon: "🌐" },
    { id: "4", name: "Mobile Development", icon: "📱" },
    { id: "5", name: "UI/UX Design", icon: "🎨" },
    { id: "6", name: "Data Science", icon: "📊" },
    { id: "7", name: "DevOps", icon: "🚀" },
    { id: "8", name: "Other", icon: "📚" },
];

const courseTypes = [
    { id: "1", name: "Khóa học trực tuyến", description: "Học tự do theo thời gian" },
    { id: "2", name: "Khóa học trực tiếp", description: "Có giảng viên hướng dẫn trực tiếp" },
    { id: "3", name: "Khóa học kết hợp", description: "Kết hợp trực tuyến và trực tiếp" },
];

const courseLevels = [
    { value: 1, label: "Cơ bản - Dành cho người mới bắt đầu" },
    { value: 2, label: "Trung bình - Có kinh nghiệm cơ bản" },
    { value: 3, label: "Nâng cao - Có kinh nghiệm sâu" },
];

const availableTags = [
    "JavaScript", "Python", "React", "Node.js", "TypeScript",
    "Vue.js", "Angular", "PHP", "Java", "C#", "Flutter",
    "React Native", "Machine Learning", "AI", "DevOps",
    "Docker", "Kubernetes", "AWS", "Azure", "UI/UX"
];

export default function CreateCoursePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

    const [formData, setFormData] = useState<CourseFormData>({
        title: "",
        description: "",
        instructor: "",
        categoryId: "",
        courseTypeId: "",
        level: 1,
        price: "",
        duration: "",
        thumbnail: null,
        thumbnailPreview: "/images/course-placeholder.jpg",
        videoUrl: "",
        isPublished: false,
        tags: [],
        modules: [],
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "price" || name === "duration" ? (value ? Number(value) : "") : value,
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: name === "level" ? Number(value) : value,
        }));
    };

    const handleTagToggle = (tag: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag]
        }));
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                toast({
                    title: "Lỗi",
                    description: "Vui lòng chọn một tệp hình ảnh",
                    variant: "destructive",
                });
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: "Lỗi",
                    description: "Kích thước hình ảnh không được vượt quá 5MB",
                    variant: "destructive",
                });
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    thumbnail: file,
                    thumbnailPreview: reader.result as string,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const addModule = () => {
        const newModule: ModuleData = {
            id: Date.now().toString(),
            title: "",
            description: "",
            order: formData.modules.length + 1,
            lessons: []
        };
        setFormData(prev => ({
            ...prev,
            modules: [...prev.modules, newModule]
        }));
        setExpandedModules(prev => ({
            ...prev,
            [newModule.id]: true
        }));
    };

    const updateModule = (moduleId: string, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            modules: prev.modules.map(module =>
                module.id === moduleId ? { ...module, [field]: value } : module
            )
        }));
    };

    const deleteModule = (moduleId: string) => {
        setFormData(prev => ({
            ...prev,
            modules: prev.modules.filter(module => module.id !== moduleId)
        }));
        setExpandedModules(prev => {
            const newState = { ...prev };
            delete newState[moduleId];
            return newState;
        });
    };

    const addLesson = (moduleId: string) => {
        const newLesson: LessonData = {
            id: Date.now().toString(),
            title: "",
            description: "",
            duration: 0,
            videoUrl: "",
            order: 1
        };

        setFormData(prev => ({
            ...prev,
            modules: prev.modules.map(module => {
                if (module.id === moduleId) {
                    return {
                        ...module,
                        lessons: [...module.lessons, { ...newLesson, order: module.lessons.length + 1 }]
                    };
                }
                return module;
            })
        }));
    };

    const updateLesson = (moduleId: string, lessonId: string, field: string, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            modules: prev.modules.map(module => {
                if (module.id === moduleId) {
                    return {
                        ...module,
                        lessons: module.lessons.map(lesson =>
                            lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
                        )
                    };
                }
                return module;
            })
        }));
    };

    const deleteLesson = (moduleId: string, lessonId: string) => {
        setFormData(prev => ({
            ...prev,
            modules: prev.modules.map(module => {
                if (module.id === moduleId) {
                    return {
                        ...module,
                        lessons: module.lessons.filter(lesson => lesson.id !== lessonId)
                    };
                }
                return module;
            })
        }));
    };

    const toggleModuleExpanded = (moduleId: string) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
    };

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                if (!formData.title.trim()) {
                    toast({
                        title: "Lỗi",
                        description: "Vui lòng nhập tiêu đề khóa học",
                        variant: "destructive",
                    });
                    return false;
                }
                if (!formData.description.trim()) {
                    toast({
                        title: "Lỗi",
                        description: "Vui lòng nhập mô tả khóa học",
                        variant: "destructive",
                    });
                    return false;
                }
                if (!formData.instructor.trim()) {
                    toast({
                        title: "Lỗi",
                        description: "Vui lòng nhập tên giảng viên",
                        variant: "destructive",
                    });
                    return false;
                }
                break;
            case 2:
                if (!formData.categoryId) {
                    toast({
                        title: "Lỗi",
                        description: "Vui lòng chọn danh mục khóa học",
                        variant: "destructive",
                    });
                    return false;
                }
                if (!formData.courseTypeId) {
                    toast({
                        title: "Lỗi",
                        description: "Vui lòng chọn loại khóa học",
                        variant: "destructive",
                    });
                    return false;
                }
                if (formData.price === "" || Number(formData.price) < 0) {
                    toast({
                        title: "Lỗi",
                        description: "Vui lòng nhập giá khóa học hợp lệ",
                        variant: "destructive",
                    });
                    return false;
                }
                break;
            case 3:
                if (formData.modules.length === 0) {
                    toast({
                        title: "Lỗi",
                        description: "Vui lòng thêm ít nhất một module cho khóa học",
                        variant: "destructive",
                    });
                    return false;
                }
                for (const moduleItem of formData.modules) {
                    if (!moduleItem.title.trim()) {
                        toast({
                            title: "Lỗi",
                            description: "Vui lòng nhập tiêu đề cho tất cả các module",
                            variant: "destructive",
                        });
                        return false;
                    }
                }
                break;
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 4));
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateStep(currentStep)) {
            return;
        }

        setLoading(true);

        try {
            // Calculate total duration from modules
            const totalDuration = formData.modules.reduce((total, module) => {
                return total + module.lessons.reduce((lessonTotal, lesson) => lessonTotal + lesson.duration, 0);
            }, 0);

            const courseData = {
                ...formData,
                duration: totalDuration || formData.duration
            };

            console.log("Course data to submit:", courseData);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            toast({
                title: "Thành công",
                description: "Khóa học đã được tạo thành công",
                variant: "success",
            });

            router.push(routes.teacher.myCourses);
        } catch (error) {
            toast({
                title: "Lỗi",
                description: "Có lỗi xảy ra khi tạo khóa học. Vui lòng thử lại.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { number: 1, title: "Thông tin cơ bản", description: "Tiêu đề, mô tả, giảng viên" },
        { number: 2, title: "Chi tiết khóa học", description: "Danh mục, giá, cấp độ" },
        { number: 3, title: "Nội dung khóa học", description: "Module và bài học" },
        { number: 4, title: "Xem lại & Hoàn tất", description: "Kiểm tra và xuất bản" }
    ];

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href={routes.teacher.myCourses}
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại danh sách khóa học
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Tạo khóa học mới</h1>
                <p className="text-gray-600">
                    Chia sẻ kiến thức của bạn với hàng ngàn học viên
                </p>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <div key={step.number} className={`flex items-center ${index < steps.length - 1 ? "flex-1" : ""}`}>
                            <div className="flex items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= step.number
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 text-gray-600"
                                        }`}
                                >
                                    {step.number}
                                </div>
                                <div className="ml-3">
                                    <p className={`text-sm font-medium ${currentStep >= step.number ? "text-blue-600" : "text-gray-500"
                                        }`}>
                                        {step.title}
                                    </p>
                                    <p className="text-xs text-gray-400">{step.description}</p>
                                </div>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-4 ${currentStep > step.number ? "bg-blue-600" : "bg-gray-200"
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <FileText className="w-5 h-5 mr-2" />
                                Thông tin cơ bản
                            </CardTitle>
                            <CardDescription>
                                Nhập thông tin cơ bản về khóa học của bạn
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Tiêu đề khóa học *</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Ví dụ: Lập trình React từ cơ bản đến nâng cao"
                                    className="text-lg"
                                    required
                                />
                                <p className="text-sm text-gray-500">
                                    Tiêu đề hấp dẫn sẽ thu hút nhiều học viên hơn
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Mô tả khóa học *</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Mô tả chi tiết về nội dung, mục tiêu và đối tượng của khóa học..."
                                    rows={5}
                                    required
                                />
                                <p className="text-sm text-gray-500">
                                    Mô tả chi tiết giúp học viên hiểu rõ hơn về khóa học
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="instructor">Tên giảng viên *</Label>
                                <Input
                                    id="instructor"
                                    name="instructor"
                                    value={formData.instructor}
                                    onChange={handleInputChange}
                                    placeholder="Tên của bạn hoặc tên giảng viên"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="videoUrl">Video giới thiệu khóa học</Label>
                                <Input
                                    id="videoUrl"
                                    name="videoUrl"
                                    value={formData.videoUrl}
                                    onChange={handleInputChange}
                                    placeholder="https://youtube.com/watch?v=..."
                                />
                                <p className="text-sm text-gray-500">
                                    Video giới thiệu sẽ giúp học viên hiểu rõ hơn về khóa học
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 2: Course Details */}
                {currentStep === 2 && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <BookOpen className="w-5 h-5 mr-2" />
                                    Chi tiết khóa học
                                </CardTitle>
                                <CardDescription>
                                    Cấu hình thông tin chi tiết cho khóa học
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Danh mục *</Label>
                                        <Select
                                            value={formData.categoryId}
                                            onValueChange={(value) => handleSelectChange("categoryId", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn danh mục" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {courseCategories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        <div className="flex items-center">
                                                            <span className="mr-2">{category.icon}</span>
                                                            {category.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Loại khóa học *</Label>
                                        <Select
                                            value={formData.courseTypeId}
                                            onValueChange={(value) => handleSelectChange("courseTypeId", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn loại khóa học" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {courseTypes.map((type) => (
                                                    <SelectItem key={type.id} value={type.id}>
                                                        <div>
                                                            <div className="font-medium">{type.name}</div>
                                                            <div className="text-sm text-gray-500">{type.description}</div>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label>Cấp độ *</Label>
                                        <Select
                                            value={formData.level.toString()}
                                            onValueChange={(value) => handleSelectChange("level", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn cấp độ" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {courseLevels.map((level) => (
                                                    <SelectItem key={level.value} value={level.value.toString()}>
                                                        {level.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="price">Giá (VNĐ) *</Label>
                                        <Input
                                            id="price"
                                            name="price"
                                            type="number"
                                            min="0"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            placeholder="0"
                                            required
                                        />
                                        <p className="text-sm text-gray-500">Nhập 0 nếu khóa học miễn phí</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="duration">Thời lượng dự kiến (giờ)</Label>
                                        <Input
                                            id="duration"
                                            name="duration"
                                            type="number"
                                            min="0"
                                            value={formData.duration}
                                            onChange={handleInputChange}
                                            placeholder="Sẽ tự tính từ các bài học"
                                        />
                                        <p className="text-sm text-gray-500">
                                            Sẽ tự động tính từ tổng thời gian các bài học
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tags */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Thẻ từ khóa</CardTitle>
                                <CardDescription>
                                    Chọn các từ khóa liên quan để học viên dễ tìm thấy khóa học
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {availableTags.map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant={formData.tags.includes(tag) ? "default" : "outline"}
                                            className="cursor-pointer"
                                            onClick={() => handleTagToggle(tag)}
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                                {formData.tags.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-600 mb-2">Đã chọn:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.tags.map((tag) => (
                                                <Badge key={tag} variant="default">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Thumbnail */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Hình ảnh khóa học</CardTitle>
                                <CardDescription>
                                    Tải lên hình ảnh đại diện cho khóa học
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-start space-x-6">
                                    <div className="flex-shrink-0">
                                        <div className="w-48 h-32 rounded-lg overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={formData.thumbnailPreview}
                                                alt="Thumbnail preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="thumbnail" className="cursor-pointer">
                                            <div className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                                                <Upload className="w-4 h-4" />
                                                <span>Chọn hình ảnh</span>
                                            </div>
                                        </Label>
                                        <Input
                                            id="thumbnail"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleThumbnailChange}
                                        />
                                        <p className="text-sm text-gray-500 mt-2">
                                            Kích thước khuyến nghị: 1280x720px, tối đa 5MB
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Step 3: Course Content */}
                {currentStep === 3 && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center">
                                        <BookOpen className="w-5 h-5 mr-2" />
                                        Nội dung khóa học
                                    </CardTitle>
                                    <CardDescription>
                                        Tạo các module và bài học cho khóa học
                                    </CardDescription>
                                </div>
                                <Button type="button" onClick={addModule} variant="outline">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Thêm Module
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.modules.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                                    <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Chưa có module nào
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        Bắt đầu bằng cách thêm module đầu tiên cho khóa học
                                    </p>
                                    <Button type="button" onClick={addModule}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Thêm Module Đầu Tiên
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {formData.modules.map((module, moduleIndex) => (
                                        <Card key={module.id} className="border-2">
                                            <CardHeader className="pb-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3 flex-1">
                                                        <GripVertical className="w-4 h-4 text-gray-400" />
                                                        <div className="flex-1">
                                                            <Input
                                                                value={module.title}
                                                                onChange={(e) => updateModule(module.id, "title", e.target.value)}
                                                                placeholder={`Module ${moduleIndex + 1}: Tiêu đề module`}
                                                                className="text-lg font-medium border-0 px-0 focus:ring-0"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => toggleModuleExpanded(module.id)}
                                                        >
                                                            {expandedModules[module.id] ? (
                                                                <ChevronUp className="w-4 h-4" />
                                                            ) : (
                                                                <ChevronDown className="w-4 h-4" />
                                                            )}
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => deleteModule(module.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-500" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <Textarea
                                                    value={module.description}
                                                    onChange={(e) => updateModule(module.id, "description", e.target.value)}
                                                    placeholder="Mô tả về nội dung module này..."
                                                    rows={2}
                                                    className="mt-2"
                                                />
                                            </CardHeader>

                                            {expandedModules[module.id] && (
                                                <CardContent className="pt-0">
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="font-medium text-sm text-gray-700">
                                                                Bài học ({module.lessons.length})
                                                            </h4>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => addLesson(module.id)}
                                                            >
                                                                <Plus className="w-3 h-3 mr-1" />
                                                                Thêm Bài Học
                                                            </Button>
                                                        </div>

                                                        {module.lessons.length === 0 ? (
                                                            <div className="text-center py-6 border border-dashed border-gray-200 rounded-lg">
                                                                <Play className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                                                <p className="text-sm text-gray-500">
                                                                    Chưa có bài học nào trong module này
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                {module.lessons.map((lesson, lessonIndex) => (
                                                                    <div
                                                                        key={lesson.id}
                                                                        className="flex items-center space-x-3 p-3 border rounded-lg bg-gray-50"
                                                                    >
                                                                        <GripVertical className="w-3 h-3 text-gray-400" />
                                                                        <Video className="w-4 h-4 text-blue-500" />
                                                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                                                                            <Input
                                                                                value={lesson.title}
                                                                                onChange={(e) => updateLesson(module.id, lesson.id, "title", e.target.value)}
                                                                                placeholder={`Bài học ${lessonIndex + 1}`}
                                                                                className="text-sm"
                                                                            />
                                                                            <Input
                                                                                value={lesson.videoUrl || ""}
                                                                                onChange={(e) => updateLesson(module.id, lesson.id, "videoUrl", e.target.value)}
                                                                                placeholder="URL video (tùy chọn)"
                                                                                className="text-sm"
                                                                            />
                                                                            <div className="flex items-center space-x-2">
                                                                                <Input
                                                                                    type="number"
                                                                                    min="0"
                                                                                    value={lesson.duration}
                                                                                    onChange={(e) => updateLesson(module.id, lesson.id, "duration", Number(e.target.value))}
                                                                                    placeholder="Phút"
                                                                                    className="text-sm"
                                                                                />
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    onClick={() => deleteLesson(module.id, lesson.id)}
                                                                                >
                                                                                    <X className="w-3 h-3 text-red-500" />
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            )}
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Step 4: Review & Publish */}
                {currentStep === 4 && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Xem lại thông tin khóa học</CardTitle>
                                <CardDescription>
                                    Kiểm tra lại thông tin trước khi xuất bản
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Basic Info Summary */}
                                <div>
                                    <h3 className="font-semibold text-lg mb-3">Thông tin cơ bản</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium">Tiêu đề:</span> {formData.title}
                                        </div>
                                        <div>
                                            <span className="font-medium">Giảng viên:</span> {formData.instructor}
                                        </div>
                                        <div>
                                            <span className="font-medium">Danh mục:</span> {
                                                courseCategories.find(c => c.id === formData.categoryId)?.name
                                            }
                                        </div>
                                        <div>
                                            <span className="font-medium">Cấp độ:</span> {
                                                courseLevels.find(l => l.value === formData.level)?.label
                                            }
                                        </div>
                                        <div>
                                            <span className="font-medium">Giá:</span> {
                                                Number(formData.price) === 0 ? "Miễn phí" : `${Number(formData.price).toLocaleString()} VNĐ`
                                            }
                                        </div>
                                        <div>
                                            <span className="font-medium">Số module:</span> {formData.modules.length}
                                        </div>
                                    </div>
                                </div>

                                {/* Content Summary */}
                                {formData.modules.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-lg mb-3">Nội dung khóa học</h3>
                                        <div className="space-y-2">
                                            {formData.modules.map((module, index) => (
                                                <div key={module.id} className="border rounded-lg p-3">
                                                    <div className="font-medium">
                                                        Module {index + 1}: {module.title || "Chưa có tiêu đề"}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {module.lessons.length} bài học - Tổng thời gian: {
                                                            module.lessons.reduce((total, lesson) => total + lesson.duration, 0)
                                                        } phút
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tags Summary */}
                                {formData.tags.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-lg mb-3">Từ khóa</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.tags.map((tag) => (
                                                <Badge key={tag} variant="secondary">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Publish Option */}
                                <div className="border-t pt-6">
                                    <div className="flex items-center space-x-3">
                                        <Switch
                                            id="isPublished"
                                            checked={formData.isPublished}
                                            onCheckedChange={(checked) =>
                                                setFormData(prev => ({ ...prev, isPublished: checked }))
                                            }
                                        />
                                        <div>
                                            <Label htmlFor="isPublished" className="text-base font-medium">
                                                Xuất bản khóa học ngay lập tức
                                            </Label>
                                            <p className="text-sm text-gray-500">
                                                Bật tùy chọn này để khóa học có thể được tìm thấy và đăng ký bởi học viên
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Quay lại
                    </Button>

                    {currentStep < 4 ? (
                        <Button type="button" onClick={handleNext}>
                            Tiếp theo
                        </Button>
                    ) : (
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {formData.isPublished ? "Tạo & Xuất bản khóa học" : "Lưu khóa học"}
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}