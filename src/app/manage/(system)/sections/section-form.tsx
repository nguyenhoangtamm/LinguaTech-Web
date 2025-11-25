"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Loader2 } from "lucide-react";
import { Button, Input, SelectPicker, Modal } from "rsuite";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useCreateSectionMutation, useUpdateSectionMutation, useGetSectionQuery } from "@/queries/useSection";
import { CreateSectionBodyType, UpdateSectionBodyType, CreateSectionBodySchema, UpdateSectionBodySchema } from "@/schemaValidations/section.schema";
import { toast } from "@/hooks/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useLessonsQuery } from "@/queries/useLesson";
import commonStyles from "../../../shared/common/styles/common.module.css";

export default function SectionForm({
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
    const createSectionMutation = useCreateSectionMutation();
    const updateSectionMutation = useUpdateSectionMutation();
    const { data: sectionData } = useGetSectionQuery({ id: id as number, enabled: isEdit });
    const { data: lessonsData } = useLessonsQuery({ pageNumber: 1, pageSize: 100 }); // Get all lessons for selection

    const form = useForm<CreateSectionBodyType | UpdateSectionBodyType>({
        resolver: zodResolver(isEdit ? UpdateSectionBodySchema : CreateSectionBodySchema),
        defaultValues: {
            title: "",
            content: "",
            order: 0,
            lessonId: 0,
        },
    });

    // Lesson options
    const lessonOptions = useMemo(() => {
        if (!lessonsData?.data) return [];
        return lessonsData.data.map((lesson: any) => ({
            label: lesson.title,
            value: lesson.id,
        }));
    }, [lessonsData]);

    // Fill form when editing
    useEffect(() => {
        if (isEdit && sectionData) {
            const sectionItem = sectionData.data;
            form.reset({
                title: sectionItem.title ?? "",
                content: sectionItem.content ?? "",
                order: sectionItem.order ?? 0,
                lessonId: sectionItem.lessonId ?? 0,
            });
        }
        if (!isEdit) {
            form.reset({
                title: "",
                content: "",
                order: 0,
                lessonId: 0,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sectionData, isEdit]);

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

    const onSubmit = async (values: CreateSectionBodyType | UpdateSectionBodyType) => {
        if (createSectionMutation.isPending || updateSectionMutation.isPending) return;
        try {
            let result: any;
            if (isEdit) {
                const { id: _omitId, ...updateData } = values as UpdateSectionBodyType;
                result = await updateSectionMutation.mutateAsync({
                    id: id as number,
                    ...updateData,
                });
            } else {
                result = await createSectionMutation.mutateAsync(values as CreateSectionBodyType);
            }

            toast({
                title: result?.message || (isEdit ? "Cập nhật phần học thành công" : "Tạo phần học thành công"),
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
        if (isEdit && sectionData) {
            const sectionItem = sectionData.data;
            form.reset({
                title: sectionItem.title ?? "",
                content: sectionItem.content ?? "",
                order: sectionItem.order ?? 0,
                lessonId: sectionItem.lessonId ?? 0,
            });
        } else {
            form.reset({
                title: "",
                content: "",
                order: 0,
                lessonId: 0,
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
                    Thêm phần học
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
                        {isEdit ? "Cập nhật phần học" : "Thêm mới phần học"}
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
                                            placeholder="Nhập tiêu đề phần học"
                                            className="w-full"
                                        />
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
                                            Nội dung *
                                        </Label>
                                        <Textarea
                                            {...field}
                                            placeholder="Nhập nội dung phần học"
                                            className="w-full"
                                            rows={5}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                                <FormField
                                    control={form.control}
                                    name="lessonId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label className="text-sm font-medium text-gray-700">
                                                Bài học *
                                            </Label>
                                            <SelectPicker
                                                {...field}
                                                data={lessonOptions}
                                                placeholder="Chọn bài học"
                                                className="w-full"
                                                cleanable={false}
                                                searchable
                                                onChange={(value) => field.onChange(Number(value))}
                                                value={field.value?.toString() || ""}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
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
                        disabled={createSectionMutation.isPending || updateSectionMutation.isPending}
                        className="bg-primary text-white"
                    >
                        {createSectionMutation.isPending || updateSectionMutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        {isEdit ? "Cập nhật" : "Thêm mới"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
