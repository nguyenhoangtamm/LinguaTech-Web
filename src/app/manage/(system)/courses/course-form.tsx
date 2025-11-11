"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Loader2, Upload, X } from "lucide-react";
import { Button, Input, SelectPicker, Modal, Uploader } from "rsuite";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
    useCreateCourseManagement,
    useUpdateCourseManagement,
    useCourseManagement,
    useCategoriesManagement
} from "@/queries/useCourseManagement";
import {
    CreateCourseBodyType,
    UpdateCourseBodyType,
    CreateCourseBodySchema,
    UpdateCourseBodySchema
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
    const { data: categoriesData } = useCategoriesManagement();
    const { data, refetch } = useCourseManagement(id as number, isEdit);

    const form = useForm<CreateCourseBodyType | UpdateCourseBodyType>({
        resolver: zodResolver(isEdit ? UpdateCourseBodySchema : CreateCourseBodySchema),
        defaultValues: {
            title: "",
            description: "",
            instructor: "",
            duration: 0,
            level: 1,
            price: 0,
            categoryId: 0,
            tags: [],
            thumbnailUrl: "",
            videoUrl: "",
        },
    });

    // Category options
    const categoryOptions = useMemo(() => {
        if (!categoriesData?.data?.data) return [];
        return categoriesData.data.data.map((category: any) => ({
            label: category.name,
            value: category.id,
        }));
    }, [categoriesData]);

    // Level options
    const levelOptions = useMemo(() => [
        { label: "Cơ bản", value: 1 },
        { label: "Trung cấp", value: 2 },
        { label: "Nâng cao", value: 3 },
    ], []);

    // Fill form when editing
    useEffect(() => {
        if (isEdit && data) {
            const courseData = data.data;
            form.reset({
                title: courseData.title ?? "",
                description: courseData.description ?? "",
                instructor: courseData.instructor ?? "",
                duration: courseData.duration ?? 0,
                level: courseData.level ?? 1,
                price: courseData.price ?? 0,
                categoryId: courseData.categoryId ?? 0,
                tags: courseData.tags ?? [],
                thumbnailUrl: courseData.thumbnailUrl ?? "",
                videoUrl: courseData.videoUrl ?? "",
            });
        }
        if (!isEdit) {
            form.reset({
                title: "",
                description: "",
                instructor: "",
                duration: 0,
                level: 1,
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
    }, [id, isEdit]);

    const handleOpenChange = (open: boolean) => {
        setOpen(open);
        if (!open) {
            setId?.(undefined);
            form.reset();
        }
    };

    const onSubmit = async (values: CreateCourseBodyType | UpdateCourseBodyType) => {
        if (createCourseMutation.isPending || updateCourseMutation.isPending) return;
        try {
            let result: any;
            if (isEdit) {
                result = await updateCourseMutation.mutateAsync({
                    id: id as number,
                    ...values as UpdateCourseBodyType,
                });
            } else {
                result = await createCourseMutation.mutateAsync(values as CreateCourseBodyType);
            }

            toast({
                title: result?.message || (isEdit ? "Cập nhật khóa học thành công" : "Tạo khóa học thành công"),
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
            const courseData = data.data;
            form.reset({
                title: courseData.title ?? "",
                description: courseData.description ?? "",
                instructor: courseData.instructor ?? "",
                duration: courseData.duration ?? 0,
                level: courseData.level ?? 1,
                price: courseData.price ?? 0,
                categoryId: courseData.categoryId ?? 0,
                tags: courseData.tags ?? [],
                thumbnailUrl: courseData.thumbnailUrl ?? "",
                videoUrl: courseData.videoUrl ?? "",
            });
        } else {
            form.reset({
                title: "",
                description: "",
                instructor: "",
                duration: 0,
                level: 1,
                price: 0,
                categoryId: 0,
                tags: [],
                thumbnailUrl: "",
                videoUrl: "",
            });
        }
    };

    // Tag input handlers
    const [tagInput, setTagInput] = useState("");
    const addTag = () => {
        if (tagInput.trim() && !form.getValues("tags").includes(tagInput.trim())) {
            const currentTags = form.getValues("tags");
            form.setValue("tags", [...currentTags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        const currentTags = form.getValues("tags");
        form.setValue("tags", currentTags.filter(tag => tag !== tagToRemove));
    };

    return (
        <>
            {triggerButton && (
                <Button
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md shadow-sm border-0"
                    onClick={() => setOpen(true)}
                    startIcon={<PlusCircle className="w-4 h-4" />}
                >
                    Thêm khóa học
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
                        {isEdit ? "Cập nhật khóa học" : "Thêm mới khóa học"}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="py-4 max-h-[70vh] overflow-y-auto">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label className="text-sm font-medium text-gray-700">
                                                Tên khóa học *
                                            </Label>
                                            <Input
                                                {...field}
                                                placeholder="Nhập tên khóa học"
                                                className="w-full"
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="instructor"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label className="text-sm font-medium text-gray-700">
                                                Giảng viên *
                                            </Label>
                                            <Input
                                                {...field}
                                                placeholder="Nhập tên giảng viên"
                                                className="w-full"
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label className="text-sm font-medium text-gray-700">
                                            Mô tả *
                                        </Label>
                                        <Textarea
                                            {...field}
                                            placeholder="Nhập mô tả khóa học"
                                            className="w-full min-h-[100px]"
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="categoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label className="text-sm font-medium text-gray-700">
                                                Danh mục *
                                            </Label>
                                            <SelectPicker
                                                {...field}
                                                data={categoryOptions}
                                                placeholder="Chọn danh mục"
                                                className="w-full"
                                                cleanable={false}
                                                searchable={false}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="level"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label className="text-sm font-medium text-gray-700">
                                                Cấp độ *
                                            </Label>
                                            <SelectPicker
                                                {...field}
                                                value={field.value ?? 1}
                                                data={levelOptions}
                                                placeholder="Chọn cấp độ"
                                                className="w-full"
                                                cleanable={false}
                                                searchable={false}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="duration"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label className="text-sm font-medium text-gray-700">
                                                Thời lượng (giờ) *
                                            </Label>
                                            <Input
                                                {...field}
                                                type="number"
                                                min="0"
                                                step="0.5"
                                                placeholder="0"
                                                className="w-full"
                                                onChange={(value) => field.onChange(Number(value))}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label className="text-sm font-medium text-gray-700">
                                            Giá (VNĐ) *
                                        </Label>
                                        <Input
                                            {...field}
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            className="w-full"
                                            onChange={(value) => field.onChange(Number(value))}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="thumbnailUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label className="text-sm font-medium text-gray-700">
                                                URL hình ảnh thumbnail
                                            </Label>
                                            <Input
                                                {...field}
                                                type="url"
                                                placeholder="https://example.com/image.jpg"
                                                className="w-full"
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="videoUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label className="text-sm font-medium text-gray-700">
                                                URL video giới thiệu
                                            </Label>
                                            <Input
                                                {...field}
                                                type="url"
                                                placeholder="https://example.com/video.mp4"
                                                className="w-full"
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Tags section */}
                            <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label className="text-sm font-medium text-gray-700">
                                            Thẻ (Tags)
                                        </Label>
                                        <div className="space-y-2">
                                            <div className="flex gap-2">
                                                <Input
                                                    value={tagInput}
                                                    onChange={setTagInput}
                                                    placeholder="Nhập thẻ"
                                                    className="flex-1"
                                                    onPressEnter={(e) => {
                                                        e.preventDefault();
                                                        addTag();
                                                    }}
                                                />
                                                <Button
                                                    type="button"
                                                    appearance="primary"
                                                    onClick={addTag}
                                                    disabled={!tagInput.trim()}
                                                >
                                                    Thêm
                                                </Button>
                                            </div>
                                            {field.value && field.value.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {field.value.map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
                                                        >
                                                            {tag}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeTag(tag)}
                                                                className="text-blue-600 hover:text-blue-800"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
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
                        disabled={createCourseMutation.isPending || updateCourseMutation.isPending}
                        className="bg-primary text-white"
                    >
                        {createCourseMutation.isPending || updateCourseMutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        {isEdit ? "Cập nhật" : "Thêm mới"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}