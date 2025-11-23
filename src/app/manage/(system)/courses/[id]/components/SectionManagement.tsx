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
    Eye,
    GripVertical,
    BookOpen
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

interface SectionManagementProps {
    courseId: number;
}

// Mock section schema
const CreateSectionSchema = z.object({
    title: z.string().min(1, "Tiêu đề là bắt buộc"),
    content: z.string().min(1, "Nội dung là bắt buộc"),
    order: z.number().min(1, "Thứ tự phải lớn hơn 0"),
    lessonId: z.number(),
});

type CreateSectionType = z.infer<typeof CreateSectionSchema>;

// Mock data
const mockLessons = [
    { id: 1, title: "Bài 1: Giới thiệu", moduleTitle: "Module 1: Cơ bản" },
    { id: 2, title: "Bài 2: Thực hành", moduleTitle: "Module 1: Cơ bản" },
];

const mockSections = [
    {
        id: 1,
        title: "Phần 1: Khái niệm cơ bản",
        content: "Nội dung về các khái niệm cơ bản...",
        order: 1,
        lessonId: 1,
        lessonTitle: "Bài 1: Giới thiệu",
        moduleTitle: "Module 1: Cơ bản",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
    },
    {
        id: 2,
        title: "Phần 2: Ví dụ thực tế",
        content: "Các ví dụ thực tế áp dụng...",
        order: 2,
        lessonId: 1,
        lessonTitle: "Bài 1: Giới thiệu",
        moduleTitle: "Module 1: Cơ bản",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
    },
];

export default function SectionManagement({ courseId }: SectionManagementProps) {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingSection, setEditingSection] = useState<any>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<CreateSectionType>({
        resolver: zodResolver(CreateSectionSchema),
        defaultValues: {
            title: "",
            content: "",
            order: 1,
            lessonId: 0,
        },
    });

    const handleSearch = () => {
        if (searchInputRef.current) {
            setSearchKeyword(searchInputRef.current.value.trim());
        }
    };

    const handleCreateSection = () => {
        const nextOrder = mockSections.length > 0 ? Math.max(...mockSections.map(s => s.order)) + 1 : 1;
        form.reset({
            title: "",
            content: "",
            order: nextOrder,
            lessonId: mockLessons[0]?.id || 0,
        });
        setEditingSection(null);
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
        setIsCreateDialogOpen(true);
    };

    const handleDeleteSection = async (section: any) => {
        toast({
            title: "Thành công",
            description: "Phần đã được xóa",
            variant: "success",
        });
    };

    const onSubmit = async (values: CreateSectionType) => {
        toast({
            title: "Thành công",
            description: editingSection ? "Phần đã được cập nhật" : "Phần đã được tạo",
            variant: "success",
        });
        setIsCreateDialogOpen(false);
    };

    const filteredSections = mockSections.filter(section =>
        section.title.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Quản lý Phần</h3>
                    <p className="text-sm text-gray-600">
                        Tổng cộng: {filteredSections.length} phần
                    </p>
                </div>
                <Button onClick={handleCreateSection}>
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

            {/* Sections List */}
            <div className="space-y-4">
                {filteredSections.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-8">
                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Chưa có phần nào
                            </h3>
                            <p className="text-gray-500 mb-4">
                                Thêm phần đầu tiên để chia nhỏ nội dung bài học
                            </p>
                            <Button onClick={handleCreateSection}>
                                <Plus className="w-4 h-4 mr-2" />
                                Tạo Phần đầu tiên
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    filteredSections.map((section) => (
                        <Card key={section.id}>
                            <CardContent className="p-6">
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
                                            <p className="text-sm text-blue-600 mb-1">
                                                {section.moduleTitle} → {section.lessonTitle}
                                            </p>
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
                            {editingSection ? "Chỉnh sửa Phần" : "Tạo Phần mới"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingSection ? "Cập nhật thông tin phần" : "Thêm phần mới vào bài học"}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
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
                                    <Select
                                        value={form.watch("lessonId")?.toString()}
                                        onValueChange={(value) => form.setValue("lessonId", parseInt(value))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn bài học" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mockLessons.map((lesson) => (
                                                <SelectItem key={lesson.id} value={lesson.id.toString()}>
                                                    {lesson.moduleTitle} → {lesson.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                        <DialogFooter className="mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateDialogOpen(false)}
                            >
                                Hủy
                            </Button>
                            <Button type="submit">
                                {editingSection ? "Cập nhật" : "Tạo Phần"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}