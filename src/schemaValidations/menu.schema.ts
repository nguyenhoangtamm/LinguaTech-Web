import z from "zod";

export const MenuSchema = z.object({
    id: z.number(),
    name: z.string().trim().min(2).max(256),
    description: z.string().optional(),
    order: z.number().int(),
    url: z.string().optional(),
    icon: z.string().optional(),
    isTargetBlank: z.boolean().optional(),
    parentId: z.number().optional(),
});

export type MenuType = z.TypeOf<typeof MenuSchema>;

export const MenuListRes = z.object({
    data: z.array(MenuSchema),
    totalCount: z.number(),
    message: z.string(),
});

export type MenuListResType = z.TypeOf<typeof MenuListRes>;

export const MenuRes = z
    .object({
        data: MenuSchema,
        message: z.string(),
    })
    .strict();

export type MenuResType = z.TypeOf<typeof MenuRes>;

export const CreateMenuBody = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, { message: "Vui lòng nhập tên menu" })
            .max(256),
        description: z.string().optional(),
        order: z.number({ message: "Vui lòng nhập thứ tự menu" }),
        url: z.string().optional(),
        icon: z.string().optional(),
        isTargetBlank: z.boolean().optional(),
        parentId: z.number().optional(),
    })
    .strict();

export type CreateMenuBodyType = z.TypeOf<typeof CreateMenuBody>;

export const UpdateMenuBody = z
    .object({
        name: z.string().trim().min(2).max(256),
        description: z.string().optional(),
        order: z.number().int(),
        url: z.string().optional(),
        icon: z.string().optional(),
        isTargetBlank: z.boolean().optional(),
        parentId: z.number().optional(),
    })
    .strict();

export type UpdateMenuBodyType = z.TypeOf<typeof UpdateMenuBody>;

export const FilterMenu = z.object({
    keywords: z.string().optional(),
});

export type FilterMenuType = z.TypeOf<typeof FilterMenu>;

export const TreeViewMenuItem: z.ZodType<{
    id: number;
    name: string;
    icon?: string;
    children?: Array<any>;
}> = z.object({
    id: z.number(),
    name: z.string().trim().min(2).max(256),
    icon: z.string().optional(),
    children: z.array(z.lazy(() => TreeViewMenuItem)).optional(),
});
export type TreeViewMenuItemType = z.TypeOf<typeof TreeViewMenuItem>;
export const TreeViewMenu = z.object({
    data: z.array(TreeViewMenuItem),
    message: z.string(),
});
export type TreeViewMenuType = z.TypeOf<typeof TreeViewMenu>;

export const MenuItemByUerRole: z.ZodType<{
    id: number;
    name: string;
    icon?: string;
    url?: string;
    isBlank?: boolean;
    parentId?: number;
    children?: Array<any>;
}> = z.object({
    id: z.number(),
    name: z.string().trim().min(1),
    icon: z.string().optional(),
    url: z.string().optional(),
    isBlank: z.boolean().optional(),
    parentId: z.number().optional(),
    children: z.array(z.lazy((): z.ZodTypeAny => MenuItemByUerRole)).optional(),
});

export type MenuItemType = z.TypeOf<typeof MenuItemByUerRole>;
export const MenuItemByUerRoleList = z.object({
    data: z.array(MenuItemByUerRole),
    message: z.string(),
});

export type MenuItemByUserRoleListType = z.TypeOf<typeof MenuItemByUerRoleList>;
