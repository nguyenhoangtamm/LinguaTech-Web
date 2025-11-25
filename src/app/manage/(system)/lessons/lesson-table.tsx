"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";
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
import LessonForm from "./lesson-form";
import { Transition } from "@headlessui/react";
import Table, { TableColumn } from "@/app/shared/common/components/table";
import BaseLayout from "@/layouts/BaseLayout";
import FunnelIcon from '@rsuite/icons/Funnel';

const PAGE_SIZE = 10;

export default function LessonTable({ title, breadcrumb }: PageHeaderProps) {
    usePageHeader({ title, breadcrumb });
    const searchParam = useSearchParams();
    const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
    const pageIndex = page - 1;

    const [lessonIdEdit, setLessonIdEdit] = useState<number | undefined>();
    const [filterCollapsed, setFilterCollapsed] = useState(false);
    const [filter, setFilter] = useState<Partial<LessonQueryParamsType>>({
        keyword: "",
        courseId: undefined,
        moduleId: undefined,
        minDuration: undefined,
        maxDuration: undefined
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

    const listResult = lessonListQuery.data || { data: [], totalCount: 0 };
    const data: LessonType[] = listResult || [];
    const totalCount: number = listResult.totalCount || 0;

    const [activeSearch, setActiveSearch] = useState(false);

    useEffect(() => {
        if (activeSearch) {
            lessonListQuery.refetch();
            setActiveSearch(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSearch]);

    const handleSearch = () => {
        let actionChange = false;
        if (inputSearchRef.current) {
            const searchValue = inputSearchRef.current?.value ?? "";
            setFilter({ ...filter, keyword: searchValue });
            actionChange = true;
        }
        if (actionChange) {
            setActiveSearch(true);
        }
    };

    const inputSearchRef = useRef<HTMLInputElement>(null);
    const { mutateAsync } = useDeleteLessonMutation();

    const handleDeleteLesson = async (value: LessonType | null) => {
        try {
            if (value) {
                const result = await mutateAsync(value.id);
                toast({
                    title: result?.message,
                    variant: "success",
                    duration: 1000,
                });
                lessonListQuery.refetch();
            }
        } catch (error) {
            handleErrorApi({
                error,
            });
        }
    };

    const handleResetFilter = () => {
        setFilter({
            keyword: "",
            courseId: undefined,
            moduleId: undefined,
            minDuration: undefined,
            maxDuration: undefined,
        });
        if (inputSearchRef.current) inputSearchRef.current.value = "";
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

    const columns: TableColumn[] = [
        {
            key: "id",
            label: "STT",
            width: 80,
            align: "center",
            render: (rowData: LessonType, rowIndex?: number) => {
                const safeRowIndex = rowIndex ?? 0;
                const stt = pageIndex * PAGE_SIZE + safeRowIndex + 1;
                return <Label>{stt}</Label>;
            },
        },
        {
            key: "order",
            label: "Thứ tự",
            width: 80,
            render: (rowData: LessonType) => (
                <Badge color="blue" >
                    #{rowData.order}
                </Badge>
            ),
        },
        {
            key: "title",
            label: "Tiêu đề",
            flexGrow: 1,
            render: (rowData: LessonType) => (
                <div>
                    <p className="font-medium line-clamp-2">{rowData.title}</p>
                    {rowData.description && (
                        <p className="text-sm text-gray-500 line-clamp-1">{rowData.description}</p>
                    )}
                </div>
            ),
        },
        {
            key: "moduleId",
            label: "Module ID",
            width: 100,
            render: (rowData: LessonType) => (
                <span className="text-sm font-mono">#{rowData.moduleId}</span>
            ),
        },
        {
            key: "duration",
            label: "Thời lượng",
            width: 100,
            render: (rowData: LessonType) => (
                <div className="flex items-center gap-1">
                    <Play size={14} className="text-gray-400" />
                    <span>{formatDuration(rowData.duration)}</span>
                </div>
            ),
        },
        {
            key: "isPublished",
            label: "Trạng thái",
            width: 120,
            render: (rowData: LessonType) => (
                <Badge
                    color={rowData.isPublished ? "green" : "orange"}
                >
                    {rowData.isPublished ? "Đã xuất bản" : "Nháp"}
                </Badge>
            ),
        },
        {
            key: "isCompleted",
            label: "Hoàn thành",
            width: 100,
            render: (rowData: LessonType) => (
                <Badge
                    color={rowData.isCompleted ? "green" : "violet"}
                >
                    {rowData.isCompleted ? "✓" : "○"}
                </Badge>
            ),
        },
        {
            key: "createdAt",
            label: "Ngày tạo",
            width: 120,
            render: (rowData: LessonType) => new Date(rowData.createdAt).toLocaleDateString("vi-VN"),
        },
        {
            key: "actions",
            label: "Thao tác",
            width: 150,
            align: "center",
            isAction: true,
            render: (rowData: LessonType) => (
                <div className="flex items-center justify-end gap-2 pe-4">
                    <IconButton
                        appearance="subtle"
                        size="sm"
                        icon={<BookOpen className="h-4 w-4" />}
                        onClick={() => {
                            // Navigate to lesson content view
                            // This could open a modal or navigate to detail page
                        }}
                        title="Xem nội dung"
                    />
                    <IconButton
                        appearance="subtle"
                        size="sm"
                        icon={<PencilIcon className="h-4 w-4" />}
                        onClick={() => setLessonIdEdit(rowData.id)}
                        title="Chỉnh sửa"
                    />
                    <DeletePopover
                        title={`Xóa bài học "${rowData.title}"`}
                        description="Bạn có chắc chắn muốn xóa bài học này không? Hành động này không thể hoàn tác."
                        onDelete={() => handleDeleteLesson(rowData)}
                    />
                </div>
            ),
        },
    ];

    const hasFilter = filter.keyword || filter.courseId || filter.moduleId || filter.minDuration || filter.maxDuration;

    return (
        <BaseLayout>
            <div className="flex items-center gap-2 justify-end mb-1">
                <IconButton
                    className="bg-gray-100 border border-gray-200 rounded-md flex items-center justify-center hover:bg-gray-200 p-1 w-7 h-7"
                    size="sm"
                    appearance="subtle"
                    icon={<FunnelIcon />}
                    onClick={() => setFilterCollapsed(!filterCollapsed)}
                />
                <LessonForm onSubmitSuccess={lessonListQuery.refetch} />
            </div>

            <Transition
                show={filterCollapsed}
                enter="transition-all duration-300 ease-out"
                enterFrom="opacity-0 max-h-0"
                enterTo="opacity-100 max-h-screen"
                leave="transition-all duration-200 ease-in"
                leaveFrom="opacity-100 max-h-screen"
                leaveTo="opacity-0 max-h-0"
            >
                <div className="pb-1 overflow-hidden pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-0 bg-white">
                        <div className="grid grid-cols-3 gap-2 mb-2">
                            <div className="col-span-1 flex items-center">
                                <Label className="block text-xs text-gray-500 mb-1">
                                    Tìm kiếm
                                </Label>
                            </div>
                            <div className="col-span-2">
                                <Input
                                    ref={inputSearchRef}
                                    placeholder="Nhập từ khóa tìm kiếm"
                                    className="w-full text-xs md:text-xs"
                                    size="sm"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-2">
                            <div className="col-span-1 flex items-center">
                                <Label className="block text-xs text-gray-500 mb-1">
                                    Course ID
                                </Label>
                            </div>
                            <div className="col-span-2">
                                <Input
                                    type="number"
                                    placeholder="Nhập Course ID"
                                    className="w-full text-xs md:text-xs"
                                    size="sm"
                                    value={filter.courseId?.toString() || ""}
                                    onChange={(value) =>
                                        setFilter((prev) => ({
                                            ...prev,
                                            courseId: value ? Number(value) : undefined,
                                        }))
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-2">
                            <div className="col-span-1 flex items-center">
                                <Label className="block text-xs text-gray-500 mb-1">
                                    Module ID
                                </Label>
                            </div>
                            <div className="col-span-2">
                                <Input
                                    type="number"
                                    placeholder="Nhập Module ID"
                                    className="w-full text-xs md:text-xs"
                                    size="sm"
                                    value={filter.moduleId?.toString() || ""}
                                    onChange={(value) =>
                                        setFilter((prev) => ({
                                            ...prev,
                                            moduleId: value ? Number(value) : undefined,
                                        }))
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-2">
                            <div className="col-span-1 flex items-center">
                                <Label className="block text-xs text-gray-500 mb-1">
                                    Thời lượng từ
                                </Label>
                            </div>
                            <div className="col-span-2">
                                <Input
                                    type="number"
                                    placeholder="Từ (phút)"
                                    className="w-full text-xs md:text-xs"
                                    size="sm"
                                    value={filter.minDuration?.toString() || ""}
                                    onChange={(value) =>
                                        setFilter((prev) => ({
                                            ...prev,
                                            minDuration: value ? Number(value) : undefined,
                                        }))
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-2">
                            <div className="col-span-1 flex items-center">
                                <Label className="block text-xs text-gray-500 mb-1">
                                    Thời lượng đến
                                </Label>
                            </div>
                            <div className="col-span-2">
                                <Input
                                    type="number"
                                    placeholder="Đến (phút)"
                                    className="w-full text-xs md:text-xs"
                                    size="sm"
                                    value={filter.maxDuration?.toString() || ""}
                                    onChange={(value) =>
                                        setFilter((prev) => ({
                                            ...prev,
                                            maxDuration: value ? Number(value) : undefined,
                                        }))
                                    }
                                />
                            </div>
                        </div>
                        <div className="flex justify-end w-full gap-2 col-span-1 md:col-span-1 lg:col-span-1 lg:col-start-3">
                            <Button
                                appearance="ghost"
                                className="border-gray-300 text-gray-700 hover:bg-gray-100 h-8 px-4"
                                onClick={() => {
                                    handleResetFilter();
                                }}
                                size="sm"
                            >
                                Đặt lại
                            </Button>
                            <Button
                                appearance="primary"
                                className="bg-primary text-white hover:bg-blue-800 hover:text-white h-8 px-4"
                                onClick={() => {
                                    handleSearch();
                                }}
                                size="sm"
                            >
                                Tìm kiếm
                            </Button>
                        </div>
                    </div>
                </div>
            </Transition>

            <LessonForm
                id={lessonIdEdit}
                setId={setLessonIdEdit}
                onSubmitSuccess={lessonListQuery.refetch}
                triggerButton={false}
            />

            <Table
                data={data}
                columns={columns}
                loading={lessonListQuery.isLoading}
                emptyText="Không có dữ liệu"
                loadingText="Đang tải..."
                showPagination={true}
                totalCount={totalCount}
                pathname="/manage/lessons"
                pageIndex={pageIndex}
                pageSize={PAGE_SIZE}
                showRowNumbers={false}
                paginationPosition="bottom"
            />
        </BaseLayout>
    );
}