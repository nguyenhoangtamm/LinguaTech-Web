import Breadcrumb from '@/components/ui/breadcrumb';
import { usePageHeaderContext } from "@/components/providers/PageHeaderContext";

export default function PageHeader({ className, children }: { className?: string; children?: React.ReactNode }) {
    const { header } = usePageHeaderContext();
    const { title, breadcrumb } = header;

    return (
        <div>
            <h6 className="mb-0 text-[14px]">
                {title}
            </h6>
            <Breadcrumb separator="" separatorVariant="circle" className="flex-wrap">
                {breadcrumb.map((item) => (
                    <Breadcrumb.Item key={item.name} {...(item.href && { href: item.href })}>
                        {item.name}
                    </Breadcrumb.Item>
                ))}
            </Breadcrumb>
        </div>
    );
}
