import { z } from "zod";

export const FileUploadSchema = z.object({
    id: z.string(),
});
export type FileUploadType = z.infer<typeof FileUploadSchema>;

