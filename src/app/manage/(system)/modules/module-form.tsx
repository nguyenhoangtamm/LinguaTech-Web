"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Loader2 } from "lucide-react";
import { Button, Input, SelectPicker, Modal } from "rsuite";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useCreateModuleMutation, useUpdateModuleMutation, useGetModuleQuery } from "@/queries/useModule";
import { CreateModuleBodyType, UpdateModuleBodyType, CreateModuleBodySchema, UpdateModuleBodySchema } from "@/schemaValidations/module.schema";
import { toast } from "@/hooks/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useCoursesQuery } from "@/queries/useCourse";
import commonStyles from "../../../shared/common/styles/common.module.css";

export default function ModuleForm({
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
    const createModuleMutation = useCreateModuleMutation();
    const updateModuleMutation = useUpdateModuleMutation();
    const { data: moduleData } = useGetModuleQuery({ id: id as number, enabled: isEdit });
    const { data: coursesData } = useCoursesQuery({ pageNumber: 1, pageSize: 100 }); // Get all courses for selection

    const form = useForm<CreateModuleBodyType | UpdateModuleBodyType>({
        resolver: zodResolver(isEdit ? UpdateModuleBodySchema : CreateModuleBodySchema),
        defaultValues: {
            title: "",
            description: "",
            order: 0,
            courseId: 0,
        },
    });

    // Course options
    const courseOptions = useMemo(() => {
        if (!coursesData?.data?.data) return [];
        return coursesData.data.data.map((course: any) => ({
            label: course.title,
            value: course.id,
        }));
    }, [coursesData]);

    // Fill form when editing
    useEffect(() => {
        if (isEdit && moduleData) {
            const moduleItem = moduleData.data;
            form.reset({
                title: moduleItem.title ?? "",
                description: moduleItem.description ?? "",
                order: moduleItem.order ?? 0,
                courseId: moduleItem.courseId ?? 0,
            });
        }
        if (!isEdit) {
            form.reset({
                title: "",
                description: "",
                order: 0,
                courseId: 0,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [moduleData, isEdit]);

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

    const onSubmit = async (values: CreateModuleBodyType | UpdateModuleBodyType) => {
        if (createModuleMutation.isPending || updateModuleMutation.isPending) return;
        try {
            let result: any;
            if (isEdit) {
                const updateData = { ...values } as UpdateModuleBodyType;
                result = await updateModuleMutation.mutateAsync({
                    id: id as number,
                    ...updateData,
                });
            } else {
                result = await createModuleMutation.mutateAsync(values as CreateModuleBodyType);
            }

            toast({
                title: result?.message || (isEdit ? "Cập nhật module thành công" : "Tạo module thành công"),
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
        if (isEdit && moduleData) {
            const moduleItem = moduleData.data;
            form.reset({
                title: moduleItem.title ?? "",
                description: moduleItem.description ?? "",
                order: moduleItem.order ?? 0,
                courseId: moduleItem.courseId ?? 0,
            });
        } else {
            form.reset({
                title: "",
                description: "",
                order: 0,
                courseId: 0,
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
                    Thêm module
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
                        {isEdit ? "Cập nhật module" : "Thêm mới module"}
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
                                            placeholder="Nhập tiêu đề module"
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
                                            placeholder="Nhập mô tả module"
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
                                    name="courseId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label className="text-sm font-medium text-gray-700">
                                                Khóa học *
                                            </Label>
                                            <SelectPicker
                                                {...field}
                                                data={courseOptions}
                                                placeholder="Chọn khóa học"
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
                        disabled={createModuleMutation.isPending || updateModuleMutation.isPending}
                        className="bg-primary text-white"
                    >
                        {createModuleMutation.isPending || updateModuleMutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        {isEdit ? "Cập nhật" : "Thêm mới"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}