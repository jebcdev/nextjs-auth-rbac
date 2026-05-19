import { getCurrentSessionAction } from "@/features/shared/actions/get-current-session.action";
import { redirect } from "next/navigation";

export default async function PrivateLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { isAuthenticated } = await getCurrentSessionAction();

    if (!isAuthenticated) redirect("/login");

    return <>{children}</>;
}
