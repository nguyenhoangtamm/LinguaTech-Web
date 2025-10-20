import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import areaApiRequest from "@/apiRequests/area";
import {FilterAreaType, UpdateAreaBodyType} from "@/schemaValidations/area.schema";

export const useGetAllAreaQuery = () => {
    return useQuery({
        queryKey: ['areas', 'all'],
        queryFn: () => areaApiRequest.getAll()
    })
}

export const useGetAreaQuery = ({id, enabled}: { id: number; enabled: boolean }) => {
    return useQuery({
        queryKey: ['areas', id],
        queryFn: () => areaApiRequest.getArea(id),
        enabled
    })
}

export const useAreaListQuery = ({pageSize, pageNumber, ...filter}: {
    pageSize: number,
    pageNumber: number
} & Partial<FilterAreaType>) => {
    const params = {pageSize, pageNumber, ...filter}
    return useQuery({
        queryKey: ['areas', params.pageNumber, params.pageSize],
        queryFn: () => areaApiRequest.list(params)
    })
}

export const useCreateAreaMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: areaApiRequest.create,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['areas']
            })
        }
    })
}

export const useUpdateAreaMutation = () => {
    return useMutation({
        mutationFn: ({id, ...body}: UpdateAreaBodyType & { id: number }) =>
            areaApiRequest.updateArea(id, body)
    })
}

export const useDeleteAreaMutation = () => {
    return useMutation({
        mutationFn: areaApiRequest.deleteArea,
    })
}