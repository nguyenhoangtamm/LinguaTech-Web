import z from "zod";
import { ResponseTableSchema } from "@/schemaValidations/common.schema";
import { BaseRoleResSchema } from "@/schemaValidations/role.schema";

export const ProfileSchema = z.object({
    profileCode: z.string(),
    name: z.string(),
    userName: z.string().optional(),
    subName: z.string(),
    status: z.number(),
    type: z.number(),
    avatar: z.string().optional(),
    jobTitle: z.string().optional(),
    position: z.number().optional(),
    roles: z.array(BaseRoleResSchema)
});

export type ProfileResType = z.TypeOf<typeof ProfileSchema>;

export const ProfileResSchema = ResponseTableSchema(
    z.array(ProfileSchema)
);

export type ProfileListResType = z.infer<typeof ProfileResSchema>;

export const FilterProfile = z.object({
    keywords: z.string().optional(),
});

export type FilterProfileType = z.TypeOf<typeof FilterProfile>;
