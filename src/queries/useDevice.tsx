import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import deviceApiRequest from "@/apiRequests/device";
import {FilterDeviceType, UpdateDeviceBodyType} from "@/schemaValidations/device.schema";

export const useGetDeviceQuery = ({id, enabled}: { id: number; enabled: boolean }) => {
    return useQuery({
        queryKey: ['devices', id],
        queryFn: () => deviceApiRequest.get(id),
        enabled
    })
}

export const useDeviceListQuery = ({pageSize, pageNumber, ...filter}: {
    pageSize: number,
    pageNumber: number
} & Partial<FilterDeviceType>) => {
    const params = {pageSize, pageNumber, ...filter}
    return useQuery({
        queryKey: ['devices', params.pageNumber, params.pageSize],
        queryFn: () => deviceApiRequest.list(params)
    })
}

export const useCreateDeviceMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deviceApiRequest.create,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['devices']
            })
        }
    })
}

export const useUpdateDeviceMutation = () => {
    return useMutation({
        mutationFn: ({id, ...body}: UpdateDeviceBodyType & { id: number }) =>
            deviceApiRequest.update(id, body)
    })
}

export const useDeleteAreaMutation = () => {
    return useMutation({
        mutationFn: deviceApiRequest.delete,
    })
}