import React, { Suspense } from 'react';
import { metaObject } from '@/config/site.config';
import { routes } from "@/config/routes";
import QuestionTable from './question-table';

export const metadata = {
    ...metaObject('Quản lý câu hỏi'),
};

const pageHeader = {
    title: 'Quản lý câu hỏi',
    breadcrumb: [
        {
            name: 'Trang chủ',
        },
        {
            href: routes.manage.system.questions,
            name: 'Câu hỏi',
        },
        {
            name: 'Danh sách',
        },
    ],
};

export default function QuestionPage() {
    return (
        <div className='space-y-2'>
            <Suspense fallback={<div>Loading...</div>}>
                <QuestionTable {...pageHeader} />
            </Suspense>
        </div>
    );
}