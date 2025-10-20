"use client";

import React from "react";
import { Table as RSTable, Loader, Pagination } from "rsuite";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../styles/table.module.css";
import BlockIcon from '@rsuite/icons/Block';

export interface TableColumn {
    key: string;
    isAction?: boolean;
    label?: string;
    width?: number;
    flexGrow?: number;
    align?: "left" | "center" | "right";
    fixed?: boolean | "left" | "right";
    render?: (rowData: any, rowIndex?: number) => React.ReactNode;
    dataKey?: string;
    minWidth?: number;
}

export interface TableProps {
    data: any[];
    columns: TableColumn[];
    loading?: boolean;
    height?: number;
    autoHeight?: boolean;
    minHeight?: number;
    maxHeight?: number;
    className?: string;
    cellBordered?: boolean;
    hover?: boolean;
    emptyText?: string;
    loadingText?: string;
    showRowNumbers?: boolean;
    pageIndex?: number;
    pageSize?: number;
    onRowClick?: (rowData: any) => void;
    emptyCell?: boolean;
    // Pagination props
    showPagination?: boolean;
    totalCount?: number;
    pathname?: string;
    showTotalPages?: boolean;
    // URL pagination callbacks
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    paginationPosition?: 'top' | 'bottom' | 'both';
}

const { Column, HeaderCell, Cell } = RSTable;

const Table: React.FC<TableProps> = ({
    data,
    columns,
    loading = false,
    height = undefined,
    autoHeight = false,
    minHeight = undefined,
    maxHeight = undefined,
    className = "",
    cellBordered = true,
    hover = true,
    emptyText = "Không có dữ liệu",
    loadingText = "Đang tải...",
    showRowNumbers = true,
    pageIndex = 0,
    pageSize = 10,
    onRowClick,
    emptyCell = true,
    // Pagination props
    showPagination = false,
    totalCount = 0,
    pathname = "",
    showTotalPages = true,
    // URL pagination callbacks
    onPageChange,
    onPageSizeChange,
    paginationPosition = 'bottom',
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    // const tableHeightProps: {
    //     fillHeight?: boolean;
    //     autoHeight?: boolean;
    //     height?: number;
    //     minHeight?: number;
    //     maxHeight?: number;
    // } = {};

    // if (autoHeight) {
    //     tableHeightProps.autoHeight = true;
    // } else if (height !== undefined && height !== null) {
    //     tableHeightProps.height = height;
    // } else {
    //     tableHeightProps.fillHeight = true;
    // }

    // if (minHeight !== undefined && minHeight !== null) {
    //     tableHeightProps.minHeight = minHeight;
    // }

    // if (maxHeight !== undefined && maxHeight !== null) {
    //     tableHeightProps.maxHeight = maxHeight;
    // }
    // Helper function to update URL with new parameters
    const updateURLParams = (newPage?: number, newPageSize?: number) => {
        if (!pathname) return;

        const params = new URLSearchParams(searchParams.toString());

        if (newPage !== undefined) {
            params.set('page', newPage.toString());
        }

        if (newPageSize !== undefined) {
            params.set('limit', newPageSize.toString());
        }

        const newURL = `${pathname}?${params.toString()}`;
        router.push(newURL);
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        const newPageIndex = page - 1; // Convert to 0-based index

        // Call custom callback if provided
        if (onPageChange) {
            onPageChange(newPageIndex);
        }

        // Update URL
        updateURLParams(page);
    };

    // Handle page size change
    const handlePageSizeChange = (newPageSize: number) => {
        // Reset to first page when changing page size
        const newPage = 1;

        // Call custom callback if provided
        if (onPageSizeChange) {
            onPageSizeChange(newPageSize);
        }

        // Update URL
        updateURLParams(newPage, newPageSize);
    };

    const renderLoading = () => {
        return <Loader center backdrop content={loadingText} />;
    };

    const renderEmpty = () => {
        if (loading) return null;
        if (data && data.length > 0) return renderLoading();
        return (
            <div className="flex items-center justify-center h-full">
                <BlockIcon className="text-gray-400" />
                <span className="ml-2">{emptyText}</span>
            </div>
        );
    };

    return (
        <>
            {/* Pagination Top */}
            {showPagination && (paginationPosition === 'top' || paginationPosition === 'both') && (
                <div className="border-t border-gray-100 bg-white p-2">
                    <Pagination
                        prev
                        next
                        ellipsis
                        boundaryLinks
                        maxButtons={3}
                        size="xs"
                        layout={['-', 'pager', 'skip']}
                        total={totalCount}
                        limitOptions={[10, 30, 50]}
                        limit={pageSize}
                        activePage={pageIndex + 1}
                        onChangePage={handlePageChange}
                        onChangeLimit={handlePageSizeChange}
                    />
                </div>
            )}

            <RSTable
                data={data}
                cellBordered={cellBordered}
                hover={hover}
                className={`${styles['rs-table']} ${className} ev-table`}
                loading={loading}
                renderLoading={renderLoading}
                renderEmpty={renderEmpty}
                onRowClick={onRowClick}
                bordered
                wordWrap
                fillHeight
                height={pageSize * 40}
                virtualized
                affixHeader
            >
                {/* Row numbers column */}
                {showRowNumbers && (
                    <Column width={60} align="center">
                        <HeaderCell className="font-bold">STT</HeaderCell>
                        <Cell style={{ fontSize: "13px" }}>
                            {(rowData, rowIndex) => {
                                const safeRowIndex = rowIndex ?? 0;
                                const stt = pageIndex * pageSize + safeRowIndex + 1;
                                return <Label>{stt}</Label>;
                            }}
                        </Cell>
                    </Column>
                )}
                {/* Dynamic columns */}
                {columns.map((column) => (
                    <Column
                        key={column.key}
                        width={column.width}
                        flexGrow={column.flexGrow}
                        align={column.align || "left"}
                        fixed={column.fixed}
                        minWidth={column.minWidth}
                    >
                        <HeaderCell className="font-bold">{column.label}</HeaderCell>
                        <Cell dataKey={column.dataKey} style={{ fontSize: "13px", display: "flex", alignItems: "center", padding: "0px 10px" }}>
                            {column.render ? (
                                (rowData: any, rowIndex?: number) => {
                                    if (!emptyCell && column.key && !column.isAction && (rowData[column.key] === null || rowData[column.key] === undefined || rowData[column.key] === '')) {
                                        return <div style={{ width: "100%" }}>---</div>;
                                    }
                                    return column.render!(rowData, rowIndex);
                                }
                            ) : column.dataKey ? (
                                (rowData: any) => { return rowData[column.dataKey!] || "---" }
                            ) : (
                                () => <div style={{ width: "100%" }}>-</div>
                            )}
                        </Cell>
                    </Column>
                ))}
            </RSTable>

            {/* Pagination Bottom */}
            {showPagination && (paginationPosition === 'bottom' || paginationPosition === 'both') && (
                <div className="flex justify-between items-center border-t border-gray-100 bg-white p-2">
                    <span style={{ fontSize: '12px' }}>
                        Số hàng trên trang: {data.length < pageSize ? data.length : pageSize}
                    </span>
                    <Pagination
                        prev
                        next
                        ellipsis
                        boundaryLinks
                        maxButtons={3}
                        size="xs"
                        layout={['-', 'pager', 'skip']}
                        total={totalCount}
                        limitOptions={[10, 30, 50]}
                        limit={pageSize}
                        activePage={pageIndex + 1}
                        onChangePage={handlePageChange}
                        onChangeLimit={handlePageSizeChange}
                    />
                </div>
            )}
        </>
    );
};

export default Table;