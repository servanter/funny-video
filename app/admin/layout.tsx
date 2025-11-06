import { AppSidebar } from "@/components/app-sidebar";
import AppTopMenu from "@/components/app-topmenu";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getCurrentUser } from "@/lib/session";
import "@/styles/globals.css";
import { UserInfo } from "@/types/user";

export default async function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = (await getCurrentUser()) as UserInfo;
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <AppSidebar />



          <main className="bg-gray-50 w-full">
            <AppTopMenu userInfo={user} />
            <div className="p-6">
              {children}
            </div>
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
