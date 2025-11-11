"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Loader2 } from "lucide-react";
import { Button, Input, Modal, DatePicker } from "rsuite";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
    useCreateAssignmentMutation,
    useUpdateAssignmentMutation,
    useGetAssignmentQuery
} from "@/queries/useAssignment";
import {
    CreateAssignmentBody,
    CreateAssignmentBodyType,
    UpdateAssignmentBody,
    UpdateAssignmentBodyType
} from "@/schemaValidations/assignment.schema";
import { toast } from "@/hooks/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
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
    const { data, refetch } = useGetAssignmentQuery({
        id: id as number,
        enabled: isEdit,
    });

    const form = useForm<CreateAssignmentBodyType | UpdateAssignmentBodyType>({
        resolver: zodResolver(isEdit ? UpdateAssignmentBody : CreateAssignmentBody),
        defaultValues: {
            title: "",
            description: "",
            lessonId: undefined,
            maxScore: undefined,
            dueDate: "",
        },
    });

    // Fill form when editing
    useEffect(() => {
        if (isEdit && data?.data) {
            const assignment = data.data;
            form.reset({
                title: assignment.title ?? "",
                description: assignment.description ?? "",
                lessonId: assignment.lessonId,
                maxScore: assignment.maxScore,
                dueDate: assignment.dueDate ?? "",
            });
        }
        if (!isEdit) {
            form.reset({
                title: "",
                description: "",
                lessonId: undefined,
                maxScore: undefined,
                dueDate: "",
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, isEdit]);

    // Open modal for edit (always open if id), or for create (button click)
    useEffect(() => {
        if (isEdit && id) setOpen(true);
    }, [isEdit, id]);

    const reset = () => {
        form.reset();
        setOpen(false);
        setId && setId(undefined);
    };

    const onSubmit = async (values: CreateAssignmentBodyType | UpdateAssignmentBodyType) => {
        try {
            let result;
            if (isEdit) {
                result = await updateAssignmentMutation.mutateAsync({
                    id: id as number,
                    ...(values as Omit<UpdateAssignmentBodyType, 'id'>),
                });
            } else {
                result = await createAssignmentMutation.mutateAsync(
                    values as CreateAssignmentBodyType
                );
            }

            if (result?.data?.succeeded) {
                toast({
                    description: isEdit
                        ? "Cập nhật bài tập thành công"
                        : "Tạo bài tập thành công",
                });
                reset();
                onSubmitSuccess?.();
            }
        } catch (error: any) {
            handleErrorApi({
                error,
                setError: form.setError,
            });
        }
    };

    return (
        <>
            {triggerButton && (
                <Button
                    startIcon={<PlusCircle className="h-4 w-4" />}
                    onClick={() => setOpen(true)}
                    color="blue"
                    appearance="primary"
                >
                    Thêm bài tập
                </Button>
            )}

            <Modal open={open} onClose={reset} size="md">
                <Modal.Header>
                    <Modal.Title>
                        {isEdit ? "Chỉnh sửa bài tập" : "Thêm bài tập mới"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label htmlFor="title">
                                            Tiêu đề <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="title"
                                            placeholder="Nhập tiêu đề bài tập"
                                            {...field}
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
                                        <Label htmlFor="description">
                                            Mô tả <span className="text-red-500">*</span>
                                        </Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Nhập mô tả bài tập"
                                            {...field}
                                            rows={3}
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
                                        <Label htmlFor="lessonId">
                                            ID Bài học <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="lessonId"
                                            type="number"
                                            placeholder="Nhập ID bài học"
                                            value={field.value?.toString() || ""}
                                            onChange={(value) => field.onChange(Number(value) || undefined)}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="maxScore"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label htmlFor="maxScore">
                                            Điểm tối đa <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="maxScore"
                                            type="number"
                                            step="0.1"
                                            placeholder="Nhập điểm tối đa"
                                            value={field.value?.toString() || ""}
                                            onChange={(value) => field.onChange(Number(value) || undefined)}
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
                                        <Label htmlFor="dueDate">
                                            Hạn nộp <span className="text-red-500">*</span>
                                        </Label>
                                        <DatePicker
                                            format="yyyy-MM-dd HH:mm:ss"
                                            placeholder="Chọn hạn nộp"
                                            value={field.value ? new Date(field.value) : null}
                                            onChange={(date) => field.onChange(date?.toISOString() || "")}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={reset} appearance="subtle">
                        Hủy
                    </Button>
                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        color="blue"
                        appearance="primary"
                        loading={createAssignmentMutation.isPending || updateAssignmentMutation.isPending}
                        startIcon={
                            (createAssignmentMutation.isPending || updateAssignmentMutation.isPending) ?
                                <Loader2 className="h-4 w-4 animate-spin" /> : undefined
                        }
                    >
                        {isEdit ? "Cập nhật" : "Tạo mới"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}