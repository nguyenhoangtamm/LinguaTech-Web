"use client";

import Link from "next/link";
import { Fragment, useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/class-names";
import { PiCaretDownBold } from "react-icons/pi";
import { useGetMenuByRoleQuery } from "@/queries/useMenu";
import * as Icons from "lucide-react";

type DynamicIconProps = {
    iconName: string;
    size?: number;
    color?: string;
};

function DynamicIcon({ iconName, size = 20, color = "currentColor" }: DynamicIconProps) {
    const LucideIcon = (Icons as any)[iconName];

    if (!LucideIcon) {
        return;
    }

    return <LucideIcon size={size} color={color} />;
}

export default function HorizontalMenu({ className }: { className?: string }) {
    const pathname = usePathname();
    const { data, isLoading } = useGetMenuByRoleQuery(1);
    const menuItems = data?.data || [];
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const handleDropdownToggle = (itemName: string) => {
        setOpenDropdown(openDropdown === itemName ? null : itemName);
    };

    const closeDropdown = () => {
        setOpenDropdown(null);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav ref={menuRef} className={cn("flex items-center space-x-2", className)}>
            {menuItems.map((item: any, index: number) => {
                const isActive = pathname === (item?.url as string);
                const pathnameExistInDropdowns: any = item?.children?.filter(
                    (dropdownItem: any) => dropdownItem.href === pathname
                );
                const isDropdownOpen = Boolean(pathnameExistInDropdowns?.length) || openDropdown === item.name;

                return (
                    <Fragment key={item.name + "-" + index}>
                        {item ? (
                            <>
                                {item?.children ? (
                                    <div className="relative group">
                                        <button
                                            onClick={() => handleDropdownToggle(item.name)}
                                            className={cn(
                                                "flex items-center space-x-2 px-4 py-1 rounded-lg text-sm font-semibold transition-all duration-200 border",
                                                isDropdownOpen
                                                    ? "bg-white text-primary border-white shadow-md"
                                                    : "text-white hover:bg-white hover:text-primary hover:border-white border-transparent"
                                            )}
                                        >
                                            {item?.icon && (
                                                <span className="flex items-center">
                                                    <DynamicIcon iconName={item.icon ?? ""} size={18} />
                                                </span>
                                            )}
                                            <span>{item.name}</span>
                                            <PiCaretDownBold
                                                className={cn(
                                                    "h-3 w-3 transition-transform duration-200 ml-1",
                                                    isDropdownOpen && "rotate-180"
                                                )}
                                            />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {openDropdown === item.name && (
                                            <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-[9999] overflow-hidden header-dropdown">
                                                <div className="py-1">
                                                    {item?.children?.map((dropdownItem: any, childIndex: number) => {
                                                        const isChildActive = pathname === (dropdownItem?.url as string);

                                                        return (
                                                            <Link
                                                                href={dropdownItem.url ? dropdownItem.url : ""}
                                                                target={dropdownItem.isBlank ? "_blank" : "_self"}
                                                                key={dropdownItem?.name + childIndex}
                                                                onClick={closeDropdown}
                                                                className={cn(
                                                                    "flex items-center px-5 py-3 text-sm transition-all duration-200 mx-2 rounded-lg",
                                                                    isChildActive
                                                                        ? "bg-primary text-white shadow-md"
                                                                        : "text-gray-700 hover:bg-gray-50 hover:text-primary hover:shadow-sm"
                                                                )}
                                                            >
                                                                {dropdownItem?.icon && (
                                                                    <span className="mr-3 flex items-center">
                                                                        <DynamicIcon iconName={dropdownItem.icon ?? ""} size={16} />
                                                                    </span>
                                                                )}
                                                                <span className="font-medium">{dropdownItem?.name}</span>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        href={item?.url ?? ""}
                                        target={item.isBlank ? "_blank" : "_self"}
                                        className={cn(
                                            "flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 border",
                                            isActive
                                                ? "bg-white text-primary border-white shadow-md"
                                                : "text-white hover:bg-white hover:text-primary hover:border-white border-transparent"
                                        )}
                                    >
                                        {item?.icon && (
                                            <span className="flex items-center">
                                                <DynamicIcon iconName={item.icon ?? ""} size={18} />
                                            </span>
                                        )}
                                        <span>{item.name}</span>
                                    </Link>
                                )}
                            </>
                        ) : null}
                    </Fragment>
                );
            })}
        </nav>
    );
}