"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Loader2 } from "lucide-react";
import { Button, Input, SelectPicker, Modal, DatePicker } from "rsuite";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useCreateClassMutation, useUpdateClassMutation, useGetClassQuery } from "@/queries/useClass";
import {
    CreateClassBodyType,
    UpdateClassBodyType,
    CreateClassBodySchema,
    UpdateClassBodySchema
} from "@/schemaValidations/class.schema";
import { toast } from "@/hooks/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useCoursesManagementWithPagination } from "@/queries/useCourseManagement";
import commonStyles from "../../../shared/common/styles/common.module.css";

export default function ClassForm({
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
    const createClassMutation = useCreateClassMutation();
    const updateClassMutation = useUpdateClassMutation();

    // Get courses for select
    const { data: coursesData } = useCoursesManagementWithPagination({
        pageNumber: 1,
        pageSize: 100, // Get all courses
        sortBy: "title",
        sortOrder: "asc",
    });

    const { data, refetch } = useGetClassQuery({
        id: id as number,
        enabled: isEdit,
    });

    const form = useForm<CreateClassBodyType | UpdateClassBodyType>({
        resolver: zodResolver(isEdit ? UpdateClassBodySchema : CreateClassBodySchema),
        defaultValues: {
            courseId: 0,
            name: "",
            startDate: "",
            endDate: "",
            schedule: "",
            location: "",
            maxStudents: 30,
            teacherName: "",
            status: "upcoming",
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

    // Status options
    const statusOptions = useMemo(() => [
        { label: "Chưa bắt đầu", value: "upcoming" },
        { label: "Đang diễn ra", value: "ongoing" },
        { label: "Đã kết thúc", value: "completed" },
        { label: "Đã hủy", value: "cancelled" },
    ], []);

    // Fill form when editing
    useEffect(() => {
        if (isEdit && data) {
            const classData = data.data;
            form.reset({
                courseId: classData.courseId ?? 0,
                name: classData.name ?? "",
                startDate: classData.startDate ?? "",
                endDate: classData.endDate ?? "",
                schedule: classData.schedule ?? "",
                location: classData.location ?? "",
                maxStudents: classData.maxStudents ?? 30,
                teacherName: classData.teacherName ?? "",
                status: classData.status ?? "upcoming",
            });
        }
        if (!isEdit) {
            form.reset({
                courseId: 0,
                name: "",
                startDate: "",
                endDate: "",
                schedule: "",
                location: "",
                maxStudents: 30,
                teacherName: "",
                status: "upcoming",
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

    const onSubmit = async (values: CreateClassBodyType | UpdateClassBodyType) => {
        if (createClassMutation.isPending || updateClassMutation.isPending) return;
        try {
            let result: any;
            if (isEdit) {
                result = await updateClassMutation.mutateAsync({
                    ...values as UpdateClassBodyType,
                    id: id as number,
                });
            } else {
                result = await createClassMutation.mutateAsync(values as CreateClassBodyType);
            }

            toast({
                title: result?.message || (isEdit ? "Cập nhật lớp học thành công" : "Tạo lớp học thành công"),
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
            const classData = data.data;
            form.reset({
                courseId: classData.courseId ?? 0,
                name: classData.name ?? "",
                startDate: classData.startDate ?? "",
                endDate: classData.endDate ?? "",
                schedule: classData.schedule ?? "",
                location: classData.location ?? "",
                maxStudents: classData.maxStudents ?? 30,
                teacherName: classData.teacherName ?? "",
                status: classData.status ?? "upcoming",
            });
        } else {
            form.reset({
                courseId: 0,
                name: "",
                startDate: "",
                endDate: "",
                schedule: "",
                location: "",
                maxStudents: 30,
                teacherName: "",
                status: "upcoming",
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
                    Thêm lớp học
                </Button>
            )}

            <Modal
                open={open}
                onClose={() => handleOpenChange(false)}
                size="lg"
                className={commonStyles.customModalOverlay}
                backdropClassName={commonStyles.customModalBackdrop}
            >
                <Modal.Header>
                    <Modal.Title className="text-lg font-semibold text-gray-900">
                        {isEdit ? "Cập nhật lớp học" : "Thêm mới lớp học"}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="py-4 max-h-[70vh] overflow-y-auto">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                searchable={true}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label className="text-sm font-medium text-gray-700">
                                                Tên lớp học *
                                            </Label>
                                            <Input
                                                {...field}
                                                placeholder="Nhập tên lớp học"
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
                                    name="teacherName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label className="text-sm font-medium text-gray-700">
                                                Tên giáo viên *
                                            </Label>
                                            <Input
                                                {...field}
                                                placeholder="Nhập tên giáo viên"
                                                className="w-full"
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="maxStudents"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label className="text-sm font-medium text-gray-700">
                                                Số học viên tối đa *
                                            </Label>
                                            <Input
                                                {...field}
                                                type="number"
                                                min="1"
                                                placeholder="30"
                                                className="w-full"
                                                onChange={(value) => field.onChange(Number(value))}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label className="text-sm font-medium text-gray-700">
                                                Ngày bắt đầu *
                                            </Label>
                                            <DatePicker
                                                {...field}
                                                format="yyyy-MM-dd"
                                                placeholder="Chọn ngày bắt đầu"
                                                className="w-full"
                                                value={field.value ? new Date(field.value) : null}
                                                onChange={(date) => {
                                                    field.onChange(date ? date.toISOString() : "");
                                                }}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="endDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label className="text-sm font-medium text-gray-700">
                                                Ngày kết thúc *
                                            </Label>
                                            <DatePicker
                                                {...field}
                                                format="yyyy-MM-dd"
                                                placeholder="Chọn ngày kết thúc"
                                                className="w-full"
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="schedule"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label className="text-sm font-medium text-gray-700">
                                                Lịch học *
                                            </Label>
                                            <Input
                                                {...field}
                                                placeholder="VD: Thứ 2, 4, 6 - 19:00-21:00"
                                                className="w-full"
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label className="text-sm font-medium text-gray-700">
                                                Địa điểm *
                                            </Label>
                                            <Input
                                                {...field}
                                                placeholder="Nhập địa điểm học"
                                                className="w-full"
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label className="text-sm font-medium text-gray-700">
                                            Trạng thái *
                                        </Label>
                                        <SelectPicker
                                            {...field}
                                            data={statusOptions}
                                            placeholder="Chọn trạng thái"
                                            className="w-full"
                                            cleanable={false}
                                            searchable={false}
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
                        disabled={createClassMutation.isPending || updateClassMutation.isPending}
                        className="bg-primary text-white"
                    >
                        {createClassMutation.isPending || updateClassMutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        {isEdit ? "Cập nhật" : "Thêm mới"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}