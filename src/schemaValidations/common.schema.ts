import z from 'zod'
import {AttendanceHistorySchema} from "@/schemaValidations/attendace.schema";

export const MessageRes = z
  .object({
    message: z.string()
  })
  .strict()

export type MessageResType = z.TypeOf<typeof MessageRes>

export const SelectOption = z.object({
  label: z.string(), value: z.string()
})

export type SelectOptionType = z.TypeOf<typeof SelectOption>

export const DepartmentSchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    parentId: z.string()
})

export const DepartmentListRes = z.object({
    data: z.array(DepartmentSchema),
    message: z.string()
})

export type DepartmentListResType = z.TypeOf<typeof DepartmentListRes>


export const UserDepartmentSchema = z.object({
    userName: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    fullName: z.string(),
    createdAt: z.string()
})

export const UserDepartmentListRes = z.object({
    data: z.array(UserDepartmentSchema),
    message: z.string()
})

export type UserDepartmentListResType = z.TypeOf<typeof UserDepartmentListRes>


export const ResponseSchema = <T extends z.ZodTypeAny>(schema: T) =>
    z.object({
        data: schema,
        message: z.string(),
    });

export const ResponseTableSchema = <T extends z.ZodTypeAny>(schema: T) =>
    z.object({
        data: schema,
        totalCount: z.number(),
        message: z.string(),
    });
