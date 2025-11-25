"use client";

import { useState, useEffect } from "react";
import { useUserProfileMeQuery } from "@/queries/useUserProfile";
import { Button, Message, toaster, Avatar } from "rsuite";
import { User, Mail, Phone, MapPin, Save, X, Edit2 } from "lucide-react";
import { usePageHeaderContext } from "@/components/providers/PageHeaderContext";

export default function ProfileClient() {
    const { setHeader } = usePageHeaderContext();
    const { data, isLoading, refetch } = useUserProfileMeQuery({ enabled: true });
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        fullname: "",
        username: "",
        email: "",
        phone: "",
        address: "",
    });

    useEffect(() => {
        setHeader({
            title: "Hồ sơ cá nhân",
            breadcrumb: [
                { name: "Dashboard", href: "/dashboard" },
                { name: "Hồ sơ cá nhân" },
            ],
        });
    }, [setHeader]);

    useEffect(() => {
        if (data?.data) {
            setFormData({
                fullname: data.data.fullname || "",
                username: data.data.username || "",
                email: data.data.email || "",
                phone: data.data.phone || "",
                address: data.data.address || "",
            });
        }
    }, [data]);

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // TODO: Thêm API call để update profile
            // await userProfileApiRequest.updateProfile(formData);

            toaster.push(
                <Message showIcon type="success" closable>
                    Cập nhật hồ sơ thành công!
                </Message>
            );
            setIsEditing(false);
            refetch();
        } catch (error) {
            toaster.push(
                <Message showIcon type="error" closable>
                    Cập nhật hồ sơ thất bại!
                </Message>
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (data?.data) {
            setFormData({
                fullname: data.data.fullname || "",
                username: data.data.username || "",
                email: data.data.email || "",
                phone: data.data.phone || "",
                address: data.data.address || "",
            });
        }
        setIsEditing(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    const userInitial = (formData.fullname?.[0] || formData.username?.[0] || "U").toUpperCase();

    return (
        <div className="space-y-6">
            {/* Header Card with Avatar */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md p-8 text-white">
                <div className="flex items-center space-x-6">
                    <Avatar
                        size="lg"
                        circle
                        style={{
                            width: '80px',
                            height: '80px',
                            fontSize: '32px',
                            backgroundColor: '#ffffff',
                            color: '#3b82f6',
                        }}
                    >
                        {userInitial}
                    </Avatar>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold">{formData.fullname || "Người dùng"}</h1>
                        <p className="text-blue-100 mt-1">@{formData.username || "username"}</p>
                    </div>
                    {!isEditing && (
                        <Button
                            appearance="ghost"
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 bg-white text-blue-600"
                        >
                            <Edit2 className="w-4 h-4" />
                            Chỉnh sửa
                        </Button>
                    )}
                </div>
            </div>

            {!isEditing ? (
                // View Mode
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Contact Information Card */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <Mail className="w-5 h-5 text-blue-600" />
                            Thông tin liên hệ
                        </h3>
                        <div className="space-y-5">
                            <div className="flex items-start space-x-4 pb-4 border-b border-gray-200">
                                <Mail className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</p>
                                    <p className="text-base text-gray-900 font-medium mt-1">{formData.email || "Chưa cập nhật"}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <Phone className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Số điện thoại</p>
                                    <p className="text-base text-gray-900 font-medium mt-1">{formData.phone || "Chưa cập nhật"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address Card */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            Địa chỉ
                        </h3>
                        <div className="flex items-start space-x-4">
                            <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Địa chỉ hiện tại</p>
                                <p className="text-base text-gray-900 font-medium mt-2 leading-relaxed">
                                    {formData.address || "Chưa cập nhật"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // Edit Mode
                <div className="bg-white rounded-lg shadow-sm p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-8">Chỉnh sửa thông tin cá nhân</h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Tên đầy đủ <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.fullname}
                                    onChange={(e) => handleInputChange("fullname", e.target.value)}
                                    placeholder="Nhập tên đầy đủ"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Tên đăng nhập
                                </label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    disabled
                                    placeholder="Tên đăng nhập"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">Tên đăng nhập không thể thay đổi</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    placeholder="Nhập email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Số điện thoại
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                    placeholder="Nhập số điện thoại"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Địa chỉ
                                </label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => handleInputChange("address", e.target.value)}
                                    placeholder="Nhập địa chỉ"
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-10 pt-6 border-t border-gray-200">
                        <Button
                            appearance="primary"
                            loading={isSaving}
                            onClick={handleSave}
                            className="flex items-center gap-2 px-6 py-2"
                        >
                            <Save className="w-4 h-4" />
                            Lưu thay đổi
                        </Button>
                        <Button
                            appearance="default"
                            onClick={handleCancel}
                            className="flex items-center gap-2 px-6 py-2"
                        >
                            <X className="w-4 h-4" />
                            Hủy
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
