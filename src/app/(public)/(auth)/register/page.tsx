import { metaObject } from "@/config/site.config";
import RegisterForm from "./register-form";

export const metadata = {
    ...metaObject("Đăng ký tài khoản"),
};

export default function RegisterPage() {
    return <RegisterForm />;
}