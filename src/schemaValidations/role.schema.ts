import z from "zod";
import { ResponseSchema } from "@/schemaValidations/common.schema";

export const RoleSchema = z.object({
  id: z.number(),
  code: z.string().optional(),
  name: z
    .string()
    .trim()
    .min(1, { message: "Vui lòng không để trống tên" })
    .max(256, {
      message: "Tên không vượt qúa 256 kí tự. Vui lòng thử lại",
    }),
  description: z.string().optional(),
  displayName: z
    .string({
      invalid_type_error: "Tên hiển thị phải là chuỗi",
    })
    .optional(),

  order: z
    .number({
      required_error: "Vui lòng chọn thứ tự",
      invalid_type_error: "Thứ tự phải là số nguyên",
    })
    .int({ message: "Thứ tự phải là số nguyên" }),

  priority: z.boolean({
    required_error: "Vui lòng chọn mức độ ưu tiên",
  }),

  color: z
    .string({
      invalid_type_error: "Màu sắc phải là chuỗi",
    })
    .optional(),
});

export type RoleType = z.TypeOf<typeof RoleSchema>;

export const RoleListRes = z.object({
  data: z.array(RoleSchema),
  totalCount: z.number(),
  message: z.string(),
});

export type RoleListResType = z.TypeOf<typeof RoleListRes>;

export const RoleRes = z
  .object({
    data: RoleSchema,
    message: z.string(),
  })
  .strict();

export type RoleResType = z.TypeOf<typeof RoleRes>;

export const CreateRoleBody = z
  .object({
      name: z
        .string({ required_error: "Vui lòng không để trống tên" })
        .trim()
        .max(256, { message: "Tên không vượt quá 256 kí tự. Vui lòng thử lại" })
        .refine(val => val !== "", { message: "Vui lòng không để trống tên" }),
      description: z
        .string({ required_error: "Vui lòng không để trống mô tả" })
        .min(2, { message: "Tên phải có ít nhất 2 ký tự" })
        .refine(val => val !== "", { message: "Vui lòng không để trống mô tả" }),
      displayName: z
        .string({ required_error: "Vui lòng không để trống tên hiển thị" })
        .trim()
        .max(256, { message: "Tên hiển thị không vượt quá 256 kí tự. Vui lòng thử lại" })
        .refine(val => val !== "", { message: "Vui lòng không để trống tên hiển thị" }),
      code: z
        .string({ required_error: "Vui lòng không để trống mã" })
        .refine(val => val !== "", { message: "Vui lòng không để trống mã" }),
      priority: z.boolean({ required_error: "Vui lòng chọn mức độ ưu tiên" }),
      order: z.number().optional(),
      color: z
        .string({ required_error: "Vui lòng không để trống màu sắc" })
        .optional()
        .refine(val => val !== "", { message: "Vui lòng không để trống màu sắc" }),
    })
  .strict();

export type CreateRoleBodyType = z.TypeOf<typeof CreateRoleBody>;

export const UpdateRoleBody = z
 .object({
      name: z
        .string({ required_error: "Vui lòng không để trống tên" })
        .trim()
        .max(256, { message: "Tên không vượt quá 256 kí tự. Vui lòng thử lại" })
        .refine(val => val !== "", { message: "Vui lòng không để trống tên" }),
      description: z
        .string({ required_error: "Vui lòng không để trống mô tả" })
        .min(2, { message: "Tên phải có ít nhất 2 ký tự" })
        .refine(val => val !== "", { message: "Vui lòng không để trống mô tả" }),
      displayName: z
        .string({ required_error: "Vui lòng không để trống tên hiển thị" })
        .trim()
        .max(256, { message: "Tên hiển thị không vượt quá 256 kí tự. Vui lòng thử lại" })
        .refine(val => val !== "", { message: "Vui lòng không để trống tên hiển thị" }),
      code: z
        .string({ required_error: "Vui lòng không để trống mã" })
        .refine(val => val !== "", { message: "Vui lòng không để trống mã" }),
      priority: z.boolean({ required_error: "Vui lòng chọn mức độ ưu tiên" }),
      order: z.number().optional(),
      color: z
        .string({ required_error: "Vui lòng không để trống màu sắc" })
        .optional()
        .refine(val => val !== "", { message: "Vui lòng không để trống màu sắc" }),
    })
  .strict();

export type UpdateRoleBodyType = z.TypeOf<typeof UpdateRoleBody>;

export const FilterRole = z.object({
  keywords: z.string().optional(),
});

export type FilterRoleType = z.TypeOf<typeof FilterRole>;

export const ConfigMenuWithRoleResSchema = ResponseSchema(z.array(z.string()));
export type ConfigMenuWithRoleResType = z.infer<
  typeof ConfigMenuWithRoleResSchema
>;

export const ActionConfigMenuWithRoleSchema = z
  .object({
    roleId: z.number(),
    menuIds: z.array(z.number()),
  })
  .strict();

export type ActionConfigMenuWithRoleType = z.infer<
  typeof ActionConfigMenuWithRoleSchema
>;

export const BaseRoleResSchema = z.object({
  code: z.string().optional(),
  displayName: z.string().optional(),
});

export const GetAllConfigPermissions = z.object({
  group: z.string(),
  permissions: z.array(z.string()),
});
export type GetAllConfigPermissionsType = z.infer<
  typeof GetAllConfigPermissions
>;
export const RolePermissionListRes = z.object({
  data: z.array(GetAllConfigPermissions),
  totalCount: z.number(),
  message: z.string(),
});
export type RolePermissionListResType = z.infer<typeof RolePermissionListRes>;
export const RolePermissionsByRoleIdRes = z.object({
  data: z.array(z.string()),
  message: z.string(),
});
export type RolePermissionsByRoleIdResType = z.infer<
  typeof RolePermissionsByRoleIdRes
>;

export const ActionConfigPermissionWithRoleSchema = z
  .object({
    roleId: z.number(),
    PermissionNames: z.array(z.string()),
  })
  .strict();
export type ActionConfigPermissionWithRoleType = z.infer<
  typeof ActionConfigPermissionWithRoleSchema
>;
