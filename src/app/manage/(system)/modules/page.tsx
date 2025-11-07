import React, { Suspense } from 'react';
import { metaObject } from '@/config/site.config';
import { routes } from "@/config/routes";
import ModuleTable from './module-table';

export const metadata = {
    ...metaObject('Quản lý module'),
};

const pageHeader = {
    title: 'Quản lý module',
    breadcrumb: [
        {
            name: 'Trang chủ',
        },
        {
            href: routes.manage.system.modules,
            name: 'Module',
        },
        {
            name: 'Danh sách',
        },
    ],
};

export default function ModulesManagementPage() {
    return (
        <div className='space-y-2'>
            <Suspense fallback={<div>Loading...</div>}>
                <ModuleTable {...pageHeader} />
            </Suspense>
        </div>
    );
}