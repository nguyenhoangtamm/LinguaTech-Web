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
    Submission,
    SubmissionStatus,
} from "@/schemaValidations/submission.schema";
import { useSubmissionsWithPagination, useDeleteSubmission } from "@/queries/useSubmission";
import { Label } from "@/components/ui/label";
import { IconButton, Input, Button, Badge } from "rsuite";
import DeletePopover from "@/app/shared/delete-popover";
import { PageHeaderProps } from "@/types/page-header-props.type";
import { usePageHeader } from "@/hooks/use-page-header";
import SubmissionForm from "./submission-form";
import { Transition } from "@headlessui/react";
import Table, { TableColumn } from "@/app/shared/common/components/table";
import BaseLayout from "@/layouts/BaseLayout";
import FunnelIcon from '@rsuite/icons/Funnel';

const PAGE_SIZE = 10;

interface FilterSubmissionType {
    searchTerm: string;
    assignmentId?: number;
    userId?: number;
    minScore?: number;
    maxScore?: number;
}

export default function SubmissionTable({ title, breadcrumb }: PageHeaderProps) {
    usePageHeader({ title, breadcrumb });
    const searchParam = useSearchParams();
    const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
    const pageIndex = page - 1;

    const [submissionIdEdit, setSubmissionIdEdit] = useState<number | undefined>();
    const [filter, setFilter] = useState<FilterSubmissionType>({ searchTerm: "" });

    const submissionListQuery = useSubmissionsWithPagination({
        pageNumber: page,
        pageSize: PAGE_SIZE,
        searchTerm: filter.searchTerm,
        assignmentId: filter.assignmentId,
        userId: filter.userId,
        minScore: filter.minScore,
        maxScore: filter.maxScore,
    });

    const listResult: { data: Submission[]; totalCount: number } =
        submissionListQuery.data?.data ?? {
            data: [],
            totalCount: 0,
        };
    const data: Submission[] = listResult.data;
    const totalCount: number = listResult.totalCount;

    const [activeSearch, setActiveSearch] = useState(false);

    useEffect(() => {
        if (activeSearch) {
            submissionListQuery.refetch();
            setActiveSearch(false);
        }
    }, [activeSearch, submissionListQuery]);

    const handleSearch = () => {
        let actionChange = false;
        if (inputSearchRef.current) {
            const searchValue = inputSearchRef.current?.value ?? "";
            setFilter({ ...filter, searchTerm: searchValue });
            actionChange = true;
        }
        if (actionChange) {
            setActiveSearch(true);
        }
    };

    const inputSearchRef = useRef<HTMLInputElement>(null);
    const { mutateAsync } = useDeleteSubmission();

    const handleDeleteSubmission = async (value: Submission | null) => {
        try {
            if (value) {
                const result = await mutateAsync(value.id);
                toast({
                    title: result?.message,
                    variant: "success",
                    duration: 1000,
                });
                submissionListQuery.refetch();
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
            searchTerm: "",
        });
        if (inputSearchRef.current) inputSearchRef.current.value = "";
        setActiveSearch(true);
    };

    const getStatusBadge = (status: number) => {
        switch (status) {
            case SubmissionStatus.DRAFT:
                return <Badge color="gray" content="Draft" />;
            case SubmissionStatus.SUBMITTED:
                return <Badge color="blue" content="Submitted" />;
            case SubmissionStatus.GRADED:
                return <Badge color="green" content="Graded" />;
            case SubmissionStatus.RETURNED:
                return <Badge color="orange" content="Returned" />;
            default:
                return <Badge color="gray" content="Unknown" />;
        }
    };

    const columns: TableColumn[] = [
        {
            key: "id",
            label: "STT",
            width: 80,
            align: "center",
            render: (rowData: Submission, rowIndex?: number) => {
                const safeRowIndex = rowIndex ?? 0;
                const stt = pageIndex * PAGE_SIZE + safeRowIndex + 1;
                return <Label>{stt}</Label>;
            },
        },
        {
            key: "assignmentId",
            label: "Assignment ID",
            width: 120,
            render: (rowData: Submission) => (
                <div>{rowData.assignmentId}</div>
            ),
        },
        {
            key: "userId",
            label: "User ID",
            width: 120,
            render: (rowData: Submission) => (
                <div>{rowData.userId}</div>
            ),
        },
        {
            key: "fileUrl",
            label: "File",
            flexGrow: 1,
            render: (rowData: Submission) => (
                <div className="truncate">
                    {rowData.fileUrl ? (
                        <a href={rowData.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {rowData.fileUrl.split('/').pop() || 'File'}
                        </a>
                    ) : (
                        <span className="text-gray-400">No file</span>
                    )}
                </div>
            ),
        },
        {
            key: "score",
            label: "Điểm",
            width: 100,
            align: "center",
            render: (rowData: Submission) => (
                <div>{rowData.score ?? "—"}</div>
            ),
        },
        {
            key: "status",
            label: "Trạng thái",
            width: 120,
            align: "center",
            render: (rowData: Submission) => getStatusBadge(rowData.status),
        },
        {
            key: "submittedAt",
            label: "Ngày nộp",
            width: 150,
            render: (rowData: Submission) => (
                <div>
                    {rowData.submittedAt
                        ? new Date(rowData.submittedAt).toLocaleDateString("vi-VN")
                        : "—"
                    }
                </div>
            ),
        },
        {
            key: "actions",
            label: "Hành động",
            width: 120,
            align: "center",
            isAction: true,
            render: (rowData: Submission) => (
                <div className="flex items-center justify-end gap-2 pe-4">
                    <IconButton
                        appearance="subtle"
                        size="sm"
                        icon={<PencilIcon className="h-4 w-4" />}
                        onClick={() => setSubmissionIdEdit(rowData.id)}
                        title="Sửa"
                    />
                    <DeletePopover
                        title={`Xóa submission`}
                        description={`Chắc chắn xóa submission này?`}
                        onDelete={() => handleDeleteSubmission(rowData)}
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
                <SubmissionForm onSubmitSuccess={submissionListQuery.refetch} />
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

            <SubmissionForm
                id={submissionIdEdit}
                setId={setSubmissionIdEdit}
                onSubmitSuccess={submissionListQuery.refetch}
                triggerButton={false}
            />

            <Table
                data={data}
                columns={columns}
                loading={submissionListQuery.isLoading}
                emptyText="Không có dữ liệu"
                loadingText="Đang tải..."
                showPagination={true}
                totalCount={totalCount}
                pathname="/manage/submissions"
                pageIndex={pageIndex}
                pageSize={PAGE_SIZE}
                showRowNumbers={false}
                paginationPosition="bottom"
            />
        </BaseLayout>
    );
}