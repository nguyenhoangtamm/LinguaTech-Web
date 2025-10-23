import { ReactNode } from "react";
import UserNavigation from "./components/UserNavigation";

export default function UserLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <UserNavigation />
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}