"use client";

import type { ReactNode } from "react";
import { AppToaster } from "@/components/ui/app-toaster";
import { ThemeProvider } from "@/components/app/theme-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      <AppToaster />
    </ThemeProvider>
  );
}
