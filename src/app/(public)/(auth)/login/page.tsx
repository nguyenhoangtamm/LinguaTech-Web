import AuthWrapper from "@/app/shared/auth-layout/auth-wrapper";
import { metaObject } from "@/config/site.config";
import LoginForm from "@/app/(public)/(auth)/login/login-form";

export const metadata = {
  ...metaObject("Đăng nhập"),
};

export default function LoginPage() {
  return <LoginForm />;
}
