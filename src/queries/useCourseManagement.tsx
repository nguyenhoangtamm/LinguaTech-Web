"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import courseManagementApiRequest from "@/apiRequests/courseManagement";
import {
    CreateCourseBodyType,
    UpdateCourseBodyType,
    GetCoursesWithPaginationQueryType,
} from "@/schemaValidations/courseManagement.schema";
import { handleErrorApi } from "@/lib/utils";

// Query keys
export const courseManagementKeys = {
    all: ["courseManagement"] as const,
    lists: () => [...courseManagementKeys.all, "list"] as const,
    list: (filters: string) => [...courseManagementKeys.lists(), { filters }] as const,
    details: () => [...courseManagementKeys.all, "detail"] as const,
    detail: (id: number) => [...courseManagementKeys.details(), id] as const,
    categories: () => [...courseManagementKeys.all, "categories"] as const,
    recent: () => [...courseManagementKeys.all, "recent"] as const,
    modules: (courseId: number) => [...courseManagementKeys.all, "modules", courseId] as const,
    byCategory: (categorySlug: string) => [...courseManagementKeys.all, "category", categorySlug] as const,
};

// Get course by ID
export function useCourseManagement(id: number, enabled?: boolean) {
    return useQuery({
        queryKey: courseManagementKeys.detail(id),
        queryFn: () => courseManagementApiRequest.getById(id),
        enabled: enabled !== undefined ? enabled : !!id,
    });
}

// Get course detail
export function useCourseManagementDetail(id: number) {
    return useQuery({
        queryKey: [...courseManagementKeys.detail(id), "full"],
        queryFn: () => courseManagementApiRequest.getDetail(id),
        enabled: !!id,
    });
}

// Get courses with pagination
export function useCoursesManagementWithPagination(params: GetCoursesWithPaginationQueryType) {
    return useQuery({
        queryKey: courseManagementKeys.list(JSON.stringify(params)),
        queryFn: () => courseManagementApiRequest.getWithPagination(params),
    });
}

// Search courses
export function useSearchCoursesManagement(params: GetCoursesWithPaginationQueryType) {
    return useQuery({
        queryKey: [...courseManagementKeys.lists(), "search", JSON.stringify(params)],
        queryFn: () => courseManagementApiRequest.search(params),
    });
}

// Get recent courses
export function useRecentCoursesManagement() {
    return useQuery({
        queryKey: courseManagementKeys.recent(),
        queryFn: () => courseManagementApiRequest.getRecent(),
    });
}

// Get courses by category
export function useCoursesByCategory(categorySlug: string, params?: GetCoursesWithPaginationQueryType) {
    return useQuery({
        queryKey: courseManagementKeys.byCategory(categorySlug),
        queryFn: () => courseManagementApiRequest.getByCategory(categorySlug, params),
        enabled: !!categorySlug,
    });
}

// Get course categories
export function useCourseCategories() {
    return useQuery({
        queryKey: courseManagementKeys.categories(),
        queryFn: () => courseManagementApiRequest.getCategories(),
    });
}

// Backwards-compatible alias
export const useCategoriesManagement = useCourseCategories;

// Get course modules
export function useCourseModules(courseId: number) {
    return useQuery({
        queryKey: courseManagementKeys.modules(courseId),
        queryFn: () => courseManagementApiRequest.getModules(courseId),
        enabled: !!courseId,
    });
}

// Create course mutation
export function useCreateCourseManagement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: CreateCourseBodyType) =>
            courseManagementApiRequest.create(body),
        onSuccess: (data) => {
            toast({
                title: "Success",
                description: "Course created successfully",
            });
            queryClient.invalidateQueries({ queryKey: courseManagementKeys.all });
        },
        onError: (error) => {
            handleErrorApi({
                error,
                setError: () => { },
            });
        },
    });
}

// Update course mutation
export function useUpdateCourseManagement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, body }: { id: number; body: UpdateCourseBodyType }) =>
            courseManagementApiRequest.update(id, body),
        onSuccess: (data, variables) => {
            toast({
                title: "Success",
                description: "Course updated successfully",
            });
            queryClient.invalidateQueries({ queryKey: courseManagementKeys.all });
            queryClient.invalidateQueries({ queryKey: courseManagementKeys.detail(variables.id) });
        },
        onError: (error) => {
            handleErrorApi({
                error,
                setError: () => { },
            });
        },
    });
}

// Delete course mutation
export function useDeleteCourseManagement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => courseManagementApiRequest.delete(id),
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Course deleted successfully",
            });
            queryClient.invalidateQueries({ queryKey: courseManagementKeys.all });
        },
        onError: (error) => {
            handleErrorApi({
                error,
                setError: () => { },
            });
        },
    });
}