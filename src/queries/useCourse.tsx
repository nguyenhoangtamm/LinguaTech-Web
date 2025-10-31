"use client";

import courseApiRequest from "@/apiRequests/course";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    CourseCreateBodyType,
    CourseUpdateBodyType,
    CourseFilterParamsType,
    EnrollmentCreateBodyType,
    UpdateProgressBodyType,
} from "@/schemaValidations/course.schema";

// Query keys
export const COURSE_QUERY_KEYS = {
    all: ['courses'] as const,
    lists: () => [...COURSE_QUERY_KEYS.all, 'list'] as const,
    list: (params?: CourseFilterParamsType) => [...COURSE_QUERY_KEYS.lists(), params] as const,
    details: () => [...COURSE_QUERY_KEYS.all, 'detail'] as const,
    detail: (id?: number) => [...COURSE_QUERY_KEYS.details(), id] as const,
    detailWithModules: (id?: number) => [...COURSE_QUERY_KEYS.details(), id, 'modules'] as const,
    categories: () => [...COURSE_QUERY_KEYS.all, 'categories'] as const,
    categoryList: (categorySlug: string, params?: CourseFilterParamsType) =>
        [...COURSE_QUERY_KEYS.all, 'category', categorySlug, params] as const,
    enrollments: () => ['enrollments'] as const,
    userEnrollments: () => [...COURSE_QUERY_KEYS.enrollments(), 'user'] as const,
    checkEnrollment: (courseId: number) => [...COURSE_QUERY_KEYS.enrollments(), 'check', courseId] as const,
    dashboard: () => ['dashboard'] as const,
    dashboardStats: () => [...COURSE_QUERY_KEYS.dashboard(), 'stats'] as const,
    recentCourses: () => [...COURSE_QUERY_KEYS.all, 'recent'] as const,
    continueCourses: () => [...COURSE_QUERY_KEYS.enrollments(), 'continue'] as const,
    search: (query: string, params?: Omit<CourseFilterParamsType, 'search'>) =>
        [...COURSE_QUERY_KEYS.all, 'search', query, params] as const,
};

// Course Queries
export const useCoursesQuery = (params?: CourseFilterParamsType, enabled: boolean = true) => {
    return useQuery({
        queryKey: COURSE_QUERY_KEYS.list(params),
        queryFn: () => courseApiRequest.getCourses(params),
        select: (data) => data, // Return the parsed response data
        enabled,
    });
};

export const useCourseQuery = (id?: number, enabled: boolean = true) => {
    return useQuery({
        queryKey: COURSE_QUERY_KEYS.detail(id),
        queryFn: () => courseApiRequest.getCourse(id as number),
        select: (data) => data?.data, // Extract the actual course data
        enabled: enabled && id != null,
    });
};

export const useCourseDetailQuery = (id?: number, enabled: boolean = true) => {
    return useQuery({
        queryKey: COURSE_QUERY_KEYS.detailWithModules(id),
        queryFn: () => courseApiRequest.getCourseDetail(id as number),
        enabled: enabled && id != null,
    });
};

export const useCategoriesQuery = (enabled: boolean = true) => {
    return useQuery({
        queryKey: COURSE_QUERY_KEYS.categories(),
        queryFn: () => courseApiRequest.getCategories(),
        enabled,
    });
};

export const useCoursesByCategoryQuery = (
    categorySlug: string,
    params?: CourseFilterParamsType,
    enabled: boolean = true
) => {
    return useQuery({
        queryKey: COURSE_QUERY_KEYS.categoryList(categorySlug, params),
        queryFn: () => courseApiRequest.getCoursesByCategory(categorySlug, params),
        enabled: enabled && !!categorySlug,
    });
};

export const useSearchCoursesQuery = (
    query: string,
    params?: Omit<CourseFilterParamsType, 'search'>,
    enabled: boolean = true
) => {
    return useQuery({
        queryKey: COURSE_QUERY_KEYS.search(query, params),
        queryFn: () => courseApiRequest.searchCourses(query, params),
        enabled: enabled && !!query.trim(),
    });
};

// Enrollment Queries
export const useUserEnrollmentsQuery = (enabled: boolean = true) => {
    return useQuery({
        queryKey: COURSE_QUERY_KEYS.userEnrollments(),
        queryFn: () => courseApiRequest.getUserEnrollments(),
        enabled,
    });
};

export const useCheckEnrollmentQuery = (courseId?: number, enabled: boolean = true) => {
    return useQuery({
        queryKey: COURSE_QUERY_KEYS.checkEnrollment(courseId as number),
        queryFn: () => courseApiRequest.checkEnrollment(courseId as number),
        enabled: enabled && courseId != null,
    });
};

// Dashboard Queries
export const useDashboardStatsQuery = (enabled: boolean = true) => {
    return useQuery({
        queryKey: COURSE_QUERY_KEYS.dashboardStats(),
        queryFn: () => courseApiRequest.getDashboardStats(),
        enabled,
    });
};

export const useRecentCoursesQuery = (enabled: boolean = true) => {
    return useQuery({
        queryKey: COURSE_QUERY_KEYS.recentCourses(),
        queryFn: () => courseApiRequest.getRecentCourses(),
        enabled,
    });
};

export const useContinueCoursesQuery = (enabled: boolean = true) => {
    return useQuery({
        queryKey: COURSE_QUERY_KEYS.continueCourses(),
        queryFn: () => courseApiRequest.getContinueCourses(),
        enabled,
    });
};

// Mutations
export const useCreateCourseMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: CourseCreateBodyType) => courseApiRequest.createCourse(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.lists() });
        },
    });
};

export const useUpdateCourseMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...body }: { id: number } & CourseUpdateBodyType) =>
            courseApiRequest.updateCourse({ id, ...body }),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.detailWithModules(variables.id) });
        },
    });
};

export const useDeleteCourseMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => courseApiRequest.deleteCourse(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.lists() });
        },
    });
};

export const useEnrollCourseMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: EnrollmentCreateBodyType) => courseApiRequest.enrollCourse(body),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.userEnrollments() });
            queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.checkEnrollment(variables.courseId) });
            queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.dashboardStats() });
        },
    });
};

export const useUpdateProgressMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ courseId, ...body }: { courseId: number } & UpdateProgressBodyType) =>
            courseApiRequest.updateProgress({ courseId, ...body }),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.userEnrollments() });
            queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.checkEnrollment(variables.courseId) });
            queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.dashboardStats() });
            queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.continueCourses() });
        },
    });
};