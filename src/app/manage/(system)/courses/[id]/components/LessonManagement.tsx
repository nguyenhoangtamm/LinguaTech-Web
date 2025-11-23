"use client";

import { useState, useRef, useEffect } from "react";
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
import { toast } from "@/hooks/use-toast";
import DeletePopover from "@/app/shared/delete-popover";
import {
    useModulesByCourseQuery,
    useLessonsQuery,
    useCreateLessonMutation,
    useUpdateLessonMutation,
    useDeleteLessonMutation
} from "@/queries/useLesson";
import { CreateLessonSchema, CreateLessonBodyType, LessonType } from "@/schemaValidations/lesson.schema";
import { Switch } from "@/components/ui/switch";

interface LessonManagementProps {
    courseId: number;
}



export default function LessonManagement({ courseId }: LessonManagementProps) {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState<LessonType | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const pageSize = 100;
    const searchInputRef = useRef<HTMLInputElement>(null);

    // API queries
    const { data: modulesData } = useModulesByCourseQuery(courseId);
    const { data: lessonsData, isLoading: lessonsLoading, refetch: refetchLessons } = useLessonsQuery({
        courseId: courseId.toString(),
        pageNumber,
        pageSize
    });

    // API mutations
    const createLessonMutation = useCreateLessonMutation();
    const updateLessonMutation = useUpdateLessonMutation();
    const deleteLessonMutation = useDeleteLessonMutation();

    const form = useForm<CreateLessonBodyType>({
        resolver: zodResolver(CreateLessonSchema),
        defaultValues: {
            title: "",
            description: "",
            duration: 30,
            order: 1,
            moduleId: "",
            isPublished: false,
        },
    });

    const modules = modulesData?.data || [];
    const lessons = lessonsData?.data || [];
    const totalCount = lessonsData?.totalCount || 0;

    const onSubmit = async (values: CreateLessonBodyType) => {
        try {
            if (editingLesson) {
                await updateLessonMutation.mutateAsync({
                    id: parseInt(editingLesson.id),
                    data: values
                });
                toast({
                    title: "Thành công",
                    description: "Bài học đã được cập nhật",
                });
            } else {
                await createLessonMutation.mutateAsync(values);
                toast({
                    title: "Thành công",
                    description: "Bài học đã được tạo",
                });
            }
            setIsCreateDialogOpen(false);
            refetchLessons();
        } catch (error) {
            toast({
                title: "Lỗi",
                description: editingLesson ? "Không thể cập nhật bài học" : "Không thể tạo bài học mới",
                variant: "destructive",
            });
        }
    };

    // Filter lessons by search keyword
    const filteredLessons = lessons.filter((lesson: any) =>
        lesson.title.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    // Handle enter key in search
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && searchInputRef.current === document.activeElement) {
                handleSearch();
            }
        };

        document.addEventListener('keypress', handleKeyPress);
        return () => document.removeEventListener('keypress', handleKeyPress);
    }, []);

    const handleSearch = () => {
        if (searchInputRef.current) {
            setSearchKeyword(searchInputRef.current.value.trim());
            setPageNumber(1); // Reset to first page when searching
        }
    };

    const handleCreateLesson = () => {
        const nextOrder = lessons.length > 0 ? Math.max(...lessons.map((l: any) => l.order)) + 1 : 1;
        form.reset({
            title: "",
            description: "",
            duration: 30,
            order: nextOrder,
            moduleId: modules[0]?.id || "",
            isPublished: false,
        });
        setEditingLesson(null);
        setIsCreateDialogOpen(true);
    };

    const handleEditLesson = (lesson: LessonType) => {
        form.reset({
            title: lesson.title,
            description: lesson.description || "",
            duration: lesson.duration,
            order: lesson.order,
            moduleId: lesson.moduleId,
            isPublished: lesson.isPublished,
        });
        setEditingLesson(lesson);
        setIsCreateDialogOpen(true);
    };

    const handleDeleteLesson = async (lesson: LessonType) => {
        try {
            await deleteLessonMutation.mutateAsync(parseInt(lesson.id));
            toast({
                title: "Thành công",
                description: "Bài học đã được xóa",
            });
            refetchLessons();
        } catch (error) {
            toast({
                title: "Lỗi",
                description: "Không thể xóa bài học. Vui lòng thử lại.",
                variant: "destructive",
            });
        }
    };



    if (lessonsLoading) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-500">Đang tải danh sách bài học...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Quản lý Bài học</h3>
                    <p className="text-sm text-gray-600">
                        Tổng cộng: {totalCount} bài học
                    </p>
                </div>
                <Button
                    onClick={handleCreateLesson}
                    disabled={modules.length === 0}
                >
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
                                {modules.length === 0 ? "Chưa có module nào" : "Chưa có bài học nào"}
                            </h3>
                            <p className="text-gray-500 mb-4">
                                {modules.length === 0
                                    ? "Vui lòng tạo module trước khi thêm bài học"
                                    : "Thêm bài học đầu tiên để bắt đầu xây dựng nội dung"
                                }
                            </p>
                            {modules.length > 0 && (
                                <Button onClick={handleCreateLesson}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Tạo Bài học đầu tiên
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    filteredLessons.map((lesson: LessonType) => {
                        const lessonModule = modules.find((m: any) => m.id === lesson.moduleId);
                        return (
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
                                                </div>
                                                <p className="text-sm text-blue-600 mb-1">
                                                    {lessonModule?.title || 'Module không xác định'}
                                                </p>
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
                        );
                    })
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
                                        value={form.watch("moduleId")}
                                        onValueChange={(value) => form.setValue("moduleId", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn module" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {modules.map((module: any) => (
                                                <SelectItem key={module.id} value={module.id}>
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
                                    <Switch
                                        id="isPublished"
                                        checked={form.watch("isPublished")}
                                        onCheckedChange={(value) => form.setValue("isPublished", value)}
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