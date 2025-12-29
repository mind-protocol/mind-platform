// DOCS: docs/connectome/page_shell/PATTERNS_Connectome_Page_Shell_Route_Composition_And_User_Control_Surface_Patterns.md
import type { ReactNode } from 'react';

export default function ConnectomeLayout({ children }: { children: ReactNode }) {
  return <div className="connectome-layout">{children}</div>;
}
