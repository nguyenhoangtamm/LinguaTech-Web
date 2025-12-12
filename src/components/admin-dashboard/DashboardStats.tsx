'use client'

import React from 'react'
import { AdminDashboardStatsType } from '@/schemaValidations/adminDashboard.schema'
import StatCard from './StatCard'
import { formatBytes } from '@/lib/utils'

interface DashboardStatsProps {
    stats: AdminDashboardStatsType
    isLoading?: boolean
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
    stats,
    isLoading = false
}) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-gray-200 h-32 rounded-lg animate-pulse"
                    />
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                title="Total Users"
                value={stats.totalUsers}
                subtext={`${stats.activeUsers} active`}
                variant="primary"
            />
            <StatCard
                title="Total Courses"
                value={stats.totalCourses}
                subtext={`${stats.publishedCourses} published`}
                variant="success"
            />
            <StatCard
                title="Total Enrollments"
                value={stats.totalEnrollments}
                subtext={`Avg ${stats.systemOverview.averageEnrollmentPerCourse.toFixed(1)} per course`}
                variant="primary"
            />
            <StatCard
                title="Total Materials"
                value={stats.totalMaterials}
                subtext={`${(stats.systemOverview.totalStorageUsedMB).toFixed(1)} MB`}
                variant="warning"
            />
            <StatCard
                title="Total Lessons"
                value={stats.totalLessons}
                variant="default"
            />
            <StatCard
                title="Total Assignments"
                value={stats.totalAssignments}
                variant="default"
            />
            <StatCard
                title="Storage Used"
                value={formatBytes(stats.totalMaterialsSize)}
                variant="warning"
            />
            <StatCard
                title="Completion Rate"
                value={`${stats.systemOverview.courseCompletionRate.toFixed(1)}%`}
                subtext={`Avg Rating: ${stats.systemOverview.averageCourseRating.toFixed(1)}/5`}
                variant="success"
            />
        </div>
    )
}

export default DashboardStats
