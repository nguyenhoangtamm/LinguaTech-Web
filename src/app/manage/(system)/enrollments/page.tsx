import React, { Suspense } from 'react';
import { metaObject } from '@/config/site.config';
import { routes } from "@/config/routes";
import EnrollmentTable from './enrollment-table';

export const metadata = {
    ...metaObject('Quản lý đăng ký học'),
};

const pageHeader = {
    title: 'Quản lý đăng ký học',
    breadcrumb: [
        {
            name: 'Trang chủ',
        },
        {
            href: routes.manage.system.enrollments,
            name: 'Đăng ký học',
        },
        {
            name: 'Danh sách',
        },
    ],
};

export default function EnrollmentsManagementPage() {
    return (
        <div className='space-y-2'>
            <Suspense fallback={<div>Loading...</div>}>
                <EnrollmentTable {...pageHeader} />
            </Suspense>
        </div>
    );
}