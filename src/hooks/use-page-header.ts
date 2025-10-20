// hooks/usePageHeader.ts
import { useEffect } from "react";
import { usePageHeaderContext } from "@/components/providers/PageHeaderContext";

interface PageHeaderProps {
    title: string;
    breadcrumb: { name: string; href?: string }[];
}

export function usePageHeader({ title, breadcrumb }: PageHeaderProps) {
    const { setHeader } = usePageHeaderContext();

    useEffect(() => {
        setHeader({
            title: title || "LinguaTech - Quản lý dự án ngôn ngữ",
            breadcrumb: breadcrumb || [
                { name: "Trang chủ", href: "/manage/dashboard" },
                { name: "Bảng điều khiển" },
            ],
        });
    }, [title, breadcrumb, setHeader]);
}
