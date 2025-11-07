"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Loader2 } from "lucide-react";
import { Button, Input, SelectPicker, Modal } from "rsuite";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useCreateSubmission, useUpdateSubmission, useSubmission } from "@/queries/useSubmission";
import {
    CreateSubmissionBodySchema,
    CreateSubmissionBodyType,
    UpdateSubmissionBodySchema,
    UpdateSubmissionBodyType,
    SubmissionStatus
} from "@/schemaValidations/submission.schema";
import { toast } from "@/hooks/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import commonStyles from "../../../shared/common/styles/common.module.css";

export default function SubmissionForm({
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
    const createSubmissionMutation = useCreateSubmission();
    const updateSubmissionMutation = useUpdateSubmission();
    const { data, refetch } = useSubmission(id as number);

    // Get data for select options - will be implemented later
    const assignmentsData = useMemo(() => ({ data: [] }), []);
    const usersData = useMemo(() => ({ data: [] }), []);

    const form = useForm<CreateSubmissionBodyType | UpdateSubmissionBodyType>({
        resolver: zodResolver(isEdit ? UpdateSubmissionBodySchema : CreateSubmissionBodySchema),
        defaultValues: {
            assignmentId: 0,
            userId: 0,
            fileUrl: "",
            score: undefined,
            feedback: "",
            status: SubmissionStatus.DRAFT,
        },
    });

    // Status options
    const statusOptions = useMemo(() => [
        { label: "Draft", value: SubmissionStatus.DRAFT },
        { label: "Submitted", value: SubmissionStatus.SUBMITTED },
        { label: "Graded", value: SubmissionStatus.GRADED },
        { label: "Returned", value: SubmissionStatus.RETURNED },
    ], []);

    // Assignment options
    const assignmentOptions = useMemo(() => {
        if (!assignmentsData?.data) return [];
        return assignmentsData.data.map((assignment: any) => ({
            label: assignment.title,
            value: assignment.id,
        }));
    }, [assignmentsData]);

    // User options
    const userOptions = useMemo(() => {
        if (!usersData?.data) return [];
        return usersData.data.map((user: any) => ({
            label: `${user.firstName} ${user.lastName} (${user.email})`,
            value: user.id,
        }));
    }, [usersData]);

    // Fill form when editing
    useEffect(() => {
        if (isEdit && data) {
            const { assignmentId, userId, fileUrl, score, feedback, status } = data.data;
            form.reset({
                assignmentId: assignmentId ?? 0,
                userId: userId ?? 0,
                fileUrl: fileUrl ?? "",
                score: score ?? undefined,
                feedback: feedback ?? "",
                status: status ?? SubmissionStatus.DRAFT,
            });
        }
        if (!isEdit) {
            form.reset({
                assignmentId: 0,
                userId: 0,
                fileUrl: "",
                score: undefined,
                feedback: "",
                status: SubmissionStatus.DRAFT,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, isEdit]);

    // Open modal for edit (always open if id), or for create (button click)
    useEffect(() => {
        if (isEdit && id) setOpen(true);
    }, [isEdit, id]);

    // Close/reset handler
    const handleClose = () => {
        form.reset();
        setOpen(false);
    };

    // onExited handler for Modal
    const handleExited = () => {
        setId && setId(undefined);
    };

    // Submit handler
    const onSubmit = async (values: CreateSubmissionBodyType | UpdateSubmissionBodyType) => {
        if (isEdit) {
            if (updateSubmissionMutation.isPending) return;
            try {
                const body = { id: id as number, ...values };
                const result = await updateSubmissionMutation.mutateAsync({ id: id as number, body });
                toast({
                    variant: "success",
                    description: result?.message,
                    duration: 1000,
                });
                refetch && refetch();
                onSubmitSuccess && onSubmitSuccess();
                handleClose();
            } catch (error: any) {
                toast({
                    variant: "danger",
                    description: error?.message ?? "Cập nhật submission thất bại",
                    duration: 2000,
                });
                handleErrorApi({ error, setError: form.setError });
            }
        } else {
            if (createSubmissionMutation.isPending) return;
            try {
                const result = await createSubmissionMutation.mutateAsync(values);
                toast({
                    variant: "success",
                    description: result?.message,
                    duration: 1000,
                });
                form.reset();
                onSubmitSuccess && onSubmitSuccess();
                handleClose();
            } catch (error: any) {
                toast({
                    variant: "danger",
                    description: error?.message ?? "Tạo submission thất bại",
                    duration: 2000,
                });
                handleErrorApi({ error, setError: form.setError });
            }
        }
    };

    // Loading state
    const isPending = isEdit ? updateSubmissionMutation.isPending : createSubmissionMutation.isPending;

    return (
        <>
            {/* Trigger button for create only */}
            {!isEdit && triggerButton && (
                <Button
                    appearance="primary"
                    startIcon={<PlusCircle className="h-3.5 w-3.5" />}
                    size="sm"
                    onClick={() => setOpen(true)}
                    className="h-7 gap-1"
                >
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Thêm submission
                    </span>
                </Button>
            )}
            <Modal
                open={open}
                onClose={handleClose}
                size="md"
                backdrop="static"
                onExited={handleExited}
            >
                <Modal.Header>
                    <Modal.Title>{isEdit ? "Cập nhật submission" : "Thêm submission"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            noValidate
                            className="grid auto-rows-max items-start gap-4 md:gap-6"
                            id={isEdit ? "edit-submission-form" : "create-submission-form"}
                        >
                            <div className="grid gap-4">
                                {/* assignmentId */}
                                <FormField
                                    control={form.control}
                                    name="assignmentId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                                <Label htmlFor="assignmentId" className="sm:col-span-1">Assignment</Label>
                                                <div className="sm:col-span-3">
                                                    <SelectPicker
                                                        data={assignmentOptions}
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        placeholder="Chọn assignment"
                                                        className={commonStyles.selectPicker}
                                                        size="sm"
                                                        menuClassName={commonStyles.selectPickerMenu}
                                                    />
                                                    <FormMessage />
                                                </div>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                {/* userId */}
                                <FormField
                                    control={form.control}
                                    name="userId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                                <Label htmlFor="userId" className="sm:col-span-1">User</Label>
                                                <div className="sm:col-span-3">
                                                    <SelectPicker
                                                        data={userOptions}
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        placeholder="Chọn user"
                                                        className={commonStyles.selectPicker}
                                                        size="sm"
                                                        menuClassName={commonStyles.selectPickerMenu}
                                                    />
                                                    <FormMessage />
                                                </div>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                {/* fileUrl */}
                                <FormField
                                    control={form.control}
                                    name="fileUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                                <Label htmlFor="fileUrl" className="sm:col-span-1">File URL</Label>
                                                <div className="sm:col-span-3">
                                                    <Input
                                                        id="fileUrl"
                                                        {...field}
                                                        size="sm"
                                                        className={commonStyles.inputField}
                                                    />
                                                    <FormMessage />
                                                </div>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                {/* score */}
                                <FormField
                                    control={form.control}
                                    name="score"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                                <Label htmlFor="score" className="sm:col-span-1">Điểm</Label>
                                                <div className="sm:col-span-3">
                                                    <Input
                                                        id="score"
                                                        className={commonStyles.inputField}
                                                        value={field.value ?? ""}
                                                        onChange={(value) => {
                                                            field.onChange(
                                                                value === "" ? undefined : parseFloat(value as string)
                                                            );
                                                        }}
                                                        type="number"
                                                        step="0.1"
                                                        size="sm"
                                                    />
                                                    <FormMessage />
                                                </div>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                {/* feedback */}
                                <FormField
                                    control={form.control}
                                    name="feedback"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                                <Label htmlFor="feedback" className="sm:col-span-1">Phản hồi</Label>
                                                <div className="sm:col-span-3">
                                                    <Textarea
                                                        id="feedback"
                                                        className={commonStyles.inputField}
                                                        {...field}
                                                    />
                                                    <FormMessage />
                                                </div>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                {/* status */}
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                                <Label htmlFor="status" className="sm:col-span-1">Trạng thái</Label>
                                                <div className="sm:col-span-3">
                                                    <SelectPicker
                                                        data={statusOptions}
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        placeholder="Chọn trạng thái"
                                                        className={commonStyles.selectPicker}
                                                        size="sm"
                                                        menuClassName={commonStyles.selectPickerMenu}
                                                    />
                                                    <FormMessage />
                                                </div>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </form>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose} appearance="default" size="sm">
                        Hủy
                    </Button>
                    <Button
                        appearance="primary"
                        type="submit"
                        form={isEdit ? "edit-submission-form" : "create-submission-form"}
                        className="w-full sm:w-auto"
                        size="sm"
                        disabled={isPending}
                    >
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isPending ? "Đang lưu..." : (isEdit ? "Cập nhật" : "Thêm")}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}