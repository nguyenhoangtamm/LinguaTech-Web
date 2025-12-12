'use client'

import React from 'react'
import { AdminDashboardStatsType } from '@/schemaValidations/adminDashboard.schema'

interface DashboardOverviewProps {
    stats: AdminDashboardStatsType
    isLoading?: boolean
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
    stats,
    isLoading = false,
}) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-6 bg-gray-200 rounded animate-pulse" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-6">System Overview</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                        <span className="text-gray-700">Last Updated</span>
                        <span className="font-medium">
                            {new Date(stats.systemOverview.lastUpdated).toLocaleString()}
                        </span>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                        <span className="text-gray-700">Avg Enrollment/Course</span>
                        <span className="font-medium text-blue-600">
                            {stats.systemOverview.averageEnrollmentPerCourse.toFixed(1)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                        <span className="text-gray-700">Total Storage Used</span>
                        <span className="font-medium text-yellow-600">
                            {stats.systemOverview.totalStorageUsedMB.toFixed(1)} MB
                        </span>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                        <span className="text-gray-700">Course Completion Rate</span>
                        <span className="font-medium text-green-600">
                            {stats.systemOverview.courseCompletionRate.toFixed(1)}%
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-gray-700">Average Course Rating</span>
                        <span className="font-medium text-purple-600">
                            {stats.systemOverview.averageCourseRating.toFixed(1)}/5.0
                        </span>
                    </div>
                </div>

                {/* Right Column - User & Course Breakdown */}
                <div className="space-y-6">
                    {/* User Breakdown */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-800 mb-3">Users Breakdown</h4>
                        <div className="space-y-2">
                            {Object.entries(stats.usersByRole).map(([role, count]) => (
                                <div key={role} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">{role}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full"
                                                style={{
                                                    width: `${(count / stats.totalUsers) * 100}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="text-sm font-medium w-12 text-right">{count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Course Status Breakdown */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-800 mb-3">Course Status</h4>
                        <div className="space-y-2">
                            {Object.entries(stats.coursesByStatus).map(([status, count]) => {
                                const colors = {
                                    Active: 'bg-green-500',
                                    Draft: 'bg-yellow-500',
                                    Archived: 'bg-gray-500',
                                }
                                return (
                                    <div key={status} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">{status}</span>
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${colors[status as keyof typeof colors] || 'bg-gray-500'
                                                        }`}
                                                    style={{
                                                        width: `${(count / stats.totalCourses) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                            <span className="text-sm font-medium w-12 text-right">{count}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardOverview
