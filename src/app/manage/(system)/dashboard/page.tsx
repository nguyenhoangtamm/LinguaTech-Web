'use client'

import React, { useState, useEffect } from 'react'
import PageHeader from '@/components/PageHeader'
import adminDashboardApiRequest from '@/apiRequests/adminDashboard'
import DashboardStats from '@/components/admin-dashboard/DashboardStats'
import DashboardOverview from '@/components/admin-dashboard/DashboardOverview'
import CourseAnalyticsTable from '@/components/admin-dashboard/CourseAnalyticsTable'
import AllCoursesAnalytics from '@/components/admin-dashboard/AllCoursesAnalytics'
import UserGrowthChart from '@/components/admin-dashboard/UserGrowthChart'
import {
    AdminDashboardStatsType,
    CourseAnalyticsType,
    UserGrowthStatsType,
} from '@/schemaValidations/adminDashboard.schema'
import { useToast } from '@/hooks/use-toast'
import LoadingOverlay from '@/components/LoadingOverlay'

interface DashboardPageState {
    stats: AdminDashboardStatsType | null
    topCoursesByEnrollment: CourseAnalyticsType[]
    topCoursesByRating: CourseAnalyticsType[]
    allCourses: CourseAnalyticsType[]
    userGrowthStats: UserGrowthStatsType[]
    loading: boolean
    error: string | null
}

export default function AdminDashboardPage() {
    const { toast } = useToast()
    const [state, setState] = useState<DashboardPageState>({
        stats: null,
        topCoursesByEnrollment: [],
        topCoursesByRating: [],
        allCourses: [],
        userGrowthStats: [],
        loading: true,
        error: null,
    })

    const [filters, setFilters] = useState({
        daysForGrowth: 30,
        limitForEnrollment: 10,
        limitForRating: 10,
    })

    useEffect(() => {
        const fetchDashboardData = async () => {
            setState(prev => ({ ...prev, loading: true, error: null }))

            try {
                const [statsRes, enrollmentRes, ratingRes, growthRes, allCoursesRes] = await Promise.all([
                    adminDashboardApiRequest.getDashboardStats(),
                    adminDashboardApiRequest.getTopCoursesByEnrollment(filters.limitForEnrollment),
                    adminDashboardApiRequest.getTopCoursesByRating(filters.limitForRating),
                    adminDashboardApiRequest.getUserGrowthStats(filters.daysForGrowth),
                    adminDashboardApiRequest.getCourseAnalytics(),
                ])

                setState(prev => ({
                    ...prev,
                    stats: statsRes.data,
                    topCoursesByEnrollment: enrollmentRes.data,
                    topCoursesByRating: ratingRes.data,
                    userGrowthStats: growthRes.data,
                    allCourses: allCoursesRes.data,
                    loading: false,
                }))
            } catch (error) {
                const errorMsg = error instanceof Error ? error.message : 'Failed to fetch dashboard data'
                setState(prev => ({
                    ...prev,
                    error: errorMsg,
                    loading: false,
                }))
                toast({
                    title: 'Error',
                    description: errorMsg,
                    variant: 'destructive',
                })
            }
        }

        fetchDashboardData()
    }, [filters, toast])

    const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }))
    }

    return (
        <div className="space-y-8">
            <PageHeader
                title="Admin Dashboard"
                description="System overview and analytics"
            />

            <LoadingOverlay show={state.loading} />

            {/* Main Stats Grid */}
            {state.stats && (
                <DashboardStats stats={state.stats} isLoading={state.loading} />
            )}

            {/* User Growth Chart Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">User Growth Statistics</h3>
                    <div className="flex gap-2">
                        <select
                            value={filters.daysForGrowth}
                            onChange={e =>
                                handleFiltersChange({ daysForGrowth: parseInt(e.target.value) })
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={7}>Last 7 days</option>
                            <option value={30}>Last 30 days</option>
                            <option value={90}>Last 90 days</option>
                            <option value={180}>Last 180 days</option>
                            <option value={365}>Last year</option>
                        </select>
                    </div>
                </div>
                <UserGrowthChart data={state.userGrowthStats} isLoading={state.loading} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* System Overview */}
                <div className="lg:col-span-2">
                    {state.stats && (
                        <DashboardOverview stats={state.stats} isLoading={state.loading} />
                    )}
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-6">Quick Stats</h3>
                    <div className="space-y-4">
                        {state.stats && (
                            <>
                                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                                    <span className="text-gray-700">Active Users Ratio</span>
                                    <span className="text-lg font-bold text-blue-600">
                                        {((state.stats.activeUsers / state.stats.totalUsers) * 100).toFixed(1)}%
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                                    <span className="text-gray-700">Published Courses Ratio</span>
                                    <span className="text-lg font-bold text-green-600">
                                        {((state.stats.publishedCourses / state.stats.totalCourses) * 100).toFixed(1)}%
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                                    <span className="text-gray-700">Active Courses</span>
                                    <span className="text-lg font-bold text-purple-600">
                                        {state.stats.activeCourses}/{state.stats.totalCourses}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700">Lessons Per Course</span>
                                    <span className="text-lg font-bold text-orange-600">
                                        {(state.stats.totalLessons / state.stats.totalCourses).toFixed(1)}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Top Courses Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <CourseAnalyticsTable
                    courses={state.topCoursesByEnrollment}
                    isLoading={state.loading}
                    title={`Top ${filters.limitForEnrollment} Courses by Enrollment`}
                />
                <CourseAnalyticsTable
                    courses={state.topCoursesByRating}
                    isLoading={state.loading}
                    title={`Top ${filters.limitForRating} Courses by Rating`}
                />
            </div>

            {/* All Courses Analytics */}
            <AllCoursesAnalytics
                courses={state.allCourses}
                isLoading={state.loading}
            />
        </div>
    )
}
