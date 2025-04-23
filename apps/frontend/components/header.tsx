"use client";

import Link from "next/link";
import { useAuth } from "@/context/useAuthContext";
import { LogoutButton } from "@/components/logout-button";
import { loginStart, registerStart } from "@/lib/utils";

export function Header() {
  const { user, isLoading } = useAuth();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Sophon
        </Link>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
          ) : user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
              <LogoutButton />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => loginStart("name")}
                className="text-sm font-medium text-muted-foreground hover:text-primary"
              >
                Log in
              </button>
              <button
                onClick={() => registerStart("name")}
                className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
