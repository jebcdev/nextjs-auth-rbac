
export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
            <main className={`p-0.5 antialiased`}>
                {children}
            </main>
    );
}