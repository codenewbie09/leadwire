import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "PitchPerfect — AI Sales Roleplay Training",
  description: "Practice sales conversations against AI prospects",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("h-full antialiased", "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
