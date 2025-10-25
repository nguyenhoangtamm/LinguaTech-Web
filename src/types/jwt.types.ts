import { Role, TokenType } from "@/constants/type";

export type TokenTypeValue = (typeof TokenType)[keyof typeof TokenType];
export type RoleType = (typeof Role)[keyof typeof Role];
export interface TokenPayload {
    userId: number;
    RoleId: number; // 1 = Admin, 2 = User
    role?: RoleType; // Có thể không có trong token
    tokenType: TokenTypeValue;
    exp: number;
    iat: number;
}

export interface TableTokenPayload {
    iat: number;
    number: number;
    tokenType: (typeof TokenType)["TableToken"];
}
