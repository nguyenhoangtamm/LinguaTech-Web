"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Loader2 } from "lucide-react";
import { Button, Input, SelectPicker, Modal } from "rsuite";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useCreateUserMutation, useUpdateUserMutation, useGetUserQuery } from "@/queries/useUser";
import { CreateUserBodyType, UpdateUserBodyType, CreateUserBody, UpdateUserBody } from "@/schemaValidations/user.schema";
import { toast } from "@/hooks/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useGetAllRoleQuery } from "@/queries/useRole";
import commonStyles from "../../../shared/common/styles/common.module.css";

export default function UserForm({
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
    const createUserMutation = useCreateUserMutation();
    const updateUserMutation = useUpdateUserMutation();
    const { data: rolesData } = useGetAllRoleQuery();
    const { data, refetch } = useGetUserQuery({
        id: id as number,
        enabled: isEdit,
    });

    const form = useForm<CreateUserBodyType | UpdateUserBodyType>({
        resolver: zodResolver(isEdit ? UpdateUserBody : CreateUserBody),
        defaultValues: {
            username: "",
            fullname: "",
            email: "",
            password: "",
            role: "",
        },
    });

    // Role options
    const roleOptions = useMemo(() => {
        if (!rolesData?.data?.data) return [];
        return rolesData.data.data.map((role: any) => ({
            label: role.name,
            value: role.code || role.name,
        }));
    }, [rolesData]);

    // Fill form when editing
    useEffect(() => {
        if (isEdit && data) {
            const { username, fullname, email, role } = data.data;
            form.reset({
                username: username ?? "",
                fullname: fullname ?? "",
                email: email ?? "",
                role: role ?? "",
                // Don't set password for edit mode
            });
        }
        if (!isEdit) {
            form.reset({
                username: "",
                fullname: "",
                email: "",
                password: "",
                role: "",
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

    const onSubmit = async (values: CreateUserBodyType | UpdateUserBodyType) => {
        if (createUserMutation.isPending || updateUserMutation.isPending) return;
        try {
            let result: any;
            if (isEdit) {
                const updateData = { ...values } as UpdateUserBodyType;
                result = await updateUserMutation.mutateAsync({
                    id: id as number,
                    ...updateData,
                });
            } else {
                result = await createUserMutation.mutateAsync(values as CreateUserBodyType);
            }

            toast({
                title: result?.message || (isEdit ? "Cập nhật người dùng thành công" : "Tạo người dùng thành công"),
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
            const { username, fullname, email, role } = data.data;
            form.reset({
                username: username ?? "",
                fullname: fullname ?? "",
                email: email ?? "",
                role: role ?? "",
            });
        } else {
            form.reset({
                username: "",
                fullname: "",
                email: "",
                password: "",
                role: "",
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
                    Thêm người dùng
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
                        {isEdit ? "Cập nhật người dùng" : "Thêm mới người dùng"}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="py-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label className="text-sm font-medium text-gray-700">
                                                Tên đăng nhập *
                                            </Label>
                                            <Input
                                                {...field}
                                                placeholder="Nhập tên đăng nhập"
                                                className="w-full"
                                                disabled={isEdit} // Don't allow username change in edit mode
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="fullname"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label className="text-sm font-medium text-gray-700">
                                                Họ và tên *
                                            </Label>
                                            <Input
                                                {...field}
                                                placeholder="Nhập họ và tên"
                                                className="w-full"
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label className="text-sm font-medium text-gray-700">
                                                Email *
                                            </Label>
                                            <Input
                                                {...field}
                                                type="email"
                                                placeholder="Nhập email"
                                                className="w-full"
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label className="text-sm font-medium text-gray-700">
                                                Vai trò *
                                            </Label>
                                            <SelectPicker
                                                {...field}
                                                data={roleOptions}
                                                placeholder="Chọn vai trò"
                                                className="w-full"
                                                cleanable={false}
                                                searchable={false}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {!isEdit && (
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label className="text-sm font-medium text-gray-700">
                                                Mật khẩu *
                                            </Label>
                                            <Input
                                                {...field}
                                                type="password"
                                                placeholder="Nhập mật khẩu"
                                                className="w-full"
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
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
                        disabled={createUserMutation.isPending || updateUserMutation.isPending}
                        className="bg-primary text-white"
                    >
                        {createUserMutation.isPending || updateUserMutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        {isEdit ? "Cập nhật" : "Thêm mới"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}