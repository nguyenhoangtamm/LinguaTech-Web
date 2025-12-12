'use client'

import { useQuery } from '@tanstack/react-query'
import adminDashboardApiRequest from '@/apiRequests/adminDashboard'
import {
    AdminDashboardStatsType,
    CourseAnalyticsType,
    UserGrowthStatsType,
} from '@/schemaValidations/adminDashboard.schema'

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['adminDashboard', 'stats'],
        queryFn: async () => {
            const response = await adminDashboardApiRequest.getDashboardStats()
            return response.data.data
        },
    })
}

export const useCourseAnalytics = () => {
    return useQuery({
        queryKey: ['adminDashboard', 'courseAnalytics'],
        queryFn: async () => {
            const response = await adminDashboardApiRequest.getCourseAnalytics()
            return response.data.data
        },
    })
}

export const useTopCoursesByEnrollment = (limit: number = 10) => {
    return useQuery({
        queryKey: ['adminDashboard', 'topCoursesByEnrollment', limit],
        queryFn: async () => {
            const response = await adminDashboardApiRequest.getTopCoursesByEnrollment(limit)
            return response.data.data
        },
    })
}

export const useTopCoursesByRating = (limit: number = 10) => {
    return useQuery({
        queryKey: ['adminDashboard', 'topCoursesByRating', limit],
        queryFn: async () => {
            const response = await adminDashboardApiRequest.getTopCoursesByRating(limit)
            return response.data.data
        },
    })
}

export const useUserGrowthStats = (days: number = 30) => {
    return useQuery({
        queryKey: ['adminDashboard', 'userGrowthStats', days],
        queryFn: async () => {
            const response = await adminDashboardApiRequest.getUserGrowthStats(days)
            return response.data.data
        },
    })
}
