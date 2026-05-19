import "./globals.css";
import { Roboto } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { getCurrentSessionAction } from "@/features/shared/actions";
import { PublicNavbar } from "@/features/public/components";

const roboto = Roboto({
    subsets: ["latin"],
    variable: "--font-sans",
});

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { isAuthenticated, isAdmin, isRegularUser ,currentUser,role} = await getCurrentSessionAction();
    
    return (
        <html
            lang="en"
            className={cn(
                "h-full",
                "antialiased",
                "font-sans",
                roboto.variable,
            )}
        >
            <body className="dark min-h-full flex flex-col">
                <PublicNavbar
                    isAuthenticated={isAuthenticated}
                    isAdmin={isAdmin}
                    isRegularUser={isRegularUser}
                    userName={currentUser?.name || ""}
                    role={role??''}
                />
                <Toaster
                    duration={3000}
                    position="top-right"
                    richColors
                    theme="dark"
                    closeButton
                />
                {children}
            </body>
        </html>
    );
}
