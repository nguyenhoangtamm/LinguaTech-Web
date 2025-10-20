import HydrogenLayout from "@/layouts/hydrogen/layout";

export default function ManageLayout({children}: Readonly<{children: React.ReactNode}>){
    return (
        <HydrogenLayout>{children}</HydrogenLayout>
    )
}