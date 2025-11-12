"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Loader2 } from "lucide-react";
import { Button, Input, SelectPicker, Modal, Checkbox } from "rsuite";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useCreateLessonMutation, useUpdateLessonMutation, useLessonQuery } from "@/queries/useLesson";
import { CreateLessonBodyType, UpdateLessonBodyType, CreateLessonSchema, UpdateLessonSchema } from "@/schemaValidations/lesson.schema";
import { toast } from "@/hooks/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useModulesByCourseQuery } from "@/queries/useLesson";
import commonStyles from "../../../shared/common/styles/common.module.css";

export default function LessonForm({
    id,
    setId,
    onSubmitSuccess,
    triggerButton = true,
}: {
    id?: number | undefined;
    setId?: (id: number | undefined) => void;
    onSubmitSuccess?: () => void;
    triggerButton?: boolean;
}) {
    const isEdit = typeof id === "number" && id !== undefined;
    const [open, setOpen] = useState(false);
    const createLessonMutation = useCreateLessonMutation();
    const updateLessonMutation = useUpdateLessonMutation();
    const { data: lessonData } = useLessonQuery(id, isEdit);
    const { data: modulesData } = useModulesByCourseQuery(); // Need to get all modules or by course

    const form = useForm<CreateLessonBodyType | UpdateLessonBodyType>({
        resolver: zodResolver(isEdit ? UpdateLessonSchema : CreateLessonSchema),
        defaultValues: {
            title: "",
            description: "",
            content: "",
            duration: 0,
            order: 0,
            moduleId: "",
            isPublished: false,
        },
    });

    // Module options - for now empty, need to implement proper module fetching
    const moduleOptions = useMemo(() => {
        if (!modulesData?.data) return [];
        return modulesData.data.map((module: any) => ({
            label: module.title,
            value: module.id,
        }));
    }, [modulesData]);

    // Fill form when editing
    useEffect(() => {
        if (isEdit && lessonData) {
            const lesson = lessonData.data;
            form.reset({
                title: lesson.title ?? "",
                description: lesson.description ?? "",
                content: lesson.content ?? "",
                duration: lesson.duration ?? 0,
                order: lesson.order ?? 0,
                moduleId: lesson.moduleId ?? "",
                isPublished: lesson.isPublished ?? false,
            });
        }
        if (!isEdit) {
            form.reset({
                title: "",
                description: "",
                content: "",
                duration: 0,
                order: 0,
                moduleId: "",
                isPublished: false,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lessonData, isEdit]);

    // Open modal for edit (always open if id), or for create (button click)
    useEffect(() => {
        if (isEdit && id) setOpen(true);
    }, [id, isEdit]);

    const handleOpenChange = (open: boolean) => {
        setOpen(open);
        if (!open) {
            setId?.(undefined);
            form.reset();
        }
    };

    const onSubmit = async (values: CreateLessonBodyType | UpdateLessonBodyType) => {
        if (createLessonMutation.isPending || updateLessonMutation.isPending) return;
        try {
            let result: any;
            if (isEdit) {
                const updateData = { ...values } as UpdateLessonBodyType;
                result = await updateLessonMutation.mutateAsync({
                    id: id as number,
                    data: updateData,
                });
            } else {
                result = await createLessonMutation.mutateAsync(values as CreateLessonBodyType);
            }

            toast({
                title: result?.message || (isEdit ? "Cập nhật bài học thành công" : "Tạo bài học thành công"),
                variant: "success",
                duration: 1000,
            });
            handleOpenChange(false);
            onSubmitSuccess?.();
        } catch (error) {
            handleErrorApi({
                error,
                setError: form.setError,
            });
        }
    };

    const reset = () => {
        if (isEdit && lessonData) {
            const lesson = lessonData.data;
            form.reset({
                title: lesson.title ?? "",
                description: lesson.description ?? "",
                content: lesson.content ?? "",
                duration: lesson.duration ?? 0,
                order: lesson.order ?? 0,
                moduleId: lesson.moduleId ?? "",
                isPublished: lesson.isPublished ?? false,
            });
        } else {
            form.reset({
                title: "",
                description: "",
                content: "",
                duration: 0,
                order: 0,
                moduleId: "",
                isPublished: false,
            });
        }
    };

    return (
        <>
            {triggerButton && (
                <Button
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md shadow-sm border-0"
                    onClick={() => setOpen(true)}
                    startIcon={<PlusCircle className="w-4 h-4" />}
                >
                    Thêm bài học
                </Button>
            )}

            <Modal
                open={open}
                onClose={() => handleOpenChange(false)}
                size="md"
                className={commonStyles.customModalOverlay}
                backdropClassName={commonStyles.customModalBackdrop}
            >
                <Modal.Header>
                    <Modal.Title className="text-lg font-semibold text-gray-900">
                        {isEdit ? "Cập nhật bài học" : "Thêm mới bài học"}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="py-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label className="text-sm font-medium text-gray-700">
                                            Tiêu đề *
                                        </Label>
                                        <Input
                                            {...field}
                                            placeholder="Nhập tiêu đề bài học"
                                            className="w-full"
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label className="text-sm font-medium text-gray-700">
                                            Mô tả
                                        </Label>
                                        <Textarea
                                            {...field}
                                            placeholder="Nhập mô tả bài học"
                                            className="w-full"
                                            rows={3}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="duration"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label className="text-sm font-medium text-gray-700">
                                                Thời lượng (phút) *
                                            </Label>
                                            <Input
                                                {...field}
                                                type="number"
                                                placeholder="Nhập thời lượng"
                                                className="w-full"
                                                onChange={(value) => field.onChange(Number(value))}
                                                value={field.value?.toString() || ""}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="order"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label className="text-sm font-medium text-gray-700">
                                                Thứ tự *
                                            </Label>
                                            <Input
                                                {...field}
                                                type="number"
                                                placeholder="Nhập thứ tự"
                                                className="w-full"
                                                onChange={(value) => field.onChange(Number(value))}
                                                value={field.value?.toString() || ""}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="moduleId"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label className="text-sm font-medium text-gray-700">
                                            Module *
                                        </Label>
                                        <SelectPicker
                                            {...field}
                                            data={moduleOptions}
                                            placeholder="Chọn module"
                                            className="w-full"
                                            cleanable={false}
                                            searchable
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="isPublished"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                {...field}
                                                checked={field.value}
                                                onChange={(value) => field.onChange(value)}
                                            />
                                            <Label className="text-sm font-medium text-gray-700">
                                                Xuất bản
                                            </Label>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label className="text-sm font-medium text-gray-700">
                                            Nội dung
                                        </Label>
                                        <Textarea
                                            {...field}
                                            placeholder="Nhập nội dung bài học"
                                            className="w-full"
                                            rows={5}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        onClick={() => handleOpenChange(false)}
                        appearance="subtle"
                        className="mr-2"
                    >
                        Hủy
                    </Button>
                    <Button
                        appearance="ghost"
                        className="mr-2"
                        onClick={reset}
                    >
                        Đặt lại
                    </Button>
                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        appearance="primary"
                        disabled={createLessonMutation.isPending || updateLessonMutation.isPending}
                        className="bg-primary text-white"
                    >
                        {createLessonMutation.isPending || updateLessonMutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        {isEdit ? "Cập nhật" : "Thêm mới"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}