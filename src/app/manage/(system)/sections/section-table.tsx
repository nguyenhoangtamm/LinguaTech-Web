"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";
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
import SectionForm from "./section-form";

const PAGE_SIZE = 10;

export default function SectionTable({ title, breadcrumb }: PageHeaderProps) {
    usePageHeader({ title, breadcrumb });
    const searchParam = useSearchParams();
    const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
    const pageIndex = page - 1;

    const [sectionIdEdit, setSectionIdEdit] = useState<number | undefined>();
    const [filter, setFilter] = useState<Partial<FilterSectionType>>({
        keyword: "",
        lessonId: undefined,
    });

    const sectionListQuery = useSectionListQuery({
        pageNumber: page,
        pageSize: PAGE_SIZE,
        keyword: filter.keyword,
        lessonId: filter.lessonId,
    });

    const listResult: { data: SectionType[]; totalCount: number } =
        sectionListQuery.data ?? {
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
    const { mutateAsync } = useDeleteSectionMutation();

    const handleDeleteSection = async (value: SectionType | null) => {
        try {
            if (value) {
                const result = await mutateAsync(value.id);
                toast({
                    title: result?.message,
                    variant: "success",
                    duration: 1000,
                });
                sectionListQuery.refetch();
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
            lessonId: undefined,
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
            render: (rowData: SectionType, rowIndex?: number) => {
                const safeRowIndex = rowIndex ?? 0;
                const stt = pageIndex * PAGE_SIZE + safeRowIndex + 1;
                return <Label>{stt}</Label>;
            },
        },
        {
            key: "order",
            label: "Thứ tự",
            width: 80,
            render: (rowData: SectionType) => (
                <Badge color="blue" >
                    #{rowData.order}
                </Badge>
            ),
        },
        {
            key: "lessonTitle",
            label: "Bài học",
            flexGrow: 1,
            render: (rowData: SectionType) => (
                <div>
                    <p className="font-medium">{rowData.lessonTitle || `Lesson #${rowData.lessonId}`}</p>
                    <p className="text-sm text-gray-500">ID: {rowData.lessonId}</p>
                </div>
            ),
        },
        {
            key: "content",
            label: "Nội dung",
            flexGrow: 1,
            render: (rowData: SectionType) => (
                <div className="max-w-xs">
                    <p className="text-sm line-clamp-2">{rowData.content}</p>
                </div>
            ),
        },
        {
            key: "createdAt",
            label: "Ngày tạo",
            width: 120,
            render: (rowData: SectionType) => new Date(rowData.createdAt).toLocaleDateString("vi-VN"),
        },
        {
            key: "updatedAt",
            label: "Ngày cập nhật",
            width: 120,
            render: (rowData: SectionType) => new Date(rowData.updatedAt).toLocaleDateString("vi-VN"),
        },
        {
            key: "actions",
            label: "Thao tác",
            width: 150,
            align: "center",
            isAction: true,
            render: (rowData: SectionType) => (
                <div className="flex items-center justify-end gap-2 pe-4">
                    <IconButton
                        appearance="subtle"
                        size="sm"
                        icon={<Eye className="h-4 w-4" />}
                        onClick={() => {
                            // Navigate to section detail
                        }}
                        title="Xem chi tiết"
                    />
                    <IconButton
                        appearance="subtle"
                        size="sm"
                        icon={<PencilIcon className="h-4 w-4" />}
                        onClick={() => setSectionIdEdit(rowData.id)}
                        title="Chỉnh sửa"
                    />
                    <DeletePopover
                        title={`Xóa phần học "${rowData.title}"`}
                        description="Bạn có chắc chắn muốn xóa phần học này không? Hành động này không thể hoàn tác."
                        onDelete={() => handleDeleteSection(rowData)}
                    />
                </div>
            ),
        },
    ];

    const hasFilter = filter.keyword || filter.lessonId;

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
                <SectionForm onSubmitSuccess={sectionListQuery.refetch} />
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
                                    Lesson ID
                                </Label>
                            </div>
                            <div className="col-span-2">
                                <Input
                                    type="number"
                                    placeholder="Nhập Lesson ID"
                                    className="w-full text-xs md:text-xs"
                                    size="sm"
                                    value={filter.lessonId?.toString() || ""}
                                    onChange={(value) =>
                                        setFilter((prev) => ({
                                            ...prev,
                                            lessonId: value ? Number(value) : undefined,
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

            <SectionForm
                id={sectionIdEdit}
                setId={setSectionIdEdit}
                onSubmitSuccess={sectionListQuery.refetch}
                triggerButton={false}
            />

            <Table
                data={data}
                columns={columns}
                loading={sectionListQuery.isLoading}
                emptyText="Không có dữ liệu"
                loadingText="Đang tải..."
                showPagination={true}
                totalCount={totalCount}
                pathname="/manage/sections"
                pageIndex={pageIndex}
                pageSize={PAGE_SIZE}
                showRowNumbers={false}
                paginationPosition="bottom"
            />
        </BaseLayout>
    );
}