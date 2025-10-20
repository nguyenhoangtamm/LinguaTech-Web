import { useMutation, useQuery } from "@tanstack/react-query";
import userProfileApiRequest from "@/apiRequests/userProfile";
import { FilterProfileType } from "@/schemaValidations/profile.schema";
import exp from "constants";

export const useProfilesByUserNameQuery = () => {
    return useQuery({
        queryKey: ['user-profile', 'getProfilesByUserName'],
        queryFn: userProfileApiRequest.getProfilesByUserName,
    })
}

export const useUserProfileMeQuery = ({enabled}: { enabled: boolean }) => {
    return useQuery({
        queryKey: ['user', 'me'],
        queryFn: userProfileApiRequest.me,
        enabled
    })
}

export const useProfileListQuery = ({ pageSize, pageNumber, ...filter }: {
    pageSize: number,
    pageNumber: number
} & Partial<FilterProfileType>) => {
    const params = { pageSize, pageNumber, ...filter }
    return useQuery({
        queryKey: ['user-profiles', params.pageNumber, params.pageSize],
        queryFn: () => userProfileApiRequest.getPagination(params)
    })
}
export const useProfileUsersQuery= () => {
    return useQuery({
        queryKey: ['user-profiles'],
        queryFn: userProfileApiRequest.getProfileUsers,
    })
}

