"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { AppToaster } from "@/components/ui/app-toaster";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
    >
      {children}
      <AppToaster />
    </ThemeProvider>
  );
}
