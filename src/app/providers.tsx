"use client";

import { HeroUIProvider } from "@heroui/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider className="flex flex-col flex-1 h-full">
      {children}
    </HeroUIProvider>
  );
}
