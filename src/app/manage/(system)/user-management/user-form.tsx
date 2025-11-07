"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Loader2 } from "lucide-react";
import { Button, Input, Modal, SelectPicker } from "rsuite";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
    useCreateUserMutation,
    useUpdateUserMutation,
    useGetUserQuery
} from "@/queries/useUser";
import {
    CreateUserBody,
    CreateUserBodyType,
    UpdateUserBody,
    UpdateUserBodyType,
    Gender,
    UserStatus
} from "@/schemaValidations/user.schema";
import { toast } from "@/hooks/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { useGetAllRoleQuery } from "@/queries/useRole";

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
    const { data: userData, refetch } = useGetUserQuery({
        id: id as number,
        enabled: isEdit,
    });
    const { data: rolesData } = useGetAllRoleQuery();

    const form = useForm<CreateUserBodyType | UpdateUserBodyType>({
        resolver: zodResolver(isEdit ? UpdateUserBody : CreateUserBody),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            gender: "Male",
            roleId: undefined,
            status: "Active",
        },
    });

    // Role options
    const roleOptions = useMemo(() => {
        return rolesData?.data?.data?.map((role: any) => ({
            label: role.name,
            value: role.id
        })) || [];
    }, [rolesData]);

    // Gender options
    const genderOptions = useMemo(() => [
        { label: "Nam", value: "Male" },
        { label: "Nữ", value: "Female" },
        { label: "Khác", value: "Other" }
    ], []);

    // Status options
    const statusOptions = useMemo(() => [
        { label: "Hoạt động", value: "Active" },
        { label: "Không hoạt động", value: "Inactive" },
        { label: "Tạm khóa", value: "Suspended" }
    ], []);

    // Fill form when editing
    useEffect(() => {
        if (isEdit && userData?.data) {
            const user = userData.data;
            form.reset({
                username: user.username ?? "",
                email: user.email ?? "",
                firstName: user.profile?.firstName ?? "",
                lastName: user.profile?.lastName ?? "",
                gender: user.profile?.gender ?? "Male",
                roleId: user.roleId,
                status: user.status ?? "Active",
                // Don't populate password for edit
            });
        }
        if (!isEdit) {
            form.reset({
                username: "",
                email: "",
                password: "",
                firstName: "",
                lastName: "",
                gender: "Male",
                roleId: undefined,
                status: "Active",
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userData, isEdit]);

    // Open modal for edit (always open if id), or for create (button click)
    useEffect(() => {
        if (isEdit && id) setOpen(true);
    }, [isEdit, id]);

    const reset = () => {
        form.reset();
        setOpen(false);
        setId && setId(undefined);
    };

    const onSubmit = async (values: CreateUserBodyType | UpdateUserBodyType) => {
        try {
            let result;
            if (isEdit) {
                result = await updateUserMutation.mutateAsync({
                    id: id as number,
                    ...(values as Omit<UpdateUserBodyType, 'id'>),
                });
            } else {
                result = await createUserMutation.mutateAsync(
                    values as CreateUserBodyType
                );
            }

            if (result?.data?.succeeded) {
                toast({
                    description: isEdit
                        ? "Cập nhật người dùng thành công"
                        : "Tạo người dùng thành công",
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
                    Thêm người dùng
                </Button>
            )}

            <Modal open={open} onClose={reset} size="md">
                <Modal.Header>
                    <Modal.Title>
                        {isEdit ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label htmlFor="username">
                                            Tên đăng nhập <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="username"
                                            placeholder="Nhập tên đăng nhập"
                                            {...field}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label htmlFor="email">
                                            Email <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Nhập email"
                                            {...field}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {!isEdit && (
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label htmlFor="password">
                                                Mật khẩu <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="Nhập mật khẩu"
                                                {...field}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label htmlFor="firstName">
                                                Họ <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="firstName"
                                                placeholder="Nhập họ"
                                                {...field}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label htmlFor="lastName">
                                                Tên <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="lastName"
                                                placeholder="Nhập tên"
                                                {...field}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label htmlFor="gender">
                                            Giới tính <span className="text-red-500">*</span>
                                        </Label>
                                        <SelectPicker
                                            data={genderOptions}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Chọn giới tính"
                                            block
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="roleId"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label htmlFor="roleId">
                                            Vai trò <span className="text-red-500">*</span>
                                        </Label>
                                        <SelectPicker
                                            data={roleOptions}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Chọn vai trò"
                                            block
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {isEdit && (
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label htmlFor="status">Trạng thái</Label>
                                            <SelectPicker
                                                data={statusOptions}
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Chọn trạng thái"
                                                block
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
                    <Button onClick={reset} appearance="subtle">
                        Hủy
                    </Button>
                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        color="blue"
                        appearance="primary"
                        loading={createUserMutation.isPending || updateUserMutation.isPending}
                        startIcon={
                            (createUserMutation.isPending || updateUserMutation.isPending) ?
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