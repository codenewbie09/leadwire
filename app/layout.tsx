import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Leadwire — LinkedIn Outreach Agent",
  description: "AI-powered prospect qualification and meeting booking",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
