import React from 'react';
import { metaObject } from '@/config/site.config';
import BaseLayout from '@/layouts/BaseLayout';

export const metadata = {
  ...metaObject('Trang chủ'),
};

const pageHeader = {
  title: 'Trang chủ',
  breadcrumb: [
    {
      name: 'Trang chủ',
    },
  ],
};

export default function Home() {
  return (
    <BaseLayout>
      <div className="space-y-8">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Chào mừng đến với LinguaTech</h1>
          <p className="text-gray-600 text-lg">Nền tảng học tập trực tuyến hàng đầu</p>
        </div>
      </div>
    </BaseLayout>
  );
}
