import { ReactNode } from "react";
import UserNavigation from "./components/UserNavigation";
import { PageHeaderProvider } from "@/components/providers/PageHeaderContext";

export default function UserLayout({ children }: { children: ReactNode }) {
    return (
        <PageHeaderProvider>
            <div className="min-h-screen bg-gray-50">
                <UserNavigation />
                <main className="container mx-auto px-4 py-8">
                    {children}
                </main>
            </div>
        </PageHeaderProvider>
    );
}