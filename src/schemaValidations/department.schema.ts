import z from "zod";

export const DepartmentSchema = z.object({
  id: z.number({
    required_error: "Vui lòng nhập mã phòng ban",
    invalid_type_error: "Mã phòng ban phải là số",
  }),
  name: z
    .string({
      required_error: "Vui lòng nhập tên phòng ban",
      invalid_type_error: "Tên phòng ban phải là chuỗi",
    })
    .trim()
    .min(2, "Tên phòng ban phải có ít nhất 2 ký tự")
    .max(256, "Tên phòng ban không được vượt quá 256 ký tự"),

  code: z
    .string({
      required_error: "Mã phòng ban là bắt buộc",
      invalid_type_error: "Mã phòng ban phải là chuỗi",
    })
    .trim()
    .min(2, "Mã phòng ban phải có ít nhất 2 ký tự")
    .max(256, "Mã phòng ban không được vượt quá 256 ký tự"),

  parentId: z
    .number({
      invalid_type_error: "Phòng ban chính phải là số",
    })
    .optional(),
});

export type DepartmentType = z.TypeOf<typeof DepartmentSchema>;

export const DepartmentListRes = z.object({
  data: z.array(DepartmentSchema),
  totalCount: z.number(),
  message: z.string(),
});

export type DepartmentListResType = z.TypeOf<typeof DepartmentListRes>;

export const DepartmentRes = z
  .object({
    data: DepartmentSchema,
    message: z.string(),
  })
  .strict();

export type DepartmentResType = z.TypeOf<typeof DepartmentRes>;

export const CreateDepartmentBody = z
  .object({
    name: z
      .string({
        required_error: "Vui lòng nhập tên phòng ban",
        invalid_type_error: "Tên phòng ban phải là chuỗi",
      })
      .trim()
      .min(2, "Tên phòng ban phải có ít nhất 2 ký tự")
      .max(256, "Tên phòng ban không được vượt quá 256 ký tự"),
    description: z.string().optional(),
    order: z
      .number({
        required_error: "Vui lòng chọn thứ tự",
        invalid_type_error: "Thứ tự hiển thị phải là số nguyên",
      })
      .int("Thứ tự hiển thị phải là số nguyên"),

    url: z
      .string({
        invalid_type_error: "URL phải là chuỗi",
      })
      .optional(),

    icon: z.string().optional(),
    isTargetBlank: z.boolean().optional(),
    parentId: z
      .number({ invalid_type_error: "Mã phòng ban chính phải là số" })
      .optional(),
  })
  .strict();

export type CreateDepartmentBodyType = z.TypeOf<typeof CreateDepartmentBody>;

export const UpdateDepartmentBody = z
  .object({
    name: z
      .string({
        required_error: "Vui lòng nhập tên phòng ban",
        invalid_type_error: "Tên phòng ban phải là chuỗi",
      })
      .trim()
      .min(2, "Tên phòng ban phải có ít nhất 2 ký tự")
      .max(256, "Tên phòng ban không được vượt quá 256 ký tự"),

    description: z.string().optional(),
    order: z
      .number({
        required_error: "Vui lòng nhập thứ tự",
        invalid_type_error: "Thứ tự hiển thị phải là số nguyên",
      })
      .int("Thứ tự hiển thị phải là số nguyên"),

    url: z
      .string({
        invalid_type_error: "URL phải là chuỗi",
      })
      .optional(),

    icon: z
      .string({
        invalid_type_error: "Icon phải là chuỗi",
      })
      .optional(),

    isTargetBlank: z.boolean().optional(),

    parentId: z
      .number({
        invalid_type_error: "Mã phòng ban chính phải là số",
      })
      .optional(),
  })
  .strict();

export type UpdateDepartmentBodyType = z.TypeOf<typeof UpdateDepartmentBody>;

export const FilterDepartment = z.object({
  keywords: z.string().optional(),
});

export type FilterDepartmentType = z.TypeOf<typeof FilterDepartment>;
