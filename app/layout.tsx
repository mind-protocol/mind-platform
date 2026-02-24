// DOCS: docs/frontend/app_shell/PATTERNS_App_Shell.md
import "./globals.css";
import { Inter, JetBrains_Mono } from "next/font/google";
import { getLocale } from "next-intl/server";
import type { ReactNode } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = {
  title: "Mind Protocol",
  description: "Persistent memory for AI agents",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="font-sans" suppressHydrationWarning>{children}</body>
    </html>
  );
}
