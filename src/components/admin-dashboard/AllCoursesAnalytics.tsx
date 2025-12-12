'use client'

import React, { useState } from 'react'
import { CourseAnalyticsType } from '@/schemaValidations/adminDashboard.schema'

interface AllCoursesAnalyticsProps {
    courses: CourseAnalyticsType[]
    isLoading?: boolean
    onLoadMore?: () => void
    hasMore?: boolean
}

export const AllCoursesAnalytics: React.FC<AllCoursesAnalyticsProps> = ({
    courses,
    isLoading = false,
    onLoadMore,
    hasMore = false,
}) => {
    const [sortBy, setSortBy] = useState<'enrollment' | 'rating' | 'date'>('enrollment')
    const [filterStatus, setFilterStatus] = useState<'all' | 'Active' | 'Draft' | 'Archived'>('all')
    const [searchTerm, setSearchTerm] = useState('')

    // Filter and sort courses
    const filteredCourses = courses
        .filter(course => {
            const matchesStatus = filterStatus === 'all' || course.status === filterStatus
            const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase())
            return matchesStatus && matchesSearch
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'enrollment':
                    return b.enrollmentCount - a.enrollmentCount
                case 'rating':
                    return b.rating - a.rating
                case 'date':
                    return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
                default:
                    return 0
            }
        })

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

    if (isLoading && courses.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">All Courses Analytics</h3>
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
            <h3 className="text-lg font-semibold mb-4">All Courses Analytics</h3>

            {/* Filter and Sort Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value as any)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Draft">Draft</option>
                        <option value="Archived">Archived</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value as any)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="enrollment">Enrollments</option>
                        <option value="rating">Rating</option>
                        <option value="date">Date Created</option>
                    </select>
                </div>

                <div className="flex items-end">
                    <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 font-medium">
                        {filteredCourses.length} / {courses.length} courses
                    </div>
                </div>
            </div>

            {/* Courses Grid */}
            {filteredCourses.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No courses found</p>
                    <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search term</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCourses.map(course => (
                        <div
                            key={course.id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            {/* Course Header */}
                            <div className="flex items-start justify-between mb-3">
                                <h4 className="font-semibold text-gray-900 text-sm flex-1 line-clamp-2">
                                    {course.title}
                                </h4>
                                <span
                                    className={`ml-2 inline-block px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${course.status === 'Active'
                                            ? 'bg-green-100 text-green-800'
                                            : course.status === 'Draft'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}
                                >
                                    {course.status}
                                </span>
                            </div>

                            {/* Published Badge */}
                            {course.isPublished && (
                                <div className="mb-2">
                                    <span className="text-xs text-green-600 font-medium">✓ Published</span>
                                </div>
                            )}

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex gap-0.5">{renderStars(course.rating)}</div>
                                <span className="text-sm font-medium text-gray-700">
                                    {course.rating.toFixed(1)}
                                </span>
                            </div>

                            {/* Stats */}
                            <div className="space-y-2 mb-3 pt-3 border-t border-gray-200">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Enrollments</span>
                                    <span className="font-semibold text-blue-600">{course.enrollmentCount}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Created</span>
                                    <span className="text-gray-900">
                                        {new Date(course.createdDate).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>
                            </div>

                            {/* ID */}
                            <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                                ID: {course.id}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Load More Button */}
            {hasMore && (
                <div className="mt-6 text-center">
                    <button
                        onClick={onLoadMore}
                        disabled={isLoading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
                    >
                        {isLoading ? 'Loading...' : 'Load More'}
                    </button>
                </div>
            )}
        </div>
    )
}

export default AllCoursesAnalytics
