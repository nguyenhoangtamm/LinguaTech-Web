"use client";

import Link from "next/link";
import HamburgerButton from "@/layouts/hamburger-button";
import Sidebar from "@/layouts/hydrogen/sidebar";
import HeaderMenuRight from "@/layouts/header-menu-right";
import StickyHeader from "@/layouts/sticky-header";
import Image from "next/image";
import { usePathname } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import HorizontalMenu from "@/layouts/hydrogen/horizontal-menu";
import MobileMenu from "@/layouts/hydrogen/mobile-menu";
import { Input, InputGroup } from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (value: string) => {
    console.log("Tìm kiếm:", value);
    // Thêm logic tìm kiếm ở đây
  };

  return (
    <StickyHeader className="z-[50] border-b border-primary bg-primary">
      <div className="w-full flex flex-col">
        {/* Top Section: Logo, Search Bar and User Icon */}
        <div className="flex w-full items-center justify-between px-4 py-3 2xl:px-8 3xl:px-10 4xl:px-12 border-b border-primary-200">
          {/* Logo section */}
          <div className="flex items-center flex-shrink-0">
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
            <span className="ml-2 text-lg font-semibold text-white">LinguaTech Web</span>
          </div>

          {/* Search Bar - Center */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <InputGroup inside style={{ width: '100%' }}>
              <Input
                placeholder="Tìm kiếm..."
                value={searchValue}
                onChange={(value) => setSearchValue(value)}
                onPressEnter={() => handleSearch(searchValue)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '25px',
                  height: '40px',
                  fontSize: '14px'
                }}
              />
              <InputGroup.Addon>
                <SearchIcon
                  style={{ cursor: 'pointer', color: '#666' }}
                  onClick={() => handleSearch(searchValue)}
                />
              </InputGroup.Addon>
            </InputGroup>
          </div>

          {/* Mobile hamburger button - only show on small screens */}
          <div className="lg:hidden">
            <HamburgerButton
              view={<MobileMenu className="static w-full" />}
            />
          </div>

          {/* Right Menu (User Icon) */}
          <div className="flex items-center flex-shrink-0">
            <HeaderMenuRight />
          </div>
        </div>
        {/* Bottom Section: Breadcrumb */}
        <div className="flex w-full px-4 py-2 2xl:px-8 3xl:px-10 4xl:px-12 bg-white">
          <PageHeader />
        </div>
      </div>
    </StickyHeader>
  );
}
