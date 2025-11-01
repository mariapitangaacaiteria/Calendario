import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SnackProvider } from "./SnackProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Continuous Calendar",
  description: "A simple, fully customizable React Calendar, styled with Tailwindcss.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="bg-gray-200 dark:bg-slate-900 transition-colors duration-300">
      <body className={`${inter.className} bg-gray-200 dark:bg-slate-900 transition-colors duration-300`}>
        <SnackProvider>
          {children}
        </SnackProvider>
      </body>
    </html>
  );
}
