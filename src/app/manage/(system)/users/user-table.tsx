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
import Image from "next/image";
import {
  UserType,
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

  const listResult: { data: UserType[]; totalCount: number } =
    userListQuery.data ?? {
      data: [],
      totalCount: 0,
    };
  const data: UserType[] = listResult.data;
  const totalCount: number = listResult.totalCount;

  const [activeSearch, setActiveSearch] = useState(false);

  useEffect(() => {
    if (activeSearch) {
      userListQuery.refetch();
      setActiveSearch(false);
    }
  }, [activeSearch, userListQuery]);

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
  const { mutateAsync } = useDeleteUserMutation();

  const handleDeleteUser = async (value: UserType | null) => {
    try {
      if (value) {
        const result = await mutateAsync(value.id);
        toast({
          title: result?.message,
          variant: "success",
          duration: 1000,
        });
        userListQuery.refetch();
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
      render: (rowData: UserType, rowIndex?: number) => {
        const safeRowIndex = rowIndex ?? 0;
        const stt = pageIndex * PAGE_SIZE + safeRowIndex + 1;
        return <Label>{stt}</Label>;
      },
    },
    {
      key: "username",
      label: "Tên đăng nhập",
      flexGrow: 1,
      render: (rowData: UserType) => (
        <div className="font-medium">{rowData.username}</div>
      ),
    },
    {
      key: "fullname",
      label: "Họ và tên",
      flexGrow: 1,
      render: (rowData: UserType) => (
        <div className="capitalize">{rowData.fullname}</div>
      ),
    },
    {
      key: "email",
      label: "Email",
      flexGrow: 1,
      render: (rowData: UserType) => (
        <div className="lowercase">{rowData.email}</div>
      ),
    },
    {
      key: "role",
      label: "Vai trò",
      width: 150,
      render: (rowData: UserType) => (
        <Badge
          color="blue"
          content={rowData.role}
        />
      ),
    },
    {
      key: "avatar",
      label: "Avatar",
      width: 100,
      align: "center",
      render: (rowData: UserType) => (
        <div className="flex items-center justify-center">
          {rowData.avatar ? (
            <Image
              src={rowData.avatar}
              alt="Avatar"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm">
              {rowData.fullname?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Hành động",
      width: 120,
      align: "center",
      isAction: true,
      render: (rowData: UserType) => (
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
        pathname="/manage/users"
        pageIndex={pageIndex}
        pageSize={PAGE_SIZE}
        showRowNumbers={false}
        paginationPosition="bottom"
      />
    </BaseLayout>
  );
}