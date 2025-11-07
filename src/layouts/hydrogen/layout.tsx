import { PageHeaderProvider } from '@/components/providers/PageHeaderContext';
import Header from '@/layouts/hydrogen/header';
import Sidebar from './sidebar';

export default function HydrogenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageHeaderProvider>
      {/* Sidebar is fixed; hide on small screens and offset content on md+ */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <main className="flex min-h-screen flex-col md:ml-[270px] 2xl:ml-72">
        <Header />
        <div className="flex w-full flex-col flex-grow px-4 py-2 2xl:px-8 3xl:px-10 4xl:px-12">
          {children}
        </div>
      </main>
    </PageHeaderProvider>
  );
}
