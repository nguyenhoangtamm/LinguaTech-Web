'use client'

import React from 'react'
import { ExportButton } from '@/components/ExportButton'
import type { ExcelColumn } from '@/utils/excel-export'
import type { CourseAnalyticsType, UserGrowthStatsType } from '@/schemaValidations/adminDashboard.schema'

interface DashboardExportProps {
    stats: any
    topCoursesByEnrollment: CourseAnalyticsType[]
    topCoursesByRating: CourseAnalyticsType[]
    userGrowthStats: UserGrowthStatsType[]
    allCourses: CourseAnalyticsType[]
}

export const DashboardExport: React.FC<DashboardExportProps> = ({
    stats,
    topCoursesByEnrollment,
    topCoursesByRating,
    userGrowthStats,
    allCourses,
}) => {
    // Cột cho báo cáo khóa học
    const courseColumns: ExcelColumn[] = [
        {
            header: 'Tên Khóa Học',
            key: 'courseName',
            width: 25,
        },
        {
            header: 'Số Học Viên',
            key: 'enrollmentCount',
            width: 15,
            type: 'number',
        },
        {
            header: 'Đánh Giá',
            key: 'averageRating',
            width: 12,
            type: 'number',
        },
        {
            header: 'Số Bài Học',
            key: 'lessonCount',
            width: 12,
            type: 'number',
        },
    ]

    // Cột cho báo cáo tăng trưởng người dùng
    const growthColumns: ExcelColumn[] = [
        {
            header: 'Ngày',
            key: 'date',
            width: 15,
            type: 'date',
        },
        {
            header: 'Số Người Dùng Mới',
            key: 'newUsersCount',
            width: 18,
            type: 'number',
        },
        {
            header: 'Tổng Người Dùng Hoạt Động',
            key: 'activeUsersCount',
            width: 22,
            type: 'number',
        },
    ]

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-2 flex-wrap">
                {/* Xuất báo cáo khóa học hàng đầu theo đăng ký */}
                {topCoursesByEnrollment.length > 0 && (
                    <ExportButton
                        fileName={`bc-khoa-hoc-theo-dang-ky-${new Date().toISOString().split('T')[0]}`}
                        sheetName="Khóa Học - Đăng Ký"
                        columns={courseColumns}
                        data={topCoursesByEnrollment}
                        title="Báo Cáo: Khóa Học Hàng Đầu Theo Số Lượng Đăng Ký"
                        variant="default"
                    >
                        📊 Xuất Khóa Học (Đăng Ký)
                    </ExportButton>
                )}

                {/* Xuất báo cáo khóa học hàng đầu theo đánh giá */}
                {topCoursesByRating.length > 0 && (
                    <ExportButton
                        fileName={`bc-khoa-hoc-theo-danh-gia-${new Date().toISOString().split('T')[0]}`}
                        sheetName="Khóa Học - Đánh Giá"
                        columns={courseColumns}
                        data={topCoursesByRating}
                        title="Báo Cáo: Khóa Học Hàng Đầu Theo Đánh Giá"
                        variant="default"
                    >
                        ⭐ Xuất Khóa Học (Đánh Giá)
                    </ExportButton>
                )}

                {/* Xuất báo cáo tăng trưởng người dùng */}
                {userGrowthStats.length > 0 && (
                    <ExportButton
                        fileName={`bc-tang-truong-nguoi-dung-${new Date().toISOString().split('T')[0]}`}
                        sheetName="Tăng Trưởng"
                        columns={growthColumns}
                        data={userGrowthStats}
                        title="Báo Cáo: Tăng Trưởng Người Dùng"
                        variant="default"
                    >
                        📈 Xuất Tăng Trưởng
                    </ExportButton>
                )}

                {/* Xuất toàn bộ khóa học */}
                {allCourses.length > 0 && (
                    <ExportButton
                        fileName={`bc-toan-bo-khoa-hoc-${new Date().toISOString().split('T')[0]}`}
                        sheetName="Toàn Bộ Khóa Học"
                        columns={courseColumns}
                        data={allCourses}
                        title="Báo Cáo: Toàn Bộ Khóa Học"
                        variant="default"
                    >
                        📋 Xuất Tất Cả Khóa Học
                    </ExportButton>
                )}
            </div>
        </div>
    )
}
