import http from "@/lib/http";
import {
    ProfileResType,
    UserProfilesResType,
} from "@/schemaValidations/user.schema";
import { ProfileListResType } from "@/schemaValidations/profile.schema";

const buildUrlWithParams = (baseUrl: string, params: Record<string, any>) => {
    const filteredParams = Object.fromEntries(
        Object.entries(params).filter(
            ([_, value]) =>
                value !== undefined && value !== null && value !== ""
        )
    );
    const queryString = new URLSearchParams(filteredParams).toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

const userProfileApiRequest = {
    me: () => http.get<ProfileResType>("Users/me"),
    getProfilesByUserName: () =>
        http.get<UserProfilesResType>("userprofiles/get-user-profiles"),
    getPagination: (filters: { pageNumber: number; pageSize: number }) =>
        http.get<ProfileListResType>(
            buildUrlWithParams("users/get-pagination", filters)
        ),
    getProfileUsers: () =>
        http.get<ProfileListResType>("userProfiles/get-profile-users"),
};

export default userProfileApiRequest;
