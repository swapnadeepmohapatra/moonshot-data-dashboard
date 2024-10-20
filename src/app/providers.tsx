"use client";

import { DataProvider } from "@/contexts/DataContext";
import { ReactNode, Suspense } from "react";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SessionProvider>
        <DataProvider>{children}</DataProvider>
      </SessionProvider>
    </Suspense>
  );
}
