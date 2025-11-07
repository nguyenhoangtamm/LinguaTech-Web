"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Loader2 } from "lucide-react";
import { Button, Input, SelectPicker, Modal, TagPicker } from "rsuite";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
    useCreateCourseManagement,
    useUpdateCourseManagement,
    useCourseManagement,
    useCourseCategories
} from "@/queries/useCourseManagement";
import {
    CreateCourseBodySchema,
    CreateCourseBodyType,
    UpdateCourseBodySchema,
    UpdateCourseBodyType,
    CourseLevel
} from "@/schemaValidations/courseManagement.schema";
import { toast } from "@/hooks/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import commonStyles from "../../../shared/common/styles/common.module.css";

export default function CourseForm({
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
    const createCourseMutation = useCreateCourseManagement();
    const updateCourseMutation = useUpdateCourseManagement();
    const { data, refetch } = useCourseManagement(id as number);

    // Get categories for select options
    const { data: categoriesData } = useCourseCategories();

    const form = useForm<CreateCourseBodyType | UpdateCourseBodyType>({
        resolver: zodResolver(isEdit ? UpdateCourseBodySchema : CreateCourseBodySchema),
        defaultValues: {
            title: "",
            description: "",
            instructor: "",
            duration: 0,
            level: CourseLevel.BEGINNER,
            price: 0,
            categoryId: 0,
            tags: [],
            thumbnailUrl: "",
            videoUrl: "",
        },
    });

    // Level options
    const levelOptions = useMemo(() => [
        { label: "Beginner", value: CourseLevel.BEGINNER },
        { label: "Intermediate", value: CourseLevel.INTERMEDIATE },
        { label: "Advanced", value: CourseLevel.ADVANCED },
    ], []);

    // Category options
    const categoryOptions = useMemo(() => {
        if (!categoriesData?.data) return [];
        return categoriesData.data.map((category: any) => ({
            label: category.name,
            value: category.id,
        }));
    }, [categoriesData]);

    // Default tag options
    const tagOptions = useMemo(() => [
        { label: "JavaScript", value: "javascript" },
        { label: "React", value: "react" },
        { label: "Node.js", value: "nodejs" },
        { label: "Python", value: "python" },
        { label: "Java", value: "java" },
        { label: "C#", value: "csharp" },
        { label: "Web Development", value: "web-development" },
        { label: "Mobile Development", value: "mobile-development" },
        { label: "Data Science", value: "data-science" },
        { label: "Machine Learning", value: "machine-learning" },
        { label: "AI", value: "ai" },
        { label: "Database", value: "database" },
        { label: "DevOps", value: "devops" },
        { label: "Cloud", value: "cloud" },
        { label: "Security", value: "security" },
    ], []);

    // Fill form when editing
    useEffect(() => {
        if (isEdit && data) {
            const { title, description, instructor, duration, level, price, categoryId, tags, thumbnailUrl, videoUrl } = data.data;
            form.reset({
                title: title ?? "",
                description: description ?? "",
                instructor: instructor ?? "",
                duration: duration ?? 0,
                level: level ?? CourseLevel.BEGINNER,
                price: price ?? 0,
                categoryId: categoryId ?? 0,
                tags: tags ?? [],
                thumbnailUrl: thumbnailUrl ?? "",
                videoUrl: videoUrl ?? "",
            });
        }
        if (!isEdit) {
            form.reset({
                title: "",
                description: "",
                instructor: "",
                duration: 0,
                level: CourseLevel.BEGINNER,
                price: 0,
                categoryId: 0,
                tags: [],
                thumbnailUrl: "",
                videoUrl: "",
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
    const onSubmit = async (values: CreateCourseBodyType | UpdateCourseBodyType) => {
        if (isEdit) {
            if (updateCourseMutation.isPending) return;
            try {
                const body = { id: id as number, ...values };
                const result = await updateCourseMutation.mutateAsync({ id: id as number, body });
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
                    description: error?.message ?? "Cập nhật khóa học thất bại",
                    duration: 2000,
                });
                handleErrorApi({ error, setError: form.setError });
            }
        } else {
            if (createCourseMutation.isPending) return;
            try {
                const result = await createCourseMutation.mutateAsync(values);
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
                    description: error?.message ?? "Tạo khóa học thất bại",
                    duration: 2000,
                });
                handleErrorApi({ error, setError: form.setError });
            }
        }
    };

    // Loading state
    const isPending = isEdit ? updateCourseMutation.isPending : createCourseMutation.isPending;

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
                        Thêm khóa học
                    </span>
                </Button>
            )}
            <Modal
                open={open}
                onClose={handleClose}
                size="lg"
                backdrop="static"
                onExited={handleExited}
            >
                <Modal.Header>
                    <Modal.Title>{isEdit ? "Cập nhật khóa học" : "Thêm khóa học"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            noValidate
                            className="grid auto-rows-max items-start gap-4 md:gap-6"
                            id={isEdit ? "edit-course-form" : "create-course-form"}
                        >
                            <div className="grid gap-4">
                                {/* title */}
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                                <Label htmlFor="title" className="sm:col-span-1">Tên khóa học</Label>
                                                <div className="sm:col-span-3">
                                                    <Input
                                                        id="title"
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
                                {/* instructor */}
                                <FormField
                                    control={form.control}
                                    name="instructor"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                                <Label htmlFor="instructor" className="sm:col-span-1">Giảng viên</Label>
                                                <div className="sm:col-span-3">
                                                    <Input
                                                        id="instructor"
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
                                {/* duration */}
                                <FormField
                                    control={form.control}
                                    name="duration"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                                <Label htmlFor="duration" className="sm:col-span-1">Thời lượng (phút)</Label>
                                                <div className="sm:col-span-3">
                                                    <Input
                                                        id="duration"
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
                                {/* level */}
                                <FormField
                                    control={form.control}
                                    name="level"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                                <Label htmlFor="level" className="sm:col-span-1">Cấp độ</Label>
                                                <div className="sm:col-span-3">
                                                    <SelectPicker
                                                        data={levelOptions}
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        placeholder="Chọn cấp độ"
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
                                {/* price */}
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                                <Label htmlFor="price" className="sm:col-span-1">Giá (VND)</Label>
                                                <div className="sm:col-span-3">
                                                    <Input
                                                        id="price"
                                                        className={commonStyles.inputField}
                                                        value={field.value}
                                                        onChange={(value) => {
                                                            field.onChange(
                                                                value === "" ? 0 : parseFloat(value as string)
                                                            );
                                                        }}
                                                        type="number"
                                                        step="1000"
                                                        size="sm"
                                                    />
                                                    <FormMessage />
                                                </div>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                {/* categoryId */}
                                <FormField
                                    control={form.control}
                                    name="categoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                                <Label htmlFor="categoryId" className="sm:col-span-1">Danh mục</Label>
                                                <div className="sm:col-span-3">
                                                    <SelectPicker
                                                        data={categoryOptions}
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        placeholder="Chọn danh mục"
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
                                {/* tags */}
                                <FormField
                                    control={form.control}
                                    name="tags"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                                <Label htmlFor="tags" className="sm:col-span-1">Tags</Label>
                                                <div className="sm:col-span-3">
                                                    <TagPicker
                                                        data={tagOptions}
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        placeholder="Chọn tags"
                                                        className={commonStyles.selectPicker}
                                                        size="sm"
                                                        menuClassName={commonStyles.selectPickerMenu}
                                                        creatable
                                                    />
                                                    <FormMessage />
                                                </div>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                {/* thumbnailUrl */}
                                <FormField
                                    control={form.control}
                                    name="thumbnailUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                                <Label htmlFor="thumbnailUrl" className="sm:col-span-1">URL hình thumbnail</Label>
                                                <div className="sm:col-span-3">
                                                    <Input
                                                        id="thumbnailUrl"
                                                        {...field}
                                                        size="sm"
                                                        className={commonStyles.inputField}
                                                        placeholder="https://example.com/thumbnail.jpg"
                                                    />
                                                    <FormMessage />
                                                </div>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                {/* videoUrl */}
                                <FormField
                                    control={form.control}
                                    name="videoUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                                <Label htmlFor="videoUrl" className="sm:col-span-1">URL video giới thiệu</Label>
                                                <div className="sm:col-span-3">
                                                    <Input
                                                        id="videoUrl"
                                                        {...field}
                                                        size="sm"
                                                        className={commonStyles.inputField}
                                                        placeholder="https://example.com/video.mp4"
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
                        form={isEdit ? "edit-course-form" : "create-course-form"}
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