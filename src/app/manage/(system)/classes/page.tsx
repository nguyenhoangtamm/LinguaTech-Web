import React, { Suspense } from 'react';
import { metaObject } from '@/config/site.config';
import { routes } from "@/config/routes";
import ClassTable from './class-table';

export const metadata = {
    ...metaObject('Quản lý lớp học'),
};

const pageHeader = {
    title: 'Quản lý lớp học',
    breadcrumb: [
        {
            name: 'Trang chủ',
        },
        {
            href: routes.manage.system.classes,
            name: 'Lớp học',
        },
        {
            name: 'Danh sách',
        },
    ],
};

export default function ClassesManagementPage() {
    return (
        <div className='space-y-2'>
            <Suspense fallback={<div>Loading...</div>}>
                <ClassTable {...pageHeader} />
            </Suspense>
        </div>
    );
}