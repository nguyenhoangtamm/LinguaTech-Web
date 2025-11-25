"use client";

import { useEffect, useRef, useState } from "react";
import { getDisplayedRowCount, handleErrorApi } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { PencilIcon, ExternalLink, Eye } from "lucide-react";
import { EnrollmentType, FilterEnrollmentType } from "@/schemaValidations/enrollment.schema";
import {
    useEnrollmentListQuery,
    useDeleteEnrollmentMutation
} from "@/queries/useEnrollment";
import { Label } from "@/components/ui/label";
import { IconButton, Input, Button, Badge, Progress } from "rsuite";
import DeletePopover from "@/app/shared/delete-popover";
import { PageHeaderProps } from "@/types/page-header-props.type";
import { usePageHeader } from "@/hooks/use-page-header";
import { Transition } from "@headlessui/react";
import Table, { TableColumn } from "@/app/shared/common/components/table";
import BaseLayout from "@/layouts/BaseLayout";
import FunnelIcon from '@rsuite/icons/Funnel';
import Link from "next/link";

const PAGE_SIZE = 10;

export default function EnrollmentTable({ title, breadcrumb }: PageHeaderProps) {
    usePageHeader({ title, breadcrumb });
    const searchParam = useSearchParams();
    const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
    const pageIndex = page - 1;

    const [enrollmentIdEdit, setEnrollmentIdEdit] = useState<number | undefined>();
    const [filter, setFilter] = useState<FilterEnrollmentType>({
        pageNumber: page,
        pageSize: PAGE_SIZE,
        keyword: "",
    });

    const enrollmentListQuery = useEnrollmentListQuery({
        pageNumber: page,
        pageSize: PAGE_SIZE,
        keyword: filter.keyword,
        userId: filter.userId,
        courseId: filter.courseId,
        status: filter.status,
    });

    const listResult: { data: EnrollmentType[]; totalCount: number } =
        enrollmentListQuery.data?.data?.data ?? {
            data: [],
            totalCount: 0,
        };
    const data: EnrollmentType[] = listResult.data;
    const totalCount: number = listResult.totalCount;

    const [activeSearch, setActiveSearch] = useState(false);

    useEffect(() => {
        if (activeSearch) {
            enrollmentListQuery.refetch();
            setActiveSearch(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSearch]);

    const inputSearchRef = useRef<HTMLInputElement>(null);
    const deleteEnrollmentMutation = useDeleteEnrollmentMutation();

    const handleDeleteEnrollment = async (enrollment: EnrollmentType) => {
        if (deleteEnrollmentMutation.isPending) return;

        try {
            const result = await deleteEnrollmentMutation.mutateAsync(enrollment.id);
            if (result?.data?.succeeded) {
                toast({
                    description: `Đã xóa đăng ký của "${enrollment.userName}"`,
                });
                enrollmentListQuery.refetch();
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

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            active: "blue",
            completed: "green",
            dropped: "red",
            suspended: "orange",
        };
        return colors[status] || "violet";
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            active: "Đang học",
            completed: "Hoàn thành",
            dropped: "Đã bỏ",
            suspended: "Tạm dừng",
        };
        return labels[status] || status;
    };

    const columns: TableColumn[] = [
        {
            key: "id",
            label: "STT",
            width: 80,
            align: "center",
            render: (rowData: EnrollmentType, rowIndex?: number) => {
                const safeRowIndex = rowIndex ?? 0;
                const stt = pageIndex * PAGE_SIZE + safeRowIndex + 1;
                return <Label>{stt}</Label>;
            },
        },
        {
            key: "userName",
            label: "Học viên",
            flexGrow: 1,
            render: (rowData: EnrollmentType) => (
                <div>
                    <p className="font-medium">{rowData.userName}</p>
                    <p className="text-sm text-gray-500">{rowData.userEmail}</p>
                </div>
            ),
        },
        {
            key: "courseTitle",
            label: "Khóa học",
            flexGrow: 1,
            render: (rowData: EnrollmentType) => (
                <div>
                    <p className="font-medium line-clamp-2">{rowData.courseTitle}</p>
                    <p className="text-sm text-gray-500">{rowData.courseInstructor}</p>
                </div>
            ),
        },
        {
            key: "progress",
            label: "Tiến độ",
            width: 150,
            render: (rowData: EnrollmentType) => (
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span>{rowData.progress}%</span>
                        <span>{rowData.completedLessons}/{rowData.totalLessons} bài</span>
                    </div>
                    <Progress.Line
                        percent={rowData.progress}
                        strokeColor={rowData.progress === 100 ? "#52c41a" : "#1890ff"}
                        showInfo={false}
                        strokeWidth={6}
                    />
                </div>
            ),
        },
        {
            key: "enrolledDate",
            label: "Ngày đăng ký",
            width: 120,
            align: "center",
            render: (rowData: EnrollmentType) => (
                <div className="text-sm">{new Date(rowData.enrolledDate).toLocaleDateString("vi-VN")}</div>
            ),
        },
        {
            key: "status",
            label: "Trạng thái",
            width: 120,
            align: "center",
            render: (rowData: EnrollmentType) => (
                <Badge color={getStatusColor(rowData.status) as any}>
                    {getStatusLabel(rowData.status)}
                </Badge>
            ),
        },
        {
            key: "completedDate",
            label: "Ngày hoàn thành",
            width: 120,
            align: "center",
            render: (rowData: EnrollmentType) => (
                <div className="text-sm">{rowData.completedDate ? new Date(rowData.completedDate).toLocaleDateString("vi-VN") : "-"}</div>
            ),
        },
        {
            key: "actions",
            label: "Thao tác",
            width: 150,
            align: "center",
            isAction: true,
            render: (rowData: EnrollmentType) => (
                <div className="flex items-center justify-end gap-2 pe-4">
                    <IconButton
                        appearance="subtle"
                        size="sm"
                        icon={<Eye className="h-4 w-4" />}
                        onClick={() => setEnrollmentIdEdit(rowData.id)}
                        title="Xem chi tiết"
                    />
                    <IconButton
                        appearance="subtle"
                        size="sm"
                        icon={<ExternalLink className="h-4 w-4" />}
                        title="Xem khóa học"
                        onClick={() => window.open(`/courses/${rowData.courseId}`, "_blank")}
                    />
                    <DeletePopover
                        title={`Hủy đăng ký của "${rowData.userName}"`}
                        description="Bạn có chắc chắn muốn hủy đăng ký này không? Hành động này không thể hoàn tác."
                        onDelete={() => handleDeleteEnrollment(rowData)}
                    />
                </div>
            ),
        },
    ];

    const hasFilter = filter.keyword || filter.userId || filter.courseId || filter.status;

    return (
        <BaseLayout>
            <div className="p-4">
                {/* Header Actions */}
                <div className="mb-6 flex justify-between items-center">
                    <div className="flex gap-3">
                        <Input
                            ref={inputSearchRef}
                            placeholder="Tìm kiếm học viên hoặc khóa học..."
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
                                <Label>User ID</Label>
                                <Input
                                    type="number"
                                    placeholder="Nhập User ID..."
                                    value={filter.userId?.toString() || ""}
                                    onChange={(value) =>
                                        setFilter((prev) => ({
                                            ...prev,
                                            userId: value ? Number(value) : undefined
                                        }))
                                    }
                                />
                            </div>
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
                                <Label>Trạng thái</Label>
                                <select
                                    className="w-full p-2 border rounded-md"
                                    value={filter.status || ""}
                                    onChange={(e) =>
                                        setFilter((prev) => ({
                                            ...prev,
                                            status: e.target.value as any
                                        }))
                                    }
                                >
                                    <option value="">Tất cả trạng thái</option>
                                    <option value="active">Đang học</option>
                                    <option value="completed">Hoàn thành</option>
                                    <option value="dropped">Đã bỏ</option>
                                    <option value="suspended">Tạm dừng</option>
                                </select>
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
                <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                            {data.filter(e => e.status === 'active').length}
                        </div>
                        <div className="text-sm text-gray-600">Đang học</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                            {data.filter(e => e.status === 'completed').length}
                        </div>
                        <div className="text-sm text-gray-600">Hoàn thành</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                            {data.filter(e => e.status === 'dropped').length}
                        </div>
                        <div className="text-sm text-gray-600">Đã bỏ</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                            {data.filter(e => e.status === 'suspended').length}
                        </div>
                        <div className="text-sm text-gray-600">Tạm dừng</div>
                    </div>
                </div>

                {/* Table */}
                <Table
                    data={data}
                    columns={columns}
                    loading={enrollmentListQuery.isLoading}
                    totalCount={totalCount}
                    pageSize={PAGE_SIZE}
                    showPagination
                    paginationPosition="bottom"
                />

                {/* Detail Modal - Simple display for now */}
                {enrollmentIdEdit !== undefined && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-2xl w-full p-6">
                            <h3 className="text-lg font-semibold mb-4">Chi tiết đăng ký</h3>
                            {/* Add detailed view here */}
                            <div className="flex justify-end">
                                <Button onClick={() => setEnrollmentIdEdit(undefined)}>
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