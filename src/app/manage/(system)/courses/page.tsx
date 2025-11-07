import React, { Suspense } from 'react';
import { metaObject } from '@/config/site.config';
import { routes } from "@/config/routes";
import CourseTable from './course-table';

export const metadata = {
    ...metaObject('Quản lý khóa học'),
};

const pageHeader = {
    title: 'Quản lý khóa học',
    breadcrumb: [
        {
            name: 'Trang chủ',
        },
        {
            href: routes.manage.system.courses,
            name: 'Khóa học',
        },
        {
            name: 'Danh sách',
        },
    ],
};

export default function CoursesManagementPage() {
    return (
        <div className='space-y-2'>
            <Suspense fallback={<div>Loading...</div>}>
                <CourseTable {...pageHeader} />
            </Suspense>
        </div>
    );
}