import { AppSidebar } from "@/components/app-sidebar";
import AppTopMenu from "@/components/app-topmenu";
import { SidebarProvider } from "@/components/ui/sidebar";
import "@/styles/globals.css";

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <AppSidebar />
          <main className="bg-gray-50 w-full">
            <AppTopMenu />
            <div className="p-6">
              {children}
            </div>
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
