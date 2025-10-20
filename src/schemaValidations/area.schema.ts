import z from 'zod'

export const AreaSchema = z.object({
    id: z.number(),
    name: z.string().min(1),
    lat: z.string().optional(),
    long: z.string().optional()
})

export type AreaType = z.TypeOf<typeof AreaSchema>

export const AreaListRes = z.object({
    data: z.array(AreaSchema),
    totalCount: z.number(),
    message: z.string()
})

export type AreaListResType = z.TypeOf<typeof AreaListRes>

export const AreaRes = z.object({
        data: AreaSchema,
        message: z.string()
    })
    .strict()

export type AreaResType = z.TypeOf<typeof AreaRes>

export const CreateAreaBody = z
    .object({
        name: z.string().trim().min(2).max(256),
        lat: z.string().optional(),
        long: z.string().optional()
    })
    .strict()

export type CreateAreaBodyType = z.TypeOf<typeof CreateAreaBody>

export const UpdateAreaBody = z
    .object({
        name: z.string().trim().min(2).max(256),
        lat: z.string().optional(),
        long: z.string().optional()
    })
    .strict()

export type UpdateAreaBodyType = z.TypeOf<typeof UpdateAreaBody>


export const FilterArea = z.object({
    keywords: z.string().optional(),
})

export type FilterAreaType = z.TypeOf<typeof FilterArea>