"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Loader2 } from "lucide-react";
import { Button, Input, SelectPicker, Modal, DatePicker } from "rsuite";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useCreateAssignmentMutation, useUpdateAssignmentMutation, useGetAssignmentQuery } from "@/queries/useAssignment";
import {
    CreateAssignmentBodyType,
    UpdateAssignmentBodyType,
    CreateAssignmentBodySchema,
    UpdateAssignmentBodySchema
} from "@/schemaValidations/assignment.schema";
import { toast } from "@/hooks/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useLessonsQuery } from "@/queries/useLesson";
import commonStyles from "../../../shared/common/styles/common.module.css";

export default function AssignmentForm({
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
    const createAssignmentMutation = useCreateAssignmentMutation();
    const updateAssignmentMutation = useUpdateAssignmentMutation();
    
    // Get lessons for select
    const { data: lessonsData } = useLessonsQuery({
        pageNumber: 1,
        pageSize: 100, // Get all lessons
        sortBy: "title",
        sortOrder: "asc",
    });
    
    const { data, refetch } = useGetAssignmentQuery({
        id: id as number,
        enabled: isEdit,
    });

    const form = useForm<CreateAssignmentBodyType | UpdateAssignmentBodyType>({
        resolver: zodResolver(isEdit ? UpdateAssignmentBodySchema : CreateAssignmentBodySchema),
        defaultValues: {
            lessonId: 0,
            title: "",
            description: "",
            dueDate: "",
            maxScore: 10,
        },
    });

    // Lesson options
    const lessonOptions = useMemo(() => {
        if (!lessonsData?.data?.data) return [];
        return lessonsData.data.data.map((lesson: any) => ({
            label: `${lesson.title} (${lesson.moduleTitle || lesson.courseTitle || ""})`,
            value: lesson.id,
        }));
    }, [lessonsData]);

    // Fill form when editing
    useEffect(() => {
        if (isEdit && data) {
            const assignmentData = data.data;
            form.reset({
                lessonId: assignmentData.lessonId ?? 0,
                title: assignmentData.title ?? "",
                description: assignmentData.description ?? "",
                dueDate: assignmentData.dueDate ?? "",
                maxScore: assignmentData.maxScore ?? 10,
            });
        }
        if (!isEdit) {
            form.reset({
                lessonId: 0,
                title: "",
                description: "",
                dueDate: "",
                maxScore: 10,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, isEdit]);

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

    const onSubmit = async (values: CreateAssignmentBodyType | UpdateAssignmentBodyType) => {
        if (createAssignmentMutation.isPending || updateAssignmentMutation.isPending) return;
        try {
            let result: any;
            if (isEdit) {
                result = await updateAssignmentMutation.mutateAsync({
                    id: id as number,
                    ...values as UpdateAssignmentBodyType,
                });
            } else {
                result = await createAssignmentMutation.mutateAsync(values as CreateAssignmentBodyType);
            }

            toast({
                title: result?.message || (isEdit ? "Cập nhật bài tập thành công" : "Tạo bài tập thành công"),
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
        if (isEdit && data) {
            const assignmentData = data.data;
            form.reset({
                lessonId: assignmentData.lessonId ?? 0,
                title: assignmentData.title ?? "",
                description: assignmentData.description ?? "",
                dueDate: assignmentData.dueDate ?? "",
                maxScore: assignmentData.maxScore ?? 10,
            });
        } else {
            form.reset({
                lessonId: 0,
                title: "",
                description: "",
                dueDate: "",
                maxScore: 10,
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
                    Thêm bài tập
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
                        {isEdit ? "Cập nhật bài tập" : "Thêm mới bài tập"}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="py-4 max-h-[70vh] overflow-y-auto">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                            searchable={true}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label className="text-sm font-medium text-gray-700">
                                            Tiêu đề bài tập *
                                        </Label>
                                        <Input
                                            {...field}
                                            placeholder="Nhập tiêu đề bài tập"
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
                                            Mô tả *
                                        </Label>
                                        <Textarea
                                            {...field}
                                            placeholder="Nhập mô tả bài tập"
                                            className="w-full min-h-[100px]"
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="maxScore"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label className="text-sm font-medium text-gray-700">
                                                Điểm tối đa *
                                            </Label>
                                            <Input
                                                {...field}
                                                type="number"
                                                min="0"
                                                step="0.1"
                                                placeholder="10"
                                                className="w-full"
                                                onChange={(value) => field.onChange(Number(value))}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="dueDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label className="text-sm font-medium text-gray-700">
                                                Hạn nộp *
                                            </Label>
                                            <DatePicker
                                                {...field}
                                                format="yyyy-MM-dd HH:mm"
                                                placeholder="Chọn ngày và giờ hạn nộp"
                                                className="w-full"
                                                showMeridian
                                                value={field.value ? new Date(field.value) : null}
                                                onChange={(date) => {
                                                    field.onChange(date ? date.toISOString() : "");
                                                }}
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
                        disabled={createAssignmentMutation.isPending || updateAssignmentMutation.isPending}
                        className="bg-primary text-white"
                    >
                        {createAssignmentMutation.isPending || updateAssignmentMutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        {isEdit ? "Cập nhật" : "Thêm mới"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}