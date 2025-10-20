import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FilterDepartmentType, UpdateDepartmentBodyType } from "@/schemaValidations/department.schema"; // Assuming you have department schema validations
import departmentApiRequest from "@/apiRequests/departments";

// Department-related hooks
export const useGetAllDepartmentQuery = () => {
    return useQuery({
        queryKey: ['departments', 'all'],
        queryFn: () => departmentApiRequest.getAll()
    })
}

export const useGetDepartmentQuery = ({ id, enabled }: { id: number; enabled: boolean }) => {
    return useQuery({
        queryKey: ['departments', id],
        queryFn: () => departmentApiRequest.getDepartment(id),
        enabled
    })
}

export const useDepartmentListQuery = ({ pageSize, pageNumber, ...filter }: {
    pageSize: number,
    pageNumber: number
} & Partial<FilterDepartmentType>) => {
    const params = { pageSize, pageNumber, ...filter }
    return useQuery({
        queryKey: ['departments', params.pageNumber, params.pageSize],
        queryFn: () => departmentApiRequest.list(params)
    })
}

export const useCreateDepartmentMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: departmentApiRequest.create,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['departments']
            })
        }
    })
}

export const useUpdateDepartmentMutation = () => {
    return useMutation({
        mutationFn: (body: UpdateDepartmentBodyType & { id: number }) =>
            departmentApiRequest.updateDepartment(body.id, body)
    })
}

export const useDeleteDepartmentMutation = () => {
    return useMutation({
        mutationFn: departmentApiRequest.deleteDepartment,
    })
}