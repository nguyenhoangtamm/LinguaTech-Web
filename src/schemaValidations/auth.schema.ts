import { RoleValues } from "@/constants/type";
import z from "zod";

export const LoginBody = z
    .object({
        UsernameOrEmail: z
            .string({
                required_error: "Vui lòng nhập tên đăng nhập hoặc email",
                invalid_type_error: "Tên đăng nhập hoặc email phải là chuỗi",
            })
            .min(1, { message: "Tên đăng nhập hoặc email không được để trống" })
            .refine(
                (value) => {
                    // Kiểm tra có phải email không
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    // Kiểm tra có phải username không (chỉ chứa chữ cái, số, dấu gạch dưới, dấu chấm)
                    const usernameRegex = /^[a-zA-Z0-9_.]+$/;

                    return emailRegex.test(value) || usernameRegex.test(value);
                },
                {
                    message:
                        "Vui lòng nhập email hợp lệ hoặc tên đăng nhập hợp lệ",
                }
            ),
        password: z
            .string({
                required_error: "Vui lòng nhập mật khẩu",
                invalid_type_error: "Mật khẩu phải là chuỗi",
            })
            .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
            .max(100, { message: "Mật khẩu không được vượt quá 100 ký tự" }),
    })
    .strict();

export type LoginBodyType = z.TypeOf<typeof LoginBody>;

export const LoginRes = z.object({
    data: z.object({
        accessToken: z.string({
            required_error: "Access token không được để trống",
            invalid_type_error: "Access token phải là chuỗi",
        }),
        refreshToken: z.string({
            required_error: "Refresh token không được để trống",
            invalid_type_error: "Refresh token phải là chuỗi",
        }),
        user: z.object({
            userName: z.string({
                required_error: "Tên người dùng không được để trống",
                invalid_type_error: "Tên người dùng phải là chuỗi",
            }),
            fullName: z.string({
                required_error: "Họ và tên không được để trống",
                invalid_type_error: "Họ và tên phải là chuỗi",
            }),
            role: z.enum(RoleValues, {
                required_error: "Vai trò không được để trống",
                invalid_type_error: "Vai trò không hợp lệ",
            }),
        }),
    }),
    message: z.string({
        required_error: "Thông báo không được để trống",
        invalid_type_error: "Thông báo phải là chuỗi",
    }),
});

export type LoginResType = z.TypeOf<typeof LoginRes>;

export const RefreshTokenBody = z
    .object({
        refreshToken: z.string({
            required_error: "Refresh token không được để trống",
            invalid_type_error: "Refresh token phải là chuỗi",
        }),
    })
    .strict();

export type RefreshTokenBodyType = z.TypeOf<typeof RefreshTokenBody>;

export const RefreshTokenRes = z.object({
    data: z.object({
        accessToken: z.string({
            required_error: "Access token không được để trống",
            invalid_type_error: "Access token phải là chuỗi",
        }),
        refreshToken: z.string({
            required_error: "Refresh token không được để trống",
            invalid_type_error: "Refresh token phải là chuỗi",
        }),
    }),
    message: z.string({
        required_error: "Thông báo không được để trống",
        invalid_type_error: "Thông báo phải là chuỗi",
    }),
});

export type RefreshTokenResType = z.TypeOf<typeof RefreshTokenRes>;

export const LogoutBody = z
    .object({
        refreshToken: z.string({
            required_error: "Refresh token không được để trống",
            invalid_type_error: "Refresh token phải là chuỗi",
        }),
    })
    .strict();

export type LogoutBodyType = z.TypeOf<typeof LogoutBody>;
