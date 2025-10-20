"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Loader2 } from "lucide-react";
import { Button, Input, SelectPicker, Modal } from "rsuite";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useCreateRoleMutation, useUpdateRoleMutation, useGetRoleQuery } from "@/queries/useRole";
import { CreateRoleBody, CreateRoleBodyType, UpdateRoleBody, UpdateRoleBodyType } from "@/schemaValidations/role.schema";
import { toast } from "@/hooks/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import commonStyles from "../../../shared/common/styles/common.module.css";

export default function RoleForm({
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
    const createRoleMutation = useCreateRoleMutation();
    const updateRoleMutation = useUpdateRoleMutation();
    const { data, refetch } = useGetRoleQuery({
        id: id as number,
        enabled: isEdit,
    });

    const form = useForm<CreateRoleBodyType | UpdateRoleBodyType>({
        resolver: zodResolver(isEdit ? UpdateRoleBody : CreateRoleBody),
        defaultValues: {
            name: "",
            displayName: "",
            description: "",
            order: undefined,
            code: "",
            priority: true,
            color: undefined,
        },
    });

    // Priority options
    const priorityOptions = useMemo(() => [
        { label: "Ưu tiên", value: "true" },
        { label: "Không ưu tiên", value: "false" }
    ], []);

    // Color options
    const colorOptions = useMemo(() => [
        { label: <span className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded-full bg-red-500" />Đỏ</span>, value: "bg-red-500" },
        { label: <span className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded-full bg-orange-500" />Cam</span>, value: "bg-orange-500" },
        { label: <span className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded-full bg-yellow-400" />Vàng</span>, value: "bg-yellow-400" },
        { label: <span className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded-full bg-green-500" />Xanh lá</span>, value: "bg-green-500" },
        { label: <span className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded-full bg-blue-500" />Xanh dương</span>, value: "bg-blue-500" },
        { label: <span className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded-full bg-indigo-500" />Chàm</span>, value: "bg-indigo-500" },
        { label: <span className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded-full bg-purple-500" />Tím</span>, value: "bg-purple-500" },
        { label: <span className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded-full bg-pink-500" />Hồng</span>, value: "bg-pink-500" },
        { label: <span className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded-full bg-gray-500" />Xám</span>, value: "bg-gray-500" },
        { label: <span className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded-full bg-black" />Đen</span>, value: "bg-black" },
    ], []);

    // Fill form when editing
    useEffect(() => {
        if (isEdit && data) {
            const { name, displayName, description, order, code, priority, color } = data.data;
            form.reset({
                name: name ?? "",
                displayName: displayName ?? "",
                description: description ?? "",
                order: order ?? undefined,
                code: code ?? "",
                priority: typeof priority === "boolean" ? priority : true,
                color: color ?? undefined,
            });
        }
        if (!isEdit) {
            form.reset({
                name: "",
                displayName: "",
                description: "",
                order: undefined,
                code: "",
                priority: true,
                color: undefined,
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
    const onSubmit = async (values: CreateRoleBodyType | UpdateRoleBodyType) => {
        if (isEdit) {
            if (updateRoleMutation.isPending) return;
            try {
                const body = { id: id as number, ...values };
                const result = await updateRoleMutation.mutateAsync(body);
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
                    description: error?.message ?? "Cập nhật vai trò thất bại",
                    duration: 2000,
                });
                handleErrorApi({ error, setError: form.setError });
            }
        } else {
            if (createRoleMutation.isPending) return;
            try {
                const result = await createRoleMutation.mutateAsync(values);
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
                    description: error?.message ?? "Tạo vai trò thất bại",
                    duration: 2000,
                });
                handleErrorApi({ error, setError: form.setError });
            }
        }
    };

    // Loading state
    const isPending = isEdit ? updateRoleMutation.isPending : createRoleMutation.isPending;

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
                        Thêm vai trò
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
                    <Modal.Title>{isEdit ? "Cập nhật vai trò" : "Thêm vai trò"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            noValidate
                            className="grid auto-rows-max items-start gap-4 md:gap-6"
                            id={isEdit ? "edit-role-form" : "create-role-form"}
                        >
                            <div className="grid gap-4">
                                {/* name */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                                <Label htmlFor="name" className="sm:col-span-1">Tên</Label>
                                                <div className="sm:col-span-3">
                                                    <Input
                                                        id="name"
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
                                {/* displayName */}
                                <FormField
                                    control={form.control}
                                    name="displayName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                                <Label htmlFor="displayName" className="sm:col-span-1">Tên hiển thị</Label>
                                                <div className="sm:col-span-3">
                                                    <Input
                                                        id="displayName"
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
                                {/* code */}
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                                <Label htmlFor="code" className="sm:col-span-1">Mã vai trò</Label>
                                                <div className="sm:col-span-3">
                                                    <Input
                                                        id="code"
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
                                {/* description */}
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                                <Label htmlFor="description" className="sm:col-span-1">Mô tả</Label>
                                                <div className="sm:col-span-3">
                                                    <Textarea
                                                        id="description"
                                                        className={commonStyles.inputField}
                                                        {...field}
                                                    />
                                                    <FormMessage />
                                                </div>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                {/* order */}
                                <FormField
                                    control={form.control}
                                    name="order"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                                <Label htmlFor="order" className="sm:col-span-1">Thứ tự</Label>
                                                <div className="sm:col-span-3">
                                                    <Input
                                                        id="order"
                                                        className={commonStyles.inputField}
                                                        value={field.value}
                                                        onChange={(value) => {
                                                            field.onChange(
                                                                value === "" ? 0 : parseInt(value as string, 10)
                                                            );
                                                        }}
                                                        type="number"
                                                        size="sm"
                                                    />
                                                    <FormMessage />
                                                </div>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                {/* priority */}
                                <FormField
                                    control={form.control}
                                    name="priority"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                                <Label htmlFor="priority" className="sm:col-span-1">Ưu tiên</Label>
                                                <div className="sm:col-span-3">
                                                    <SelectPicker
                                                        data={priorityOptions}
                                                        value={field.value ? "true" : "false"}
                                                        onChange={(value) => field.onChange(value === "true")}
                                                        placeholder="Chọn mức độ ưu tiên"
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
                                {/* color */}
                                <FormField
                                    control={form.control}
                                    name="color"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                                <Label htmlFor="color" className="sm:col-span-1">Màu sắc</Label>
                                                <div className="sm:col-span-3">
                                                    <SelectPicker
                                                        data={colorOptions}
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        placeholder="Chọn màu sắc"
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
                        form={isEdit ? "edit-role-form" : "create-role-form"}
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