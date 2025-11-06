'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserInfo } from "@/types/user";
import { ChevronDown } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface AppTopMenuProps {
  userInfo: UserInfo | null;
}

export default function AppTopMenu({ userInfo }: AppTopMenuProps) {

  return (
    <div className="w-full bg-card border-b sticky top-0 z-50">
      <div className="px-4 lg:px-8" >
        <div className="flex items-center justify-between h-16">
          <div className="inline"></div>
          <div className="flex items-center gap-4">

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center py-1 px-3 gap-4 hover:bg-gray-100" >
                <Avatar className="h-10 w-10 border-2 border-purple-600">
                  <AvatarImage src={userInfo?.avatar} alt="Avatar" />
                  <AvatarFallback className="text-lg">Nickname</AvatarFallback>
                </Avatar>
                {userInfo?.username}
                <ChevronDown size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{userInfo?.username}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/admin/">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/videos">Videos</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/admin/billing">Billing</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: `${window.location.origin}/` })}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}