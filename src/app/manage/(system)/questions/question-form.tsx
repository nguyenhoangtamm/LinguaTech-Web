"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Loader2 } from "lucide-react";
import { Button, Input, Modal } from "rsuite";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
    useCreateQuestionMutation,
    useUpdateQuestionMutation,
    useGetQuestionQuery
} from "@/queries/useQuestion";
import {
    CreateQuestionBody,
    CreateQuestionBodyType,
    UpdateQuestionBody,
    UpdateQuestionBodyType
} from "@/schemaValidations/question.schema";
import { toast } from "@/hooks/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

export default function QuestionForm({
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
    const createQuestionMutation = useCreateQuestionMutation();
    const updateQuestionMutation = useUpdateQuestionMutation();
    const { data, refetch } = useGetQuestionQuery({
        id: id as number,
        enabled: isEdit,
    });

    const form = useForm<CreateQuestionBodyType | UpdateQuestionBodyType>({
        resolver: zodResolver(isEdit ? UpdateQuestionBody : CreateQuestionBody),
        defaultValues: {
            content: "",
            score: undefined,
            assignmentId: undefined,
            questionTypeId: undefined,
        },
    });

    // Fill form when editing
    useEffect(() => {
        if (isEdit && data?.data) {
            const question = data.data;
            form.reset({
                content: question.content ?? "",
                score: question.score,
                assignmentId: question.assignmentId,
                questionTypeId: question.questionTypeId,
            });
        }
        if (!isEdit) {
            form.reset({
                content: "",
                score: undefined,
                assignmentId: undefined,
                questionTypeId: undefined,
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

    const onSubmit = async (values: CreateQuestionBodyType | UpdateQuestionBodyType) => {
        try {
            let result;
            if (isEdit) {
                result = await updateQuestionMutation.mutateAsync({
                    id: id as number,
                    ...(values as Omit<UpdateQuestionBodyType, 'id'>),
                });
            } else {
                result = await createQuestionMutation.mutateAsync(
                    values as CreateQuestionBodyType
                );
            }

            if (result?.data?.succeeded) {
                toast({
                    description: isEdit
                        ? "Cập nhật câu hỏi thành công"
                        : "Tạo câu hỏi thành công",
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
                    Thêm câu hỏi
                </Button>
            )}

            <Modal open={open} onClose={reset} size="md">
                <Modal.Header>
                    <Modal.Title>
                        {isEdit ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label htmlFor="content">
                                            Nội dung câu hỏi <span className="text-red-500">*</span>
                                        </Label>
                                        <Textarea
                                            id="content"
                                            placeholder="Nhập nội dung câu hỏi"
                                            {...field}
                                            rows={4}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="assignmentId"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label htmlFor="assignmentId">
                                            ID Bài tập <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="assignmentId"
                                            type="number"
                                            placeholder="Nhập ID bài tập"
                                            value={field.value?.toString() || ""}
                                            onChange={(value) => field.onChange(Number(value) || undefined)}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="questionTypeId"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label htmlFor="questionTypeId">
                                            ID Loại câu hỏi <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="questionTypeId"
                                            type="number"
                                            placeholder="Nhập ID loại câu hỏi"
                                            value={field.value?.toString() || ""}
                                            onChange={(value) => field.onChange(Number(value) || undefined)}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="score"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label htmlFor="score">
                                            Điểm <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="score"
                                            type="number"
                                            step="0.1"
                                            placeholder="Nhập điểm"
                                            value={field.value?.toString() || ""}
                                            onChange={(value) => field.onChange(Number(value) || undefined)}
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
                        loading={createQuestionMutation.isPending || updateQuestionMutation.isPending}
                        startIcon={
                            (createQuestionMutation.isPending || updateQuestionMutation.isPending) ?
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