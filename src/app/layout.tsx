import "./globals.css";
import { Roboto } from "next/font/google";
import { cn } from "@/lib/utils";

const roboto = Roboto({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={cn("h-full", "antialiased", "font-sans", roboto.variable)}>
            <body className="dark min-h-full flex flex-col">
                {children}
            </body>
        </html>
    );
}
