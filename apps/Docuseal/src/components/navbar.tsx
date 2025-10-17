"use client";

import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Mail } from "lucide-react";
import { useCounts } from "@/contexts/counts-context";

export function Navbar() {
  const { data: session } = useSession();
  const { submissionsCount, templatesCount, loading } = useCounts();

  // Don't render navbar if user is not authenticated
  if (!session) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-1 ml-2">
          <span className="text-2xl">🐵</span>
          <span className="hidden font-bold sm:inline-block">DocuSeal App</span>
        </Link>

        {/* Right side */}
        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="flex items-center space-x-2">
            {/* Count indicator */}
            <div 
              className="flex items-center space-x-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-md shadow-sm"
              title={`${submissionsCount} submissions / ${templatesCount} templates`}
            >
              <Mail className="h-4 w-4 text-gray-500" />
              {loading ? (
                <span className="text-gray-500 dark:text-gray-400">...</span>
              ) : (
                <>
                  <span className="font-medium text-gray-700 dark:text-gray-300">{submissionsCount}</span>
                  <span className="text-gray-400">/</span>
                  <span className="text-gray-500 dark:text-gray-400">{templatesCount}</span>
                </>
              )}
            </div>
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={session.user?.image || "/avatars/01.png"}
                      alt={session.user?.name || "User"}
                    />
                    <AvatarFallback className="bg-muted">
                      {session.user?.name
                        ? session.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user?.name || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => signOut()}
                  className="text-red-600 focus:text-red-600 dark:text-red-400"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}