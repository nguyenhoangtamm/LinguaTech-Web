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

// Register Schema
export const RegisterBody = z
    .object({
        email: z
            .string({
                required_error: "Vui lòng nhập email",
                invalid_type_error: "Email phải là chuỗi",
            })
            .min(1, { message: "Email không được để trống" })
            .email({ message: "Email không hợp lệ" }),
        password: z
            .string({
                required_error: "Vui lòng nhập mật khẩu",
                invalid_type_error: "Mật khẩu phải là chuỗi",
            })
            .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
            .max(100, { message: "Mật khẩu không được vượt quá 100 ký tự" })
            .regex(/(?=.*[a-z])/, {
                message: "Mật khẩu phải có ít nhất 1 chữ thường",
            })
            .regex(/(?=.*[A-Z])/, {
                message: "Mật khẩu phải có ít nhất 1 chữ hoa",
            })
            .regex(/(?=.*\d)/, { message: "Mật khẩu phải có ít nhất 1 số" }),
        confirmPassword: z.string({
            required_error: "Vui lòng xác nhận mật khẩu",
            invalid_type_error: "Xác nhận mật khẩu phải là chuỗi",
        }),
        userName: z
            .string({
                required_error: "Vui lòng nhập tên người dùng",
                invalid_type_error: "Tên người dùng phải là chuỗi",
            })
            .min(3, { message: "Tên người dùng phải có ít nhất 3 ký tự" })
            .max(50, { message: "Tên người dùng không được vượt quá 50 ký tự" })
            .regex(/^[a-zA-Z0-9_.]+$/, {
                message:
                    "Tên người dùng chỉ được chứa chữ cái, số, dấu gạch dưới và dấu chấm",
            }),
        fullname: z
            .string({
                required_error: "Vui lòng nhập họ và tên",
                invalid_type_error: "Họ và tên phải là chuỗi",
            })
            .min(2, { message: "Họ và tên phải có ít nhất 2 ký tự" })
            .max(100, { message: "Họ và tên không được vượt quá 100 ký tự" }),
        gender: z
            .string({
                required_error: "Vui lòng chọn giới tính",
                invalid_type_error: "Giới tính phải là chuỗi",
            })
            .refine((value) => ["male", "female", "other"].includes(value), {
                message: "Giới tính phải là 'male', 'female' hoặc 'other'",
            }),
        birthDate: z
            .string({
                required_error: "Vui lòng nhập ngày sinh",
                invalid_type_error: "Ngày sinh phải là chuỗi",
            })
            .datetime({ message: "Ngày sinh không hợp lệ" }),
        address: z
            .string({
                required_error: "Vui lòng nhập địa chỉ",
                invalid_type_error: "Địa chỉ phải là chuỗi",
            })
            .min(5, { message: "Địa chỉ phải có ít nhất 5 ký tự" })
            .max(200, { message: "Địa chỉ không được vượt quá 200 ký tự" }),
        phoneNumber: z
            .string({
                required_error: "Vui lòng nhập số điện thoại",
                invalid_type_error: "Số điện thoại phải là chuỗi",
            })
            .min(10, { message: "Số điện thoại phải có ít nhất 10 số" })
            .max(15, { message: "Số điện thoại không được vượt quá 15 số" })
            .regex(/^[0-9+\-\s()]+$/, {
                message:
                    "Số điện thoại chỉ được chứa số và các ký tự +, -, (), khoảng trắng",
            }),
    })
    .strict()
    .refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu xác nhận không khớp",
        path: ["confirmPassword"],
    })
    .refine(
        (data) => {
            const birthDate = new Date(data.birthDate);
            const now = new Date();
            const age = now.getFullYear() - birthDate.getFullYear();
            return age >= 13 && age <= 100;
        },
        {
            message: "Tuổi phải từ 13 đến 100",
            path: ["birthDate"],
        }
    );

export type RegisterBodyType = z.TypeOf<typeof RegisterBody>;

export const RegisterRes = z.object({
    data: z.object({
        message: z.string({
            required_error: "Thông báo không được để trống",
            invalid_type_error: "Thông báo phải là chuỗi",
        }),
    }),
    message: z.string({
        required_error: "Thông báo không được để trống",
        invalid_type_error: "Thông báo phải là chuỗi",
    }),
});

export type RegisterResType = z.TypeOf<typeof RegisterRes>;
