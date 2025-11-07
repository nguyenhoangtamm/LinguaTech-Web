import React, { Suspense } from 'react';
import { metaObject } from '@/config/site.config';
import { routes } from "@/config/routes";
import SectionTable from './section-table';

export const metadata = {
    ...metaObject('Quản lý phần học'),
};

const pageHeader = {
    title: 'Quản lý phần học',
    breadcrumb: [
        {
            name: 'Trang chủ',
        },
        {
            href: routes.manage.system.sections,
            name: 'Phần học',
        },
        {
            name: 'Danh sách',
        },
    ],
};

export default function SectionsManagementPage() {
    return (
        <div className='space-y-2'>
            <Suspense fallback={<div>Loading...</div>}>
                <SectionTable {...pageHeader} />
            </Suspense>
        </div>
    );
}