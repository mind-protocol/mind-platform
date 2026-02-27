// DOCS: docs/frontend/app_shell/PATTERNS_App_Shell.md
import "./globals.css";
import { Inter, JetBrains_Mono } from "next/font/google";
import { getLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/lib/theme";

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
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent" as const,
    title: "MIND Tracker",
  },
};

export const viewport = {
  themeColor: "#f59e0b",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={`dark ${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-sans" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            var ow=console.warn,oe=console.error;
            var skip=[
              'DEPRECATED','Default export is deprecated',
              'DialogContent','DialogTitle','aria-describedby','Missing \x60Description\x60',
              'Phantom was registered','SES Removing',
              'solflare-detect','AdUnit','content-script'
            ];
            function f(orig){return function(){
              var s=String(arguments[0]||'');
              if(skip.some(function(k){return s.indexOf(k)!==-1}))return;
              return orig.apply(console,arguments);
            }}
            console.warn=f(ow);console.error=f(oe);
          })();
        `}} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
