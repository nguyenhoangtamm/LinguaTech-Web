"use client";

import React, { useState } from "react";
import { ToggleColumns } from "@/components/ui/inbox/table";
import { PiMagnifyingGlassBold, PiFunnel, PiXBold } from "react-icons/pi";
import { Button, Input, IconButton, Drawer } from "rsuite";
import cn from "@/utils/class-names";
import { useMedia } from "@/hooks/use-media";

export function FilterDrawerView({
  isOpen,
  drawerTitle,
  setOpenDrawer,
  children,
}: React.PropsWithChildren<{
  drawerTitle?: string;
  hasSearched?: boolean;
  setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen?: boolean;
}>) {
  return (
    <Drawer
      size="sm"
      open={isOpen ?? false}
      onClose={() => setOpenDrawer(false)}
      placement="left"
      className="z-[9999]"
    >
      <Drawer.Header>
        <Drawer.Title>{drawerTitle}</Drawer.Title>
      </Drawer.Header>
      <Drawer.Body className="flex flex-col h-full">
        <div className="flex-grow">
          <div className="grid grid-cols-1 gap-6 [&_.price-field>span.mr-2]:mb-1.5 [&_.price-field]:flex-col [&_.price-field]:items-start [&_.react-datepicker-wrapper]:w-full [&_.react-datepicker-wrapper_.w-72]:w-full [&_.text-gray-500]:text-gray-700 [&_button.h-9]:h-10 sm:[&_button.h-9]:h-11 [&_label>.h-9]:h-10 sm:[&_label>.h-9]:h-11 [&_label>.w-24.h-9]:w-full">
            {children}
          </div>
        </div>
        <Button
          size="lg"
          appearance="primary"
          onClick={() => setOpenDrawer(false)}
          className="mt-5 h-11 w-full text-sm"
        >
          Show Results
        </Button>
      </Drawer.Body>
    </Drawer>
  );
}

export type TableFilterProps = {
  searchTerm: string;
  onSearchClear: () => void;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  columns: { [key: string]: any }[];
  checkedColumns: string[];
  setCheckedColumns: React.Dispatch<React.SetStateAction<string[]>>;
  hideIndex?: number;
  children?: React.ReactNode;
  drawerTitle?: string;
  hasSearched?: boolean;
  showSearchOnTheRight?: boolean;
  enableDrawerFilter?: boolean;
  menu?: React.ReactNode;
};

export default function TableFilter({
  searchTerm,
  onSearchClear,
  onSearchChange,
  columns,
  checkedColumns,
  setCheckedColumns,
  hideIndex,
  drawerTitle = "Table Filters",
  hasSearched,
  enableDrawerFilter = false,
  showSearchOnTheRight = false,
  menu,
  children,
}: TableFilterProps) {
  const isMediumScreen = useMedia("(max-width: 1860px)", false);
  const [showFilters, setShowFilters] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleInputChange = (value: string) => {
    const event = {
      target: { value }
    } as React.ChangeEvent<HTMLInputElement>;
    onSearchChange(event);
  };

  return (
    <div className="table-filter mb-4 flex items-center justify-between">
      <div className="flex flex-wrap items-center gap-4">
        {!showSearchOnTheRight ? (
          <Input
            type="search"
            placeholder="Search by anything..."
            value={searchTerm}
            onChange={handleInputChange}
            className="h-9 w-full"
          />
        ) : null}

        {showSearchOnTheRight && enableDrawerFilter ? (
          <>{menu ? menu : null}</>
        ) : null}

        {children && (
          <>
            {isMediumScreen || enableDrawerFilter ? (
              <FilterDrawerView
                isOpen={openDrawer}
                setOpenDrawer={setOpenDrawer}
                drawerTitle={drawerTitle}
                hasSearched={hasSearched}
              >
                {children}
              </FilterDrawerView>
            ) : (
              <>{showFilters ? children : null}</>
            )}
          </>
        )}
      </div>

      <div className="ms-4 flex flex-shrink-0 items-center">
        {showSearchOnTheRight ? (
          <Input
            type="search"
            placeholder="Search by anything..."
            value={searchTerm}
            onChange={handleInputChange}
            className="h-9 w-full me-2.5"
          />
        ) : null}

        {children ? (
          <Button
            {...(isMediumScreen || enableDrawerFilter
              ? {
                onClick: () => {
                  setOpenDrawer(() => !openDrawer);
                },
              }
              : { onClick: () => setShowFilters(() => !showFilters) })}
            appearance={"ghost"}
            className={cn(
              "me-2.5 h-9 px-3",
              !(isMediumScreen || enableDrawerFilter) &&
              showFilters &&
              "border-dashed border-gray-700"
            )}
          >
            <PiFunnel className="me-1.5 h-[18px] w-[18px]" strokeWidth={1.7} />
            {!(isMediumScreen || enableDrawerFilter) && showFilters
              ? "Hide Filters"
              : "Filters"}
          </Button>
        ) : null}

        <ToggleColumns
          columns={columns}
          checkedColumns={checkedColumns}
          setCheckedColumns={setCheckedColumns}
          hideIndex={hideIndex}
        />
      </div>
    </div>
  );
}
