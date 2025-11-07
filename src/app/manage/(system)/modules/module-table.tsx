"use client";

import { useEffect, useRef, useState } from "react";
import { getDisplayedRowCount, handleErrorApi } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { PencilIcon, BookOpen, Plus, Eye } from "lucide-react";
import { ModuleType, FilterModuleType } from "@/schemaValidations/module.schema";
import {
    useModuleListQuery,
    useDeleteModuleMutation
} from "@/queries/useModule";
import { Label } from "@/components/ui/label";
import { IconButton, Input, Button, Badge } from "rsuite";
import DeletePopover from "@/app/shared/delete-popover";
import { PageHeaderProps } from "@/types/page-header-props.type";
import { usePageHeader } from "@/hooks/use-page-header";
import { Transition } from "@headlessui/react";
import Table, { TableColumn } from "@/app/shared/common/components/table";
import BaseLayout from "@/layouts/BaseLayout";
import FunnelIcon from '@rsuite/icons/Funnel';

const PAGE_SIZE = 10;

export default function ModuleTable({ title, breadcrumb }: PageHeaderProps) {
    usePageHeader({ title, breadcrumb });
    const searchParam = useSearchParams();
    const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
    const pageIndex = page - 1;

    const [moduleIdEdit, setModuleIdEdit] = useState<number | undefined>();
    const [filter, setFilter] = useState<FilterModuleType>({
        pageNumber: page,
        pageSize: PAGE_SIZE,
        keyword: "",
    });

    const moduleListQuery = useModuleListQuery({
        pageNumber: page,
        pageSize: PAGE_SIZE,
        keyword: filter.keyword,
        courseId: filter.courseId,
    });

    const listResult: { data: ModuleType[]; totalCount: number } =
        moduleListQuery.data?.data?.data ?? {
            data: [],
            totalCount: 0,
        };
    const data: ModuleType[] = listResult.data;
    const totalCount: number = listResult.totalCount;

    const [activeSearch, setActiveSearch] = useState(false);

    useEffect(() => {
        if (activeSearch) {
            moduleListQuery.refetch();
            setActiveSearch(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSearch]);

    const inputSearchRef = useRef<HTMLInputElement>(null);
    const deleteModuleMutation = useDeleteModuleMutation();

    const handleDeleteModule = async (module: ModuleType) => {
        if (deleteModuleMutation.isPending) return;

        try {
            const result = await deleteModuleMutation.mutateAsync(module.id);
            if (result?.data?.succeeded) {
                toast({
                    description: `Đã xóa module "${module.title}"`,
                });
                moduleListQuery.refetch();
            }
        } catch (error: any) {
            handleErrorApi({
                error,
            });
        }
    };

    const [filterCollapsed, setFilterCollapsed] = useState(false);

    const handleResetFilter = () => {
        setFilter({
            pageNumber: page,
            pageSize: PAGE_SIZE,
            keyword: "",
        });
        if (inputSearchRef.current) {
            inputSearchRef.current.value = "";
        }
        setActiveSearch(true);
    };

    const handleSearch = () => {
        const keyword = inputSearchRef.current?.value || "";
        setFilter((prev) => ({
            ...prev,
            keyword: keyword,
        }));
        setActiveSearch(true);
    };

    const columns: TableColumn<ModuleType>[] = [
        {
            title: "STT",
            dataIndex: "id",
            key: "stt",
            width: 70,
            render: (_: any, __: ModuleType, index: number) => {
                return <span>{pageIndex * PAGE_SIZE + index + 1}</span>;
            },
        },
        {
            title: "Thứ tự",
            dataIndex: "order",
            key: "order",
            width: 80,
            render: (order: number) => (
                <Badge color="blue" appearance="ghost">
                    #{order}
                </Badge>
            ),
        },
        {
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
            render: (title: string, record: ModuleType) => (
                <div>
                    <p className="font-medium line-clamp-2">{title}</p>
                    {record.description && (
                        <p className="text-sm text-gray-500 line-clamp-1">{record.description}</p>
                    )}
                </div>
            ),
        },
        {
            title: "Khóa học",
            dataIndex: "courseTitle",
            key: "courseTitle",
            render: (courseTitle: string, record: ModuleType) => (
                <div>
                    <p className="font-medium">{courseTitle || `Course #${record.courseId}`}</p>
                    <p className="text-sm text-gray-500">ID: {record.courseId}</p>
                </div>
            ),
        },
        {
            title: "Số bài học",
            dataIndex: "lessonsCount",
            key: "lessonsCount",
            width: 100,
            render: (lessonsCount: number) => (
                <div className="flex items-center gap-1">
                    <BookOpen size={14} className="text-gray-400" />
                    <span>{lessonsCount || 0}</span>
                </div>
            ),
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 120,
            render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
        },
        {
            title: "Ngày cập nhật",
            dataIndex: "updatedAt",
            key: "updatedAt",
            width: 120,
            render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
        },
        {
            title: "Thao tác",
            key: "actions",
            width: 180,
            render: (_: any, record: ModuleType) => (
                <div className="flex gap-2">
                    <IconButton
                        size="sm"
                        appearance="subtle"
                        color="blue"
                        icon={<Eye size={16} />}
                        title="Xem chi tiết"
                        onClick={() => {
                            // Navigate to module detail with lessons
                        }}
                    />
                    <IconButton
                        size="sm"
                        appearance="subtle"
                        color="cyan"
                        icon={<Plus size={16} />}
                        title="Thêm bài học"
                        onClick={() => {
                            // Navigate to create lesson for this module
                        }}
                    />
                    <IconButton
                        size="sm"
                        appearance="subtle"
                        color="green"
                        icon={<PencilIcon size={16} />}
                        onClick={() => setModuleIdEdit(record.id)}
                        title="Chỉnh sửa"
                    />
                    <DeletePopover
                        title={`Xóa module "${record.title}"`}
                        description="Bạn có chắc chắn muốn xóa module này không? Tất cả bài học trong module cũng sẽ bị xóa. Hành động này không thể hoàn tác."
                        onConfirm={() => handleDeleteModule(record)}
                    />
                </div>
            ),
        },
    ];

    const hasFilter = filter.keyword || filter.courseId;

    return (
        <BaseLayout>
            <div className="p-4">
                {/* Header Actions */}
                <div className="mb-6 flex justify-between items-center">
                    <div className="flex gap-3">
                        <Input
                            ref={inputSearchRef}
                            placeholder="Tìm kiếm module..."
                            style={{ width: 300 }}
                            onPressEnter={handleSearch}
                        />
                        <Button onClick={handleSearch} appearance="primary">
                            Tìm kiếm
                        </Button>
                        <IconButton
                            icon={<FunnelIcon />}
                            onClick={() => setFilterCollapsed(!filterCollapsed)}
                            appearance="subtle"
                        />
                    </div>
                    <Button
                        appearance="primary"
                        onClick={() => setModuleIdEdit(0)}
                    >
                        Thêm module
                    </Button>
                </div>

                {/* Filter Section */}
                <Transition
                    show={filterCollapsed}
                    enter="transition-all duration-300"
                    enterFrom="opacity-0 max-h-0"
                    enterTo="opacity-100 max-h-96"
                    leave="transition-all duration-300"
                    leaveFrom="opacity-100 max-h-96"
                    leaveTo="opacity-0 max-h-0"
                >
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Course ID</Label>
                                <Input
                                    type="number"
                                    placeholder="Nhập Course ID..."
                                    value={filter.courseId?.toString() || ""}
                                    onChange={(value) =>
                                        setFilter((prev) => ({
                                            ...prev,
                                            courseId: value ? Number(value) : undefined
                                        }))
                                    }
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <Button onClick={() => setActiveSearch(true)} appearance="primary">
                                Áp dụng bộ lọc
                            </Button>
                            {hasFilter && (
                                <Button onClick={handleResetFilter} appearance="subtle">
                                    Xóa bộ lọc
                                </Button>
                            )}
                        </div>
                    </div>
                </Transition>

                {/* Statistics Cards */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                            {data.length}
                        </div>
                        <div className="text-sm text-gray-600">Tổng số module</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                            {data.reduce((sum, m) => sum + (m.lessonsCount || 0), 0)}
                        </div>
                        <div className="text-sm text-gray-600">Tổng số bài học</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                            {Math.round(data.reduce((sum, m) => sum + (m.lessonsCount || 0), 0) / (data.length || 1))}
                        </div>
                        <div className="text-sm text-gray-600">Trung bình bài học/module</div>
                    </div>
                </div>

                {/* Table */}
                <Table
                    data={data}
                    columns={columns}
                    loading={moduleListQuery.isLoading}
                    totalCount={totalCount}
                    pageSize={PAGE_SIZE}
                    showPagination
                    paginationPosition="bottom"
                />

                {/* Edit/Create Form Modal - Placeholder */}
                {moduleIdEdit !== undefined && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                {moduleIdEdit ? "Chỉnh sửa module" : "Thêm module mới"}
                            </h3>
                            {/* Add module form here */}
                            <div className="flex justify-end">
                                <Button onClick={() => setModuleIdEdit(undefined)}>
                                    Đóng
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </BaseLayout>
    );
}