import React, { Suspense } from 'react';
import { metaObject } from '@/config/site.config';
import { routes } from "@/config/routes";
import LessonTable from './lesson-table';

export const metadata = {
    ...metaObject('Quản lý bài học'),
};

const pageHeader = {
    title: 'Quản lý bài học',
    breadcrumb: [
        {
            name: 'Trang chủ',
        },
        {
            href: routes.manage.system.lessons,
            name: 'Bài học',
        },
        {
            name: 'Danh sách',
        },
    ],
};

export default function LessonsManagementPage() {
    return (
        <div className='space-y-2'>
            <Suspense fallback={<div>Loading...</div>}>
                <LessonTable {...pageHeader} />
            </Suspense>
        </div>
    );
}