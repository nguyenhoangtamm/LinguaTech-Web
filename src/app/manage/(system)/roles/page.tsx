import React, { Suspense } from 'react';
import { metaObject } from '@/config/site.config';
import PageHeader from "@/app/shared/page-header";
import { routes } from "@/config/routes";
import { Button } from "@/components/ui/button";
import { PiPlusBold } from "react-icons/pi";
import RoleTable from './role-table';

export const metadata = {
    ...metaObject('Vai trò'),
};

const pageHeader = {
    title: 'Vai trò',
    breadcrumb: [
        {
            name: 'Trang chủ',
        },
        {
            href: routes.manage.roles,
            name: 'Vai trò',
        },
        {
            name: 'Danh sách',
        },
    ],
};

export default function RolePage() {
    return (

        <div className='space-y-2'>
            <Suspense fallback={<div>Loading...</div>}>
                <RoleTable {...pageHeader} />
            </Suspense>
        </div>
    )
}
