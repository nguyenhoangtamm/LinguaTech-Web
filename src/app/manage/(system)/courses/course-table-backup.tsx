"use client";

import { useEffect, useRef, useState } from "react";
import { getDisplayedRowCount, handleErrorApi } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { PencilIcon, ExternalLink } from "lucide-react";
import { CourseType, GetCoursesWithPaginationQueryType } from "@/schemaValidations/courseManagement.schema";
import {
    useCoursesManagementWithPagination,
    useDeleteCourseManagement,
    useCategoriesManagement
} from "@/queries/useCourseManagement";
import { Label } from "@/components/ui/label";
import { IconButton, Input, Button, Badge } from "rsuite";
import DeletePopover from "@/app/shared/delete-popover";
import { PageHeaderProps } from "@/types/page-header-props.type";
import { usePageHeader } from "@/hooks/use-page-header";
import { Transition } from "@headlessui/react";
import Table, { TableColumn } from "@/app/shared/common/components/table";
import BaseLayout from "@/layouts/BaseLayout";
import FunnelIcon from '@rsuite/icons/Funnel';
import Link from "next/link";

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
        search: filter.search,
        category: filter.category,
        level: filter.level,
        sortBy: "createdDate",
        sortOrder: "desc",
    });

    const { data: categoriesData } = useCategoriesManagement();

    const listResult = courseListQuery.data?.data || { data: [], totalCount: 0 };
    const data: CourseType[] = listResult.data || [];
    const totalCount: number = listResult.totalCount || 0;

    const [activeSearch, setActiveSearch] = useState(false);

    useEffect(() => {
        if (activeSearch) {
            courseListQuery.refetch();
            setActiveSearch(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSearch]);

    const inputSearchRef = useRef<HTMLInputElement>(null);
    const deleteCourseMutation = useDeleteCourseManagement();

    const handleDeleteCourse = async (course: CourseType) => {
        if (deleteCourseMutation.isPending) return;

        try {
            const result = await deleteCourseMutation.mutateAsync(course.id);
            if (result?.data?.succeeded) {
                toast({
                    description: `Đã xóa khóa học "${course.title}"`,
                });
                courseListQuery.refetch();
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
            search: "",
            category: "",
            level: undefined,
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
            search: keyword,
        }));
        setActiveSearch(true);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const getLevelLabel = (level: number) => {
        const levels: Record<number, string> = {
            1: "Cơ bản",
            2: "Trung cấp",
            3: "Nâng cao",
        };
        return levels[level] || level.toString();
    };

    const columns: TableColumn<CourseType>[] = [
        {
            title: "STT",
            dataIndex: "id",
            key: "stt",
            width: 70,
            render: (_: any, __: CourseType, index: number) => {
                return <span>{pageIndex * PAGE_SIZE + index + 1}</span>;
            },
        },
        {
            title: "Hình ảnh",
            dataIndex: "thumbnailUrl",
            key: "thumbnailUrl",
            width: 80,
            render: (thumbnailUrl: string, record: CourseType) => (
                <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                    {thumbnailUrl ? (
                        <img
                            src={thumbnailUrl}
                            alt={record.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span className="text-xs">No Image</span>
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
            render: (title: string, record: CourseType) => (
                <div>
                    <p className="font-medium line-clamp-2">{title}</p>
                    <p className="text-sm text-gray-500 line-clamp-1">{record.description}</p>
                </div>
            ),
        },
        {
            title: "Giảng viên",
            dataIndex: "instructor",
            key: "instructor",
        },
        {
            title: "Thời lượng",
            dataIndex: "duration",
            key: "duration",
            width: 100,
            render: (duration: number) => `${duration} phút`,
        },
        {
            title: "Cấp độ",
            dataIndex: "level",
            key: "level",
            width: 100,
            render: (level: number) => (
                <Badge color="blue" appearance="ghost">
                    {getLevelLabel(level)}
                </Badge>
            ),
        },
        {
            title: "Giá",
            dataIndex: "price",
            key: "price",
            width: 120,
            render: (price: number) => (
                <span className="font-medium text-green-600">
                    {formatPrice(price)}
                </span>
            ),
        },
        {
            title: "Đánh giá",
            dataIndex: "rating",
            key: "rating",
            width: 100,
            render: (rating: number) => (
                <div className="flex items-center gap-1">
                    <span>{rating || 0}</span>
                    <span className="text-yellow-500">⭐</span>
                </div>
            ),
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdDate",
            key: "createdDate",
            width: 120,
            render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
        },
        {
            title: "Thao tác",
            key: "actions",
            width: 150,
            render: (_: any, record: CourseType) => (
                <div className="flex gap-2">
                    <IconButton
                        size="sm"
                        appearance="subtle"
                        color="blue"
                        icon={<ExternalLink size={16} />}
                        as={Link}
                        href={`/courses/${record.id}`}
                        target="_blank"
                    />
                    <IconButton
                        size="sm"
                        appearance="subtle"
                        color="green"
                        icon={<PencilIcon size={16} />}
                        onClick={() => setCourseIdEdit(record.id)}
                    />
                    <DeletePopover
                        title={`Xóa khóa học "${record.title}"`}
                        description="Bạn có chắc chắn muốn xóa khóa học này không? Hành động này không thể hoàn tác."
                        onConfirm={() => handleDeleteCourse(record)}
                    />
                </div>
            ),
        },
    ];

    const categories = categoriesData?.data || [];
    const hasFilter = filter.search || filter.category || filter.level;

    return (
        <BaseLayout>
            <div className="p-4">
                {/* Header Actions */}
                <div className="mb-6 flex justify-between items-center">
                    <div className="flex gap-3">
                        <Input
                            ref={inputSearchRef}
                            placeholder="Tìm kiếm khóa học..."
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
                        as={Link}
                        href="/my-courses/create-new"
                        appearance="primary"
                    >
                        Thêm khóa học
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
                                <Label>Danh mục</Label>
                                <select
                                    className="w-full p-2 border rounded-md"
                                    value={filter.category || ""}
                                    onChange={(e) =>
                                        setFilter((prev) => ({ ...prev, category: e.target.value }))
                                    }
                                >
                                    <option value="">Tất cả danh mục</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.slug}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <Label>Cấp độ</Label>
                                <select
                                    className="w-full p-2 border rounded-md"
                                    value={filter.level || ""}
                                    onChange={(e) =>
                                        setFilter((prev) => ({
                                            ...prev,
                                            level: e.target.value ? Number(e.target.value) : undefined
                                        }))
                                    }
                                >
                                    <option value="">Tất cả cấp độ</option>
                                    <option value="1">Cơ bản</option>
                                    <option value="2">Trung cấp</option>
                                    <option value="3">Nâng cao</option>
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

                {/* Table */}
                <Table
                    data={data}
                    columns={columns}
                    loading={courseListQuery.isLoading}
                    totalCount={totalCount}
                    pageSize={PAGE_SIZE}
                    showPagination
                    paginationPosition="bottom"
                />
            </div>
        </BaseLayout>
    );
}