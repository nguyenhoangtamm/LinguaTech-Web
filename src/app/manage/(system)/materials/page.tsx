import React, { Suspense } from 'react';
import { metaObject } from '@/config/site.config';
import { routes } from "@/config/routes";
import MaterialTable from './material-table';

export const metadata = {
    ...metaObject('Quản lý tài liệu'),
};

const pageHeader = {
    title: 'Quản lý tài liệu',
    breadcrumb: [
        {
            name: 'Trang chủ',
        },
        {
            href: routes.manage.system.materials,
            name: 'Tài liệu',
        },
        {
            name: 'Danh sách',
        },
    ],
};

export default function MaterialsManagementPage() {
    return (
        <div className='space-y-2'>
            <Suspense fallback={<div>Loading...</div>}>
                <MaterialTable {...pageHeader} />
            </Suspense>
        </div>
    );
}