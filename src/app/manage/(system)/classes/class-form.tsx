"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { handleErrorApi } from "@/lib/utils";
import {
    CreateClassBodyType,
    CreateClassBodySchema,
    ClassType
} from "@/schemaValidations/class.schema";
import {
    useCreateClassMutation,
    useUpdateClassMutation,
    useGetClassQuery
} from "@/queries/useClass";
import { useCoursesManagementWithPagination } from "@/queries/useCourseManagement";
import { useEffect } from "react";

interface ClassFormProps {
    classId?: number;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const classStatuses = [
    { value: "draft", label: "Nháp" },
    { value: "published", label: "Đã xuất bản" },
    { value: "ongoing", label: "Đang diễn ra" },
    { value: "completed", label: "Đã hoàn thành" },
    { value: "cancelled", label: "Đã hủy" },
];

export default function ClassForm({ classId, onSuccess, onCancel }: ClassFormProps) {
    const isEdit = !!classId;

    const { data: classData } = useGetClassQuery({
        id: classId!,
        enabled: isEdit
    });

    const { data: coursesData } = useCoursesManagementWithPagination({
        pageNumber: 1,
        pageSize: 100,
    });

    const createClassMutation = useCreateClassMutation();
    const updateClassMutation = useUpdateClassMutation();

    const form = useForm<CreateClassBodyType>({
        resolver: zodResolver(CreateClassBodySchema),
        defaultValues: {
            courseId: 0,
            name: "",
            startDate: "",
            endDate: "",
            schedule: "",
            location: "",
            maxStudents: 30,
            teacherName: "",
            status: "draft",
        },
    });

    // Populate form when editing
    useEffect(() => {
        if (isEdit && classData?.data) {
            const classInfo = classData.data;
            form.reset({
                courseId: classInfo.courseId,
                name: classInfo.name,
                startDate: classInfo.startDate.split('T')[0], // Format for date input
                endDate: classInfo.endDate.split('T')[0],
                schedule: classInfo.schedule,
                location: classInfo.location,
                maxStudents: classInfo.maxStudents,
                teacherName: classInfo.teacherName,
                status: classInfo.status,
            });
        }
    }, [classData, form, isEdit]);

    const onSubmit = async (data: CreateClassBodyType) => {
        try {
            // Format dates to ISO string
            const submitData = {
                ...data,
                startDate: new Date(data.startDate).toISOString(),
                endDate: new Date(data.endDate).toISOString(),
            };

            if (isEdit) {
                const result = await updateClassMutation.mutateAsync({
                    id: classId,
                    ...submitData
                });
                if (result?.data?.succeeded) {
                    toast({
                        description: "Cập nhật lớp học thành công",
                    });
                }
            } else {
                const result = await createClassMutation.mutateAsync(submitData);
                if (result?.data?.succeeded) {
                    toast({
                        description: "Tạo lớp học thành công",
                    });
                    form.reset();
                }
            }
            onSuccess?.();
        } catch (error: any) {
            handleErrorApi({ error });
        }
    };

    const courses = coursesData?.data?.data || [];
    const isLoading = createClassMutation.isPending || updateClassMutation.isPending;

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>
                    {isEdit ? "Chỉnh sửa lớp học" : "Tạo lớp học mới"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Course Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="courseId">Khóa học *</Label>
                            <Select
                                value={form.watch("courseId")?.toString() || ""}
                                onValueChange={(value) => form.setValue("courseId", parseInt(value))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn khóa học" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courses.map((course) => (
                                        <SelectItem key={course.id} value={course.id.toString()}>
                                            {course.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {form.formState.errors.courseId && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.courseId.message}
                                </p>
                            )}
                        </div>

                        {/* Class Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Tên lớp *</Label>
                            <Input
                                id="name"
                                {...form.register("name")}
                                placeholder="Nhập tên lớp"
                            />
                            {form.formState.errors.name && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Start Date */}
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Ngày bắt đầu *</Label>
                            <Input
                                id="startDate"
                                type="date"
                                {...form.register("startDate")}
                            />
                            {form.formState.errors.startDate && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.startDate.message}
                                </p>
                            )}
                        </div>

                        {/* End Date */}
                        <div className="space-y-2">
                            <Label htmlFor="endDate">Ngày kết thúc *</Label>
                            <Input
                                id="endDate"
                                type="date"
                                {...form.register("endDate")}
                            />
                            {form.formState.errors.endDate && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.endDate.message}
                                </p>
                            )}
                        </div>

                        {/* Teacher Name */}
                        <div className="space-y-2">
                            <Label htmlFor="teacherName">Giáo viên *</Label>
                            <Input
                                id="teacherName"
                                {...form.register("teacherName")}
                                placeholder="Nhập tên giáo viên"
                            />
                            {form.formState.errors.teacherName && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.teacherName.message}
                                </p>
                            )}
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <Label htmlFor="location">Địa điểm *</Label>
                            <Input
                                id="location"
                                {...form.register("location")}
                                placeholder="Nhập địa điểm"
                            />
                            {form.formState.errors.location && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.location.message}
                                </p>
                            )}
                        </div>

                        {/* Max Students */}
                        <div className="space-y-2">
                            <Label htmlFor="maxStudents">Số học viên tối đa *</Label>
                            <Input
                                id="maxStudents"
                                type="number"
                                min="1"
                                {...form.register("maxStudents", { valueAsNumber: true })}
                                placeholder="30"
                            />
                            {form.formState.errors.maxStudents && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.maxStudents.message}
                                </p>
                            )}
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <Label htmlFor="status">Trạng thái *</Label>
                            <Select
                                value={form.watch("status")}
                                onValueChange={(value) => form.setValue("status", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classStatuses.map((status) => (
                                        <SelectItem key={status.value} value={status.value}>
                                            {status.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {form.formState.errors.status && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.status.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Schedule */}
                    <div className="space-y-2">
                        <Label htmlFor="schedule">Lịch học *</Label>
                        <Textarea
                            id="schedule"
                            {...form.register("schedule")}
                            placeholder="Nhập lịch học (ví dụ: Thứ 2, 4, 6 - 19:00-21:00)"
                            rows={3}
                        />
                        {form.formState.errors.schedule && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.schedule.message}
                            </p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isLoading}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? "Đang xử lý..." : isEdit ? "Cập nhật" : "Tạo mới"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}