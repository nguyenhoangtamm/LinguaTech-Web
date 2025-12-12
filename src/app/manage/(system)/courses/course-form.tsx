"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Loader2, Upload, X } from "lucide-react";
import { Button, Input, SelectPicker, Modal, Uploader, TagPicker } from "rsuite";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
    useCreateCourseManagement,
    useUpdateCourseManagement,
    useCourseManagement,
    useCategoriesManagement
} from "@/queries/useCourseManagement";
import { useGetAllCourseTags } from "@/queries/useCourseTag";
import {
    CreateCourseBodyType,
    UpdateCourseBodyType,
    CreateCourseBodySchema,
    UpdateCourseBodySchema
} from "@/schemaValidations/courseManagement.schema";
import { toast } from "@/hooks/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from "@/components/ui/rich-text-editor";
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
    const { data: courseTagsData } = useGetAllCourseTags();
    const { data, refetch } = useCourseManagement(id as number, isEdit);
    const form = useForm<CreateCourseBodyType>({
        resolver: zodResolver(CreateCourseBodySchema),
        defaultValues: {
            title: "",
            description: "",
            instructor: "",
            duration: 0,
            level: 1,
            price: 10,
            categoryId: 0,
            tags: [],
            thumbnailUrl: "",
            videoUrl: "",
            detailedDescription: "",
        },
    });

    // Category options
    const categoryOptions = useMemo(() => {
        if (!categoriesData?.data) return [];
        return categoriesData.data.map((category: any) => ({
            label: category.name,
            value: Number(category.id),
        }));
    }, [categoriesData]);

    // Course tag options
    const courseTagOptions = useMemo(() => {
        if (!courseTagsData?.data) return [];
        return courseTagsData.data
            .filter((tag: any) => tag.isActive)
            .map((tag: any) => ({
                label: tag.name,
                value: tag.id,
            }));
    }, [courseTagsData]);

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
                categoryId: courseData.category.id ? Number(courseData.category.id) : 0,
                tags: courseData.tags ?? [],
                thumbnailUrl: courseData.thumbnailUrl ?? "",
                videoUrl: courseData.videoUrl ?? "",
                detailedDescription: courseData.detailedDescription ?? "",
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
                detailedDescription: "",
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

    const onSubmit = async (values: CreateCourseBodyType) => {
        if (createCourseMutation.isPending || updateCourseMutation.isPending) return;
        try {
            // Transform tags to ensure they are numbers
            const transformedValues = {
                ...values,
                tags: Array.isArray(values.tags)
                    ? values.tags.map((tag: any) => typeof tag === 'object' ? tag.value : tag)
                    : []
            };

            let result: any;
            if (isEdit) {
                result = await updateCourseMutation.mutateAsync({
                    id: id as number,
                    body: transformedValues as UpdateCourseBodyType,
                });
            } else {
                result = await createCourseMutation.mutateAsync(transformedValues as CreateCourseBodyType);
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
                detailedDescription: courseData.detailedDescription ?? "",
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
                detailedDescription: "",
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
                        <form id="course-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                                onChange={(value) => field.onChange(Number(value))}

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
                                        <TagPicker
                                            {...field}
                                            data={courseTagOptions}
                                            placeholder="Chọn thẻ"
                                            className="w-full"
                                            cleanable={true}
                                            searchable={true}
                                            block
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Detailed Description section */}
                            <FormField
                                control={form.control}
                                name="detailedDescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label className="text-sm font-medium text-gray-700">
                                            Mô tả chi tiết
                                        </Label>
                                        <RichTextEditor
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Nhập mô tả chi tiết về khóa học..."
                                            className="min-h-[200px]"
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
                        type="submit"
                        form="course-form"
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