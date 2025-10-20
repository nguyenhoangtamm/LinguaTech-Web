import cn from '@/utils/class-names';
import Breadcrumb from '@/components/ui/breadcrumb';

export type PageHeaderTypes = {
    title: string;
    breadcrumb: { name: string; href?: string }[];
    className?: string;
};

export default function PageHeader({
    title,
    breadcrumb,
    children,
    className,
}: React.PropsWithChildren<PageHeaderTypes>) {
    return (
        <header className={cn('mb-2 @container xs:-mt-2 lg:mb-0', className)}>
            <div className="flex flex-row items-center justify-between">
                <div className="flex-[2]">
                    <h2 className="mb-2 text-[22px] lg:text-2xl 4xl:text-[26px] font-semibold">
                        {title}
                    </h2>
                    <Breadcrumb
                        separator=""
                        separatorVariant="circle"
                        className="flex-wrap"
                    >
                        {breadcrumb.map((item) => (
                            <Breadcrumb.Item
                                key={item.name}
                                {...(item?.href && { href: item?.href })}
                            >
                                {item.name}
                            </Breadcrumb.Item>
                        ))}
                    </Breadcrumb>
                </div>

                {/* Children chiếm 1 phần */}
                <div className="flex-[1]">
                    {children}
                </div>
            </div>
        </header>
    );
}
