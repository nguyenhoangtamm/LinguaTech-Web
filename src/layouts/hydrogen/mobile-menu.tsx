"use client";

import Link from "next/link";
import { Fragment, useState } from "react";
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

export default function MobileMenu({ className }: { className?: string }) {
    const pathname = usePathname();
    const { data, isLoading } = useGetMenuByRoleQuery(1);
    const menuItems = data?.data || [];
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    const toggleMenu = (itemName: string) => {
        setOpenMenus(prev => ({
            ...prev,
            [itemName]: !prev[itemName]
        }));
    };

    return (
        <div className={cn("w-full bg-white border-t border-gray-200", className)}>
            <div className="px-4 py-2 max-h-96 overflow-y-auto">
                {menuItems.map((item, index) => {
                    const isActive = pathname === (item?.url as string);
                    const pathnameExistInDropdowns: any = item?.children?.filter(
                        (dropdownItem) => dropdownItem.href === pathname
                    );
                    const isDropdownOpen = Boolean(pathnameExistInDropdowns?.length);
                    const isMenuOpen = openMenus[item.name] ?? isDropdownOpen;

                    return (
                        <Fragment key={item.name + "-" + index}>
                            {item?.parentId ? (
                                <>
                                    {item?.children ? (
                                        <div className="mb-2">
                                            <button
                                                onClick={() => toggleMenu(item.name)}
                                                className={cn(
                                                    "w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors duration-200",
                                                    isDropdownOpen
                                                        ? "bg-primary text-white"
                                                        : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                                                )}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    {item?.icon && (
                                                        <span className="flex items-center">
                                                            <DynamicIcon iconName={item.icon ?? ""} />
                                                        </span>
                                                    )}
                                                    <span className="font-medium">{item.name}</span>
                                                </div>

                                                <PiCaretDownBold
                                                    className={cn(
                                                        "h-4 w-4 transition-transform duration-200",
                                                        isMenuOpen && "rotate-180"
                                                    )}
                                                />
                                            </button>

                                            {isMenuOpen && (
                                                <div className="ml-4 mt-2 space-y-1">
                                                    {item?.children?.map((dropdownItem: any, childIndex: number) => {
                                                        const isChildActive = pathname === (dropdownItem?.url as string);

                                                        return (
                                                            <Link
                                                                href={dropdownItem.url ? dropdownItem.url : ""}
                                                                target={dropdownItem.isBlank ? "_blank" : "_self"}
                                                                key={dropdownItem?.name + childIndex}
                                                                className={cn(
                                                                    "flex items-center p-3 rounded-lg transition-colors duration-200",
                                                                    isChildActive
                                                                        ? "bg-primary text-white"
                                                                        : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                                                                )}
                                                            >
                                                                {dropdownItem?.icon && (
                                                                    <span className="mr-3 flex items-center">
                                                                        <DynamicIcon iconName={dropdownItem.icon ?? ""} size={16} />
                                                                    </span>
                                                                )}
                                                                <span>{dropdownItem?.name}</span>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <Link
                                            href={item?.url ?? ""}
                                            target={item.isBlank ? "_blank" : "_self"}
                                            className={cn(
                                                "flex items-center p-3 mb-2 rounded-lg transition-colors duration-200",
                                                isActive
                                                    ? "bg-primary text-white"
                                                    : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                                            )}
                                        >
                                            {item?.icon && (
                                                <span className="mr-3 flex items-center">
                                                    <DynamicIcon iconName={item.icon ?? ""} />
                                                </span>
                                            )}
                                            <span className="font-medium">{item.name}</span>
                                        </Link>
                                    )}
                                </>
                            ) : null}
                        </Fragment>
                    );
                })}
            </div>
        </div>
    );
}