import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronDown } from "lucide-react";

export default function AppTopMenu() {
    return (
        <div className="w-full bg-card border-b sticky top-0 z-50">
              <div className="px-4 lg:px-8" >
                <div className="flex items-center justify-between h-16">
                  <div className="inline"></div>
                  <div className="flex items-center gap-4">
                  
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center py-1 px-3 gap-4 hover:bg-gray-100" >
                        <Avatar className="h-10 w-10 ">
                          <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                          <AvatarFallback className="text-lg">CN</AvatarFallback>
                        </Avatar>
                        Account
                        <ChevronDown size={16}/>
                        </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Team</DropdownMenuItem>
                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                  </div>
                </div>
              </div>
            </div>
    );
}