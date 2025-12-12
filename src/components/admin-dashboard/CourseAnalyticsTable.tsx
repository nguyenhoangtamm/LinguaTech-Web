'use client'

import React from 'react'
import { CourseAnalyticsType } from '@/schemaValidations/adminDashboard.schema'
import { formatDate } from '@/lib/utils'

interface CourseAnalyticsTableProps {
    courses: CourseAnalyticsType[]
    isLoading?: boolean
    title?: string
}

export const CourseAnalyticsTable: React.FC<CourseAnalyticsTableProps> = ({
    courses,
    isLoading = false,
    title = 'Course Analytics',
}) => {
    const renderStars = (rating: number) => {
        return Array(5)
            .fill(0)
            .map((_, i) => (
                <span
                    key={i}
                    className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}
                >
                    ★
                </span>
            ))
    }

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">{title}</h3>
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            {courses.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No courses available</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                                    Course Title
                                </th>
                                <th className="text-center py-3 px-4 font-semibold text-sm text-gray-700">
                                    Enrollments
                                </th>
                                <th className="text-center py-3 px-4 font-semibold text-sm text-gray-700">
                                    Rating
                                </th>
                                <th className="text-center py-3 px-4 font-semibold text-sm text-gray-700">
                                    Status
                                </th>
                                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                                    Created Date
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course) => (
                                <tr
                                    key={course.id}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    <td className="py-4 px-4 text-sm text-gray-900">
                                        <div className="font-medium">{course.title}</div>
                                        {course.isPublished && (
                                            <span className="text-xs text-green-600 font-medium">Published</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-4 text-center text-sm text-gray-700">
                                        {course.enrollmentCount}
                                    </td>
                                    <td className="py-4 px-4 text-center text-sm">
                                        <div className="flex items-center justify-center gap-1">
                                            {renderStars(course.rating)}
                                            <span className="ml-2 text-gray-700">{course.rating.toFixed(1)}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-center text-sm">
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${course.status === 'Active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : course.status === 'Draft'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}
                                        >
                                            {course.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-600">
                                        {formatDate(new Date(course.createdDate))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default CourseAnalyticsTable
