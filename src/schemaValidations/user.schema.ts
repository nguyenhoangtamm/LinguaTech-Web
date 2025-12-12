import z from "zod";
import { ResponseSchema } from "@/schemaValidations/common.schema";

export const UserSchema = z.object({
    id: z.number({
        required_error: "Mã người dùng là bắt buộc",
        invalid_type_error: "Mã người dùng phải là số",
    }),
    username: z
        .string({
            required_error: "Tên đăng nhập là bắt buộc",
            invalid_type_error: "Tên đăng nhập phải là chuỗi",
        })
        .min(1, "Tên đăng nhập không được để trống"),
    fullname: z
        .string({
            required_error: "Vui lòng nhập họ và tên",
            invalid_type_error: "Họ và tên phải là chuỗi",
        })
        .min(1, "Họ và tên không được để trống"),

    email: z
        .string({
            required_error: "Vui lòng nhập email",
            invalid_type_error: "Email phải là chuỗi",
        })
        .min(1, "Email không được để trống")
        .email("Email bạn nhập không đúng định dạng"),

    role: z
        .string({
            required_error: "Vui lòng nhập vai trò",
            invalid_type_error: "Vai trò phải là chuỗi",
        })
        .min(1, "Vai trò không được để trống"),

    avatar: z
        .string({
            invalid_type_error: "Avatar phải là chuỗi",
        })
        .nullable(),
});

export type UserType = z.TypeOf<typeof UserSchema>;

export const UserListRes = z.object({
    data: z.array(UserSchema),
    message: z.string(),
});

export type UserListResType = z.TypeOf<typeof UserListRes>;

export const UserRes = z
    .object({
        data: UserSchema,
        message: z.string(),
    })
    .strict();

export type UserResType = z.TypeOf<typeof UserRes>;

const profileSchema = z.object({
    profileCode: z
        .string({
            required_error: "Mã hồ sơ là bắt buộc",
            invalid_type_error: "Mã hồ sơ phải là chuỗi",
        })
        .min(1, "Mã hồ sơ không được để trống"),

    name: z
        .string({
            required_error: "Vui lòng nhập tên hồ sơ",
            invalid_type_error: "Tên hồ sơ phải là chuỗi",
        })
        .min(1, "Tên hồ sơ không được để trống"),

    subName: z
        .string({
            required_error: "Vui lòng nhập tên bổ sung",
            invalid_type_error: "Tên bổ sung phải là chuỗi",
        })
        .min(1, "Tên phụ không được để trống"),

    status: z.number({
        required_error: "Vui lòng chọn trạng thái",
        invalid_type_error: "Trạng thái phải là số",
    }),

    type: z.number({
        required_error: "Vui lòng chọn loại hồ sơ",
        invalid_type_error: "Loại hồ sơ phải là số",
    }),

    avatar: z
        .string({
            invalid_type_error: "Avatar phải là chuỗi",
        })
        .optional(),
});
export const profileResSchema = z
    .object({
        data: UserSchema,
        message: z.string(),
        successed: z.boolean(),
        code: z.number(),
    })
    .strict();
export type ProfileResType = z.TypeOf<typeof profileResSchema>;

const userSchema = z.object({
    userId: z.number({
        required_error: "Mã người dùng là bắt buộc",
        invalid_type_error: "Mã người dùng phải là số",
    }),

    userName: z
        .string({
            required_error: "Tên đăng nhập là bắt buộc",
            invalid_type_error: "Tên đăng nhập phải là chuỗi",
        })
        .min(1, "Tên đăng nhập không được để trống"),

    fullName: z
        .string({
            required_error: "Vui lòng nhập họ và tên",
            invalid_type_error: "Họ và tên phải là chuỗi",
        })
        .min(1, "Họ và tên không được để trống"),

    profiles: z.array(profileSchema, {
        required_error: "Danh sách hồ sơ là bắt buộc",
        invalid_type_error: "Danh sách hồ sơ phải là mảng",
    }),
});

export const userProfileSchema = z
    .object({
        data: userSchema,
        message: z.string(),
    })
    .strict();

export type UserProfilesResType = z.TypeOf<typeof userProfileSchema>;
export const AssignRoleToUser = z.object({
    profileCode: z.string({
        required_error: "Mã hồ sơ là bắt buộc",
        invalid_type_error: "Mã hồ sơ phải là chuỗi",
    }),
    userName: z.string({
        required_error: "Tên đăng nhập là bắt buộc",
        invalid_type_error: "Tên đăng nhập phải là chuỗi",
    }),
    roleCode: z.string({
        required_error: "Vui lòng nhập mã vai trò",
        invalid_type_error: "Mã vai trò phải là chuỗi",
    }),
});
export type AssignRoleToUserType = z.TypeOf<typeof AssignRoleToUser>;

export const AssignRoleToUserResSchema = ResponseSchema(z.number());
export type AssignRoleToUserResType = z.infer<typeof AssignRoleToUserResSchema>;

// Additional User schemas based on API structure from api.json

// Gender enum
export const Gender = z.enum(["Male", "Female", "Other"]);
export type GenderType = z.TypeOf<typeof Gender>;

// User Status enum
export const UserStatus = z.enum(["Active", "Inactive", "Suspended"]);
export type UserStatusType = z.TypeOf<typeof UserStatus>;

// Profile DTO
export const ProfileDto = z.object({
    id: z.number().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    gender: Gender.optional(),
    // Add other profile fields as needed
});

// User Schema for API responses (matching api.json structure)
export const ApiUserSchema = z.object({
    id: z.number(),
    username: z.string(),
    email: z.string(),
    fullname: z.string(),
    status: UserStatus,
    roleId: z.number(),
    roleName: z.string(),
    createdDate: z.string().optional(),
    updatedDate: z.string().optional(),
    profile: ProfileDto.optional(),
});

export type ApiUserType = z.TypeOf<typeof ApiUserSchema>;

// User Dashboard Stats Response
export const AchievementType = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().optional(),
    // Add other achievement fields
});

export const UserDashboardStats = z.object({
    totalCourses: z.number(),
    completedCourses: z.number(),
    inProgressCourses: z.number(),
    totalStudyHours: z.number(),
    streak: z.number(),
    achievements: z.array(AchievementType),
});

export const UserDashboardStatsRes = z.object({
    message: z.string(),
    succeeded: z.boolean(),
    data: UserDashboardStats,
    code: z.number(),
});

export type UserDashboardStatsResType = z.TypeOf<typeof UserDashboardStatsRes>;

// Paginated User Response
export const UserPaginatedData = z.object({
    data: z.array(ApiUserSchema),
    totalPages: z.number(),
    totalCount: z.number(),
    pageSize: z.number(),
});

// User List Response
export const ApiUserListRes = z.object({
    message: z.string(),
    succeeded: z.boolean(),
    data: UserPaginatedData,
    code: z.number(),
});

export type ApiUserListResType = z.TypeOf<typeof ApiUserListRes>;

// User Single Response
export const ApiUserRes = z.object({
    message: z.string(),
    succeeded: z.boolean(),
    data: ApiUserSchema,
    code: z.number(),
});

export type ApiUserResType = z.TypeOf<typeof ApiUserRes>;

// Create User Body
export const CreateUserBody = z
    .object({
        username: z
            .string({ required_error: "Vui lòng nhập tên đăng nhập" })
            .trim()
            .min(1, { message: "Tên đăng nhập không được để trống" })
            .max(50, { message: "Tên đăng nhập không được vượt quá 50 ký tự" }),
        email: z
            .string({ required_error: "Vui lòng nhập email" })
            .email({ message: "Email không đúng định dạng" }),
        password: z
            .string({ required_error: "Vui lòng nhập mật khẩu" })
            .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
        firstName: z
            .string({ required_error: "Vui lòng nhập họ" })
            .trim()
            .min(1, { message: "Họ không được để trống" }),
        lastName: z
            .string({ required_error: "Vui lòng nhập tên" })
            .trim()
            .min(1, { message: "Tên không được để trống" }),
        gender: Gender.optional(),
        roleId: z.number({ required_error: "Vui lòng chọn vai trò" }),
    })
    .strict();

export type CreateUserBodyType = z.TypeOf<typeof CreateUserBody>;

// Update User Body
export const UpdateUserBody = z
    .object({
        id: z.number(),
        username: z
            .string()
            .trim()
            .min(1, { message: "Tên đăng nhập không được để trống" })
            .max(50, { message: "Tên đăng nhập không được vượt quá 50 ký tự" })
            .optional(),
        email: z
            .string()
            .email({ message: "Email không đúng định dạng" })
            .optional(),
        password: z
            .string()
            .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
            .optional(),
        firstName: z
            .string()
            .trim()
            .min(1, { message: "Họ không được để trống" })
            .optional(),
        lastName: z
            .string()
            .trim()
            .min(1, { message: "Tên không được để trống" })
            .optional(),
        gender: Gender.optional(),
        roleId: z.number().optional(),
        status: UserStatus.optional(),
    })
    .strict();

export type UpdateUserBodyType = z.TypeOf<typeof UpdateUserBody>;

// Filter User Type
export const FilterUserSchema = z.object({
    keyword: z.string().optional(),
});

export type FilterUserType = z.TypeOf<typeof FilterUserSchema>;

// Simple User DTO for lists/dropdowns
export const GetAllUsersDto = z.object({
    id: z.number(),
    username: z.string(),
    email: z.string(),
    fullname: z.string(),
    roleName: z.string().optional(),
});

export const GetAllUsersRes = z.object({
    message: z.string(),
    succeeded: z.boolean(),
    data: z.array(GetAllUsersDto),
    code: z.number(),
});

export type GetAllUsersResType = z.TypeOf<typeof GetAllUsersRes>;

// Result type for create/update/delete operations
export const UserOperationRes = z.object({
    message: z.string(),
    succeeded: z.boolean(),
    data: z.number(), // Returns ID
    code: z.number(),
});

export type UserOperationResType = z.TypeOf<typeof UserOperationRes>;
