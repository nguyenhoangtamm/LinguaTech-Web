"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    Edit,
    Trash2,
    Search,
    BookOpen,
    FileText,
    GripVertical,
    Eye
} from "lucide-react";
import {
    useModuleListQuery,
    useCreateModuleMutation,
    useUpdateModuleMutation,
    useDeleteModuleMutation
} from "@/queries/useModule";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    CreateModuleBodyType,
    CreateModuleBodySchema,
    UpdateModuleBodyType,
    UpdateModuleBodySchema
} from "@/schemaValidations/module.schema";
import { toast } from "@/hooks/use-toast";
import { handleErrorApi } from "@/lib/utils";
import DeletePopover from "@/app/shared/delete-popover";

interface ModuleManagementProps {
    courseId: number;
}

interface Module {
    id: number;
    title: string;
    description?: string;
    order: number;
    courseId: number;
    courseTitle?: string;
    lessonsCount?: number;
    createdAt: string;
    updatedAt: string;
}

export default function ModuleManagement({ courseId }: ModuleManagementProps) {

    const [searchKeyword, setSearchKeyword] = useState("");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingModule, setEditingModule] = useState<Module | null>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Memoize query parameters to prevent infinite re-renders
    const queryParams = useMemo(() => ({
        pageSize: 100,
        pageNumber: 1,
        courseId: courseId,
        keyword: searchKeyword || undefined,
    }), [courseId, searchKeyword]);

    // Queries and mutations
    const {
        data: modulesData,
        isLoading,
        refetch
    } = useModuleListQuery(queryParams);

    const createModuleMutation = useCreateModuleMutation();
    const updateModuleMutation = useUpdateModuleMutation();
    const deleteModuleMutation = useDeleteModuleMutation();

    // Memoize modules array to prevent unnecessary re-renders
    const modules: Module[] = useMemo(() => modulesData?.data || [], [modulesData]);
    const totalCount = modulesData?.totalCount || 0;

    // Memoize form resolver to prevent unnecessary re-renders
    const formResolver = useMemo(() =>
        zodResolver(editingModule ? UpdateModuleBodySchema : CreateModuleBodySchema),
        [editingModule]
    );

    // Form for create/edit
    const form = useForm<CreateModuleBodyType | UpdateModuleBodyType>({
        resolver: formResolver,
        defaultValues: {
            title: "",
            description: "",
            order: 1,
            courseId: courseId,
        },
    });

    const handleSearch = useCallback(() => {
        if (searchInputRef.current) {
            setSearchKeyword(searchInputRef.current.value.trim());
        }
    }, [ ]);

    const handleCreateModule = useCallback(() => {
        const nextOrder = modules.length > 0 ? Math.max(...modules.map(m => m.order)) + 1 : 1;
        form.reset({
            title: "",
            description: "",
            order: nextOrder,
            courseId: courseId,
        });
        setEditingModule(null);
        setIsCreateDialogOpen(true);
    }, [modules, courseId, form]);

    const handleEditModule = useCallback((module: Module) => {
        form.reset({
            title: module.title,
            description: module.description || "",
            order: module.order,
            courseId: module.courseId,
        });
        setEditingModule(module);
        setIsCreateDialogOpen(true);
    }, [form]);

    const handleDeleteModule = async (module: Module) => {
        try {
            await deleteModuleMutation.mutateAsync(module.id);
            toast({
                title: "Thành công",
                description: "Module đã được xóa",
                variant: "success",
            });
            // React Query will handle invalidation automatically
        } catch (error) {
            toast({
                title: "Lỗi",
                description: "Không thể xóa module",
                variant: "destructive",
            });
        }
    };

    const onSubmit = async (values: CreateModuleBodyType | UpdateModuleBodyType) => {
        try {
            if (editingModule) {
                await updateModuleMutation.mutateAsync({
                    id: editingModule.id,
                    ...values,
                } as UpdateModuleBodyType);
                toast({
                    title: "Thành công",
                    description: "Module đã được cập nhật",
                    variant: "success",
                });
            } else {
                await createModuleMutation.mutateAsync(values as CreateModuleBodyType);
                toast({
                    title: "Thành công",
                    description: "Module đã được tạo",
                    variant: "success",
                });
            }
            setIsCreateDialogOpen(false);
            // Let React Query handle the invalidation automatically
        } catch (error) {
            handleErrorApi({
                error,
                setError: form.setError,
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Quản lý Module</h3>
                    <p className="text-sm text-gray-600">
                        Tổng cộng: {totalCount} module
                    </p>
                </div>
                <Button onClick={handleCreateModule}>
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm Module
                </Button>
            </div>

            {/* Search */}
            <div className="flex gap-2">
                <Input
                    ref={searchInputRef}
                    placeholder="Tìm kiếm module..."
                    className="flex-1"
                    defaultValue={searchKeyword}
                />
                <Button variant="outline" onClick={handleSearch}>
                    <Search className="w-4 h-4" />
                </Button>
            </div>

            {/* Modules List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p>Đang tải...</p>
                    </div>
                ) : modules.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-8">
                            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Chưa có module nào
                            </h3>
                            <p className="text-gray-500 mb-4">
                                Thêm module đầu tiên để bắt đầu xây dựng khóa học
                            </p>
                            <Button onClick={handleCreateModule}>
                                <Plus className="w-4 h-4 mr-2" />
                                Tạo Module đầu tiên
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    modules.map((module) => (
                        <Card key={module.id}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="flex items-center gap-2">
                                            <GripVertical className="w-4 h-4 text-gray-400" />
                                            <Badge variant="outline">#{module.order}</Badge>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-medium text-gray-900">{module.title}</h4>
                                                <Badge variant="secondary" className="text-xs">
                                                    <FileText className="w-3 h-3 mr-1" />
                                                    {module.lessonsCount || 0} bài học
                                                </Badge>
                                            </div>
                                            {module.description && (
                                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                    {module.description}
                                                </p>
                                            )}
                                            <div className="text-xs text-gray-500">
                                                Tạo: {new Date(module.createdAt).toLocaleDateString("vi-VN")}
                                                {module.updatedAt !== module.createdAt && (
                                                    <span> • Cập nhật: {new Date(module.updatedAt).toLocaleDateString("vi-VN")}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleEditModule(module)}>
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <DeletePopover
                                            title="Xóa Module"
                                            description={`Bạn có chắc chắn muốn xóa module "${module.title}"? Hành động này không thể hoàn tác.`}
                                            onDelete={() => handleDeleteModule(module)}
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingModule ? "Chỉnh sửa Module" : "Tạo Module mới"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingModule ? "Cập nhật thông tin module" : "Thêm module mới vào khóa học"}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="title">Tiêu đề Module *</Label>
                                <Input
                                    id="title"
                                    placeholder="Ví dụ: Giới thiệu về React"
                                    {...form.register("title")}
                                />
                                {form.formState.errors.title && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {form.formState.errors.title.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="description">Mô tả</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Mô tả nội dung module..."
                                    {...form.register("description")}
                                    rows={3}
                                />
                            </div>
                            <div>
                                <Label htmlFor="order">Thứ tự</Label>
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
                            <Button
                                type="submit"
                                disabled={createModuleMutation.isPending || updateModuleMutation.isPending}
                            >
                                {editingModule ? "Cập nhật" : "Tạo Module"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}