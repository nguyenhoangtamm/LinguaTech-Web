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
import { RegisterBody, RegisterBodyType } from "@/schemaValidations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@/queries/useAuth";
import { useToast } from "@/hooks/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputPicker } from "rsuite";
import { Loader2, Eye, EyeOff, Mail, User, Lock, Phone, MapPin, Calendar } from "lucide-react";
import { routes } from "@/config/routes";
import Link from "next/link";

const genderOptions = [
    { label: "Nam", value: "male" },
    { label: "Nữ", value: "female" },
    { label: "Khác", value: "other" }
];

export default function RegisterForm() {
    const registerMutation = useRegisterMutation();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const form = useForm<RegisterBodyType>({
        resolver: zodResolver(RegisterBody),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            userName: "",
            fullname: "",
            gender: "",
            birthDate: "",
            address: "",
            phoneNumber: "",
        },
    });

    async function onSubmit(values: RegisterBodyType) {
        if (registerMutation.isPending) return;
        try {
            setIsLoading(true);
            const result = await registerMutation.mutateAsync(values);
            toast({
                title: "Đăng ký thành công!",
                description: "Tài khoản của bạn đã được tạo. Vui lòng đăng nhập để tiếp tục.",
                variant: "success",
            });
            router.push("/login");
        } catch (error: any) {
            toast({
                title: "Đăng ký thất bại",
                description: error.message || "Có lỗi xảy ra khi đăng ký tài khoản",
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
            {/* Cột trái - Branding */}
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
                    <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold transform -rotate-12">
                        Mới!
                    </div>
                </div>
                <div className="mt-8 text-center">
                    <h1 className="text-4xl font-bold mb-4">Chào mừng đến với LinguaTech!</h1>
                    <p className="text-xl text-blue-100 mb-6">
                        Tham gia cộng đồng học tập và phát triển ngôn ngữ hàng đầu
                    </p>
                    <div className="space-y-4 text-blue-100">
                        <div className="flex items-center justify-center space-x-3">
                            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                            <span>Khóa học chất lượng cao</span>
                        </div>
                        <div className="flex items-center justify-center space-x-3">
                            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                            <span>Cộng đồng học viên tích cực</span>
                        </div>
                        <div className="flex items-center justify-center space-x-3">
                            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                            <span>Công nghệ học tập hiện đại</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cột phải - Form đăng ký */}
            <div className="w-full lg:w-1/2 flex items-start justify-center p-4 lg:p-8 overflow-y-auto">
                <div className="w-full max-w-2xl space-y-4">
                    {/* Header */}
                    <div className="text-center">
                        <div className="lg:hidden mb-4">
                            <Image
                                src="/ltlogo.png"
                                alt="LinguaTech"
                                width={100}
                                height={75}
                                className="mx-auto rounded-lg"
                            />
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Tạo tài khoản mới</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Điền thông tin bên dưới để tạo tài khoản
                        </p>
                    </div>

                    {/* Form */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                            {/* Row 1: Email & Username */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* Email */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 font-medium text-sm">Email *</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                                                    <Input
                                                        placeholder="Nhập email"
                                                        {...field}
                                                        className="pl-9 h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                        type="email"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-red-500 text-xs" />
                                        </FormItem>
                                    )}
                                />

                                {/* Tên người dùng */}
                                <FormField
                                    control={form.control}
                                    name="userName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 font-medium text-sm">Tên người dùng *</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                                                    <Input
                                                        placeholder="Nhập tên người dùng"
                                                        {...field}
                                                        className="pl-9 h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-red-500 text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Row 2: Fullname & Gender */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* Họ và tên */}
                                <FormField
                                    control={form.control}
                                    name="fullname"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 font-medium text-sm">Họ và tên *</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                                                    <Input
                                                        placeholder="Nhập họ và tên"
                                                        {...field}
                                                        className="pl-9 h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-red-500 text-xs" />
                                        </FormItem>
                                    )}
                                />

                                {/* Giới tính */}
                                <FormField
                                    control={form.control}
                                    name="gender"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 font-medium text-sm">Giới tính *</FormLabel>
                                            <FormControl>
                                                <InputPicker
                                                    data={genderOptions}
                                                    valueKey="value"
                                                    labelKey="label"
                                                    placeholder="Chọn giới tính"
                                                    value={field.value || null}
                                                    onChange={(value) => field.onChange(value || "")}
                                                    searchable={false}
                                                    style={{ width: "100%", height: 36 }}
                                                    className="text-sm"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-500 text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Row 3: BirthDate & Phone */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* Ngày sinh */}
                                <FormField
                                    control={form.control}
                                    name="birthDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 font-medium text-sm">Ngày sinh *</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                                                    <Input
                                                        placeholder="Chọn ngày sinh"
                                                        {...field}
                                                        type="date"
                                                        className="pl-9 h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                        onChange={(e) => {
                                                            const date = new Date(e.target.value);
                                                            field.onChange(date.toISOString());
                                                        }}
                                                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-red-500 text-xs" />
                                        </FormItem>
                                    )}
                                />

                                {/* Số điện thoại */}
                                <FormField
                                    control={form.control}
                                    name="phoneNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 font-medium text-sm">Số điện thoại *</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                                                    <Input
                                                        placeholder="Nhập số điện thoại"
                                                        {...field}
                                                        className="pl-9 h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-red-500 text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Row 4: Address (full width) */}
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 font-medium text-sm">Địa chỉ *</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                                                <Input
                                                    placeholder="Nhập địa chỉ"
                                                    {...field}
                                                    className="pl-9 h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-xs" />
                                    </FormItem>
                                )}
                            />

                            {/* Row 5: Password & Confirm Password */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* Mật khẩu */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 font-medium text-sm">Mật khẩu *</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                                                    <Input
                                                        placeholder="Nhập mật khẩu"
                                                        type={showPassword ? "text" : "password"}
                                                        {...field}
                                                        className="pl-9 pr-9 h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-red-500 text-xs" />
                                        </FormItem>
                                    )}
                                />

                                {/* Xác nhận mật khẩu */}
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 font-medium text-sm">Xác nhận mật khẩu *</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                                                    <Input
                                                        placeholder="Nhập lại mật khẩu"
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        {...field}
                                                        className="pl-9 pr-9 h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    >
                                                        {showConfirmPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-red-500 text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-10 bg-gradient-to-r from-[#072442] to-[#0a2d55] hover:from-[#0a2d55] hover:to-[#072442] text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl mt-4"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Đang tạo tài khoản...
                                    </>
                                ) : (
                                    "Tạo tài khoản"
                                )}
                            </Button>
                        </form>
                    </Form>

                    {/* Footer */}
                    <div className="text-center">
                        <p className="text-gray-600">
                            Đã có tài khoản?{" "}
                            <Link
                                href="/login"
                                className="font-medium text-[#072442] hover:text-[#0a2d55] transition-colors duration-200"
                            >
                                Đăng nhập ngay
                            </Link>
                        </p>
                    </div>

                    {/* Terms */}
                    <div className="text-center">
                        <p className="text-xs text-gray-500">
                            Bằng việc tạo tài khoản, bạn đồng ý với{" "}
                            <Link href="/terms" className="text-[#072442] hover:underline">
                                Điều khoản dịch vụ
                            </Link>{" "}
                            và{" "}
                            <Link href="/privacy" className="text-[#072442] hover:underline">
                                Chính sách bảo mật
                            </Link>{" "}
                            của chúng tôi.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}