import React, { Suspense } from 'react';
import { metaObject } from '@/config/site.config';
import { routes } from "@/config/routes";
import AssignmentTable from './assignment-table';

export const metadata = {
    ...metaObject('Quản lý bài tập'),
};

const pageHeader = {
    title: 'Quản lý bài tập',
    breadcrumb: [
        {
            name: 'Trang chủ',
        },
        {
            href: routes.manage.system.assignments,
            name: 'Bài tập',
        },
        {
            name: 'Danh sách',
        },
    ],
};

export default function AssignmentPage() {
    return (
        <div className='space-y-2'>
            <Suspense fallback={<div>Loading...</div>}>
                <AssignmentTable {...pageHeader} />
            </Suspense>
        </div>
    );
}