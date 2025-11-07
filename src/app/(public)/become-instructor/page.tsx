"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
    ArrowLeft,
    Upload,
    Loader2,
    GraduationCap,
    Award,
    BookOpen,
    Users,
    Star,
    CheckCircle
} from "lucide-react";
import Link from "next/link";
import { routes } from "@/config/routes";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface InstructorApplicationData {
    fullName: string;
    email: string;
    phone: string;
    bio: string;
    experience: string;
    education: string;
    expertise: string[];
    portfolio: string;
    linkedin: string;
    cv: File | null;
    certificate: File | null;
    profileImage: File | null;
    profileImagePreview: string;
}

const expertiseAreas = [
    "Frontend Development",
    "Backend Development",
    "Full Stack Development",
    "Mobile Development",
    "UI/UX Design",
    "Data Science",
    "Machine Learning",
    "DevOps",
    "Cloud Computing",
    "Cybersecurity",
    "Blockchain",
    "Game Development",
    "Digital Marketing",
    "Project Management",
    "Other"
];

const benefits = [
    {
        icon: BookOpen,
        title: "Tạo khóa học không giới hạn",
        description: "Chia sẻ kiến thức của bạn thông qua các khóa học chất lượng"
    },
    {
        icon: Users,
        title: "Tiếp cận hàng ngàn học viên",
        description: "Kết nối với cộng đồng học tập trên toàn quốc"
    },
    {
        icon: Award,
        title: "Thu nhập hấp dẫn",
        description: "Nhận lên đến 80% doanh thu từ khóa học của bạn"
    },
    {
        icon: Star,
        title: "Xây dựng thương hiệu cá nhân",
        description: "Trở thành chuyên gia được công nhận trong lĩnh vực"
    }
];

export default function BecomeInstructorPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<InstructorApplicationData>({
        fullName: "",
        email: "",
        phone: "",
        bio: "",
        experience: "",
        education: "",
        expertise: [],
        portfolio: "",
        linkedin: "",
        cv: null,
        certificate: null,
        profileImage: null,
        profileImagePreview: "/images/default-avatar.png",
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleExpertiseToggle = (area: string) => {
        setFormData(prev => ({
            ...prev,
            expertise: prev.expertise.includes(area)
                ? prev.expertise.filter(item => item !== area)
                : [...prev.expertise, area]
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (fieldName === "profileImage") {
            if (!file.type.startsWith("image/")) {
                toast({
                    title: "Lỗi",
                    description: "Vui lòng chọn một tệp hình ảnh",
                    variant: "destructive",
                });
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: "Lỗi",
                    description: "Kích thước hình ảnh không được vượt quá 5MB",
                    variant: "destructive",
                });
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    profileImage: file,
                    profileImagePreview: reader.result as string,
                }));
            };
            reader.readAsDataURL(file);
        } else {
            // For CV and Certificate files
            if (file.size > 10 * 1024 * 1024) {
                toast({
                    title: "Lỗi",
                    description: "Kích thước file không được vượt quá 10MB",
                    variant: "destructive",
                });
                return;
            }

            setFormData(prev => ({
                ...prev,
                [fieldName]: file,
            }));
        }
    };

    const validateStep = (currentStep: number): boolean => {
        switch (currentStep) {
            case 1:
                if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
                    toast({
                        title: "Lỗi",
                        description: "Vui lòng điền đầy đủ thông tin cơ bản",
                        variant: "destructive",
                    });
                    return false;
                }
                break;
            case 2:
                if (!formData.bio.trim() || !formData.experience.trim() || !formData.education.trim()) {
                    toast({
                        title: "Lỗi",
                        description: "Vui lòng điền đầy đủ thông tin chuyên môn",
                        variant: "destructive",
                    });
                    return false;
                }
                if (formData.expertise.length === 0) {
                    toast({
                        title: "Lỗi",
                        description: "Vui lòng chọn ít nhất một lĩnh vực chuyên môn",
                        variant: "destructive",
                    });
                    return false;
                }
                break;
            case 3:
                if (!formData.cv) {
                    toast({
                        title: "Lỗi",
                        description: "Vui lòng tải lên CV của bạn",
                        variant: "destructive",
                    });
                    return false;
                }
                break;
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep(step)) {
            setStep(prev => Math.min(prev + 1, 3));
        }
    };

    const handlePrevious = () => {
        setStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateStep(3)) {
            return;
        }

        setLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            toast({
                title: "Thành công",
                description: "Đơn đăng ký của bạn đã được gửi thành công! Chúng tôi sẽ xem xét và phản hồi trong vòng 24-48 giờ.",
                variant: "success",
                duration: 5000,
            });

            router.push(routes.user.dashboard);
        } catch (error) {
            toast({
                title: "Lỗi",
                description: "Có lỗi xảy ra khi gửi đơn đăng ký. Vui lòng thử lại.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    if (step === 0) {
        return (
            <div className="max-w-6xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Trở thành giảng viên tại LinguaTech
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Chia sẻ kiến thức của bạn với hàng ngàn học viên trên toàn quốc.
                        Xây dựng sự nghiệp giảng dạy trực tuyến và tạo ra thu nhập ổn định.
                    </p>
                    <Button
                        onClick={() => setStep(1)}
                        size="lg"
                        className="text-lg px-8 py-3"
                    >
                        <GraduationCap className="w-5 h-5 mr-2" />
                        Bắt đầu đăng ký
                    </Button>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {benefits.map((benefit, index) => {
                        const Icon = benefit.icon;
                        return (
                            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Icon className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                                <p className="text-gray-600">{benefit.description}</p>
                            </Card>
                        );
                    })}
                </div>

                {/* Requirements */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                            Yêu cầu để trở thành giảng viên
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                                <span>Có ít nhất 2 năm kinh nghiệm trong lĩnh vực chuyên môn</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                                <span>Bằng cấp hoặc chứng chỉ liên quan đến lĩnh vực giảng dạy</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                                <span>Portfolio hoặc dự án thực tế để chứng minh năng lực</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                                <span>Khả năng giao tiếp tốt và đam mê chia sẻ kiến thức</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <Link
                        href={routes.user.dashboard}
                        className="inline-flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Quay lại
                    </Link>
                    <Button
                        variant="outline"
                        onClick={() => setStep(0)}
                        className="text-sm"
                    >
                        Xem thông tin chương trình
                    </Button>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Đăng ký trở thành giảng viên
                </h1>
                <p className="text-gray-600">
                    Hoàn thành các bước dưới đây để gửi đơn đăng ký
                </p>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {[1, 2, 3].map((stepNumber) => (
                        <div
                            key={stepNumber}
                            className={`flex items-center ${stepNumber < 3 ? "flex-1" : ""}`}
                        >
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${step >= stepNumber
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 text-gray-600"
                                    }`}
                            >
                                {stepNumber}
                            </div>
                            <div className="ml-3">
                                <p className={`text-sm font-medium ${step >= stepNumber ? "text-blue-600" : "text-gray-500"
                                    }`}>
                                    {stepNumber === 1 && "Thông tin cơ bản"}
                                    {stepNumber === 2 && "Thông tin chuyên môn"}
                                    {stepNumber === 3 && "Tài liệu & Xác nhận"}
                                </p>
                            </div>
                            {stepNumber < 3 && (
                                <div className={`flex-1 h-0.5 mx-4 ${step > stepNumber ? "bg-blue-600" : "bg-gray-200"
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Step 1: Basic Information */}
                {step === 1 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin cơ bản</CardTitle>
                            <CardDescription>
                                Vui lòng cung cấp thông tin liên hệ của bạn
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Profile Image */}
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={formData.profileImagePreview}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="profileImage" className="cursor-pointer">
                                        <div className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                                            <Upload className="w-4 h-4" />
                                            <span className="text-sm">Tải ảnh đại diện</span>
                                        </div>
                                    </Label>
                                    <Input
                                        id="profileImage"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e, "profileImage")}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Họ và tên *</Label>
                                    <Input
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="Nguyễn Văn A"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="example@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Số điện thoại *</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="0123456789"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Giới thiệu bản thân</Label>
                                <Textarea
                                    id="bio"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    placeholder="Viết một đoạn giới thiệu ngắn về bản thân..."
                                    rows={4}
                                />
                                <p className="text-sm text-gray-500">
                                    Ít nhất 100 ký tự để mô tả về kinh nghiệm và đam mê của bạn
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 2: Professional Information */}
                {step === 2 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin chuyên môn</CardTitle>
                            <CardDescription>
                                Thông tin về kinh nghiệm và lĩnh vực chuyên môn
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="experience">Kinh nghiệm làm việc *</Label>
                                <Textarea
                                    id="experience"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    placeholder="Mô tả kinh nghiệm làm việc của bạn..."
                                    rows={4}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="education">Trình độ học vấn *</Label>
                                <Textarea
                                    id="education"
                                    name="education"
                                    value={formData.education}
                                    onChange={handleInputChange}
                                    placeholder="Bằng cấp, chứng chỉ, khóa học đã hoàn thành..."
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <Label>Lĩnh vực chuyên môn *</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {expertiseAreas.map((area) => (
                                        <Badge
                                            key={area}
                                            variant={formData.expertise.includes(area) ? "default" : "outline"}
                                            className="cursor-pointer justify-center py-2"
                                            onClick={() => handleExpertiseToggle(area)}
                                        >
                                            {area}
                                        </Badge>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500">
                                    Chọn ít nhất một lĩnh vực mà bạn có kinh nghiệm giảng dạy
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="portfolio">Portfolio/Website</Label>
                                <Input
                                    id="portfolio"
                                    name="portfolio"
                                    value={formData.portfolio}
                                    onChange={handleInputChange}
                                    placeholder="https://yourportfolio.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="linkedin">LinkedIn Profile</Label>
                                <Input
                                    id="linkedin"
                                    name="linkedin"
                                    value={formData.linkedin}
                                    onChange={handleInputChange}
                                    placeholder="https://linkedin.com/in/yourprofile"
                                />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 3: Documents & Confirmation */}
                {step === 3 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Tài liệu & Xác nhận</CardTitle>
                            <CardDescription>
                                Tải lên các tài liệu cần thiết để xác minh thông tin
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="cv">CV/Resume *</Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                    {formData.cv ? (
                                        <div>
                                            <p className="text-green-600 font-medium">{formData.cv.name}</p>
                                            <p className="text-sm text-gray-500">File đã được chọn</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-gray-600">Tải lên CV của bạn</p>
                                            <p className="text-sm text-gray-500">PDF, DOC, DOCX (tối đa 10MB)</p>
                                        </div>
                                    )}
                                    <Label htmlFor="cv" className="cursor-pointer">
                                        <Button type="button" variant="outline" className="mt-2">
                                            Chọn file
                                        </Button>
                                    </Label>
                                    <Input
                                        id="cv"
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e, "cv")}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="certificate">Chứng chỉ/Bằng cấp (tùy chọn)</Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                    {formData.certificate ? (
                                        <div>
                                            <p className="text-green-600 font-medium">{formData.certificate.name}</p>
                                            <p className="text-sm text-gray-500">File đã được chọn</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-gray-600">Tải lên chứng chỉ liên quan</p>
                                            <p className="text-sm text-gray-500">PDF, JPG, PNG (tối đa 10MB)</p>
                                        </div>
                                    )}
                                    <Label htmlFor="certificate" className="cursor-pointer">
                                        <Button type="button" variant="outline" className="mt-2">
                                            Chọn file
                                        </Button>
                                    </Label>
                                    <Input
                                        id="certificate"
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e, "certificate")}
                                    />
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                                <h3 className="font-semibold text-lg">Tóm tắt thông tin</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium">Họ tên:</span> {formData.fullName}
                                    </div>
                                    <div>
                                        <span className="font-medium">Email:</span> {formData.email}
                                    </div>
                                    <div>
                                        <span className="font-medium">Số điện thoại:</span> {formData.phone}
                                    </div>
                                    <div>
                                        <span className="font-medium">Lĩnh vực chuyên môn:</span> {formData.expertise.join(", ")}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-8">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={step === 1}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Quay lại
                    </Button>

                    {step < 3 ? (
                        <Button type="button" onClick={handleNext}>
                            Tiếp theo
                        </Button>
                    ) : (
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Gửi đơn đăng ký
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}