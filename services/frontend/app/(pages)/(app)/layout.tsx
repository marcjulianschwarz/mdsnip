import SidebarProvider from "@/app/(pages)/(app)/sidebar-provider";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
