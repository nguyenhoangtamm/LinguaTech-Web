import { z } from "zod";

export const UserProfileSchema = z.object({
  userName: z.string(),
  fullName: z.string().optional(),
  email: z.string().email().optional(),
});
export type UserProfileSchemaType = z.infer<typeof UserProfileSchema>;

export const UserProfileResultShema = z.object({
  isSuccess: z.boolean(),
  data: UserProfileSchema.nullable(),
  errorMessage: z.string().nullable(),
});
export type UserProfileResultShemaType = z.infer<typeof UserProfileResultShema>;
