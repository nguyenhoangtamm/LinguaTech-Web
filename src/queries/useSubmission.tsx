"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import submissionApiRequest from "@/apiRequests/submission";
import {
    CreateSubmissionBodyType,
    UpdateSubmissionBodyType,
    GetSubmissionsWithPaginationQueryType,
} from "@/schemaValidations/submission.schema";
import { handleErrorApi } from "@/lib/utils";

// Query keys
export const submissionKeys = {
    all: ["submissions"] as const,
    lists: () => [...submissionKeys.all, "list"] as const,
    list: (filters: string) => [...submissionKeys.lists(), { filters }] as const,
    details: () => [...submissionKeys.all, "detail"] as const,
    detail: (id: number) => [...submissionKeys.details(), id] as const,
    byAssignment: (assignmentId: number) => [...submissionKeys.all, "assignment", assignmentId] as const,
    byUser: (userId: number) => [...submissionKeys.all, "user", userId] as const,
    currentUser: (assignmentId: number) => [...submissionKeys.all, "currentUser", assignmentId] as const,
};

// Get submission by ID
export function useSubmission(id: number) {
    return useQuery({
        queryKey: submissionKeys.detail(id),
        queryFn: () => submissionApiRequest.getById(id),
        enabled: !!id,
    });
}

// Get all submissions
export function useAllSubmissions() {
    return useQuery({
        queryKey: submissionKeys.all,
        queryFn: () => submissionApiRequest.getAll(),
    });
}

// Get submissions with pagination
export function useSubmissionsWithPagination(params: GetSubmissionsWithPaginationQueryType) {
    return useQuery({
        queryKey: submissionKeys.list(JSON.stringify(params)),
        queryFn: () => submissionApiRequest.getWithPagination(params),
    });
}

// Get submissions by assignment
export function useSubmissionsByAssignment(assignmentId: number) {
    return useQuery({
        queryKey: submissionKeys.byAssignment(assignmentId),
        queryFn: () => submissionApiRequest.getByAssignment(assignmentId),
        enabled: !!assignmentId,
    });
}

// Get submissions by user
export function useSubmissionsByUser(userId: number) {
    return useQuery({
        queryKey: submissionKeys.byUser(userId),
        queryFn: () => submissionApiRequest.getByUser(userId),
        enabled: !!userId,
    });
}

// Get current user submission
export function useCurrentUserSubmission(assignmentId: number) {
    return useQuery({
        queryKey: submissionKeys.currentUser(assignmentId),
        queryFn: () => submissionApiRequest.getCurrentUserSubmission(assignmentId),
        enabled: !!assignmentId,
    });
}

// Create submission mutation
export function useCreateSubmission() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: CreateSubmissionBodyType) =>
            submissionApiRequest.create(body),
        onSuccess: (data) => {
            toast({
                title: "Success",
                description: "Submission created successfully",
            });
            queryClient.invalidateQueries({ queryKey: submissionKeys.all });
        },
        onError: (error) => {
            handleErrorApi({
                error,
                setError: () => { },
            });
        },
    });
}

// Update submission mutation
export function useUpdateSubmission() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, body }: { id: number; body: UpdateSubmissionBodyType }) =>
            submissionApiRequest.update(id, body),
        onSuccess: (data, variables) => {
            toast({
                title: "Success",
                description: "Submission updated successfully",
            });
            queryClient.invalidateQueries({ queryKey: submissionKeys.all });
            queryClient.invalidateQueries({ queryKey: submissionKeys.detail(variables.id) });
        },
        onError: (error) => {
            handleErrorApi({
                error,
                setError: () => { },
            });
        },
    });
}

// Delete submission mutation
export function useDeleteSubmission() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => submissionApiRequest.delete(id),
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Submission deleted successfully",
            });
            queryClient.invalidateQueries({ queryKey: submissionKeys.all });
        },
        onError: (error) => {
            handleErrorApi({
                error,
                setError: () => { },
            });
        },
    });
}