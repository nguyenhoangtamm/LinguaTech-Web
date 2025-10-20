import { TreeViewMenuItemType } from "@/schemaValidations/menu.schema";

export interface FlatTreeItem {
    id: number;
    name: string;
    parent: number | null;
    children: number[];
    metadata: {
        icon?: string;
    };
}


const ROOT_ID = 0;

export function flattenMenuWithRoot(data: TreeViewMenuItemType[]): FlatTreeItem[] {
    const flattenedChildren = data.flatMap((item) =>
        flattenMenu(item, ROOT_ID)
    );

    const root: FlatTreeItem = {
        id: ROOT_ID,
        name: "Root",
        parent: null,
        children: data.map((item) => item.id),
        metadata: {}, // Root không có icon
    };

    return [root, ...flattenedChildren];
}

function flattenMenu(item: TreeViewMenuItemType, parent: number | null): FlatTreeItem[] {
    const current: FlatTreeItem = {
        id: item.id,
        name: item.name,
        parent: parent,
        children: item.children?.map((child) => child.id) || [],
        metadata: {
            icon: item.icon,
        },
    };

    const children = item.children?.flatMap((child) => flattenMenu(child, item.id)) || [];

    return [current, ...children];
}