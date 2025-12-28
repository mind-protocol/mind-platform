// DOCS: docs/frontend/app_shell/PATTERNS_App_Shell.md
import "./globals.css";
import "./connectome/connectome.css";
import "reactflow/dist/style.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Connectome",
  description: "Connectome V1 frontend",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
