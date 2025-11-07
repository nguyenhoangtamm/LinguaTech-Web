"use client";

import { useEffect, useRef, useState } from "react";
import { getDisplayedRowCount, handleErrorApi } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { PencilIcon, Eye, Hash } from "lucide-react";
import { SectionType, FilterSectionType } from "@/schemaValidations/section.schema";
import {
    useSectionListQuery,
    useDeleteSectionMutation
} from "@/queries/useSection";
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

export default function SectionTable({ title, breadcrumb }: PageHeaderProps) {
    usePageHeader({ title, breadcrumb });
    const searchParam = useSearchParams();
    const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
    const pageIndex = page - 1;

    const [sectionIdEdit, setSectionIdEdit] = useState<number | undefined>();
    const [filter, setFilter] = useState<FilterSectionType>({
        pageNumber: page,
        pageSize: PAGE_SIZE,
        keyword: "",
    });

    const sectionListQuery = useSectionListQuery({
        pageNumber: page,
        pageSize: PAGE_SIZE,
        keyword: filter.keyword,
        lessonId: filter.lessonId,
    });

    const listResult: { data: SectionType[]; totalCount: number } =
        sectionListQuery.data?.data?.data ?? {
            data: [],
            totalCount: 0,
        };
    const data: SectionType[] = listResult.data;
    const totalCount: number = listResult.totalCount;

    const [activeSearch, setActiveSearch] = useState(false);

    useEffect(() => {
        if (activeSearch) {
            sectionListQuery.refetch();
            setActiveSearch(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSearch]);

    const inputSearchRef = useRef<HTMLInputElement>(null);
    const deleteSectionMutation = useDeleteSectionMutation();

    const handleDeleteSection = async (section: SectionType) => {
        if (deleteSectionMutation.isPending) return;

        try {
            const result = await deleteSectionMutation.mutateAsync(section.id);
            if (result?.data?.succeeded) {
                toast({
                    description: `Đã xóa phần học "${section.title}"`,
                });
                sectionListQuery.refetch();
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

    const columns: TableColumn<SectionType>[] = [
        {
            title: "STT",
            dataIndex: "id",
            key: "stt",
            width: 70,
            render: (_: any, __: SectionType, index: number) => {
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
            render: (title: string, record: SectionType) => (
                <div>
                    <p className="font-medium line-clamp-2">{title}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <Hash size={12} className="text-gray-400" />
                        <span className="text-sm text-gray-500">Lesson: {record.lessonId}</span>
                    </div>
                </div>
            ),
        },
        {
            title: "Bài học",
            dataIndex: "lessonTitle",
            key: "lessonTitle",
            render: (lessonTitle: string, record: SectionType) => (
                <div>
                    <p className="font-medium">{lessonTitle || `Lesson #${record.lessonId}`}</p>
                    {record.moduleTitle && (
                        <p className="text-sm text-gray-500">{record.moduleTitle}</p>
                    )}
                </div>
            ),
        },
        {
            title: "Nội dung",
            dataIndex: "content",
            key: "content",
            render: (content: string) => (
                <div className="max-w-xs">
                    <p className="text-sm line-clamp-3" title={content}>
                        {content}
                    </p>
                    {content.length > 100 && (
                        <span className="text-xs text-gray-400">
                            ...({content.length} ký tự)
                        </span>
                    )}
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
            width: 150,
            render: (_: any, record: SectionType) => (
                <div className="flex gap-2">
                    <IconButton
                        size="sm"
                        appearance="subtle"
                        color="blue"
                        icon={<Eye size={16} />}
                        title="Xem nội dung"
                        onClick={() => {
                            // Preview section content
                        }}
                    />
                    <IconButton
                        size="sm"
                        appearance="subtle"
                        color="green"
                        icon={<PencilIcon size={16} />}
                        onClick={() => setSectionIdEdit(record.id)}
                        title="Chỉnh sửa"
                    />
                    <DeletePopover
                        title={`Xóa phần học "${record.title}"`}
                        description="Bạn có chắc chắn muốn xóa phần học này không? Hành động này không thể hoàn tác."
                        onConfirm={() => handleDeleteSection(record)}
                    />
                </div>
            ),
        },
    ];

    const hasFilter = filter.keyword || filter.lessonId;

    return (
        <BaseLayout>
            <div className="p-4">
                {/* Header Actions */}
                <div className="mb-6 flex justify-between items-center">
                    <div className="flex gap-3">
                        <Input
                            ref={inputSearchRef}
                            placeholder="Tìm kiếm phần học..."
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
                        onClick={() => setSectionIdEdit(0)}
                    >
                        Thêm phần học
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
                                <Label>Lesson ID</Label>
                                <Input
                                    type="number"
                                    placeholder="Nhập Lesson ID..."
                                    value={filter.lessonId?.toString() || ""}
                                    onChange={(value) =>
                                        setFilter((prev) => ({
                                            ...prev,
                                            lessonId: value ? Number(value) : undefined
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
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                            {data.length}
                        </div>
                        <div className="text-sm text-gray-600">Tổng số phần học</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                            {data.reduce((sum, s) => sum + s.content.length, 0)}
                        </div>
                        <div className="text-sm text-gray-600">Tổng số ký tự nội dung</div>
                    </div>
                </div>

                {/* Table */}
                <Table
                    data={data}
                    columns={columns}
                    loading={sectionListQuery.isLoading}
                    totalCount={totalCount}
                    pageSize={PAGE_SIZE}
                    showPagination
                    paginationPosition="bottom"
                />

                {/* Edit/Create Form Modal - Placeholder */}
                {sectionIdEdit !== undefined && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                {sectionIdEdit ? "Chỉnh sửa phần học" : "Thêm phần học mới"}
                            </h3>
                            {/* Add section form here */}
                            <div className="flex justify-end">
                                <Button onClick={() => setSectionIdEdit(undefined)}>
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