"use client";

import Link from "next/link";
import HamburgerButton from "@/layouts/hamburger-button";
import SearchWidget from "@/components/search/search";
import Sidebar from "@/layouts/hydrogen/sidebar";
import HeaderMenuRight from "@/layouts/header-menu-right";
import StickyHeader from "@/layouts/sticky-header";
import Image from "next/image";
import { usePathname } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import HorizontalMenu from "@/layouts/hydrogen/horizontal-menu";
import MobileMenu from "@/layouts/hydrogen/mobile-menu";

export default function Header() {
  const pathname = usePathname();
  return (
    <StickyHeader className="z-[50] border-b border-primary bg-primary">
      <div className="w-full flex flex-col">
        {/* Top Section: Logo and User Icon */}
        <div className="flex w-full items-center justify-between px-4 py-3 2xl:px-8 3xl:px-10 4xl:px-12 border-b border-primary-200">
          {/* Logo section */}
          <div className="flex items-center">
            <Link
              href={"/"}
              aria-label="Site Logo"
              className="shrink-0 text-white hover:text-gray-200"
            >
              <Image
                src="/ltlogo.png"
                alt="LinguaTech Logo"
                width={50}
                height={50}
              />
            </Link>
          </div>

          {/* Mobile hamburger button - only show on small screens */}
          <div className="lg:hidden">
            <HamburgerButton
              view={<MobileMenu className="static w-full" />}
            />
          </div>

          {/* Right Menu (User Icon) */}
          <div className="flex items-center">
            <HeaderMenuRight />
          </div>
        </div>

        {/* Middle Section: Horizontal Menu */}
        <div className="hidden lg:flex w-full justify-center px-4 py-3 2xl:px-8 3xl:px-10 4xl:px-12 border-b border-primary-200">
          <HorizontalMenu />
        </div>

        {/* Bottom Section: Breadcrumb */}
        <div className="flex w-full px-4 py-2 2xl:px-8 3xl:px-10 4xl:px-12 bg-white">
          <PageHeader />
        </div>
      </div>
    </StickyHeader>
  );
}
