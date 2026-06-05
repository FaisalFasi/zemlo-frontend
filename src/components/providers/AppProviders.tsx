"use client";

import QueryProvider from "@/src/lib/query/query-provider";

type AppProvidersProps = {
  children: React.ReactNode;
};

export default function AppProviders({ children }: AppProvidersProps) {
  return <QueryProvider>{children}</QueryProvider>;
}
