import React, { Suspense } from 'react';
import { metaObject } from '@/config/site.config';
import PageHeader from "@/app/shared/page-header";
import { routes } from "@/config/routes";
// import UserTable from "@/app/manage/(system)/users/user-table";
import UserTable from "./user-table";

export const metadata = {
    ...metaObject('Người dùng'),
};

const pageHeader = {
    title: 'Người dùng',
    breadcrumb: [
        {
            name: 'Trang chủ',
        },
        {
            href: routes.manage.users,
            name: 'Người dùng',
        },
        {
            name: 'Danh sách',
        },
    ],
};

export default function UserPage() {
    return (

        <div className='space-y-2'>
            <Suspense fallback={<div>Loading...</div>}>
                <UserTable {...pageHeader} />
            </Suspense>
        </div>

    )
}
