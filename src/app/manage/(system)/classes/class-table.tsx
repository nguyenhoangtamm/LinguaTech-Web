"use client";

import { useEffect, useRef, useState } from "react";
import { getDisplayedRowCount, handleErrorApi } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { PencilIcon } from "lucide-react";
import { ClassType, FilterClassType } from "@/schemaValidations/class.schema";
import { useClassListQuery, useDeleteClassMutation } from "@/queries/useClass";
import { Label } from "@/components/ui/label";
import { IconButton, Input, Button, Badge } from "rsuite";
import DeletePopover from "@/app/shared/delete-popover";
import { PageHeaderProps } from "@/types/page-header-props.type";
import { usePageHeader } from "@/hooks/use-page-header";
import ClassForm from "./class-form";
import { Transition } from "@headlessui/react";
import Table, { TableColumn } from "@/app/shared/common/components/table";
import BaseLayout from "@/layouts/BaseLayout";
import FunnelIcon from '@rsuite/icons/Funnel';

const PAGE_SIZE = 10;

export default function ClassTable({ title, breadcrumb }: PageHeaderProps) {
    usePageHeader({ title, breadcrumb });
    const searchParam = useSearchParams();
    const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
    const pageIndex = page - 1;

    const [classIdEdit, setClassIdEdit] = useState<number | undefined>();
    const [filter, setFilter] = useState<FilterClassType>({
        pageNumber: page,
        pageSize: PAGE_SIZE,
        searchTerm: "",
    });

    const classListQuery = useClassListQuery({
        pageNumber: page,
        pageSize: PAGE_SIZE,
        searchTerm: filter.searchTerm,
        courseId: filter.courseId,
        status: filter.status,
    });

    const listResult: { data: ClassType[]; totalCount: number } =
        classListQuery.data?.data?.data ?? {
            data: [],
            totalCount: 0,
        };
    const data: ClassType[] = listResult.data;
    const totalCount: number = listResult.totalCount;

    const [activeSearch, setActiveSearch] = useState(false);

    useEffect(() => {
        if (activeSearch) {
            classListQuery.refetch();
            setActiveSearch(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSearch]);

    const inputSearchRef = useRef<HTMLInputElement>(null);
    const deleteClassMutation = useDeleteClassMutation();

    const handleDeleteClass = async (classItem: ClassType) => {
        if (deleteClassMutation.isPending) return;

        try {
            const result = await deleteClassMutation.mutateAsync(classItem.id);
            if (result?.data?.succeeded) {
                toast({
                    description: `Đã xóa lớp học "${classItem.name}"`,
                });
                classListQuery.refetch();
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
            searchTerm: "",
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
            searchTerm: keyword,
        }));
        setActiveSearch(true);
    };

    const columns: TableColumn<ClassType>[] = [
        {
            title: "STT",
            dataIndex: "id",
            key: "stt",
            width: 70,
            render: (_: any, __: ClassType, index: number) => {
                return <span>{pageIndex * PAGE_SIZE + index + 1}</span>;
            },
        },
        {
            title: "Tên lớp",
            dataIndex: "name",
            key: "name",
            render: (name: string) => (
                <span className="font-medium">{name}</span>
            ),
        },
        {
            title: "Giáo viên",
            dataIndex: "teacherName",
            key: "teacherName",
        },
        {
            title: "Địa điểm",
            dataIndex: "location",
            key: "location",
        },
        {
            title: "Lịch học",
            dataIndex: "schedule",
            key: "schedule",
            width: 200,
            render: (schedule: string) => (
                <span className="text-sm">{schedule}</span>
            ),
        },
        {
            title: "Ngày bắt đầu",
            dataIndex: "startDate",
            key: "startDate",
            render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
        },
        {
            title: "Ngày kết thúc",
            dataIndex: "endDate",
            key: "endDate",
            render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
        },
        {
            title: "Học viên",
            dataIndex: "maxStudents",
            key: "maxStudents",
            width: 100,
            render: (maxStudents: number, record: ClassType) => (
                <span>
                    {record.currentStudents || 0}/{maxStudents}
                </span>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            width: 120,
            render: (status: string) => {
                const statusColors: Record<string, string> = {
                    draft: "bg-gray-100 text-gray-800",
                    published: "bg-blue-100 text-blue-800",
                    ongoing: "bg-green-100 text-green-800",
                    completed: "bg-purple-100 text-purple-800",
                    cancelled: "bg-red-100 text-red-800",
                };
                const statusLabels: Record<string, string> = {
                    draft: "Nháp",
                    published: "Đã xuất bản",
                    ongoing: "Đang diễn ra",
                    completed: "Đã hoàn thành",
                    cancelled: "Đã hủy",
                };
                return (
                    <Badge className={`px-2 py-1 rounded-full text-xs ${statusColors[status] || "bg-gray-100 text-gray-800"}`}>
                        {statusLabels[status] || status}
                    </Badge>
                );
            },
        },
        {
            title: "Thao tác",
            key: "actions",
            width: 120,
            render: (_: any, record: ClassType) => (
                <div className="flex gap-2">
                    <IconButton
                        size="sm"
                        appearance="subtle"
                        color="blue"
                        icon={<PencilIcon size={16} />}
                        onClick={() => setClassIdEdit(record.id)}
                    />
                    <DeletePopover
                        title={`Xóa lớp học "${record.name}"`}
                        description="Bạn có chắc chắn muốn xóa lớp học này không?"
                        onConfirm={() => handleDeleteClass(record)}
                    />
                </div>
            ),
        },
    ];

    const hasFilter = filter.searchTerm || filter.courseId || filter.status;

    return (
        <BaseLayout>
            <div className="p-4">
                {/* Header Actions */}
                <div className="mb-6 flex justify-between items-center">
                    <div className="flex gap-3">
                        <Input
                            ref={inputSearchRef}
                            placeholder="Tìm kiếm lớp học..."
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
                        onClick={() => setClassIdEdit(0)}
                        appearance="primary"
                    >
                        Thêm lớp học
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label>Trạng thái</Label>
                                <Input
                                    placeholder="Nhập trạng thái..."
                                    value={filter.status || ""}
                                    onChange={(value) =>
                                        setFilter((prev) => ({ ...prev, status: value }))
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

                {/* Table */}
                <Table
                    data={data}
                    columns={columns}
                    loading={classListQuery.isLoading}
                    totalCount={totalCount}
                    pageSize={PAGE_SIZE}
                    showPagination
                    paginationPosition="bottom"
                />

                {/* Edit/Create Form Modal */}
                {classIdEdit !== undefined && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <ClassForm
                                classId={classIdEdit || undefined}
                                onSuccess={() => {
                                    setClassIdEdit(undefined);
                                    classListQuery.refetch();
                                }}
                                onCancel={() => setClassIdEdit(undefined)}
                            />
                        </div>
                    </div>
                )}
            </div>
        </BaseLayout>
    );
}