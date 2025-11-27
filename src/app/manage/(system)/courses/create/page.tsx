"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
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
    GripVertical
} from "lucide-react";
import Link from "next/link";
import { routes } from "@/config/routes";
import { toast } from "@/hooks/use-toast";
import { usePageHeader } from "@/hooks/use-page-header";
import {
    CreateCourseBodyType,
    CreateCourseBodySchema
} from "@/schemaValidations/courseManagement.schema";
import {
    useCreateCourseManagement,
    useCategoriesManagement
} from "@/queries/useCourseManagement";
import { handleErrorApi } from "@/lib/utils";

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

const pageHeader = {
    title: 'Tạo khóa học mới',
    breadcrumb: [
        {
            name: 'Trang chủ',
        },
        {
            href: routes.manage.system.courses,
            name: 'Khóa học',
        },
        {
            name: 'Tạo mới',
        },
    ],
};

export default function CreateCoursePage() {
    usePageHeader(pageHeader);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [thumbnailPreview, setThumbnailPreview] = useState("/images/course-placeholder.jpg");
    const [selectedTags, setSelectedTags] = useState<number[]>([]);

    const { data: categoriesData } = useCategoriesManagement();
    const createCourseMutation = useCreateCourseManagement();

    const form = useForm<CreateCourseBodyType>({
        resolver: zodResolver(CreateCourseBodySchema),
        defaultValues: {
            title: "",
            description: "",
            instructor: "",
            categoryId: 0,
            level: 1,
            price: 0,
            duration: 0,
            thumbnailUrl: "",
            videoUrl: "",
            tags: [],
        },
    });

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
                setThumbnailPreview(reader.result as string);
                // In a real app, you'd upload the file and get a URL
                form.setValue("thumbnailUrl", reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const addTag = (tag: number) => {
        if (!selectedTags.includes(tag)) {
            const newTags = [...selectedTags, tag];
            setSelectedTags(newTags);
            form.setValue("tags", newTags);
        }
    };

    const removeTag = (tagToRemove: number) => {
        const newTags = selectedTags.filter(tag => tag !== tagToRemove);
        setSelectedTags(newTags);
        form.setValue("tags", newTags);
    };

    const onSubmit = async (values: CreateCourseBodyType) => {
        if (createCourseMutation.isPending) return;

        setLoading(true);
        try {
            const result = await createCourseMutation.mutateAsync(values);
            toast({
                title: "Thành công",
                description: "Khóa học đã được tạo thành công",
                variant: "success",
                duration: 3000,
            });

            // Redirect to course detail page for component management
            if (result?.data?.id) {
                router.push(`${routes.manage.system.courses}/${result.data.id}`);
            } else {
                router.push(routes.manage.system.courses);
            }
        } catch (error) {
            handleErrorApi({
                error,
                setError: form.setError,
            });
        } finally {
            setLoading(false);
        }
    };

    const categories = categoriesData?.data?.data || [];

    return (
        <div className="space-y-6 pb-6">
            {/* Form */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin cơ bản</CardTitle>
                        <CardDescription>
                            Cung cấp thông tin chung về khóa học
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
                                placeholder="Ví dụ: React Advanced Patterns và Performance Optimization"
                                {...form.register("title")}
                                maxLength={100}
                                className="h-10"
                            />
                            {form.formState.errors.title && (
                                <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                            )}
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Tiêu đề nên ngắn, súc tích và hấp dẫn</span>
                                <span>{form.watch("title")?.length || 0}/100</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="font-medium">
                                Mô tả khóa học <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Mô tả chi tiết về nội dung, mục tiêu học tập và lợi ích của khóa học..."
                                {...form.register("description")}
                                rows={5}
                                maxLength={1000}
                                className="resize-none"
                            />
                            {form.formState.errors.description && (
                                <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                            )}
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Mô tả chi tiết giúp học viên hiểu rõ hơn về khóa học</span>
                                <span>{form.watch("description")?.length || 0}/1000</span>
                            </div>
                        </div>

                        {/* Instructor */}
                        <div className="space-y-2">
                            <Label htmlFor="instructor" className="font-medium">
                                Giảng viên <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="instructor"
                                placeholder="Tên giảng viên"
                                {...form.register("instructor")}
                                className="h-10"
                            />
                            {form.formState.errors.instructor && (
                                <p className="text-sm text-red-500">{form.formState.errors.instructor.message}</p>
                            )}
                        </div>

                        {/* Category and Level Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Category */}
                            <div className="space-y-2">
                                <Label htmlFor="categoryId" className="font-medium">
                                    Danh mục <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={form.watch("categoryId")?.toString()}
                                    onValueChange={(value) => form.setValue("categoryId", parseInt(value))}
                                >
                                    <SelectTrigger id="categoryId" className="h-10">
                                        <SelectValue placeholder="Chọn danh mục" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category: any) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {form.formState.errors.categoryId && (
                                    <p className="text-sm text-red-500">{form.formState.errors.categoryId.message}</p>
                                )}
                            </div>

                            {/* Level */}
                            <div className="space-y-2">
                                <Label htmlFor="level" className="font-medium">
                                    Mức độ khóa học
                                </Label>
                                <Select
                                    value={form.watch("level")?.toString()}
                                    onValueChange={(value) => form.setValue("level", parseInt(value))}
                                >
                                    <SelectTrigger id="level" className="h-10">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {courseLevels.map(level => (
                                            <SelectItem key={level.value} value={level.value.toString()}>
                                                {level.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {form.watch("level") && (
                                    <Badge variant="secondary" className="text-xs mt-2">
                                        {courseLevels.find(l => l.value === form.watch("level"))?.label}
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
                                    type="number"
                                    placeholder="1500000"
                                    {...form.register("price", { valueAsNumber: true })}
                                    min="0"
                                    step="100000"
                                    className="h-10"
                                />
                                {form.formState.errors.price && (
                                    <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>
                                )}
                                {form.watch("price") && Number(form.watch("price")) > 0 && (
                                    <div className="text-xs text-gray-500">
                                        Giá: {Number(form.watch("price")).toLocaleString("vi-VN")}đ
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
                                    type="number"
                                    placeholder="40"
                                    {...form.register("duration", { valueAsNumber: true })}
                                    min="1"
                                    step="1"
                                    className="h-10"
                                />
                                {form.formState.errors.duration && (
                                    <p className="text-sm text-red-500">{form.formState.errors.duration.message}</p>
                                )}
                                {form.watch("duration") && (
                                    <div className="text-xs text-gray-500">
                                        Tổng cộng: {Number(form.watch("duration"))} giờ
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Video URL */}
                        <div className="space-y-2">
                            <Label htmlFor="videoUrl" className="font-medium">
                                URL video giới thiệu
                            </Label>
                            <Input
                                id="videoUrl"
                                placeholder="https://youtube.com/watch?v=..."
                                {...form.register("videoUrl")}
                                className="h-10"
                            />
                            <div className="text-xs text-gray-500">
                                URL video giới thiệu khóa học (YouTube, Vimeo, etc.)
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tags</CardTitle>
                        <CardDescription>
                            Chọn các tag phù hợp để học viên dễ tìm kiếm
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Selected Tags */}
                        {selectedTags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {selectedTags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="ml-1 hover:text-red-500"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {/* Available Tags */}
                        <div className="flex flex-wrap gap-2">
                            {availableTags
                                .filter(tag => !selectedTags.includes(Number(tag)))
                                .map((tag) => (
                                    <Button
                                        key={tag}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addTag(Number(tag))}
                                        className="text-xs"
                                    >
                                        <Plus className="w-3 h-3 mr-1" />
                                        {tag}
                                    </Button>
                                ))}
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
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center relative">
                            <Image
                                src={thumbnailPreview}
                                alt="Thumbnail preview"
                                fill
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
                        </div>
                    </CardContent>
                </Card>

                {/* Form Actions */}
                <div className="flex justify-end gap-4">
                    <Button variant="outline" type="button" asChild>
                        <Link href={routes.manage.system.courses}>
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