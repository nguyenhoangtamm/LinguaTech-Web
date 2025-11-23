"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    Edit,
    Trash2,
    Search,
    FileText,
    Play,
    Clock,
    GripVertical,
    Eye
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import DeletePopover from "@/app/shared/delete-popover";

interface LessonManagementProps {
    courseId: number;
}

// Mock lesson schema - replace with actual schema
const CreateLessonSchema = z.object({
    title: z.string().min(1, "Tiêu đề là bắt buộc"),
    description: z.string().optional(),
    content: z.string().optional(),
    duration: z.number().min(1, "Thời lượng phải lớn hơn 0"),
    order: z.number().min(1, "Thứ tự phải lớn hơn 0"),
    moduleId: z.number(),
    isPublished: z.boolean().default(false),
});

type CreateLessonType = z.infer<typeof CreateLessonSchema>;

// Mock data
const mockModules = [
    { id: 1, title: "Module 1: Cơ bản", order: 1 },
    { id: 2, title: "Module 2: Nâng cao", order: 2 },
];

const mockLessons = [
    {
        id: 1,
        title: "Bài 1: Giới thiệu",
        description: "Bài học giới thiệu về khóa học",
        duration: 30,
        order: 1,
        moduleId: 1,
        moduleName: "Module 1: Cơ bản",
        isPublished: true,
        sectionsCount: 3,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
    },
    {
        id: 2,
        title: "Bài 2: Thực hành",
        description: "Bài học thực hành",
        duration: 45,
        order: 2,
        moduleId: 1,
        moduleName: "Module 1: Cơ bản",
        isPublished: false,
        sectionsCount: 5,
        createdAt: "2024-01-02T00:00:00Z",
        updatedAt: "2024-01-02T00:00:00Z",
    },
];

export default function LessonManagement({ courseId }: LessonManagementProps) {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState<any>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<CreateLessonType>({
        resolver: zodResolver(CreateLessonSchema),
        defaultValues: {
            title: "",
            description: "",
            content: "",
            duration: 30,
            order: 1,
            moduleId: 0,
            isPublished: false,
        },
    });

    const handleSearch = () => {
        if (searchInputRef.current) {
            setSearchKeyword(searchInputRef.current.value.trim());
        }
    };

    const handleCreateLesson = () => {
        const nextOrder = mockLessons.length > 0 ? Math.max(...mockLessons.map(l => l.order)) + 1 : 1;
        form.reset({
            title: "",
            description: "",
            content: "",
            duration: 30,
            order: nextOrder,
            moduleId: mockModules[0]?.id || 0,
            isPublished: false,
        });
        setEditingLesson(null);
        setIsCreateDialogOpen(true);
    };

    const handleEditLesson = (lesson: any) => {
        form.reset({
            title: lesson.title,
            description: lesson.description || "",
            content: lesson.content || "",
            duration: lesson.duration,
            order: lesson.order,
            moduleId: lesson.moduleId,
            isPublished: lesson.isPublished,
        });
        setEditingLesson(lesson);
        setIsCreateDialogOpen(true);
    };

    const handleDeleteLesson = async (lesson: any) => {
        // Mock delete
        toast({
            title: "Thành công",
            description: "Bài học đã được xóa",
            variant: "success",
        });
    };

    const onSubmit = async (values: CreateLessonType) => {
        // Mock submit
        toast({
            title: "Thành công",
            description: editingLesson ? "Bài học đã được cập nhật" : "Bài học đã được tạo",
            variant: "success",
        });
        setIsCreateDialogOpen(false);
    };

    const filteredLessons = mockLessons.filter(lesson =>
        lesson.title.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Quản lý Bài học</h3>
                    <p className="text-sm text-gray-600">
                        Tổng cộng: {filteredLessons.length} bài học
                    </p>
                </div>
                <Button onClick={handleCreateLesson}>
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm Bài học
                </Button>
            </div>

            {/* Search */}
            <div className="flex gap-2">
                <Input
                    ref={searchInputRef}
                    placeholder="Tìm kiếm bài học..."
                    className="flex-1"
                />
                <Button variant="outline" onClick={handleSearch}>
                    <Search className="w-4 h-4" />
                </Button>
            </div>

            {/* Lessons List */}
            <div className="space-y-4">
                {filteredLessons.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-8">
                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Chưa có bài học nào
                            </h3>
                            <p className="text-gray-500 mb-4">
                                Thêm bài học đầu tiên để bắt đầu xây dựng nội dung
                            </p>
                            <Button onClick={handleCreateLesson}>
                                <Plus className="w-4 h-4 mr-2" />
                                Tạo Bài học đầu tiên
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    filteredLessons.map((lesson) => (
                        <Card key={lesson.id}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="flex items-center gap-2">
                                            <GripVertical className="w-4 h-4 text-gray-400" />
                                            <Badge variant="outline">#{lesson.order}</Badge>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                                                <Badge
                                                    variant={lesson.isPublished ? "default" : "secondary"}
                                                    className="text-xs"
                                                >
                                                    {lesson.isPublished ? "Đã xuất bản" : "Bản nháp"}
                                                </Badge>
                                                <Badge variant="outline" className="text-xs">
                                                    <FileText className="w-3 h-3 mr-1" />
                                                    {lesson.sectionsCount} phần
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-blue-600 mb-1">{lesson.moduleName}</p>
                                            {lesson.description && (
                                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                    {lesson.description}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {lesson.duration} phút
                                                </div>
                                                <span>
                                                    Tạo: {new Date(lesson.createdAt).toLocaleDateString("vi-VN")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm">
                                            <Play className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleEditLesson(lesson)}>
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <DeletePopover
                                            title="Xóa Bài học"
                                            description={`Bạn có chắc chắn muốn xóa bài học "${lesson.title}"? Hành động này không thể hoàn tác.`}
                                            onDelete={() => handleDeleteLesson(lesson)}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {editingLesson ? "Chỉnh sửa Bài học" : "Tạo Bài học mới"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingLesson ? "Cập nhật thông tin bài học" : "Thêm bài học mới vào khóa học"}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="title">Tiêu đề Bài học *</Label>
                                    <Input
                                        id="title"
                                        placeholder="Ví dụ: Giới thiệu về Components"
                                        {...form.register("title")}
                                    />
                                    {form.formState.errors.title && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {form.formState.errors.title.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="moduleId">Module *</Label>
                                    <Select
                                        value={form.watch("moduleId")?.toString()}
                                        onValueChange={(value) => form.setValue("moduleId", parseInt(value))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn module" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mockModules.map((module) => (
                                                <SelectItem key={module.id} value={module.id.toString()}>
                                                    {module.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="description">Mô tả</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Mô tả nội dung bài học..."
                                    {...form.register("description")}
                                    rows={3}
                                />
                            </div>
                            <div>
                                <Label htmlFor="content">Nội dung</Label>
                                <Textarea
                                    id="content"
                                    placeholder="Nội dung chi tiết của bài học..."
                                    {...form.register("content")}
                                    rows={5}
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="duration">Thời lượng (phút) *</Label>
                                    <Input
                                        id="duration"
                                        type="number"
                                        min="1"
                                        {...form.register("duration", { valueAsNumber: true })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="order">Thứ tự *</Label>
                                    <Input
                                        id="order"
                                        type="number"
                                        min="1"
                                        {...form.register("order", { valueAsNumber: true })}
                                    />
                                </div>
                                <div className="flex items-center space-x-2 pt-6">
                                    <input
                                        id="isPublished"
                                        type="checkbox"
                                        {...form.register("isPublished")}
                                        className="rounded border-gray-300"
                                    />
                                    <Label htmlFor="isPublished">Xuất bản ngay</Label>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateDialogOpen(false)}
                            >
                                Hủy
                            </Button>
                            <Button type="submit">
                                {editingLesson ? "Cập nhật" : "Tạo Bài học"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}