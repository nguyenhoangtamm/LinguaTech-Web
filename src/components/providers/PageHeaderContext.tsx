// components/providers/PageHeaderProvider.tsx
"use client";
import React, { createContext, useContext, useState } from 'react';

type PageHeaderData = {
    title: string;
    breadcrumb: { name: string; href?: string }[];
};

type PageHeaderContextType = {
    header: PageHeaderData;
    setHeader: (value: PageHeaderData) => void;
};

const PageHeaderContext = createContext<PageHeaderContextType | undefined>(undefined);

export const PageHeaderProvider = ({ children }: { children: React.ReactNode }) => {
    const [header, setHeader] = useState<PageHeaderData>({
        title: '',
        breadcrumb: [],
    });

    return (
        <PageHeaderContext.Provider value={{ header, setHeader }}>
            {children}
        </PageHeaderContext.Provider>
    );
};

export const usePageHeaderContext = () => {
    const context = useContext(PageHeaderContext);
    if (!context) throw new Error("usePageHeader must be used within a PageHeaderProvider");
    return context;
};
