import z from "zod";
import { ResponseSchema } from "@/schemaValidations/common.schema";

export const UserSchema = z.object({
  id: z.number({
    required_error: "Mã người dùng là bắt buộc",
    invalid_type_error: "Mã người dùng phải là số",
  }),

  fullName: z
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
    data: profileSchema,
    message: z.string(),
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
