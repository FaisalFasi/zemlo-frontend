"use client";

import QueryProvider from "../query/query-provider";

type AppProvidersProps = {
  children: React.ReactNode;
};

export default function AppProviders({ children }: AppProvidersProps) {
  return <QueryProvider>{children}</QueryProvider>;
}
