"use client";

type Props = {
    children: React.ReactNode;
};

export default function BaseLayout({ children }: Props) {
    return (
        <div className="w-full flex flex-col" style={{ height: 'calc(100vh - 60px)' }}>
            {children}
        </div>
    );
}