"use client";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/components/app-provider";
import { useLoginMutation } from "@/queries/useAuth";
import { useToast } from "@/hooks/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { routes } from "@/config/routes";
import Link from "next/link";

export default function LoginForm() {
  const loginMutation = useLoginMutation();
  const { setIsAuth } = useAppContext();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      UsernameOrEmail: "",
      password: "",
    },
  });
  async function onSubmit(values: LoginBodyType) {
    if (loginMutation.isPending) return;
    try {
      setIsLoading(true);
      const result = await loginMutation.mutateAsync(values);
      toast({
        title: "Thông báo",
        description: result?.message,
        variant: "success",
      });
      setIsAuth(true);
      router.push(routes.manage.roles);
    } catch (error: any) {
      toast({
        title: "Thông báo lỗi",
        description: error.message,
        variant: "danger",
      });
      setIsLoading(false);
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* cột trái */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#072442] to-[#0a2d55] text-white flex-col justify-center items-center p-10">
        <div className="relative">
          <div className="bg-white p-4 rounded-lg shadow-lg transform rotate-6">

            <Image
              src="/ltlogo.png"
              alt="LinguaTech"
              width={200}
              height={150}
              className="rounded-lg"
            />
          </div>
          <div className="absolute inset-0 border-2 border-white transform -rotate-6 rounded-lg"></div>
        </div>
        <h1 className="text-4xl font-bold mt-8 text-white">
          LinguaTech
        </h1>
        <p className="text-sm opacity-70 mt-2 text-center">
          Công nghệ - Ngôn ngữ - Đổi mới
        </p>
      </div>

      {/* cột phải */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-10 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center">
            <Link href={'/'} className=" inline-block max-w-[240px] lg:mb-9">
              <Image src='/ltlogo.png' width={280} height={280} alt="LinguaTech" className="dark:invert" />
            </Link>
          </div>
          <h2 className="text-2xl font-semibold text-blue-900 mb-5 text-center">
            LinguaTech - Quản lý dự án ngôn ngữ
          </h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 max-w-[600px] flex-shrink-0 w-full"
              noValidate
            >
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-gray-50 px-2 text-gray-500">
                    Đăng nhập
                  </span>
                </div>
              </div>

              <FormField
                control={form.control}
                name="UsernameOrEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên đăng nhập hoặc Email</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Nhập tên đăng nhập hoặc email"
                        required
                        className="h-11"
                        autoComplete="username email"
                        {...field}
                      />
                    </FormControl>
                    <div className="text-xs text-gray-500 mt-1">
                      Bạn có thể sử dụng tên đăng nhập hoặc địa chỉ email
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Mật khẩu</FormLabel>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Nhập vào mật khẩu"
                          required
                          className="h-11"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                disabled={isLoading}
                type="submit"
                className="w-full h-11 font-bold bg-primary hover:bg-primary/90 text-white rounded-md "
              >
                {isLoading ? <Loader2 className="animate-spin" /> : null}
                Đăng Nhập
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
