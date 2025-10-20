"use client";
import React, { Suspense, useMemo, useState } from 'react';
import PageHeader from "@/app/shared/page-header";
import { routes } from "@/config/routes";
import TreeViewMenu from './tree-view';
import MenuCRUDPanel from './crud';
import { usePageHeader } from '@/hooks/use-page-header';

export default function UserPage() {
    const [selectedMenuId, setSelectedMenuId] = useState<number | undefined>(0);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleSubmitSuccess = () => {
        setRefreshKey((prevKey) => prevKey + 1);
    };

    const pageHeader = useMemo(() => ({
        title: 'Menu',
        breadcrumb: [
            {
                name: 'Trang chủ',
            },
            {
                href: routes.manage.roles,
                name: 'Menu',
            },
            {
                name: 'Danh sách',
            },
        ],
    }), []);

    usePageHeader(pageHeader);
    usePageHeader({ title: pageHeader.title, breadcrumb: pageHeader.breadcrumb });
    return (
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            <div className="lg:w-1/2">
                <Suspense fallback={<div>Loading TreeView...</div>}>
                    <TreeViewMenu key={refreshKey} refreshKey={refreshKey} onSelectMenu={setSelectedMenuId} />
                </Suspense>
            </div>
            <div className="">
                <MenuCRUDPanel id={selectedMenuId} setId={setSelectedMenuId} onSubmitSuccess={handleSubmitSuccess} />
            </div>
        </div>
    );
}
