import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Inventory Management",
  description: "Inventory management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
