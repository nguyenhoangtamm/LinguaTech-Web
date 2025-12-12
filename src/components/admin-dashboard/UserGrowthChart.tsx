'use client'

import React from 'react'
import { UserGrowthStatsType } from '@/schemaValidations/adminDashboard.schema'

interface UserGrowthChartProps {
    data: UserGrowthStatsType[]
    isLoading?: boolean
}

export const UserGrowthChart: React.FC<UserGrowthChartProps> = ({
    data,
    isLoading = false,
}) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="h-64 bg-gray-200 rounded animate-pulse" />
            </div>
        )
    }

    if (data?.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">User Growth Statistics</h3>
                <p className="text-gray-500 text-center py-8">No data available</p>
            </div>
        )
    }

    // Calculate max values for scaling
    const maxTotalUsers = Math.max(...data.map(d => d.totalUsers))
    const maxNewUsers = Math.max(...data.map(d => d.newUsers))
    const maxActiveUsers = Math.max(...data.map(d => d.activeUsers))

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">User Growth Statistics</h3>
            <div className="space-y-4">
                {/* Bar Chart Section */}
                <div className="overflow-x-auto pb-4">
                    <div className="flex gap-2 min-w-full">
                        {data.map((item, idx) => {
                            const date = new Date(item.date)
                            const dateStr = date.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                            })

                            const totalHeight = (item.totalUsers / maxTotalUsers) * 150
                            const newHeight = (item.newUsers / maxNewUsers) * 150
                            const activeHeight = (item.activeUsers / maxActiveUsers) * 150

                            return (
                                <div key={idx} className="flex-shrink-0 flex flex-col items-center">
                                    <div className="h-40 flex items-end gap-1">
                                        <div
                                            className="w-4 bg-blue-400 rounded-t opacity-75"
                                            style={{ height: `${totalHeight}px` }}
                                            title={`Total: ${item.totalUsers}`}
                                        />
                                        <div
                                            className="w-4 bg-green-400 rounded-t opacity-75"
                                            style={{ height: `${newHeight}px` }}
                                            title={`New: ${item.newUsers}`}
                                        />
                                        <div
                                            className="w-4 bg-purple-400 rounded-t opacity-75"
                                            style={{ height: `${activeHeight}px` }}
                                            title={`Active: ${item.activeUsers}`}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-600 mt-2">{dateStr}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Legend */}
                <div className="flex gap-6 justify-center mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-400 rounded" />
                        <span className="text-sm text-gray-700">Total Users</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-400 rounded" />
                        <span className="text-sm text-gray-700">New Users</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-400 rounded" />
                        <span className="text-sm text-gray-700">Active Users</span>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-200">
                    <div className="text-center">
                        <p className="text-gray-600 text-sm">Latest Total Users</p>
                        <p className="text-2xl font-bold text-blue-600 mt-1">
                            {data[data.length - 1]?.totalUsers || 0}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-gray-600 text-sm">Total New Users</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">
                            {data.reduce((sum, d) => sum + d.newUsers, 0)}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-gray-600 text-sm">Avg Active Users</p>
                        <p className="text-2xl font-bold text-purple-600 mt-1">
                            {Math.round(data.reduce((sum, d) => sum + d.activeUsers, 0) / data.length)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserGrowthChart
