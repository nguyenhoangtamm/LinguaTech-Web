import { Metadata } from "next";
import { ProtectedRoute } from "@/components/protected-route";
import SubmissionTable from "./submission-table";
import { metaObject } from "@/config/site.config";

export const metadata: Metadata = {
    ...metaObject("Quản lý Submissions"),
};

const breadcrumb = [
    {
        name: "Trang chủ",
        href: "/manage",
    },
    {
        name: "Submissions",
        href: "/manage/submissions",
    },
];

export default function SubmissionsPage() {
    return (
        <ProtectedRoute>
            <SubmissionTable
                title="Quản lý Submissions"
                breadcrumb={breadcrumb}
            />
        </ProtectedRoute>
    );
}