import http from '@/lib/http'
import {
    ProfileResType,
    UserProfilesResType,
} from '@/schemaValidations/user.schema'
import { ProfileListResType  } from "@/schemaValidations/profile.schema";

const buildUrlWithParams = (baseUrl: string, params: Record<string, any>) => {
    const queryString = new URLSearchParams(params).toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

const userProfileApiRequest = {
    me: () => http.get<ProfileResType>('Auth/me'),
    getProfilesByUserName: () => http.get<UserProfilesResType>('userprofiles/get-user-profiles'),
    getPagination: (filters: { pageNumber: number; pageSize: number }) =>
        http.get<ProfileListResType>(
            buildUrlWithParams("userProfiles/get-user-profile-pagination", filters)
        ),
    getProfileUsers: () => http.get<ProfileListResType>('userProfiles/get-profile-users'),
}

export default userProfileApiRequest
