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
    Eye,
    GripVertical,
    BookOpen
} from "lucide-react";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InputPicker, Modal, Button as RSButton } from "rsuite";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import DeletePopover from "@/app/shared/delete-popover";
import { useSectionListQuery, useCreateSectionMutation, useUpdateSectionMutation, useDeleteSectionMutation } from "@/queries/useSection";
import { useModulesByCourseQuery } from "@/queries/useLesson";
import { CreateSectionBodySchema, CreateSectionBodyType, SectionType } from "@/schemaValidations/section.schema";

interface SectionManagementProps {
    courseId: number;
}

export default function SectionManagement({ courseId }: SectionManagementProps) {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingSection, setEditingSection] = useState<any>(null);
    const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const pageSize = 100;
    const searchInputRef = useRef<HTMLInputElement>(null);

    // API queries
    const { data: sectionsData, isLoading: sectionsLoading, refetch: refetchSections } = useSectionListQuery({
        pageSize,
        pageNumber,
        keyword: searchKeyword,
    });

    const { data: modulesData } = useModulesByCourseQuery(courseId);

    // API mutations
    const createSectionMutation = useCreateSectionMutation();
    const updateSectionMutation = useUpdateSectionMutation();
    const deleteSectionMutation = useDeleteSectionMutation();

    const form = useForm<CreateSectionBodyType>({
        resolver: zodResolver(CreateSectionBodySchema),
        defaultValues: {
            title: "",
            content: "",
            order: 1,
            lessonId: 0,
        },
    });

    // Get all lessons from modules
    const allLessons = useMemo(() =>
        (modulesData?.data || modulesData || [])?.flatMap((module: any) =>
            (module.lessons || []).map((lesson: any) => ({
                id: parseInt(lesson.id),
                title: lesson.title,
                moduleTitle: module.title,
                moduleId: module.id
            }))
        ) || [], [modulesData]
    );

    const sections = useMemo(() => sectionsData?.data || [], [sectionsData?.data]);
    const totalCount = (sectionsData as any)?.totalCount || 0;

    // Group sections by lesson
    const sectionsByLesson = useMemo(() => {
        const grouped = new Map();

        // Initialize all lessons with empty arrays
        allLessons.forEach((lesson: any) => {
            grouped.set(lesson.id, {
                lesson,
                sections: []
            });
        });

        // Group sections by lesson
        sections.forEach((section: any) => {
            const lessonData = grouped.get(section.lessonId);
            if (lessonData) {
                lessonData.sections.push(section);
            }
        });

        // Filter by search keyword
        if (searchKeyword) {
            grouped.forEach((value, key) => {
                value.sections = value.sections.filter((section: any) =>
                    section.title.toLowerCase().includes(searchKeyword.toLowerCase())
                );
            });
        }

        return Array.from(grouped.values());
    }, [allLessons, sections, searchKeyword]);

    const handleSearch = () => {
        if (searchInputRef.current) {
            setSearchKeyword(searchInputRef.current.value.trim());
            setPageNumber(1); // Reset to first page when searching
        }
    };

    const handleCreateSection = (lessonId?: number) => {
        const nextOrder = sections.length > 0 ? Math.max(...sections.map((s: any) => s.order)) + 1 : 1;
        form.reset({
            title: "",
            content: "",
            order: nextOrder,
            lessonId: lessonId || allLessons[0]?.id || 0,
        });
        setEditingSection(null);
        setSelectedLessonId(lessonId || null); // Lưu lessonId để khóa InputPicker
        setIsCreateDialogOpen(true);
    };

    const handleEditSection = (section: any) => {
        form.reset({
            title: section.title,
            content: section.content,
            order: section.order,
            lessonId: section.lessonId,
        });
        setEditingSection(section);
        setSelectedLessonId(null); // Reset khi edit
        setIsCreateDialogOpen(true);
    };

    const handleDeleteSection = async (section: any) => {
        try {
            await deleteSectionMutation.mutateAsync(section.id);
            toast({
                title: "Thành công",
                description: "Phần đã được xóa",
            });
            refetchSections();
        } catch (error) {
            toast({
                title: "Lỗi",
                description: "Không thể xóa phần. Vui lòng thử lại.",
                variant: "destructive",
            });
        }
    };

    const onSubmit = async (values: CreateSectionBodyType) => {
        try {
            if (editingSection) {
                await updateSectionMutation.mutateAsync({
                    id: editingSection.id,
                    ...values
                });
                toast({
                    title: "Thành công",
                    description: "Phần đã được cập nhật",
                });
            } else {
                await createSectionMutation.mutateAsync(values);
                toast({
                    title: "Thành công",
                    description: "Phần đã được tạo",
                });
            }
            setIsCreateDialogOpen(false);
            refetchSections();
        } catch (error) {
            toast({
                title: "Lỗi",
                description: editingSection ? "Không thể cập nhật phần" : "Không thể tạo phần mới",
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

    if (sectionsLoading) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-500">Đang tải danh sách phần...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Quản lý Phần</h3>
                    <p className="text-sm text-gray-600">
                        Tổng cộng: {totalCount} phần
                    </p>
                </div>
                <Button
                    onClick={() => handleCreateSection()}
                    disabled={allLessons.length === 0}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm Phần
                </Button>
            </div>

            {/* Search */}
            <div className="flex gap-2">
                <Input
                    ref={searchInputRef}
                    placeholder="Tìm kiếm phần..."
                    className="flex-1"
                />
                <Button variant="outline" onClick={handleSearch}>
                    <Search className="w-4 h-4" />
                </Button>
            </div>

            {/* Sections by Lesson */}
            <div className="space-y-6">
                {allLessons.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-8">
                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Chưa có bài học nào
                            </h3>
                            <p className="text-gray-500 mb-4">
                                Vui lòng tạo module và bài học trước khi thêm phần
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    sectionsByLesson.map(({ lesson, sections: lessonSections }) => (
                        <Card key={lesson.id}>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-green-600" />
                                        <div>
                                            <CardTitle className="text-base">{lesson.title}</CardTitle>
                                            <CardDescription className="text-sm">
                                                {lesson.moduleTitle} • {lessonSections.length} phần
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() => handleCreateSection(lesson.id)}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Thêm phần
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                {lessonSections.length === 0 ? (
                                    <div className="text-center py-6 text-gray-500">
                                        <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm">Chưa có phần nào trong bài học này</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {lessonSections.map((section: any) => (
                                            <div key={section.id} className="border rounded-lg p-4 bg-gray-50">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start gap-4 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <GripVertical className="w-4 h-4 text-gray-400" />
                                                            <Badge variant="outline">#{section.order}</Badge>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className="font-medium text-gray-900">{section.title}</h4>
                                                            </div>
                                                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                                {section.content}
                                                            </p>
                                                            <div className="text-xs text-gray-500">
                                                                Tạo: {new Date(section.createdAt).toLocaleDateString("vi-VN")}
                                                                {section.updatedAt !== section.createdAt && (
                                                                    <span> • Cập nhật: {new Date(section.updatedAt).toLocaleDateString("vi-VN")}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button variant="ghost" size="sm">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm" onClick={() => handleEditSection(section)}>
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <DeletePopover
                                                            title="Xóa Phần"
                                                            description={`Bạn có chắc chắn muốn xóa phần "${section.title}"? Hành động này không thể hoàn tác.`}
                                                            onDelete={() => handleDeleteSection(section)}
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
                        {editingSection ? "Chỉnh sửa Phần" : "Tạo Phần mới"}
                    </Modal.Title>
                </Modal.Header>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Modal.Body>
                        <p className="text-gray-600 mb-4">
                            {editingSection ? "Cập nhật thông tin phần" : "Thêm phần mới vào bài học"}
                        </p>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="title">Tiêu đề Phần *</Label>
                                    <Input
                                        id="title"
                                        placeholder="Ví dụ: Giới thiệu về khái niệm"
                                        {...form.register("title")}
                                    />
                                    {form.formState.errors.title && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {form.formState.errors.title.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="lessonId">Bài học *</Label>
                                    <InputPicker
                                        data={allLessons.map((lesson: any) => ({
                                            label: `${lesson.moduleTitle} → ${lesson.title}`,
                                            value: lesson.id
                                        }))}
                                        value={form.watch("lessonId")}
                                        onChange={(value) => form.setValue("lessonId", value)}
                                        placeholder="Chọn bài học"
                                        searchable={true}
                                        style={{ width: '100%' }}
                                        block
                                        disabled={selectedLessonId !== null && !editingSection}
                                    />
                                    {selectedLessonId && !editingSection && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Bài học đã được chọn sẵn từ danh sách
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="content">Nội dung *</Label>
                                <Textarea
                                    id="content"
                                    placeholder="Nội dung chi tiết của phần..."
                                    {...form.register("content")}
                                    rows={8}
                                />
                                {form.formState.errors.content && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {form.formState.errors.content.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="order">Thứ tự *</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    min="1"
                                    {...form.register("order", { valueAsNumber: true })}
                                />
                                {form.formState.errors.order && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {form.formState.errors.order.message}
                                    </p>
                                )}
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
                            {editingSection ? "Cập nhật" : "Tạo Phần"}
                        </RSButton>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    );
}