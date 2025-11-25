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
    ApiUserType,
    FilterUserType,
} from "@/schemaValidations/user.schema";
import { useUserListQuery, useDeleteUserMutation } from "@/queries/useUser";
import { Label } from "@/components/ui/label";
import { IconButton, Input, Button, Badge } from "rsuite";
import DeletePopover from "@/app/shared/delete-popover";
import { PageHeaderProps } from "@/types/page-header-props.type";
import { usePageHeader } from "@/hooks/use-page-header";
import UserForm from "./user-form";
import { Transition } from "@headlessui/react";
import Table, { TableColumn } from "@/app/shared/common/components/table";
import BaseLayout from "@/layouts/BaseLayout";
import FunnelIcon from '@rsuite/icons/Funnel';

const PAGE_SIZE = 10;

export default function UserTable({ title, breadcrumb }: PageHeaderProps) {
    usePageHeader({ title, breadcrumb });
    const searchParam = useSearchParams();
    const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
    const pageIndex = page - 1;

    const [userIdEdit, setUserIdEdit] = useState<number | undefined>();
    const [filter, setFilter] = useState<FilterUserType>({ keyword: "" });

    const userListQuery = useUserListQuery({
        pageNumber: page,
        pageSize: PAGE_SIZE,
        keyword: filter.keyword,
    });

    const listResult: { data: ApiUserType[]; totalCount: number } =
        userListQuery.data?.data?.data ?? {
            data: [],
            totalCount: 0,
        };
    const data: ApiUserType[] = listResult.data;
    const totalCount: number = listResult.totalCount;

    const [activeSearch, setActiveSearch] = useState(false);

    useEffect(() => {
        if (activeSearch) {
            userListQuery.refetch();
            setActiveSearch(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSearch]);

    const inputSearchRef = useRef<HTMLInputElement>(null);
    const deleteUserMutation = useDeleteUserMutation();

    const handleDeleteUser = async (user: ApiUserType) => {
        if (deleteUserMutation.isPending) return;

        try {
            const result = await deleteUserMutation.mutateAsync(user.id);
            if (result?.data?.succeeded) {
                toast({
                    description: `Đã xóa người dùng "${user.username}"`,
                });
                userListQuery.refetch();
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Active":
                return "green";
            case "Inactive":
                return "orange";
            case "Suspended":
                return "red";
            default:
                return "violet";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "Active":
                return "Hoạt động";
            case "Inactive":
                return "Không hoạt động";
            case "Suspended":
                return "Tạm khóa";
            default:
                return status;
        }
    };

    const columns: TableColumn[] = [
        {
            key: "id",
            label: "STT",
            width: 80,
            align: "center",
            render: (rowData: ApiUserType, rowIndex?: number) => {
                const safeRowIndex = rowIndex ?? 0;
                const stt = pageIndex * PAGE_SIZE + safeRowIndex + 1;
                return <Label>{stt}</Label>;
            },
        },
        {
            key: "username",
            label: "Tên đăng nhập",
            width: 150,
            render: (rowData: ApiUserType) => (
                <div className="font-medium">{rowData.username}</div>
            ),
        },
        {
            key: "fullname",
            label: "Họ và tên",
            flexGrow: 1,
            render: (rowData: ApiUserType) => (
                <div>{rowData.fullname}</div>
            ),
        },
        {
            key: "email",
            label: "Email",
            width: 200,
            render: (rowData: ApiUserType) => (
                <div className="text-sm text-gray-600">{rowData.email}</div>
            ),
        },
        {
            key: "roleName",
            label: "Vai trò",
            width: 120,
            render: (rowData: ApiUserType) => (
                <Badge content={rowData.roleName} color="blue" />
            ),
        },
        {
            key: "status",
            label: "Trạng thái",
            width: 120,
            align: "center",
            render: (rowData: ApiUserType) => (
                <Badge
                    content={getStatusText(rowData.status)}
                    color={getStatusColor(rowData.status)}
                />
            ),
        },
        {
            key: "createdDate",
            label: "Ngày tạo",
            width: 150,
            render: (rowData: ApiUserType) => {
                if (!rowData.createdDate) return "-";
                const date = new Date(rowData.createdDate);
                return (
                    <div className="text-sm">
                        {date.toLocaleDateString("vi-VN")}
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
            render: (rowData: ApiUserType) => (
                <div className="flex items-center justify-end gap-2 pe-4">
                    <IconButton
                        appearance="subtle"
                        size="sm"
                        icon={<PencilIcon className="h-4 w-4" />}
                        onClick={() => setUserIdEdit(rowData.id)}
                        title="Sửa"
                    />
                    <DeletePopover
                        title={`Xóa người dùng`}
                        description={`Chắc chắn xóa người dùng "${rowData.username}"`}
                        onDelete={() => handleDeleteUser(rowData)}
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
                <UserForm onSubmitSuccess={userListQuery.refetch} />
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
                                    placeholder="Nhập tên, email..."
                                    onChange={(value) =>
                                        setFilter((prev) => ({ ...prev, keyword: value }))
                                    }
                                />
                            </div>
                        </div>
                        <div></div>
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

            <UserForm
                id={userIdEdit}
                setId={setUserIdEdit}
                onSubmitSuccess={userListQuery.refetch}
                triggerButton={false}
            />

            <Table
                data={data}
                columns={columns}
                loading={userListQuery.isLoading}
                emptyText="Không có dữ liệu"
                loadingText="Đang tải..."
                showPagination={true}
                totalCount={totalCount}
                pathname="/manage/user-management"
                pageIndex={pageIndex}
                pageSize={PAGE_SIZE}
                showRowNumbers={false}
                paginationPosition="bottom"
            />
        </BaseLayout>
    );
}