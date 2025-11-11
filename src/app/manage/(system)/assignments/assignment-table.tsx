"use client";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { getDisplayedRowCount, handleErrorApi } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { PencilIcon, FileText, Calendar } from "lucide-react";
import {
  AssignmentType,
  FilterAssignmentType,
} from "@/schemaValidations/assignment.schema";
import { useAssignmentListQuery, useDeleteAssignmentMutation } from "@/queries/useAssignment";
import { Label } from "@/components/ui/label";
import { IconButton, Input, Button, Badge, SelectPicker } from "rsuite";
import DeletePopover from "@/app/shared/delete-popover";
import { PageHeaderProps } from "@/types/page-header-props.type";
import { usePageHeader } from "@/hooks/use-page-header";
import AssignmentForm from "./assignment-form";
import { Transition } from "@headlessui/react";
import Table, { TableColumn } from "@/app/shared/common/components/table";
import BaseLayout from "@/layouts/BaseLayout";
import FunnelIcon from '@rsuite/icons/Funnel';
import { useLessonsQuery } from "@/queries/useLesson";

const PAGE_SIZE = 10;

export default function AssignmentTable({ title, breadcrumb }: PageHeaderProps) {
  usePageHeader({ title, breadcrumb });
  const searchParam = useSearchParams();
  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  const pageIndex = page - 1;

  const [assignmentIdEdit, setAssignmentIdEdit] = useState<number | undefined>();
  const [filter, setFilter] = useState<Partial<FilterAssignmentType>>({
    keyword: "",
    lessonId: undefined,
  });

  const assignmentListQuery = useAssignmentListQuery({
    pageNumber: page,
    pageSize: PAGE_SIZE,
    keyword: filter.keyword,
    lessonId: filter.lessonId,
  });

  // Get lessons for filter
  const { data: lessonsData } = useLessonsQuery({
    pageNumber: 1,
    pageSize: 100, // Get all lessons for filter
    sortBy: "title",
    sortOrder: "asc",
  });

  const listResult: { data: AssignmentType[]; totalCount: number } =
    assignmentListQuery.data?.data ?? {
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
  }, [activeSearch, assignmentListQuery]);

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
  const lessonRef = useRef<any>(null);
  const { mutateAsync } = useDeleteAssignmentMutation();

  const handleDeleteAssignment = async (value: AssignmentType | null) => {
    try {
      if (value) {
        const result = await mutateAsync(value.id);
        toast({
          title: result?.message,
          variant: "success",
          duration: 1000,
        });
        assignmentListQuery.refetch();
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
    if (lessonRef.current) lessonRef.current.clear();
    setActiveSearch(true);
  };

  // Lesson options for filter
  const lessonOptions = lessonsData?.data?.data?.map((lesson: any) => ({
    label: `${lesson.title} (${lesson.moduleTitle || lesson.courseTitle || ""})`,
    value: lesson.id,
  })) || [];

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('vi-VN'),
      time: date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getDueDateStatus = (dueDateString: string) => {
    const dueDate = new Date(dueDateString);
    const now = new Date();
    const diffHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 0) {
      return <Badge color="red" content="Đã quá hạn" />;
    } else if (diffHours < 24) {
      return <Badge color="orange" content="Sắp hết hạn" />;
    } else {
      return <Badge color="green" content="Còn thời gian" />;
    }
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
      label: "Tiêu đề bài tập",
      flexGrow: 1,
      render: (rowData: AssignmentType) => (
        <div className="font-medium">{rowData.title}</div>
      ),
    },
    {
      key: "lessonTitle",
      label: "Bài học",
      width: 200,
      render: (rowData: AssignmentType) => (
        <div className="text-sm">
          <div className="font-medium">{rowData.lessonTitle}</div>
          {rowData.courseTitle && (
            <div className="text-gray-500 text-xs">{rowData.courseTitle}</div>
          )}
        </div>
      ),
    },
    {
      key: "description",
      label: "Mô tả",
      width: 250,
      render: (rowData: AssignmentType) => (
        <div className="text-sm text-gray-600 line-clamp-2">
          {rowData.description || "Không có mô tả"}
        </div>
      ),
    },
    {
      key: "maxScore",
      label: "Điểm tối đa",
      width: 100,
      align: "center",
      render: (rowData: AssignmentType) => (
        <div className="font-medium text-blue-600">{rowData.maxScore}</div>
      ),
    },
    {
      key: "dueDate",
      label: "Hạn nộp",
      width: 150,
      align: "center",
      render: (rowData: AssignmentType) => {
        const { date, time } = formatDateTime(rowData.dueDate);
        return (
          <div className="text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-gray-500" />
              <span>{date}</span>
            </div>
            <div className="text-gray-500 text-xs">{time}</div>
          </div>
        );
      },
    },
    {
      key: "status",
      label: "Trạng thái",
      width: 120,
      align: "center",
      render: (rowData: AssignmentType) => getDueDateStatus(rowData.dueDate),
    },
    {
      key: "createdDate",
      label: "Ngày tạo",
      width: 120,
      align: "center",
      render: (rowData: AssignmentType) => (
        <div className="text-sm">
          {rowData.createdDate ? formatDateTime(rowData.createdDate).date : "N/A"}
        </div>
      ),
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 bg-white">
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
                  Bài học
                </Label>
              </div>
              <div className="col-span-2">
                <SelectPicker
                  ref={lessonRef}
                  data={lessonOptions}
                  placeholder="Chọn bài học"
                  className="w-full"
                  size="sm"
                  searchable={true}
                  onChange={(value) => setFilter({ ...filter, lessonId: value })}
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