import React, {Suspense} from 'react';
import { metaObject } from '@/config/site.config';
import PageHeader from "@/app/shared/page-header";
import {routes} from "@/config/routes";
import RoleMenuTree from "@/app/manage/(system)/roles/config-menu/role-menu-tree";

export const metadata = {
    ...metaObject('Cấu hình danh mục'),
};

const pageHeader = {
    title: 'Cấu hình danh mục',
    breadcrumb: [
        {
            name: 'Trang chủ',
        },
        {
            href: routes.manage.roles,
            name: 'Cấu hình danh mục',
        },
    ],
};

export default function ConfigMenuPage() {
    return (
        <>
            <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
            </PageHeader>
            <div className='space-y-2'>
                <Suspense fallback={<div>Loading...</div>}>
                    <RoleMenuTree />
                </Suspense>
            </div>
        </>
    )
}
