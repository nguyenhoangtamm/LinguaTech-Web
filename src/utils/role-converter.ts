import { Role } from "@/constants/type";
import type { RoleType } from "@/types/jwt.types";

/**
 * Ánh xạ RoleId từ token sang Role string
 * RoleId: 1 = Admin, 2 = User, 3 = Teacher
 */
export const ROLE_ID_MAP: Record<number, RoleType> = {
    1: Role.Admin,
    2: Role.User,
} as const;

/**
 * Convert RoleId (number) sang Role (string)
 */
export function convertRoleIdToRole(roleId: number): RoleType {
    const role = ROLE_ID_MAP[roleId];
    if (!role) {
        console.warn(`Unknown RoleId: ${roleId}, defaulting to User`);
        return Role.User;
    }
    return role;
}

/**
 * Convert Role (string) sang RoleId (number)
 */
export function convertRoleToRoleId(role: RoleType): number {
    const roleIdMap: Record<RoleType, number> = {
        [Role.Admin]: 1,
        [Role.User]: 2,
        [Role.Teacher]: 3,
    };
    return roleIdMap[role] ?? 2;
}
