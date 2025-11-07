import http from "@/lib/http";
import {
    ApiUserListResType,
    ApiUserResType,
    CreateUserBodyType,
    UpdateUserBodyType,
    FilterUserType,
    GetAllUsersResType,
    UserOperationResType,
    UserDashboardStatsResType,
} from "@/schemaValidations/user.schema";

const buildUrlWithParams = (baseUrl: string, params: Record<string, any>) => {
    const queryString = new URLSearchParams(params).toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

// User API endpoints based on api.json
const userApiRequest = {
    // Create user
    create: (body: CreateUserBodyType) =>
        http.post<UserOperationResType>("/api/v1/users/create", body),

    // Update user
    update: (id: number, body: UpdateUserBodyType) =>
        http.post<UserOperationResType>(`/api/v1/users/update/${id}`, body),

    // Delete user
    delete: (id: number) =>
        http.post<UserOperationResType>(`/api/v1/users/delete/${id}`, null),

    // Get user by ID
    getById: (id: number) => http.get<ApiUserResType>(`/api/v1/users/${id}`),

    // Get all users (simple list)
    getAll: () => http.get<GetAllUsersResType>("/api/v1/users/get-all"),

    // Get users with pagination and filters
    list: (filters: {
        pageNumber: number;
        pageSize: number;
        keyword?: string;
    }) => {
        const params = Object.fromEntries(
            Object.entries(filters).filter(
                ([_, value]) => value !== undefined && value !== ""
            )
        );
        return http.get<ApiUserListResType>(
            buildUrlWithParams("/api/v1/users/get-pagination", params)
        );
    },

    // Get current user info
    getMe: () => http.get<ApiUserResType>("/api/v1/users/me"),

    // Get user dashboard stats
    getDashboardStats: () =>
        http.get<UserDashboardStatsResType>("/api/v1/users/dashboard-stats"),
};

export default userApiRequest;
