"use client";
import {
    useEffect,
    useRef,
    useState,
} from "react";
import { getDisplayedRowCount, handleErrorApi } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { PencilIcon } from "lucide-react";
import {
    AssignmentType,
    FilterAssignmentType,
} from "@/schemaValidations/assignment.schema";
import { useAssignmentListQuery, useDeleteAssignmentMutation } from "@/queries/useAssignment";
import { Label } from "@/components/ui/label";
import { IconButton, Input, Button, Badge } from "rsuite";
import DeletePopover from "@/app/shared/delete-popover";
import { PageHeaderProps } from "@/types/page-header-props.type";
import { usePageHeader } from "@/hooks/use-page-header";
import AssignmentForm from "./assignment-form";
import { Transition } from "@headlessui/react";
import Table, { TableColumn } from "@/app/shared/common/components/table";
import BaseLayout from "@/layouts/BaseLayout";
import FunnelIcon from '@rsuite/icons/Funnel';

const PAGE_SIZE = 10;

export default function AssignmentTable({ title, breadcrumb }: PageHeaderProps) {
    usePageHeader({ title, breadcrumb });
    const searchParam = useSearchParams();
    const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
    const pageIndex = page - 1;

    const [assignmentIdEdit, setAssignmentIdEdit] = useState<number | undefined>();
    const [filter, setFilter] = useState<FilterAssignmentType>({ keyword: "" });

    const assignmentListQuery = useAssignmentListQuery({
        pageNumber: page,
        pageSize: PAGE_SIZE,
        keyword: filter.keyword,
        lessonId: filter.lessonId,
        dueDateFrom: filter.dueDateFrom,
        dueDateTo: filter.dueDateTo,
        minScore: filter.minScore,
        maxScore: filter.maxScore,
    });

    const listResult: { data: AssignmentType[]; totalCount: number } =
        assignmentListQuery.data?.data?.data ?? {
            data: [],
            totalCount: 0,
        };
    const data: AssignmentType[] = listResult.data;
    const totalCount: number = listResult.totalCount;

    const [activeSearch, setActiveSearch] = useState(false);

    useEffect(() => {
        if (activeSearch) {
            assignmentListQuery.refetch();
            setActiveSearch(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSearch]);

    const inputSearchRef = useRef<HTMLInputElement>(null);
    const deleteAssignmentMutation = useDeleteAssignmentMutation();

    const handleDeleteAssignment = async (assignment: AssignmentType) => {
        if (deleteAssignmentMutation.isPending) return;

        try {
            const result = await deleteAssignmentMutation.mutateAsync(assignment.id);
            if (result?.data?.succeeded) {
                toast({
                    description: `Đã xóa bài tập "${assignment.title}"`,
                });
                assignmentListQuery.refetch();
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
            render: (rowData: AssignmentType, rowIndex?: number) => {
                const safeRowIndex = rowIndex ?? 0;
                const stt = pageIndex * PAGE_SIZE + safeRowIndex + 1;
                return <Label>{stt}</Label>;
            },
        },
        {
            key: "title",
            label: "Tiêu đề",
            flexGrow: 1,
            render: (rowData: AssignmentType) => (
                <div className="font-medium">{rowData.title}</div>
            ),
        },
        {
            key: "description",
            label: "Mô tả",
            width: 300,
            render: (rowData: AssignmentType) => (
                <div className="text-sm text-gray-600 truncate">
                    {rowData.description}
                </div>
            ),
        },
        {
            key: "lessonTitle",
            label: "Bài học",
            width: 150,
            render: (rowData: AssignmentType) => (
                <div className="text-sm">{rowData.lessonTitle || `Lesson ${rowData.lessonId}`}</div>
            ),
        },
        {
            key: "maxScore",
            label: "Điểm tối đa",
            width: 100,
            align: "center",
            render: (rowData: AssignmentType) => (
                <Badge content={rowData.maxScore} />
            ),
        },
        {
            key: "dueDate",
            label: "Hạn nộp",
            width: 150,
            render: (rowData: AssignmentType) => {
                const date = new Date(rowData.dueDate);
                return (
                    <div className="text-sm">
                        {date.toLocaleDateString("vi-VN")}
                        <br />
                        <span className="text-gray-500">
                            {date.toLocaleTimeString("vi-VN", {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                );
            },
        },
        {
            key: "actions",
            label: "Hành động",
            width: 120,
            align: "center",
            isAction: true,
            render: (rowData: AssignmentType) => (
                <div className="flex items-center justify-end gap-2 pe-4">
                    <IconButton
                        appearance="subtle"
                        size="sm"
                        icon={<PencilIcon className="h-4 w-4" />}
                        onClick={() => setAssignmentIdEdit(rowData.id)}
                        title="Sửa"
                    />
                    <DeletePopover
                        title={`Xóa bài tập`}
                        description={`Chắc chắn xóa bài tập "${rowData.title}"`}
                        onDelete={() => handleDeleteAssignment(rowData)}
                    />
                </div>
            ),
        },
    ];

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
                <AssignmentForm onSubmitSuccess={assignmentListQuery.refetch} />
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
                                    placeholder="Nhập từ khóa..."
                                    onChange={(value) =>
                                        setFilter((prev) => ({ ...prev, keyword: value }))
                                    }
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
                                    placeholder="Nhập ID bài học..."
                                    onChange={(value) =>
                                        setFilter((prev) => ({ ...prev, lessonId: value ? Number(value) : undefined }))
                                    }
                                />
                            </div>
                        </div>
                        <div className="flex justify-start gap-2 mb-2">
                            <Button
                                appearance="primary"
                                size="sm"
                                onClick={() => setActiveSearch(true)}
                            >
                                Tìm kiếm
                            </Button>
                            <Button
                                appearance="default"
                                size="sm"
                                onClick={handleResetFilter}
                            >
                                Đặt lại
                            </Button>
                        </div>
                    </div>
                </div>
            </Transition>

            <AssignmentForm
                id={assignmentIdEdit}
                setId={setAssignmentIdEdit}
                onSubmitSuccess={assignmentListQuery.refetch}
                triggerButton={false}
            />

            <Table
                data={data}
                columns={columns}
                loading={assignmentListQuery.isLoading}
                emptyText="Không có dữ liệu"
                loadingText="Đang tải..."
                showPagination={true}
                totalCount={totalCount}
                pathname="/manage/assignments"
                pageIndex={pageIndex}
                pageSize={PAGE_SIZE}
                showRowNumbers={false}
                paginationPosition="bottom"
            />
        </BaseLayout>
    );
}