"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";
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
import ModuleForm from "./module-form";
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
    const [filter, setFilter] = useState<Partial<FilterModuleType>>({
        keyword: "",
        courseId: undefined,
    });

    const moduleListQuery = useModuleListQuery({
        pageNumber: page,
        pageSize: PAGE_SIZE,
        keyword: filter.keyword,
        courseId: filter.courseId,
    });

    const listResult: { data: ModuleType[]; totalCount: number } =
        moduleListQuery.data ?? {
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
    const { mutateAsync } = useDeleteModuleMutation();

    const handleDeleteModule = async (value: ModuleType | null) => {
        try {
            if (value) {
                const result = await mutateAsync(value.id);
                toast({
                    title: result?.message,
                    variant: "success",
                    duration: 1000,
                });
                moduleListQuery.refetch();
            }
        } catch (error) {
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
        });
        if (inputSearchRef.current) inputSearchRef.current.value = "";
        setActiveSearch(true);
    };



    const columns: TableColumn[] = [
        {
            key: "id",
            label: "STT",
            width: 80,
            align: "center",
            render: (rowData: ModuleType, rowIndex?: number) => {
                const safeRowIndex = rowIndex ?? 0;
                const stt = pageIndex * PAGE_SIZE + safeRowIndex + 1;
                return <Label>{stt}</Label>;
            },
        },
        {
            key: "order",
            label: "Thứ tự",
            width: 80,
            render: (rowData: ModuleType) => (
                <Badge color="blue" appearance="ghost">
                    #{rowData.order}
                </Badge>
            ),
        },
        {
            key: "title",
            label: "Tiêu đề",
            flexGrow: 1,
            render: (rowData: ModuleType) => (
                <div>
                    <p className="font-medium line-clamp-2">{rowData.title}</p>
                    {rowData.description && (
                        <p className="text-sm text-gray-500 line-clamp-1">{rowData.description}</p>
                    )}
                </div>
            ),
        },
        {
            key: "courseTitle",
            label: "Khóa học",
            flexGrow: 1,
            render: (rowData: ModuleType) => (
                <div>
                    <p className="font-medium">{rowData.courseTitle || `Course #${rowData.courseId}`}</p>
                    <p className="text-sm text-gray-500">ID: {rowData.courseId}</p>
                </div>
            ),
        },
        {
            key: "lessonsCount",
            label: "Số bài học",
            width: 100,
            render: (rowData: ModuleType) => (
                <div className="flex items-center gap-1">
                    <BookOpen size={14} className="text-gray-400" />
                    <span>{rowData.lessonsCount || 0}</span>
                </div>
            ),
        },
        {
            key: "createdAt",
            label: "Ngày tạo",
            width: 120,
            render: (rowData: ModuleType) => new Date(rowData.createdAt).toLocaleDateString("vi-VN"),
        },
        {
            key: "updatedAt",
            label: "Ngày cập nhật",
            width: 120,
            render: (rowData: ModuleType) => new Date(rowData.updatedAt).toLocaleDateString("vi-VN"),
        },
        {
            key: "actions",
            label: "Thao tác",
            width: 180,
            align: "center",
            isAction: true,
            render: (rowData: ModuleType) => (
                <div className="flex items-center justify-end gap-2 pe-4">
                    <IconButton
                        appearance="subtle"
                        size="sm"
                        icon={<Eye className="h-4 w-4" />}
                        onClick={() => {
                            // Navigate to module detail with lessons
                        }}
                        title="Xem chi tiết"
                    />
                    <IconButton
                        appearance="subtle"
                        size="sm"
                        icon={<Plus className="h-4 w-4" />}
                        onClick={() => {
                            // Navigate to create lesson for this module
                        }}
                        title="Thêm bài học"
                    />
                    <IconButton
                        appearance="subtle"
                        size="sm"
                        icon={<PencilIcon className="h-4 w-4" />}
                        onClick={() => setModuleIdEdit(rowData.id)}
                        title="Chỉnh sửa"
                    />
                    <DeletePopover
                        title={`Xóa module "${rowData.title}"`}
                        description="Bạn có chắc chắn muốn xóa module này không? Tất cả bài học trong module cũng sẽ bị xóa. Hành động này không thể hoàn tác."
                        onDelete={() => handleDeleteModule(rowData)}
                    />
                </div>
            ),
        },
    ];

    const hasFilter = filter.keyword || filter.courseId;

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
                <ModuleForm onSubmitSuccess={moduleListQuery.refetch} />
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

            <ModuleForm
                id={moduleIdEdit}
                setId={setModuleIdEdit}
                onSubmitSuccess={moduleListQuery.refetch}
                triggerButton={false}
            />

            <Table
                data={data}
                columns={columns}
                loading={moduleListQuery.isLoading}
                emptyText="Không có dữ liệu"
                loadingText="Đang tải..."
                showPagination={true}
                totalCount={totalCount}
                pathname="/manage/modules"
                pageIndex={pageIndex}
                pageSize={PAGE_SIZE}
                showRowNumbers={false}
                paginationPosition="bottom"
            />
        </BaseLayout>
    );
}