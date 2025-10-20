

import fileApiRequest from "@/apiRequests/file";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useUploadFileMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (file: File) => fileApiRequest.upload(file),
        onSuccess: (uploadedFile) => {
            queryClient.invalidateQueries({
                queryKey: ['files']
            })
            return uploadedFile; 
        }
    })
}
export const useDoawloadFileQuery = ({
    id,
    enabled,
}: {
    id: string;
    enabled: boolean;
}) => {
    return useQuery({
        queryKey: ['download-file', id],
        queryFn: () => fileApiRequest.download(id),
        enabled
    });
};
export const useDeleteFileMutation = () => {
    return useMutation({
        mutationFn: (fileId: string) => fileApiRequest.delete(fileId),
    })
}