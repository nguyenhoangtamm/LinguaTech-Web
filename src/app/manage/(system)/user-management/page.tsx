import React, { Suspense } from 'react';
import { metaObject } from '@/config/site.config';
import { routes } from "@/config/routes";
import UserTable from './user-table';

export const metadata = {
    ...metaObject('Quản lý người dùng'),
};

const pageHeader = {
    title: 'Quản lý người dùng',
    breadcrumb: [
        {
            name: 'Trang chủ',
        },
        {
            href: routes.manage.system.userManagement,
            name: 'Người dùng',
        },
        {
            name: 'Danh sách',
        },
    ],
};

export default function UserManagementPage() {
    return (
        <div className='space-y-2'>
            <Suspense fallback={<div>Loading...</div>}>
                <UserTable {...pageHeader} />
            </Suspense>
        </div>
    );
}