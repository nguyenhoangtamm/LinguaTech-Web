"use client";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { getDisplayedRowCount, handleErrorApi } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { PencilIcon, ExternalLink, Plus, Eye } from "lucide-react";
import { CourseType, GetCoursesWithPaginationQueryType } from "@/schemaValidations/courseManagement.schema";
import {
  useCoursesManagementWithPagination,
  useDeleteCourseManagement,
  useCategoriesManagement
} from "@/queries/useCourseManagement";
import { Label } from "@/components/ui/label";
import { IconButton, Input, Button, Badge, SelectPicker } from "rsuite";
import DeletePopover from "@/app/shared/delete-popover";
import { PageHeaderProps } from "@/types/page-header-props.type";
import { usePageHeader } from "@/hooks/use-page-header";
import CourseForm from "./course-form";
import { Transition } from "@headlessui/react";
import Table, { TableColumn } from "@/app/shared/common/components/table";
import BaseLayout from "@/layouts/BaseLayout";
import FunnelIcon from '@rsuite/icons/Funnel';
import Link from "next/link";
import Image from "next/image";
import { routes } from "@/config/routes";

const PAGE_SIZE = 10;

export default function CourseTable({ title, breadcrumb }: PageHeaderProps) {
  usePageHeader({ title, breadcrumb });
  const searchParam = useSearchParams();
  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  const pageIndex = page - 1;

  const [courseIdEdit, setCourseIdEdit] = useState<number | undefined>();
  const [filter, setFilter] = useState<Partial<GetCoursesWithPaginationQueryType>>({
    search: "",
    category: "",
    level: undefined,
  });

  const courseListQuery = useCoursesManagementWithPagination({
    pageNumber: page,
    pageSize: PAGE_SIZE,
    search: filter.search || undefined,
    category: filter.category || undefined,
    ...(filter.level !== undefined ? { level: filter.level } : {}),
    sortBy: "createdDate",
    sortOrder: "desc",
  });

  const { data: categoriesData } = useCategoriesManagement();

  const listResult: { data: CourseType[]; totalCount: number } =
    courseListQuery.data ?? {
      data: [],
      totalCount: 0,
    };
  const data: CourseType[] = listResult.data;
  const totalCount: number = listResult.totalCount;

  const [activeSearch, setActiveSearch] = useState(false);

  useEffect(() => {
    if (activeSearch) {
      courseListQuery.refetch();
      setActiveSearch(false);
    }
  }, [activeSearch, courseListQuery]);

  const handleSearch = () => {
    let actionChange = false;
    if (inputSearchRef.current) {
      const searchValue = inputSearchRef.current?.value ?? "";
      setFilter({ ...filter, search: searchValue });
      actionChange = true;
    }
    if (actionChange) {
      setActiveSearch(true);
    }
  };

  const inputSearchRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<any>(null);
  const levelRef = useRef<any>(null);
  const { mutateAsync } = useDeleteCourseManagement();

  const handleDeleteCourse = async (value: CourseType | null) => {
    try {
      if (value) {
        const result = await mutateAsync(value.id);
        toast({
          title: result?.message,
          variant: "success",
          duration: 1000,
        });
        courseListQuery.refetch();
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
      search: "",
      category: "",
      level: undefined,
    });
    if (inputSearchRef.current) inputSearchRef.current.value = "";
    if (categoryRef.current) categoryRef.current.clear();
    if (levelRef.current) levelRef.current.clear();
    setActiveSearch(true);
  };

  // Category options for filter
  const categoryOptions = categoriesData?.data?.data?.map((category: any) => ({
    label: category.name,
    value: category.slug,
  })) || [];

  // Level options
  const levelOptions = [
    { label: "Cơ bản", value: 1 },
    { label: "Trung cấp", value: 2 },
    { label: "Nâng cao", value: 3 },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getLevelBadge = (level: number | undefined) => {
    switch (level) {
      case 1:
        return <Badge color="green" content="Cơ bản" />;
      case 2:
        return <Badge color="orange" content="Trung cấp" />;
      case 3:
        return <Badge color="red" content="Nâng cao" />;
      default:
        return <Badge color="gray" content="Không xác định" />;
    }
  };

  const columns: TableColumn[] = [
    {
      key: "id",
      label: "STT",
      width: 80,
      align: "center",
      render: (rowData: CourseType, rowIndex?: number) => {
        const safeRowIndex = rowIndex ?? 0;
        const stt = pageIndex * PAGE_SIZE + safeRowIndex + 1;
        return <Label>{stt}</Label>;
      },
    },
    {
      key: "thumbnailUrl",
      label: "Hình ảnh",
      width: 100,
      align: "center",
      render: (rowData: CourseType) => (
        <div className="flex items-center justify-center">
          {rowData.thumbnailUrl ? (
            <Image
              src={rowData.thumbnailUrl}
              alt="Course thumbnail"
              width={48}
              height={32}
              className="w-12 h-8 object-cover rounded"
            />
          ) : (
            <div className="w-12 h-8 bg-gray-300 flex items-center justify-center rounded text-gray-600 text-xs">
              No Image
            </div>
          )}
        </div>
      ),
    },
    {
      key: "title",
      label: "Tên khóa học",
      flexGrow: 1,
      render: (rowData: CourseType) => (
        <div className="font-medium line-clamp-2">{rowData.title}</div>
      ),
    },
    {
      key: "instructor",
      label: "Giảng viên",
      width: 150,
      render: (rowData: CourseType) => (
        <div className="capitalize">{rowData.instructor}</div>
      ),
    },
    {
      key: "level",
      label: "Cấp độ",
      width: 120,
      align: "center",
      render: (rowData: CourseType) => getLevelBadge(rowData.level),
    },
    {
      key: "price",
      label: "Giá",
      width: 120,
      align: "right",
      render: (rowData: CourseType) => (
        <div className="font-medium">
          {rowData.price === 0 ? (
            <Badge color="green" content="Miễn phí" />
          ) : (
            formatCurrency(rowData.price)
          )}
        </div>
      ),
    },
    {
      key: "duration",
      label: "Thời lượng",
      width: 100,
      align: "center",
      render: (rowData: CourseType) => (
        <div>{rowData.duration} giờ</div>
      ),
    },
    {
      key: "totalEnrollments",
      label: "Học viên",
      width: 100,
      align: "center",
      render: (rowData: CourseType) => (
        <div>{rowData.totalEnrollments || 0}</div>
      ),
    },
    {
      key: "isPublished",
      label: "Trạng thái",
      width: 120,
      align: "center",
      render: (rowData: CourseType) => (
        <Badge
          color={rowData.isPublished ? "green" : "orange"}
          content={rowData.isPublished ? "Đã xuất bản" : "Bản nháp"}
        />
      ),
    },
    {
      key: "actions",
      label: "Hành động",
      width: 120,
      align: "center",
      isAction: true,
      render: (rowData: CourseType) => (
        <div className="flex items-center justify-end gap-2 pe-4">
          <IconButton
            appearance="subtle"
            size="sm"
            icon={<ExternalLink className="h-4 w-4" />}
            as={Link}
            href={`${routes.manage.system.courses}/${rowData.id}`}
            title="Xem chi tiết"
          />
          <IconButton
            appearance="subtle"
            size="sm"
            icon={<PencilIcon className="h-4 w-4" />}
            onClick={() => setCourseIdEdit(rowData.id)}
            title="Sửa"
          />
          <DeletePopover
            title={`Xóa khóa học`}
            description={`Chắc chắn xóa khóa học "${rowData.title}"`}
            onDelete={() => handleDeleteCourse(rowData)}
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
        <Link href={routes.manage.system.courses + "/create"} className="inline-block">
          <Button appearance="primary" size="sm" startIcon={<Plus />}>
            Tạo khóa học
          </Button>
        </Link>
        <CourseForm onSubmitSuccess={courseListQuery.refetch} />
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
                  Danh mục
                </Label>
              </div>
              <div className="col-span-2">
                <SelectPicker
                  ref={categoryRef}
                  data={categoryOptions}
                  placeholder="Chọn danh mục"
                  className="w-full"
                  size="sm"
                  searchable={false}
                  onChange={(value) => setFilter({ ...filter, category: value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="col-span-1 flex items-center">
                <Label className="block text-xs text-gray-500 mb-1">
                  Cấp độ
                </Label>
              </div>
              <div className="col-span-2">
                <SelectPicker
                  ref={levelRef}
                  data={levelOptions}
                  placeholder="Chọn cấp độ"
                  className="w-full"
                  size="sm"
                  searchable={false}
                  cleanable={false}
                  onChange={(value) => setFilter({ ...filter, level: value })}
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

      <CourseForm
        id={courseIdEdit}
        setId={setCourseIdEdit}
        onSubmitSuccess={courseListQuery.refetch}
        triggerButton={false}
      />

      <Table
        data={data}
        columns={columns}
        loading={courseListQuery.isLoading}
        emptyText="Không có dữ liệu"
        loadingText="Đang tải..."
        showPagination={true}
        totalCount={totalCount}
        pathname="/manage/courses"
        pageIndex={pageIndex}
        pageSize={PAGE_SIZE}
        showRowNumbers={false}
        paginationPosition="bottom"
      />
    </BaseLayout>
  );
}