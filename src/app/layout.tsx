import "./globals.css";
import { Roboto } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const roboto = Roboto({
    subsets: ["latin"],
    variable: "--font-sans",
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
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
