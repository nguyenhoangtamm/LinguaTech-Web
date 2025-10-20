'use client';

import React, { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { SelectPicker } from 'rsuite';
import { Button } from '@/components/ui/button';
import { Folder, FolderOpen, File, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConfigMenuWithRole, useGetAllRoleQuery, useGetConfigMenuWithRoleQuery } from "@/queries/useRole";
import {
    ActionConfigMenuWithRoleType,
    RoleType,
} from "@/schemaValidations/role.schema";
import { useGetTreeViewMenuQuery } from "@/queries/useMenu";
import { TreeViewMenuItemType } from "@/schemaValidations/menu.schema";
import { toast } from '@/hooks/use-toast';

function collectAllIds(node: TreeViewMenuItemType): string[] {
    let ids = [node.id.toString()];
    if (node.children) {
        for (const child of node.children) {
            ids = [...ids, ...collectAllIds(child)];
        }
    }
    return ids;
}

function collectAllExpandableIds(nodes: TreeViewMenuItemType[]): Set<string> {
    const ids = new Set<string>();
    const recurse = (nodeList: TreeViewMenuItemType[]) => {
        for (const node of nodeList) {
            if (node.children) {
                ids.add(node.id.toString());
                recurse(node.children);
            }
        }
    };
    recurse(nodes);
    return ids;
}

export default function RoleMenuTree() {
    const [selectedRole, setSelectedRole] = useState<string | undefined>();
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const configMenuMutation = useConfigMenuWithRole();
    const getAllRoleQuery = useGetAllRoleQuery();
    const getTreeViewMenuQuery = useGetTreeViewMenuQuery();
    const getConfigMenuWithRole = useGetConfigMenuWithRoleQuery({ id: selectedRole });
    const { data: roleData }: { data: RoleType[]; totalCount: number } =
        getAllRoleQuery.data ?? {
            data: [],
            totalCount: 0,
        };

    const dataMenuConfigs = getConfigMenuWithRole.data?.data;

    const { data: menuData }: { data: TreeViewMenuItemType[]; } =
        getTreeViewMenuQuery.data ?? {
            data: [],
        };
    useEffect(() => {
        setExpandedItems(collectAllExpandableIds(menuData));
    }, [menuData]);

    useEffect(() => {
        setSelectedItems(dataMenuConfigs?.map(x => x.toString()) ?? [])
    }, [dataMenuConfigs]);

    useEffect(() => {
        console.log(selectedItems);
    }, [selectedItems]);

    async function onSubmitConfigMenu() {
        if (configMenuMutation.isPending) return;
        try {
            const tempValue = { roleId: parseInt(selectedRole ?? ""), menuIds: selectedItems.map(x => parseInt(x)) };
            let body: ActionConfigMenuWithRoleType & { id: number } = { id: parseInt(selectedRole ?? ""), ...tempValue };
            const result = await configMenuMutation.mutateAsync(body);
            toast({
                title: "Thông báo",
                description: result?.message,
                variant: "success",
            });
        } catch (error: any) {
            toast({
                title: "Thông báo lỗi",
                description: error.message,
                variant: "danger",
            });
        }
    }

    const handleToggle = (node: TreeViewMenuItemType) => {
        const allNodeIds = collectAllIds(node);
        setSelectedItems((prev) => {
            const isChecked = prev.includes(node.id.toString());
            if (isChecked) {
                return prev.filter((x) => !allNodeIds.includes(x));
            } else {
                return [...new Set([...prev, ...allNodeIds])];
            }
        });
    };

    const toggleExpand = (id: string) => {
        setExpandedItems((prev) => {
            const copy = new Set(prev);
            copy.has(id) ? copy.delete(id) : copy.add(id);
            return copy;
        });
    };

    const renderTree = (nodes: TreeViewMenuItemType[]) => (
        <ul className="pl-4 space-y-1">
            {nodes && nodes.map((node) => (
                <li key={node.id} className="space-y-1">
                    <div className="flex items-center gap-2">
                        {node.children ? (
                            <button
                                onClick={() => toggleExpand(node.id.toString())}
                                className="text-muted-foreground hover:text-primary"
                            >
                                {expandedItems.has(node.id.toString()) ? <ChevronDown size={16} /> :
                                    <ChevronRight size={16} />}
                            </button>
                        ) : (
                            <div className="w-4" />
                        )}
                        {node.children ? (
                            expandedItems.has(node.id.toString()) ? (
                                <FolderOpen size={16} className="text-yellow-600" />
                            ) : (
                                <Folder size={16} className="text-yellow-600" />
                            )
                        ) : (
                            <File size={16} className="text-sky-600" />
                        )}
                        <Checkbox
                            id={node.id.toString()}
                            checked={selectedItems.includes(node.id.toString())}
                            onCheckedChange={() => handleToggle(node)}
                        />
                        <Label htmlFor={node.id.toString()} className="cursor-pointer text-sm">
                            {node.name}
                        </Label>
                    </div>
                    {node.children && (
                        <AnimatePresence initial={false}>
                            {expandedItems.has(node.id.toString()) && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="pl-6 border-l border-muted">
                                        {renderTree(node.children)}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </li>
            ))}
        </ul>
    );

    return (
        <div className="py-4 mx-auto space-y-6 flex-col">
            <div className="flex flex-row space-x-3">
                <div className="space-y-2">
                    <SelectPicker
                        data={roleData?.map((r: RoleType) => ({
                            label: r.name,
                            value: r.id.toString()
                        })) || []}
                        value={selectedRole}
                        onChange={(value) => setSelectedRole(value || undefined)}
                        placeholder="Chọn role"
                        className="w-[200px]"
                        style={{ width: '200px' }}
                    />
                </div>
                <Button onClick={() => onSubmitConfigMenu()}
                    disabled={configMenuMutation.isPending}
                >
                    {configMenuMutation.isPending ?
                        <Loader2 className="animate-spin" /> : null}
                    Lưu cấu hình
                </Button>
            </div>

            <div className=" border rounded-md p-4 shadow-sm bg-white">
                <h2 className="text-lg font-semibold mb-3">Danh sách Menu</h2>
                {renderTree(menuData)}
            </div>
        </div>
    );
}
