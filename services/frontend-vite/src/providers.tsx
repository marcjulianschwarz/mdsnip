import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import DropToast from "./components/DropToast/DropToast";
import { PreferencesProvider } from "./providers/PreferencesProvider";
import { UserProvider } from "./providers/UserProvider";
import SidebarProvider from "./providers/sidebar-provider";
import { DropToastProvider } from "./providers/DropToastProvider";

export default function QueryProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <PreferencesProvider>
          <DropToastProvider>
            <DropToast />
            <SidebarProvider>{children}</SidebarProvider>
          </DropToastProvider>
        </PreferencesProvider>
      </UserProvider>
      {/*<ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>*/}
    </QueryClientProvider>
  );
}
