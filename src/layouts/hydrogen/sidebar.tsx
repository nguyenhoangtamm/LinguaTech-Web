"use client";

import Link from "next/link";
import { Fragment, useState } from "react";
import { usePathname } from "next/navigation";
import { Panel, PanelGroup } from "rsuite";
import { cn } from "@/utils/class-names";
import { PiCaretDownBold } from "react-icons/pi";
import SimpleBar from "@/components/ui/simplebar";
// import { menuItems } from "@/layouts/hydrogen/menu-items";
import Image from "next/image";
import { DropdownItem, MenuItem } from "@/types/menu.types";
import { useGetMenuByRoleQuery } from "@/queries/useMenu";
import { MenuItemByUserRoleListType } from "@/schemaValidations/menu.schema";
import * as Icons from "lucide-react";

type DynamicIconProps = {
  iconName: string;
  size?: number;
  color?: string;
};

function DynamicIcon({ iconName, size = 24, color = "white" }: DynamicIconProps) {
  const LucideIcon = (Icons as any)[iconName];

  if (!LucideIcon) {
    return;
  }

  return <LucideIcon size={size} color={color} />;
}
export default function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { data, isLoading, refetch: refetchTask } = useGetMenuByRoleQuery(1)
  const menuItems = data?.data || [];
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (itemName: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };
  return (
    <aside
      className={cn(
        "fixed bottom-0 start-0 z-50 h-full w-[270px] border-e-2 border-gray-100 bg-primary 2xl:w-72 dark:bg-gray-100/50",
        className
      )}
    >
      <div className="sticky top-0 z-40 px-6 pb-5 pt-5 2xl:px-8 2xl:pt-6 dark:bg-gray-100/5">
        <Link
          href={"/"}
          aria-label="LinguaTech System"
          className="text-white hover:text-gray-900 justify-center flex items-center"
        >
          <Image
            src="/ltlogo.png"
            alt="LinguaTech Logo"
            width={180}
            height={180}
          />
        </Link>
      </div>

      <SimpleBar className="h-[calc(100%-80px)] pt-4">
        <div className="mt-4 3xl:mt-6 pb-10">
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
                      <div>
                        <div
                          onClick={() => toggleMenu(item.name)}
                          className={cn(
                            "group relative mx-3 flex cursor-pointer items-center justify-between rounded-md px-3 py-2 font-medium lg:my-1 2xl:mx-5 2xl:my-2",
                            isDropdownOpen
                              ? "before:top-2/5 text-white before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-primary 2xl:before:-start-5"
                              : "text-white transition-colors duration-200 hover:bg-primary-dark dark:text-gray-700/90 dark:hover:text-primary"
                          )}
                        >
                          <span className="flex items-center">
                            {item?.icon && (
                              <span
                                className={cn(
                                  "me-2 inline-flex h-5 w-5 items-center justify-center rounded-md [&>svg]:h-[20px] [&>svg]:w-[20px]",
                                  isDropdownOpen
                                    ? "text-white"
                                    : "text-white hover:bg-primary-dark dark:text-gray-500 dark:group-hover:text-primary"
                                )}
                              >
                                <DynamicIcon iconName={item.icon ?? ""} />
                              </span>
                            )}
                            {item.name}
                          </span>

                          <PiCaretDownBold
                            strokeWidth={3}
                            className={cn(
                              "h-3.5 w-3.5 -rotate-90 text-white-500 transition-transform duration-200 rtl:rotate-90",
                              isMenuOpen && "rotate-0 rtl:rotate-0"
                            )}
                          />
                        </div>

                        {isMenuOpen && (
                          <div className="overflow-hidden">
                            {item?.children?.map((dropdownItem: any, index: number) => {
                              const isChildActive =
                                pathname === (dropdownItem?.url as string);

                              return (
                                <Link
                                  href={dropdownItem.url ? dropdownItem.url : ""}
                                  target={dropdownItem.isBlank ? "_blank" : "_self"}
                                  key={dropdownItem?.name + index}
                                  className={cn(
                                    "mx-3.5 mb-0.5 flex items-center justify-between rounded-md px-3.5 py-2 font-medium capitalize last-of-type:mb-1 lg:last-of-type:mb-2 2xl:mx-5",
                                    isChildActive
                                      ? "text-white bg-primary-dark"
                                      : "text-white transition-colors duration-200 hover:bg-primary-dark hover:text-white"
                                  )}
                                >
                                  <div className="flex items-center truncate">
                                    <span
                                      className={cn(
                                        "me-[18px] ms-1 inline-flex h-1 w-1 rounded-full bg-current transition-all duration-200",
                                        isChildActive
                                          ? "opacity-100 ring-[1px] ring-white bg-primary-dark"
                                          : "opacity-100"
                                      )}
                                    />{" "}
                                    <span className="truncate">
                                      {dropdownItem?.icon && (
                                        <span
                                          className={cn(
                                            "me-2 inline-flex h-5 w-5 items-center justify-center rounded-md [&>svg]:h-[20px] [&>svg]:w-[20px]",
                                            isChildActive
                                              ? "text-white"
                                              : "text-white hover:bg-primary-dark dark:text-gray-500 dark:group-hover:text-primary"
                                          )}
                                        >
                                          <DynamicIcon iconName={dropdownItem.icon ?? ""} />
                                        </span>
                                      )}
                                      {dropdownItem?.name}
                                    </span>
                                  </div>
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
                          "group relative mx-3 my-0.5 flex items-center justify-between rounded-md px-3 py-2 font-medium capitalize lg:my-1 2xl:mx-5 2xl:my-2",
                          isActive
                            ? "before:top-2/5 text-white bg-primary-dark before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-primary 2xl:before:-start-5"
                            : "text-gray-700 transition-colors duration-200 hover:bg-primary-dark hover:text-primary dark:text-gray-700/90"
                        )}
                      >
                        <div className="flex items-center truncate">
                          {item?.icon && (
                            <span
                              className={cn(
                                "me-2 inline-flex h-5 w-5 items-center justify-center rounded-md [&>svg]:h-[20px] [&>svg]:w-[20px]",
                                isActive
                                  ? "text-gray-200"
                                  : "text-gray-200 dark:text-gray-500 dark:group-hover:text-primary"
                              )}
                            >
                              <DynamicIcon iconName={item.icon ?? ""} />
                            </span>
                          )}
                          <span className="truncate text-gray-200 hover:text-white">{item.name}</span>
                        </div>
                      </Link>
                    )}
                  </>
                ) : (
                  // <h6
                  //   className={cn(
                  //     "mb-2 truncate px-6 text-xs font-bold font-sarabun uppercase tracking-widest text-white 2xl:px-8",
                  //     index !== 0 && "mt-6 3xl:mt-7"
                  //   )}
                  // >
                  //   {item.name}
                  // </h6>
                  <Link
                        href={item?.url ?? ""}
                        target={item.isBlank ? "_blank" : "_self"}
                        className={cn(
                          "group relative mx-3 my-0.5 flex items-center justify-between rounded-md px-3 py-2 font-medium capitalize lg:my-1 2xl:mx-5 2xl:my-2",
                          isActive
                            ? "before:top-2/5 text-white bg-primary-dark before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-primary 2xl:before:-start-5"
                            : "text-gray-700 transition-colors duration-200 hover:bg-primary-dark hover:text-primary dark:text-gray-700/90"
                        )}
                      >
                        <div className="flex items-center truncate">
                          {item?.icon && (
                            <span
                              className={cn(
                                "me-2 inline-flex h-5 w-5 items-center justify-center rounded-md [&>svg]:h-[20px] [&>svg]:w-[20px]",
                                isActive
                                  ? "text-gray-200"
                                  : "text-gray-200 dark:text-gray-500 dark:group-hover:text-primary"
                              )}
                            >
                              <DynamicIcon iconName={item.icon ?? ""} />
                            </span>
                          )}
                          <span className="truncate text-gray-200 hover:text-white">{item.name}</span>
                        </div>
                      </Link>
                )}
              </Fragment>
            );
          })}
        </div>
      </SimpleBar>
    </aside>
  );
}
