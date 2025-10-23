import { redirect } from "next/navigation";
import { routes } from "@/config/routes";

export default function UserHomePage() {
    redirect(routes.user.dashboard);
}