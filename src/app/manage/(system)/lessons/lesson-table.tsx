"use client";

import { useEffect, useRef, useState } from "react";
import { getDisplayedRowCount, handleErrorApi } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { PencilIcon, ExternalLink, Play, BookOpen } from "lucide-react";
import {
    LessonType,
    LessonQueryParamsType
} from "@/schemaValidations/lesson.schema";
import {
    useLessonListQuery,
    useDeleteLessonMutation
} from "@/queries/useLesson";
import { Label } from "@/components/ui/label";
import { IconButton, Input, Button, Badge } from "rsuite";
import DeletePopover from "@/app/shared/delete-popover";
import { PageHeaderProps } from "@/types/page-header-props.type";
import { usePageHeader } from "@/hooks/use-page-header";
import { Transition } from "@headlessui/react";
import Table, { TableColumn } from "@/app/shared/common/components/table";
import BaseLayout from "@/layouts/BaseLayout";
import FunnelIcon from '@rsuite/icons/Funnel';
import Link from "next/link";

const PAGE_SIZE = 10;

export default function LessonTable({ title, breadcrumb }: PageHeaderProps) {
    usePageHeader({ title, breadcrumb });
    const searchParam = useSearchParams();
    const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
    const pageIndex = page - 1;

    const [lessonIdEdit, setLessonIdEdit] = useState<number | undefined>();
    const [filter, setFilter] = useState<Partial<LessonQueryParamsType>>({
        keyword: "",
        courseId: undefined,
        moduleId: undefined,
        minDuration: undefined,
        maxDuration: undefined,
    });

    const lessonListQuery = useLessonListQuery({
        pageNumber: page,
        pageSize: PAGE_SIZE,
        keyword: filter.keyword,
        courseId: filter.courseId,
        moduleId: filter.moduleId,
        minDuration: filter.minDuration,
        maxDuration: filter.maxDuration,
    });

    const listResult = lessonListQuery.data?.data || { data: [], totalCount: 0 };
    const data: LessonType[] = listResult.data || [];
    const totalCount: number = listResult.totalCount || 0;

    const [activeSearch, setActiveSearch] = useState(false);

    useEffect(() => {
        if (activeSearch) {
            lessonListQuery.refetch();
            setActiveSearch(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSearch]);

    const inputSearchRef = useRef<HTMLInputElement>(null);
    const deleteLessonMutation = useDeleteLessonMutation();

    const handleDeleteLesson = async (lesson: LessonType) => {
        if (deleteLessonMutation.isPending) return;

        try {
            const result = await deleteLessonMutation.mutateAsync(lesson.id);
            if (result?.data?.succeeded) {
                toast({
                    description: `Đã xóa bài học "${lesson.title}"`,
                });
                lessonListQuery.refetch();
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
            keyword: "",
            courseId: undefined,
            moduleId: undefined,
            minDuration: undefined,
            maxDuration: undefined,
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

    const formatDuration = (duration: number) => {
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    const columns: TableColumn<LessonType>[] = [
        {
            title: "STT",
            dataIndex: "id",
            key: "stt",
            width: 70,
            render: (_: any, __: LessonType, index: number) => {
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
            render: (title: string, record: LessonType) => (
                <div>
                    <p className="font-medium line-clamp-2">{title}</p>
                    {record.description && (
                        <p className="text-sm text-gray-500 line-clamp-1">{record.description}</p>
                    )}
                </div>
            ),
        },
        {
            title: "Module ID",
            dataIndex: "moduleId",
            key: "moduleId",
            width: 100,
            render: (moduleId: string) => (
                <span className="text-sm font-mono">#{moduleId}</span>
            ),
        },
        {
            title: "Thời lượng",
            dataIndex: "duration",
            key: "duration",
            width: 100,
            render: (duration: number) => (
                <div className="flex items-center gap-1">
                    <Play size={14} className="text-gray-400" />
                    <span>{formatDuration(duration)}</span>
                </div>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "isPublished",
            key: "isPublished",
            width: 120,
            render: (isPublished: boolean) => (
                <Badge
                    color={isPublished ? "green" : "orange"}
                    appearance="ghost"
                >
                    {isPublished ? "Đã xuất bản" : "Nháp"}
                </Badge>
            ),
        },
        {
            title: "Hoàn thành",
            dataIndex: "isCompleted",
            key: "isCompleted",
            width: 100,
            render: (isCompleted: boolean) => (
                <Badge
                    color={isCompleted ? "green" : "gray"}
                    appearance="ghost"
                >
                    {isCompleted ? "✓" : "○"}
                </Badge>
            ),
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 120,
            render: (date: Date) => new Date(date).toLocaleDateString("vi-VN"),
        },
        {
            title: "Thao tác",
            key: "actions",
            width: 150,
            render: (_: any, record: LessonType) => (
                <div className="flex gap-2">
                    <IconButton
                        size="sm"
                        appearance="subtle"
                        color="blue"
                        icon={<BookOpen size={16} />}
                        title="Xem nội dung"
                        onClick={() => {
                            // Navigate to lesson content view
                            // This could open a modal or navigate to detail page
                        }}
                    />
                    <IconButton
                        size="sm"
                        appearance="subtle"
                        color="green"
                        icon={<PencilIcon size={16} />}
                        onClick={() => setLessonIdEdit(record.id)}
                        title="Chỉnh sửa"
                    />
                    <DeletePopover
                        title={`Xóa bài học "${record.title}"`}
                        description="Bạn có chắc chắn muốn xóa bài học này không? Hành động này không thể hoàn tác."
                        onConfirm={() => handleDeleteLesson(record)}
                    />
                </div>
            ),
        },
    ];

    const hasFilter = filter.keyword || filter.courseId || filter.moduleId || filter.minDuration || filter.maxDuration;

    return (
        <BaseLayout>
            <div className="p-4">
                {/* Header Actions */}
                <div className="mb-6 flex justify-between items-center">
                    <div className="flex gap-3">
                        <Input
                            ref={inputSearchRef}
                            placeholder="Tìm kiếm bài học..."
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
                        onClick={() => setLessonIdEdit(0)}
                    >
                        Thêm bài học
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
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                            <div>
                                <Label>Module ID</Label>
                                <Input
                                    type="number"
                                    placeholder="Nhập Module ID..."
                                    value={filter.moduleId?.toString() || ""}
                                    onChange={(value) =>
                                        setFilter((prev) => ({
                                            ...prev,
                                            moduleId: value ? Number(value) : undefined
                                        }))
                                    }
                                />
                            </div>
                            <div>
                                <Label>Thời lượng tối thiểu (phút)</Label>
                                <Input
                                    type="number"
                                    placeholder="Từ..."
                                    value={filter.minDuration?.toString() || ""}
                                    onChange={(value) =>
                                        setFilter((prev) => ({
                                            ...prev,
                                            minDuration: value ? Number(value) : undefined
                                        }))
                                    }
                                />
                            </div>
                            <div>
                                <Label>Thời lượng tối đa (phút)</Label>
                                <Input
                                    type="number"
                                    placeholder="Đến..."
                                    value={filter.maxDuration?.toString() || ""}
                                    onChange={(value) =>
                                        setFilter((prev) => ({
                                            ...prev,
                                            maxDuration: value ? Number(value) : undefined
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
                            {data.filter(l => l.isPublished).length}
                        </div>
                        <div className="text-sm text-gray-600">Đã xuất bản</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                            {data.filter(l => !l.isPublished).length}
                        </div>
                        <div className="text-sm text-gray-600">Nháp</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                            {data.filter(l => l.isCompleted).length}
                        </div>
                        <div className="text-sm text-gray-600">Đã hoàn thành</div>
                    </div>
                </div>

                {/* Table */}
                <Table
                    data={data}
                    columns={columns}
                    loading={lessonListQuery.isLoading}
                    totalCount={totalCount}
                    pageSize={PAGE_SIZE}
                    showPagination
                    paginationPosition="bottom"
                />

                {/* Edit/Create Form Modal - Placeholder */}
                {lessonIdEdit !== undefined && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                {lessonIdEdit ? "Chỉnh sửa bài học" : "Thêm bài học mới"}
                            </h3>
                            {/* Add lesson form here */}
                            <div className="flex justify-end">
                                <Button onClick={() => setLessonIdEdit(undefined)}>
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