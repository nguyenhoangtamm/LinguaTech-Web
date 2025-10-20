import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { inter, lexendDeca } from "@/app/fonts";
import GlobalDrawer from "@/app/shared/drawer-views/container";
import GlobalModal from "@/app/shared/modal-views/container";
import { cn } from "@/utils/class-names";
import "@/app/globals.css";
// import "@/app/style.css";
import AppProvider from "@/components/app-provider";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
    title: "LinguaTech - Quản lý dự án ngôn ngữ",
    description: "Nền tảng LinguaTech chuyên nghiệp hỗ trợ quản lý và theo dõi các dự án ngôn ngữ, dịch thuật và phát triển công nghệ ngôn ngữ một cách hiệu quả và chính xác.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang='en'
            suppressHydrationWarning
        >
            <body
                suppressHydrationWarning
                className={cn(inter.variable, lexendDeca.variable, "font-inter")}
            >
                <AppProvider>
                    <ThemeProvider
                        attribute='class'
                        defaultTheme='light'
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                        <GlobalDrawer />
                        <GlobalModal />
                        <Toaster />
                    </ThemeProvider>
                </AppProvider>

            </body>
        </html>
    );
}
