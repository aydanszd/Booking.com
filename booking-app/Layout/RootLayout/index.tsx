import React from "react";
import HeaderSelector from "./Header/HeaderSelector";
import Footer from "./Footer/page";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <HeaderSelector />
                {children}
                <Footer />
            </body>
        </html>
    );
}