"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { InputPicker } from "rsuite";
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
    GripVertical
} from "lucide-react";
import Link from "next/link";
import { routes } from "@/config/routes";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

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

// Convert to InputPicker format
const categoryOptions = courseCategories.map(cat => ({
    label: `${cat.icon} ${cat.name}`,
    value: cat.id
}));

const levelOptions = courseLevels.map(level => ({
    label: level.label,
    value: level.value.toString()
}));

const availableTags = [
    "JavaScript", "Python", "React", "Node.js", "TypeScript",
    "Vue.js", "Angular", "PHP", "Java", "C#", "Flutter",
    "React Native", "Machine Learning", "AI", "DevOps",
    "Docker", "Kubernetes", "AWS", "Azure", "UI/UX"
];

export default function CreateCoursePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
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
            [name]: value,
        }));
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                toast({
                    title: "Lỗi",
                    description: "Vui lòng chọn một tệp hình ảnh",
                    variant: "destructive",
                    duration: 3000,
                });
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: "Lỗi",
                    description: "Kích thước hình ảnh không được vượt quá 5MB",
                    variant: "destructive",
                    duration: 3000,
                });
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    thumbnail: file,
                    thumbnail_preview: reader.result as string,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = (): boolean => {
        if (!formData.title.trim()) {
            toast({
                title: "Lỗi",
                description: "Vui lòng nhập tiêu đề khóa học",
                variant: "destructive",
                duration: 3000,
            });
            return false;
        }

        if (!formData.description.trim()) {
            toast({
                title: "Lỗi",
                description: "Vui lòng nhập mô tả khóa học",
                variant: "destructive",
                duration: 3000,
            });
            return false;
        }

        if (!formData.categoryId) {
            toast({
                title: "Lỗi",
                description: "Vui lòng chọn danh mục khóa học",
                variant: "destructive",
                duration: 3000,
            });
            return false;
        }

        if (formData.price === "" || Number(formData.price) < 0) {
            toast({
                title: "Lỗi",
                description: "Vui lòng nhập giá khóa học hợp lệ",
                variant: "destructive",
                duration: 3000,
            });
            return false;
        }

        if (formData.duration === "" || Number(formData.duration) <= 0) {
            toast({
                title: "Lỗi",
                description: "Vui lòng nhập thời lượng khóa học (tính bằng giờ)",
                variant: "destructive",
                duration: 3000,
            });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            toast({
                title: "Thành công",
                description: "Khóa học đã được tạo thành công",
                variant: "success",
                duration: 3000,
            });

            // Redirect to my-courses page
            router.push(routes.teacher.myCourses);
        } catch (error) {
            toast({
                title: "Lỗi",
                description: "Có lỗi xảy ra khi tạo khóa học. Vui lòng thử lại.",
                variant: "destructive",
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const selectedCategory = courseCategories.find(cat => cat.id === formData.categoryId);

    return (
        <div className="space-y-6 pb-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={routes.teacher.myCourses}>
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Tạo khóa học mới</h1>
                    <p className="text-gray-600 text-sm mt-1">Điền thông tin chi tiết của khóa học bạn muốn tạo</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin cơ bản</CardTitle>
                        <CardDescription>
                            Cung cấp thông tin chung về khóa học của bạn
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title" className="font-medium">
                                Tiêu đề khóa học <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="Ví dụ: React Advanced Patterns và Performance Optimization"
                                value={formData.title}
                                onChange={handleInputChange}
                                maxLength={100}
                                className="h-10"
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Tiêu đề nên ngắn, súc tích và hấp dẫn</span>
                                <span>{formData.title.length}/100</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="font-medium">
                                Mô tả khóa học <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Mô tả chi tiết về nội dung, mục tiêu học tập và lợi ích của khóa học..."
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={5}
                                maxLength={1000}
                                className="resize-none"
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Mô tả chi tiết giúp học viên hiểu rõ hơn về khóa học</span>
                                <span>{formData.description.length}/1000</span>
                            </div>
                        </div>

                        {/* Category and Level Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Category */}
                            <div className="space-y-2">
                                <Label htmlFor="category" className="font-medium">
                                    Danh mục <span className="text-red-500">*</span>
                                </Label>
                                <InputPicker
                                    data={categoryOptions}
                                    valueKey="value"
                                    labelKey="label"
                                    placeholder="Chọn danh mục"
                                    value={formData.categoryId || null}
                                    onChange={(value) => handleSelectChange("categoryId", value || "")}
                                    searchable={true}
                                    style={{ width: "100%", height: 40 }}
                                />
                            </div>

                            {/* Level */}
                            <div className="space-y-2">
                                <Label htmlFor="level" className="font-medium">
                                    Mức độ khóa học
                                </Label>
                                <InputPicker
                                    data={levelOptions}
                                    valueKey="value"
                                    labelKey="label"
                                    placeholder="Chọn mức độ"
                                    value={formData.level.toString()}
                                    onChange={(value) => setFormData(prev => ({ ...prev, level: parseInt(value || "1") }))}
                                    searchable={false}
                                    style={{ width: "100%", height: 40 }}
                                />
                                {formData.level && (
                                    <Badge variant="secondary" className="text-xs mt-2">
                                        {courseLevels.find(l => l.value === formData.level)?.label}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Course Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Chi tiết khóa học</CardTitle>
                        <CardDescription>
                            Cung cấp thông tin về giá cả và thời lượng khóa học
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Price */}
                            <div className="space-y-2">
                                <Label htmlFor="price" className="font-medium">
                                    Giá khóa học (VND) <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    placeholder="1500000"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="100000"
                                    className="h-10"
                                />
                                {formData.price && Number(formData.price) > 0 && (
                                    <div className="text-xs text-gray-500">
                                        Giá: {Number(formData.price).toLocaleString("vi-VN")}đ
                                    </div>
                                )}
                            </div>

                            {/* Duration */}
                            <div className="space-y-2">
                                <Label htmlFor="duration" className="font-medium">
                                    Thời lượng khóa học (giờ) <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="duration"
                                    name="duration"
                                    type="number"
                                    placeholder="40"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    min="1"
                                    step="1"
                                    className="h-10"
                                />
                                {formData.duration && (
                                    <div className="text-xs text-gray-500">
                                        Tổng cộng: {Number(formData.duration)} giờ
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Thumbnail */}
                <Card>
                    <CardHeader>
                        <CardTitle>Hình ảnh đại diện</CardTitle>
                        <CardDescription>
                            Chọn hình ảnh để làm đại diện cho khóa học (tối đa 5MB, định dạng PNG/JPG)
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Thumbnail Preview */}
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <Image
                                src={formData.thumbnailPreview}
                                alt="Thumbnail preview"
                                width={400}
                                height={225}
                                className="object-cover"
                            />
                        </div>

                        {/* File Upload */}
                        <div className="space-y-2">
                            <Label htmlFor="thumbnail" className="font-medium">
                                Tải lên hình ảnh
                            </Label>
                            <div className="flex items-center justify-center w-full">
                                <label
                                    htmlFor="thumbnail"
                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">Nhấp để tải lên</span> hoặc kéo thả
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG (Tối đa 5MB)</p>
                                    </div>
                                    <input
                                        id="thumbnail"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleThumbnailChange}
                                    />
                                </label>
                            </div>
                            {formData.thumbnail && (
                                <div className="text-xs text-gray-500">
                                    Tệp được chọn: {formData.thumbnail.name}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Form Actions */}
                <div className="flex justify-end gap-4">
                    <Button variant="outline" type="button" asChild>
                        <Link href={routes.teacher.myCourses}>
                            Hủy
                        </Link>
                    </Button>
                    <Button type="submit" disabled={loading} className="gap-2">
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? "Đang tạo..." : "Tạo khóa học"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
