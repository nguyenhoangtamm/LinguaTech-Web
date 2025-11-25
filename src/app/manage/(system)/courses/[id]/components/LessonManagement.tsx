"use client";

import { useState, useRef, useEffect, useMemo } from "react";
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
    Eye,
    BookOpen
} from "lucide-react";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InputPicker, Modal, Button as RSButton } from "rsuite";
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
    const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const pageSize = 100;
    const searchInputRef = useRef<HTMLInputElement>(null);

    // API queries
    const { data: modulesData } = useModulesByCourseQuery(courseId);
    const { data: lessonsData, isLoading: lessonsLoading, refetch: refetchLessons } = useLessonsQuery({
        courseId: courseId,
        pageNumber,
        pageSize
    });

    // API mutations
    const createLessonMutation = useCreateLessonMutation();
    const updateLessonMutation = useUpdateLessonMutation();
    const deleteLessonMutation = useDeleteLessonMutation();

    const moduleOptions = useMemo(() => {
        return (modulesData?.data || []).map((module: any) => ({
            label: module.title,
            value: module.id,
        }));
    }, [modulesData?.data]);

    const form = useForm<CreateLessonBodyType>({
        resolver: zodResolver(CreateLessonSchema),
        defaultValues: {
            title: "",
            description: "",
            duration: 30,
            order: 1,
            moduleId: undefined,
            isPublished: false,
        },
    });

    const modules = useMemo(() => modulesData?.data || [], [modulesData?.data]);
    const lessons = useMemo(() => lessonsData?.data || [], [lessonsData?.data]);
    const totalCount = (lessonsData as any)?.totalCount || 0;

    // Group lessons by module
    const lessonsByModule = useMemo(() => {
        const grouped = new Map();

        // Initialize all modules with empty arrays
        modules.forEach((module: any) => {
            grouped.set(module.id, {
                module,
                lessons: []
            });
        });

        // Group lessons by module
        lessons.forEach((lesson: any) => {
            const moduleData = grouped.get(lesson.moduleId);
            if (moduleData) {
                moduleData.lessons.push(lesson);
            }
        });

        // Filter by search keyword
        if (searchKeyword) {
            grouped.forEach((value, key) => {
                value.lessons = value.lessons.filter((lesson: any) =>
                    lesson.title.toLowerCase().includes(searchKeyword.toLowerCase())
                );
            });
        }

        return Array.from(grouped.values());
    }, [modules, lessons, searchKeyword]);

    const onSubmit = async (values: CreateLessonBodyType) => {
        try {
            if (editingLesson) {
                await updateLessonMutation.mutateAsync({
                    id: editingLesson.id,
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

    const handleCreateLesson = (moduleId?: string) => {
        const nextOrder = lessons.length > 0 ? Math.max(...lessons.map((l: any) => l.order)) + 1 : 1;
        form.reset({
            title: "",
            description: "",
            duration: 30,
            order: nextOrder,
            moduleId: moduleId || modules[0]?.id || "",
            isPublished: false,
        });
        setEditingLesson(null);
        setSelectedModuleId(moduleId || null); // Lưu moduleId để khóa InputPicker
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
        setSelectedModuleId(null); // Reset khi edit
        setIsCreateDialogOpen(true);
    };

    const handleDeleteLesson = async (lesson: LessonType) => {
        try {
            await deleteLessonMutation.mutateAsync(lesson.id);
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
                    onClick={() => handleCreateLesson()}
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

            {/* Lessons by Module */}
            <div className="space-y-6">
                {modules.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-8">
                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Chưa có module nào
                            </h3>
                            <p className="text-gray-500 mb-4">
                                Vui lòng tạo module trước khi thêm bài học
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    lessonsByModule.map(({ module, lessons: moduleLessons }) => (
                        <Card key={module.id}>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <BookOpen className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <CardTitle className="text-base">{module.title}</CardTitle>
                                            <CardDescription className="text-sm">
                                                {moduleLessons.length} bài học
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() => handleCreateLesson(module.id)}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Thêm bài học
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                {moduleLessons.length === 0 ? (
                                    <div className="text-center py-6 text-gray-500">
                                        <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm">Chưa có bài học nào trong module này</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {moduleLessons.map((lesson: any) => (
                                            <div key={lesson.id} className="border rounded-lg p-4 bg-gray-50">
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
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Create/Edit Modal */}
            <Modal
                open={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
                size="lg"
            >
                <Modal.Header>
                    <Modal.Title>
                        {editingLesson ? "Chỉnh sửa Bài học" : "Tạo Bài học mới"}
                    </Modal.Title>
                </Modal.Header>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Modal.Body>
                        <p className="text-gray-600 mb-4">
                            {editingLesson ? "Cập nhật thông tin bài học" : "Thêm bài học mới vào khóa học"}
                        </p>
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
                                    <InputPicker
                                        data={moduleOptions}
                                        value={form.watch("moduleId")}
                                        onChange={(value) => form.setValue("moduleId", value)}
                                        placeholder="Chọn module"
                                        searchable={false}
                                        style={{ width: '100%' }}
                                        disabled={selectedModuleId !== null && !editingLesson}
                                    />
                                    {selectedModuleId && !editingLesson && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Module đã được chọn sẵn từ danh sách
                                        </p>
                                    )}
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
                    </Modal.Body>
                    <Modal.Footer>
                        <RSButton
                            appearance="subtle"
                            onClick={() => setIsCreateDialogOpen(false)}
                        >
                            Hủy
                        </RSButton>
                        <RSButton
                            appearance="primary"
                            type="submit"
                        >
                            {editingLesson ? "Cập nhật" : "Tạo Bài học"}
                        </RSButton>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    );
}