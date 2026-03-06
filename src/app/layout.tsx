import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Paraallax | 5-Game Challenge",
    description: "Complete 5 unique games to reach the end!",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
