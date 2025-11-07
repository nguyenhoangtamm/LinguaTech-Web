"use client";

import { useEffect, useRef, useState } from "react";
import { getDisplayedRowCount, handleErrorApi } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { PencilIcon, Download, Eye, FileText, Video, Image, Music } from "lucide-react";
import {
    MaterialType,
    MaterialQueryParamsType
} from "@/schemaValidations/lesson.schema";
import {
    useMaterialListQuery,
    useDeleteMaterialMutation
} from "@/queries/useLesson";
import { Label } from "@/components/ui/label";
import { IconButton, Input, Button, Badge } from "rsuite";
import DeletePopover from "@/app/shared/delete-popover";
import { PageHeaderProps } from "@/types/page-header-props.type";
import { usePageHeader } from "@/hooks/use-page-header";
import { Transition } from "@headlessui/react";
import Table, { TableColumn } from "@/app/shared/common/components/table";
import BaseLayout from "@/layouts/BaseLayout";
import FunnelIcon from '@rsuite/icons/Funnel';

const PAGE_SIZE = 10;

export default function MaterialTable({ title, breadcrumb }: PageHeaderProps) {
    usePageHeader({ title, breadcrumb });
    const searchParam = useSearchParams();
    const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
    const pageIndex = page - 1;

    const [materialIdEdit, setMaterialIdEdit] = useState<number | undefined>();
    const [filter, setFilter] = useState<Partial<MaterialQueryParamsType>>({
        keyword: "",
        lessonId: undefined,
        type: undefined,
        fileType: undefined,
        minSize: undefined,
        maxSize: undefined,
    });

    const materialListQuery = useMaterialListQuery({
        pageNumber: page,
        pageSize: PAGE_SIZE,
        keyword: filter.keyword,
        lessonId: filter.lessonId,
        type: filter.type,
        fileType: filter.fileType,
        minSize: filter.minSize,
        maxSize: filter.maxSize,
    });

    const listResult = materialListQuery.data?.data || { data: [], totalCount: 0 };
    const data: MaterialType[] = listResult.data || [];
    const totalCount: number = listResult.totalCount || 0;

    const [activeSearch, setActiveSearch] = useState(false);

    useEffect(() => {
        if (activeSearch) {
            materialListQuery.refetch();
            setActiveSearch(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSearch]);

    const inputSearchRef = useRef<HTMLInputElement>(null);
    const deleteMaterialMutation = useDeleteMaterialMutation();

    const handleDeleteMaterial = async (material: MaterialType) => {
        if (deleteMaterialMutation.isPending) return;

        try {
            const result = await deleteMaterialMutation.mutateAsync(material.id);
            if (result?.data?.succeeded) {
                toast({
                    description: `Đã xóa tài liệu "${material.title}"`,
                });
                materialListQuery.refetch();
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
            lessonId: undefined,
            type: undefined,
            fileType: undefined,
            minSize: undefined,
            maxSize: undefined,
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

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (fileType: string) => {
        const iconProps = { size: 16, className: "text-gray-600" };

        switch (fileType.toLowerCase()) {
            case "pdf":
            case "document":
            case "doc":
            case "docx":
                return <FileText {...iconProps} className="text-red-600" />;
            case "video":
            case "mp4":
            case "avi":
            case "mov":
                return <Video {...iconProps} className="text-blue-600" />;
            case "image":
            case "jpg":
            case "jpeg":
            case "png":
            case "gif":
                return <Image {...iconProps} className="text-green-600" />;
            case "audio":
            case "mp3":
            case "wav":
                return <Music {...iconProps} className="text-purple-600" />;
            default:
                return <FileText {...iconProps} />;
        }
    };

    const getFileTypeColor = (fileType: string) => {
        const colors: Record<string, string> = {
            pdf: "red",
            document: "blue",
            video: "cyan",
            image: "green",
            audio: "violet",
        };
        return colors[fileType.toLowerCase()] || "gray";
    };

    const columns: TableColumn<MaterialType>[] = [
        {
            title: "STT",
            dataIndex: "id",
            key: "stt",
            width: 70,
            render: (_: any, __: MaterialType, index: number) => {
                return <span>{pageIndex * PAGE_SIZE + index + 1}</span>;
            },
        },
        {
            title: "Tên tài liệu",
            dataIndex: "title",
            key: "title",
            render: (title: string, record: MaterialType) => (
                <div className="flex items-center gap-2">
                    {getFileIcon(record.fileType)}
                    <div>
                        <p className="font-medium line-clamp-1">{title}</p>
                        <p className="text-sm text-gray-500">{record.fileName}</p>
                    </div>
                </div>
            ),
        },
        {
            title: "Lesson ID",
            dataIndex: "lessonId",
            key: "lessonId",
            width: 100,
            render: (lessonId: string) => (
                <span className="text-sm font-mono">#{lessonId}</span>
            ),
        },
        {
            title: "Loại file",
            dataIndex: "fileType",
            key: "fileType",
            width: 100,
            render: (fileType: string) => (
                <Badge
                    color={getFileTypeColor(fileType)}
                    appearance="ghost"
                >
                    {fileType.toUpperCase()}
                </Badge>
            ),
        },
        {
            title: "Kích thước",
            dataIndex: "size",
            key: "size",
            width: 100,
            render: (size: number) => (
                <span className="text-sm">{formatFileSize(size)}</span>
            ),
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 120,
            render: (date: Date) => new Date(date).toLocaleDateString("vi-VN"),
        },
        {
            title: "Ngày cập nhật",
            dataIndex: "updatedAt",
            key: "updatedAt",
            width: 120,
            render: (date: Date) => new Date(date).toLocaleDateString("vi-VN"),
        },
        {
            title: "Thao tác",
            key: "actions",
            width: 180,
            render: (_: any, record: MaterialType) => (
                <div className="flex gap-2">
                    <IconButton
                        size="sm"
                        appearance="subtle"
                        color="blue"
                        icon={<Eye size={16} />}
                        title="Xem trước"
                        onClick={() => {
                            // Preview material
                            window.open(record.fileUrl, '_blank');
                        }}
                    />
                    <IconButton
                        size="sm"
                        appearance="subtle"
                        color="green"
                        icon={<Download size={16} />}
                        title="Tải xuống"
                        onClick={() => {
                            // Download material
                            const link = document.createElement('a');
                            link.href = record.fileUrl;
                            link.download = record.fileName;
                            link.click();
                        }}
                    />
                    <IconButton
                        size="sm"
                        appearance="subtle"
                        color="orange"
                        icon={<PencilIcon size={16} />}
                        onClick={() => setMaterialIdEdit(record.id)}
                        title="Chỉnh sửa"
                    />
                    <DeletePopover
                        title={`Xóa tài liệu "${record.title}"`}
                        description="Bạn có chắc chắn muốn xóa tài liệu này không? Hành động này không thể hoàn tác."
                        onConfirm={() => handleDeleteMaterial(record)}
                    />
                </div>
            ),
        },
    ];

    const hasFilter = filter.keyword || filter.lessonId || filter.type || filter.fileType || filter.minSize || filter.maxSize;

    return (
        <BaseLayout>
            <div className="p-4">
                {/* Header Actions */}
                <div className="mb-6 flex justify-between items-center">
                    <div className="flex gap-3">
                        <Input
                            ref={inputSearchRef}
                            placeholder="Tìm kiếm tài liệu..."
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
                        appearance="primary"
                        onClick={() => setMaterialIdEdit(0)}
                    >
                        Thêm tài liệu
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
                                <Label>Lesson ID</Label>
                                <Input
                                    type="number"
                                    placeholder="Nhập Lesson ID..."
                                    value={filter.lessonId?.toString() || ""}
                                    onChange={(value) =>
                                        setFilter((prev) => ({
                                            ...prev,
                                            lessonId: value ? Number(value) : undefined
                                        }))
                                    }
                                />
                            </div>
                            <div>
                                <Label>Loại file</Label>
                                <select
                                    className="w-full p-2 border rounded-md"
                                    value={filter.fileType || ""}
                                    onChange={(e) =>
                                        setFilter((prev) => ({ ...prev, fileType: e.target.value }))
                                    }
                                >
                                    <option value="">Tất cả loại file</option>
                                    <option value="pdf">PDF</option>
                                    <option value="video">Video</option>
                                    <option value="image">Hình ảnh</option>
                                    <option value="document">Tài liệu</option>
                                    <option value="audio">Âm thanh</option>
                                </select>
                            </div>
                            <div>
                                <Label>Kích thước tối đa (MB)</Label>
                                <Input
                                    type="number"
                                    placeholder="Kích thước tối đa..."
                                    value={filter.maxSize ? (filter.maxSize / (1024 * 1024)).toString() : ""}
                                    onChange={(value) =>
                                        setFilter((prev) => ({
                                            ...prev,
                                            maxSize: value ? Number(value) * 1024 * 1024 : undefined
                                        }))
                                    }
                                />
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
                <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="bg-red-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                            {data.filter(m => m.fileType === 'pdf').length}
                        </div>
                        <div className="text-sm text-gray-600">PDF</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                            {data.filter(m => m.fileType === 'video').length}
                        </div>
                        <div className="text-sm text-gray-600">Video</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                            {data.filter(m => m.fileType === 'image').length}
                        </div>
                        <div className="text-sm text-gray-600">Hình ảnh</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                            {data.filter(m => m.fileType === 'audio').length}
                        </div>
                        <div className="text-sm text-gray-600">Âm thanh</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-gray-600">
                            {formatFileSize(data.reduce((sum, m) => sum + m.size, 0))}
                        </div>
                        <div className="text-sm text-gray-600">Tổng dung lượng</div>
                    </div>
                </div>

                {/* Table */}
                <Table
                    data={data}
                    columns={columns}
                    loading={materialListQuery.isLoading}
                    totalCount={totalCount}
                    pageSize={PAGE_SIZE}
                    showPagination
                    paginationPosition="bottom"
                />

                {/* Edit/Create Form Modal - Placeholder */}
                {materialIdEdit !== undefined && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                {materialIdEdit ? "Chỉnh sửa tài liệu" : "Thêm tài liệu mới"}
                            </h3>
                            {/* Add material form here */}
                            <div className="flex justify-end">
                                <Button onClick={() => setMaterialIdEdit(undefined)}>
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