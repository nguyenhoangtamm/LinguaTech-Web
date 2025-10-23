"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/class-names";
import { routes } from "@/config/routes";
import {
    BookOpen,
    Home,
    Search,
    User,
    Bell,
    Settings
} from "lucide-react";

const navigationItems = [
    {
        title: "Dashboard",
        href: routes.user.dashboard,
        icon: Home,
    },
    {
        title: "Khóa học",
        href: routes.user.courses,
        icon: BookOpen,
    },
    {
        title: "Tìm kiếm",
        href: "/user/search",
        icon: Search,
    },
];

export default function UserNavigation() {
    const pathname = usePathname();

    return (
        <header className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href={routes.user.dashboard} className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">LinguaTech</span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                        pathname === item.href
                                            ? "text-blue-600 bg-blue-50"
                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{item.title}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User actions */}
                    <div className="flex items-center space-x-4">
                        <button className="p-2 text-gray-600 hover:text-gray-900 rounded-md">
                            <Bell className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-gray-900 rounded-md">
                            <Settings className="w-5 h-5" />
                        </button>
                        <button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 rounded-md">
                            <User className="w-5 h-5" />
                            <span className="text-sm">Tài khoản</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}