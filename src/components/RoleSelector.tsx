"use client";

import { useEffect, useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAssignRoleToUserMutation, useGetAllRoleQuery } from "@/queries/useRole";
import { RoleType } from "@/schemaValidations/role.schema";
import { toast } from "@/hooks/use-toast";

interface IRoleSelectorProps {
    profileCode?: string;
    userName?: string;
    roleList: { code?: string; displayName?: string }[];
}

export default function RoleSelector({profileCode, userName, roleList}: IRoleSelectorProps) {
    const getAllRoleQuery = useGetAllRoleQuery();
    const assignRoleToUserMutation = useAssignRoleToUserMutation();
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState<{ code?: string; displayName?: string }[]>([]);

    const handleAddRole = async (role: RoleType) => {
        if (assignRoleToUserMutation.isPending) return;
        if (!profileCode || !userName || !role.code) return;
        try {
            const result = await assignRoleToUserMutation.mutateAsync({
                profileCode,
                userName,
                roleCode: role.code,
            });
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
    const toggleRole = (role: RoleType) => {
        setSelectedRoles((prev) => {
            const exists = prev.find((r) => r.code === role.code);
            if (exists) {
                return prev.filter((r) => r.code !== role.code);
            } else {
                return [...prev, {code: role.code, displayName: role.displayName}];
            }
        });
    };

    const displayedRoles = selectedRoles.slice(0, 1);
    const remainingCount = selectedRoles.length - displayedRoles.length;
    const {data: roleData}: { data: RoleType[]; totalCount: number } = getAllRoleQuery.data ?? {
        data: [],
        totalCount: 0,
    };
    useEffect(() => {
        setSelectedRoles(roleList);
    },[roleList])
    return (
        <div className="flex items-center group space-x-1 relative">
            {displayedRoles.map((role) => {
                const roleOption = roleData.find((r) => r.code === role.code);
                return (
                    <div
                        key={role.code}
                        className={`inline-flex items-center gap-1 px-2 rounded-md text-[10px] font-bold text-white ${roleOption?.color ?? "bg-gray-500"}`}
                    >
                        <span className="w-2 h-2 rounded-full bg-white/30"/>
                        <span>{role.displayName ?? role.code}</span>
                    </div>
                );
            })}

            {remainingCount >= 0 && (
                <span className="ml-1 p-[6px] rounded-sm bg-gray-200 text-gray-800 text-[9px] font-medium leading-none">
                    +{remainingCount}
                </span>
            )}

            {(isPopoverOpen || true) && (
                <div
                    className={`group-hover:opacity-100 ${isPopoverOpen ? "opacity-100" : "opacity-0"} transition-opacity duration-200`}>
                    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                className="w-6 h-6 px-2 py-1 text-[14px] text-white font-bold border rounded-md border-white bg-primary"
                            >
                                +
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 space-y-2 bg-white shadow-lg">
                            {roleData.map((role) => {
                                const isChecked = selectedRoles.some((r) => r.code === role.code);
                                return (
                                    <div
                                        key={role.code}
                                        className="flex items-center justify-between hover:bg-muted p-1 rounded"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className={`w-3 h-3 rounded-full ${role.color ?? "bg-gray-400"}`}/>
                                            <span>{role.displayName ?? role.code}</span>
                                        </div>
                                        <Checkbox
                                            checked={isChecked}
                                            onCheckedChange={() => {
                                                handleAddRole(role);
                                                toggleRole(role);
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </PopoverContent>
                    </Popover>
                </div>
            )}
        </div>
    );
}
