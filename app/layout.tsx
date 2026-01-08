import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Mantle Mentorship",
  description:
    "Transferring the practical & life-based skill mantle to next future leaders",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`nunito antialiased`}>{children}</body>
    </html>
  );
}
