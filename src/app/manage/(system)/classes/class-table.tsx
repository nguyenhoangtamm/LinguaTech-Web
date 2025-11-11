"use client";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { getDisplayedRowCount, handleErrorApi } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { PencilIcon, Users } from "lucide-react";
import {
  ClassType,
  FilterClassType,
} from "@/schemaValidations/class.schema";
import { useClassListQuery, useDeleteClassMutation } from "@/queries/useClass";
import { Label } from "@/components/ui/label";
import { IconButton, Input, Button, Badge, SelectPicker } from "rsuite";
import DeletePopover from "@/app/shared/delete-popover";
import { PageHeaderProps } from "@/types/page-header-props.type";
import { usePageHeader } from "@/hooks/use-page-header";
import ClassForm from "./class-form";
import { Transition } from "@headlessui/react";
import Table, { TableColumn } from "@/app/shared/common/components/table";
import BaseLayout from "@/layouts/BaseLayout";
import FunnelIcon from '@rsuite/icons/Funnel';
import { useCoursesManagementWithPagination } from "@/queries/useCourseManagement";

const PAGE_SIZE = 10;

export default function ClassTable({ title, breadcrumb }: PageHeaderProps) {
  usePageHeader({ title, breadcrumb });
  const searchParam = useSearchParams();
  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  const pageIndex = page - 1;

  const [classIdEdit, setClassIdEdit] = useState<number | undefined>();
  const [filter, setFilter] = useState<Partial<FilterClassType>>({
    searchTerm: "",
    courseId: undefined,
    status: "",
  });

  const classListQuery = useClassListQuery({
    pageNumber: page,
    pageSize: PAGE_SIZE,
    searchTerm: filter.searchTerm,
    courseId: filter.courseId,
    status: filter.status,
  });

  // Get courses for filter
  const { data: coursesData } = useCoursesManagementWithPagination({
    pageNumber: 1,
    pageSize: 100, // Get all courses for filter
    sortBy: "title",
    sortOrder: "asc",
  });

  const listResult: { data: ClassType[]; totalCount: number } =
    classListQuery.data?.data ?? {
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
  }, [activeSearch, classListQuery]);

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
  const courseRef = useRef<any>(null);
  const statusRef = useRef<any>(null);
  const { mutateAsync } = useDeleteClassMutation();

  const handleDeleteClass = async (value: ClassType | null) => {
    try {
      if (value) {
        const result = await mutateAsync(value.id);
        toast({
          title: result?.message,
          variant: "success",
          duration: 1000,
        });
        classListQuery.refetch();
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
      courseId: undefined,
      status: "",
    });
    if (inputSearchRef.current) inputSearchRef.current.value = "";
    if (courseRef.current) courseRef.current.clear();
    if (statusRef.current) statusRef.current.clear();
    setActiveSearch(true);
  };

  // Course options for filter
  const courseOptions = coursesData?.data?.data?.map((course: any) => ({
    label: course.title,
    value: course.id,
  })) || [];

  // Status options
  const statusOptions = [
    { label: "Chưa bắt đầu", value: "upcoming" },
    { label: "Đang diễn ra", value: "ongoing" },
    { label: "Đã kết thúc", value: "completed" },
    { label: "Đã hủy", value: "cancelled" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return <Badge color="blue" content="Chưa bắt đầu" />;
      case "ongoing":
        return <Badge color="green" content="Đang diễn ra" />;
      case "completed":
        return <Badge color="gray" content="Đã kết thúc" />;
      case "cancelled":
        return <Badge color="red" content="Đã hủy" />;
      default:
        return <Badge color="orange" content={status} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const columns: TableColumn[] = [
    {
      key: "id",
      label: "STT",
      width: 80,
      align: "center",
      render: (rowData: ClassType, rowIndex?: number) => {
        const safeRowIndex = rowIndex ?? 0;
        const stt = pageIndex * PAGE_SIZE + safeRowIndex + 1;
        return <Label>{stt}</Label>;
      },
    },
    {
      key: "name",
      label: "Tên lớp",
      flexGrow: 1,
      render: (rowData: ClassType) => (
        <div className="font-medium">{rowData.name}</div>
      ),
    },
    {
      key: "teacherName",
      label: "Giáo viên",
      width: 150,
      render: (rowData: ClassType) => (
        <div className="capitalize">{rowData.teacherName}</div>
      ),
    },
    {
      key: "schedule",
      label: "Lịch học",
      width: 120,
      render: (rowData: ClassType) => (
        <div className="text-sm">{rowData.schedule}</div>
      ),
    },
    {
      key: "location",
      label: "Địa điểm",
      width: 120,
      render: (rowData: ClassType) => (
        <div className="text-sm">{rowData.location}</div>
      ),
    },
    {
      key: "startDate",
      label: "Ngày bắt đầu",
      width: 120,
      align: "center",
      render: (rowData: ClassType) => (
        <div className="text-sm">{formatDate(rowData.startDate)}</div>
      ),
    },
    {
      key: "endDate",
      label: "Ngày kết thúc",
      width: 120,
      align: "center",
      render: (rowData: ClassType) => (
        <div className="text-sm">{formatDate(rowData.endDate)}</div>
      ),
    },
    {
      key: "students",
      label: "Học viên",
      width: 120,
      align: "center",
      render: (rowData: ClassType) => (
        <div className="flex items-center justify-center gap-1">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium">
            {rowData.currentStudents || 0}/{rowData.maxStudents}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Trạng thái",
      width: 120,
      align: "center",
      render: (rowData: ClassType) => getStatusBadge(rowData.status),
    },
    {
      key: "actions",
      label: "Hành động",
      width: 120,
      align: "center",
      isAction: true,
      render: (rowData: ClassType) => (
        <div className="flex items-center justify-end gap-2 pe-4">
          <IconButton
            appearance="subtle"
            size="sm"
            icon={<PencilIcon className="h-4 w-4" />}
            onClick={() => setClassIdEdit(rowData.id)}
            title="Sửa"
          />
          <DeletePopover
            title={`Xóa lớp học`}
            description={`Chắc chắn xóa lớp học "${rowData.name}"`}
            onDelete={() => handleDeleteClass(rowData)}
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
        <ClassForm onSubmitSuccess={classListQuery.refetch} />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-2 bg-white">
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
                  Khóa học
                </Label>
              </div>
              <div className="col-span-2">
                <SelectPicker
                  ref={courseRef}
                  data={courseOptions}
                  placeholder="Chọn khóa học"
                  className="w-full"
                  size="sm"
                  searchable={false}
                  onChange={(value) => setFilter({ ...filter, courseId: value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="col-span-1 flex items-center">
                <Label className="block text-xs text-gray-500 mb-1">
                  Trạng thái
                </Label>
              </div>
              <div className="col-span-2">
                <SelectPicker
                  ref={statusRef}
                  data={statusOptions}
                  placeholder="Chọn trạng thái"
                  className="w-full"
                  size="sm"
                  searchable={false}
                  onChange={(value) => setFilter({ ...filter, status: value })}
                />
              </div>
            </div>
            
            <div className="flex justify-end w-full gap-2 col-span-1">
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

      <ClassForm
        id={classIdEdit}
        setId={setClassIdEdit}
        onSubmitSuccess={classListQuery.refetch}
        triggerButton={false}
      />

      <Table
        data={data}
        columns={columns}
        loading={classListQuery.isLoading}
        emptyText="Không có dữ liệu"
        loadingText="Đang tải..."
        showPagination={true}
        totalCount={totalCount}
        pathname="/manage/classes"
        pageIndex={pageIndex}
        pageSize={PAGE_SIZE}
        showRowNumbers={false}
        paginationPosition="bottom"
      />
    </BaseLayout>
  );
}