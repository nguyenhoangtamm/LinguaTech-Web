'use client'

import React, { ReactNode } from 'react'
import { useExportExcel } from '@/hooks/use-export-excel'
import type { ExcelColumn } from '@/utils/excel-export'

interface ExportButtonProps {
    fileName: string
    sheetName?: string
    columns: ExcelColumn[]
    data: any[]
    title?: string
    className?: string
    children?: ReactNode
    disabled?: boolean
    onClick?: () => void
    variant?: 'default' | 'outline' | 'ghost'
}

/**
 * Component nút xuất Excel
 */
export const ExportButton: React.FC<ExportButtonProps> = ({
    fileName,
    sheetName,
    columns,
    data,
    title,
    className = '',
    children,
    disabled = false,
    onClick,
    variant = 'default',
}) => {
    const { isExporting, exportData } = useExportExcel({
        fileName,
        sheetName,
        columns,
        title,
    })

    const handleClick = async () => {
        if (onClick) {
            onClick()
        }
        await exportData(data)
    }

    const baseStyles =
        'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'

    const variantStyles = {
        default: 'bg-blue-500 text-white hover:bg-blue-600',
        outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
        ghost: 'text-gray-700 hover:bg-gray-100',
    }

    return (
        <button
            onClick={handleClick}
            disabled={disabled || isExporting || data.length === 0}
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            title={data.length === 0 ? 'Không có dữ liệu để xuất' : 'Xuất dữ liệu ra Excel'}
        >
            {isExporting && (
                <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}
            {children || (
                <>
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8l-9-2m9 2l9-2m-9-8l9 2m-9-2l-9 2m9-2v8"
                        />
                    </svg>
                    Xuất Excel
                </>
            )}
        </button>
    )
}

interface ExportButtonGroupProps {
    fileName: string
    columns: ExcelColumn[]
    data: any[]
    title?: string
    className?: string
}

/**
 * Component nhóm nút xuất với các tùy chọn khác nhau
 */
export const ExportButtonGroup: React.FC<ExportButtonGroupProps> = ({
    fileName,
    columns,
    data,
    title,
    className = '',
}) => {
    return (
        <div className={`flex gap-2 ${className}`}>
            <ExportButton
                fileName={fileName}
                columns={columns}
                data={data}
                title={title}
                variant="default"
            >
                📊 Xuất Excel
            </ExportButton>
        </div>
    )
}
