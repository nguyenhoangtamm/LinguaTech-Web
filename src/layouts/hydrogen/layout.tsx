import { PageHeaderProvider } from '@/components/providers/PageHeaderContext';
import Header from '@/layouts/hydrogen/header';

export default function HydrogenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageHeaderProvider>
      <main className="flex min-h-screen flex-col">
        <Header />
        <div className="flex w-full flex-col flex-grow px-4 py-2 2xl:px-8 3xl:px-10 4xl:px-12">
          {children}
        </div>
      </main>
    </PageHeaderProvider>
  );
}
