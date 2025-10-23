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
  RoleType,
  FilterRoleType,
} from "@/schemaValidations/role.schema";
import { useRoleListQuery, useDeleteRoleMutation } from "@/queries/useRole";
import { Label } from "@/components/ui/label";
import { IconButton, Input, Button, Badge } from "rsuite";
import DeletePopover from "@/app/shared/delete-popover";
import { PageHeaderProps } from "@/types/page-header-props.type";
import { usePageHeader } from "@/hooks/use-page-header";
import RoleForm from "./role-form";
import { Transition } from "@headlessui/react";
import Table, { TableColumn } from "@/app/shared/common/components/table";
import BaseLayout from "@/layouts/BaseLayout";
import FunnelIcon from '@rsuite/icons/Funnel';

const PAGE_SIZE = 10;

export default function RoleTable({ title, breadcrumb }: PageHeaderProps) {
  usePageHeader({ title, breadcrumb });
  const searchParam = useSearchParams();
  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  const pageIndex = page - 1;

  const [roleIdEdit, setRoleIdEdit] = useState<number | undefined>();
  const [filter, setFilter] = useState<FilterRoleType>({ keywords: "" });

  const roleListQuery = useRoleListQuery({
    pageNumber: page,
    pageSize: PAGE_SIZE,
    keywords: filter.keywords,
  });

  const listResult: { data: RoleType[]; totalCount: number } =
    roleListQuery.data?.data ?? {
      data: [],
      totalCount: 0,
    };
  const data: RoleType[] = listResult.data;
  const totalCount: number = listResult.totalCount;

  const [activeSearch, setActiveSearch] = useState(false);

  useEffect(() => {
    if (activeSearch) {
      roleListQuery.refetch();
      setActiveSearch(false);
    }
  }, [activeSearch, roleListQuery]);

  const handleSearch = () => {
    let actionChange = false;
    if (inputSearchRef.current) {
      const searchValue = inputSearchRef.current?.value ?? "";
      setFilter({ ...filter, keywords: searchValue });
      actionChange = true;
    }
    if (actionChange) {
      setActiveSearch(true);
    }
  };

  const inputSearchRef = useRef<HTMLInputElement>(null);
  const { mutateAsync } = useDeleteRoleMutation();

  const handleDeleteRole = async (value: RoleType | null) => {
    try {
      if (value) {
        const result = await mutateAsync(value.id);
        toast({
          title: result?.message,
          variant: "success",
          duration: 1000,
        });
        roleListQuery.refetch();
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
      keywords: "",
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
      render: (rowData: RoleType, rowIndex?: number) => {
        const safeRowIndex = rowIndex ?? 0;
        const stt = pageIndex * PAGE_SIZE + safeRowIndex + 1;
        return <Label>{stt}</Label>;
      },
    },
    {
      key: "name",
      label: "Tên vai trò",
      flexGrow: 1,
      render: (rowData: RoleType) => (
        <div className="capitalize">{rowData.name}</div>
      ),
    },
    {
      key: "code",
      label: "Mã vai trò",
      width: 150,
      render: (rowData: RoleType) => (
        <div className="capitalize">{rowData.code}</div>
      ),
    },
    {
      key: "description",
      label: "Mô tả",
      flexGrow: 1,
      render: (rowData: RoleType) => (
        <div className="capitalize">{rowData.description}</div>
      ),
    },
    {
      key: "priority",
      label: "Ưu tiên",
      width: 120,
      align: "center",
      render: (rowData: RoleType) => (
        <Badge
          color={rowData.priority ? "green" : "orange"}
          content={rowData.priority ? "Ưu tiên" : "Không ưu tiên"}
        />

      ),
    },
    {
      key: "order",
      label: "Thứ tự",
      width: 100,
      align: "center",
      render: (rowData: RoleType) => (
        <div className="capitalize">{rowData.order}</div>
      ),
    },
    {
      key: "color",
      label: "Màu sắc",
      width: 100,
      align: "center",
      render: (rowData: RoleType) => {
        return (
          <div className="capitalize">
            <span
              className={`inline-block w-5 h-5 rounded-full border ${rowData.color || "bg-gray-300"}`}
            />
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
      render: (rowData: RoleType) => (
        <div className="flex items-center justify-end gap-2 pe-4">
          <IconButton
            appearance="subtle"
            size="sm"
            icon={<PencilIcon className="h-4 w-4" />}
            onClick={() => setRoleIdEdit(rowData.id)}
            title="Sửa"
          />
          <DeletePopover
            title={`Xóa vai trò`}
            description={`Chắc chắn xóa dữ liệu vai trò "${rowData.name}"`}
            onDelete={() => handleDeleteRole(rowData)}
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
        <RoleForm onSubmitSuccess={roleListQuery.refetch} />
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

      <RoleForm
        id={roleIdEdit}
        setId={setRoleIdEdit}
        onSubmitSuccess={roleListQuery.refetch}
        triggerButton={false}
      />

      <Table
        data={data}
        columns={columns}
        loading={roleListQuery.isLoading}
        emptyText="Không có dữ liệu"
        loadingText="Đang tải..."
        showPagination={true}
        totalCount={totalCount}
        pathname="/manage/roles"
        pageIndex={pageIndex}
        pageSize={PAGE_SIZE}
        showRowNumbers={false}
        paginationPosition="bottom"
      />
    </BaseLayout>
  );
}
