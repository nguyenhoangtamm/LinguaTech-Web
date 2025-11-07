'use client';
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectPicker } from "rsuite";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import TailwindSelect from 'react-tailwindcss-select';
const TamSelect = TailwindSelect;
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';
import { useCreateMenuMutation, useDeleteMenuMutation, useGetAllMenuQuery, useGetMenuQuery, useUpdateMenuMutation } from '@/queries/useMenu';
import { handleErrorApi } from "@/lib/utils";
import { Modal } from "rsuite";
import { CreateMenuBody, CreateMenuBodyType } from "@/schemaValidations/menu.schema";

export default function MenuCRUDPanel({ id, setId, onSubmitSuccess }: { id: number | undefined, setId: (id: number | undefined) => void, onSubmitSuccess?: () => void }) {
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const { mutateAsync } = useDeleteMenuMutation()
    const createMenuMutation = useCreateMenuMutation()
    const updateMenuMutation = useUpdateMenuMutation()
    const { data, refetch } = useGetMenuQuery({
        id: id as number,
        enabled: Boolean(id)
    })
    const parentMenuId = useGetAllMenuQuery()
    const form = useForm<CreateMenuBodyType>({
        resolver: zodResolver(CreateMenuBody),
        defaultValues: {
            name: "",
            description: undefined,
            order: undefined,
            icon: undefined,
            url: undefined,
            isTargetBlank: undefined,
            parentId: undefined,
        }
    })
    useEffect(() => {
        if (data) {
            const { name, description, order, icon, url, isTargetBlank, parentId } = data.data
            form.reset({
                name,
                description: description ?? '',
                order: order ?? 0,
                icon: icon ?? '',
                url: url ?? '',
                isTargetBlank: isTargetBlank ?? false,
                parentId: parentId ?? undefined,
            })
        }
    }, [data, form])

    const handleSetOpen = () => {
        if (!id) {
            toast({
                title: "Vui lòng chọn menu cần xóa",
                description: "Bạn cần chọn một menu trước khi thực hiện hành động này.",
                variant: "warning",
                duration: 2000,
                style: { height: "auto" },

            });
            return;
        }
        setDeleteModalOpen(true);
    }

    const handleReset = () => {
        if (id) {
            setId(undefined)
        }
        form.reset({
            name: '',
            description: '',
            order: 0,
            icon: '',
            url: '',
            isTargetBlank: false,
            parentId: undefined,
        });
    };

    const handleDelete = async () => {
        try {
            if (id) {
                const result = await mutateAsync(id)
                toast({
                    title: result?.message,
                    variant: "success",
                    duration: 1000,
                })
                setId(undefined)
                form.reset({
                    name: '',
                    description: '',
                    order: 0,
                    icon: '',
                    url: '',
                    isTargetBlank: false,
                    parentId: -1,
                });
                refetch();
                onSubmitSuccess && onSubmitSuccess();
            }

        } catch (error) {
            toast({
                title: "Xóa menu thất bại",
                description: "Đã có lỗi xảy ra khi xóa menu. Vui lòng thử lại sau.",
                variant: "danger",
                duration: 2000,
                style: { height: "auto" },
            });
            handleErrorApi({
                error
            })

        }
        finally {
            setDeleteModalOpen(false)
        }
    }


    const handleSave = async () => {
        if (id && id > 0) {

            handleUdate()
        } else {
            handleCreate()
        }

    };
    const handleCreate = async () => {
        if (createMenuMutation.isPending) return
        setId(undefined)
        try {
            let { ...restValues } = form.getValues();
            let body: CreateMenuBodyType = { ...restValues };
            const result = await createMenuMutation.mutateAsync(body)
            toast({
                description: result?.message,
                variant: "success",
                duration: 1000,

            })
            refetch();
            onSubmitSuccess && onSubmitSuccess();
        } catch (error: any) {
            toast({
                title: "Tạo menu thất bại",
                description: "Đã có lỗi xảy ra khi tạo menu. Vui lòng thử lại sau.",
                variant: "danger",
                duration: 2000,
                style: { height: "auto" },
            });
            handleErrorApi({
                error,
                setError: form.setError
            })
        }
    }
    const handleUdate = async () => {
        if (updateMenuMutation.isPending) return;
        try {
            let { ...restValues } = form.getValues();
            let body: CreateMenuBodyType & { id: number } = { id: id as number, ...restValues };
            const result = await updateMenuMutation.mutateAsync(body);
            toast({
                description: result?.message,
                variant: "success",
                duration: 1000,
            });
            refetch();
            onSubmitSuccess && onSubmitSuccess();
        } catch (error: any) {
            toast({
                title: "Cập nhật menu thất bại",
                description: "Đã có lỗi xảy ra khi cập nhật menu. Vui lòng thử lại sau.",
                variant: "danger",
                duration: 2000,
                style: { height: "auto" },
            });
            handleErrorApi({
                error,
                setError: form.setError,
            });
        }
    }

    return (
        <>
            <div className="p-4 border border-gray-300 rounded-md shadow-sm space-y-4 w-full  bg-white">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSave)}
                        onReset={handleReset}
                        noValidate
                        className='grid auto-rows-max items-start gap-4 md:gap-8'
                        id='create-menu-form'
                    >
                        <div className='grid gap-4 py-4'>

                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                                            <Label htmlFor='name'>Tên</Label>
                                            <div className='col-span-3 w-full space-y-2'>
                                                <Input id='name' placeholder="Tên menu" className='w-full' {...field} />
                                                <FormMessage />
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='description'
                                render={({ field }) => (
                                    <FormItem>
                                        <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                                            <Label htmlFor='description'>Mô tả</Label>
                                            <div className='col-span-3 w-full space-y-2'>
                                                <Textarea id='description' className='w-full' {...field} />
                                                <FormMessage />
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='order'
                                render={({ field }) => (
                                    <FormItem>
                                        <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                                            <Label htmlFor='order'>Thứ tự</Label>
                                            <div className='col-span-3 w-full space-y-2'>
                                                <Input id='order' className='w-full' {...field} type='number' onChange={(e) => {
                                                    const value = e.target.value;
                                                    field.onChange(
                                                        value === "" ? 0 : parseInt(value, 10)
                                                    );
                                                }} />
                                                < FormMessage />
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='icon'
                                render={({ field }) => (
                                    <FormItem>
                                        <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                                            <Label htmlFor='icon'>Icon</Label>
                                            <div className='col-span-3 w-full space-y-2'>
                                                <Input id='icon' className='w-full' {...field} />
                                                <FormMessage />
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='url'
                                render={({ field }) => (
                                    <FormItem>
                                        <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                                            <Label htmlFor='url'>Url</Label>
                                            <div className='col-span-3 w-full space-y-2'>
                                                <Input id='url' className='w-full' {...field} />
                                                <FormMessage />
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='parentId'
                                render={({ field }) => (
                                    <FormItem>
                                        <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                                            <Label htmlFor='parentId'>Menu cha</Label>
                                            <div className='col-span-3 w-full space-y-2'>
                                                <TamSelect
                                                    value={
                                                        parentMenuId.data?.data
                                                            .map((item) => ({
                                                                label: item.name,
                                                                value: item.id.toString(),
                                                            }))
                                                            .find((option) => option.value === (field.value !== undefined ? String(field.value) : undefined)) || null
                                                    }
                                                    onChange={(selected) => {
                                                        // selected can be null or an Option
                                                        if (selected && !Array.isArray(selected)) {
                                                            field.onChange(selected.value ? parseInt(selected.value, 10) : undefined);
                                                        } else {
                                                            field.onChange(undefined);
                                                        }
                                                    }}
                                                    isClearable
                                                    options={
                                                        parentMenuId.data?.data.map((item) => ({
                                                            label: item.name,
                                                            value: item.id.toString(),
                                                        })) || []
                                                    }
                                                    primaryColor="blue"
                                                    isSearchable={true}
                                                    searchInputPlaceholder="Tìm kiếm menu cha..."
                                                    placeholder="Chọn menu cha"
                                                />

                                                <FormMessage />
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='isTargetBlank'
                                render={({ field }) => (
                                    <FormItem>
                                        <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                                            <Label htmlFor='isTargetBlank'>Mở trong tab mới</Label>
                                            <div className='col-span-3 w-full space-y-2'>
                                                <SelectPicker
                                                    data={[
                                                        { label: "Có", value: "active" },
                                                        { label: "Không", value: "inactive" }
                                                    ]}
                                                    value={field.value ? "active" : "inactive"}
                                                    onChange={(value) =>
                                                        field.onChange(value === "active")
                                                    }
                                                    placeholder="Chọn trạng thái"
                                                    className="w-full"
                                                    style={{ width: '100%' }}
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

                <div className="flex justify-end gap-2 pt-2">
                    <Button onClick={handleReset} className="bg-yellow-400 hover:bg-yellow-500 text-white">Đặt lại</Button>
                    <Button onClick={handleSetOpen} className="bg-red-500 hover:bg-red-600 text-white">Xóa</Button>
                    <Button type="submit" form="create-menu-form" className="bg-blue-600 hover:bg-blue-700 text-white">Lưu</Button>
                </div>
            </div>
            {/* Modal xác nhận xóa */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">Xác nhận xóa</h3>
                    <p>Bạn có chắc chắn muốn xóa menu này không?</p>

                    <div className="mt-4 flex justify-end gap-2">
                        <Button onClick={() => setDeleteModalOpen(false)}>Hủy</Button>
                        <Button
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            Xác nhận xóa
                        </Button>
                    </div>
                </div>
            </Modal>
        </>

    );
}
