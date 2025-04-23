"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/useAuthContext";
import { User } from "@sophon/shared";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [localUser, setLocalUser] = useState<User | null>(null);

  // Check localStorage first for immediate feedback
  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    if (storedUser) {
      try {
        setLocalUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse stored user data", err);
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_token");
      }
    }
  }, []);

  // Redirect if no user in localStorage or SWR
  useEffect(() => {
    if (!isLoading && !user && !localUser) {
      router.push("/login");
    }
  }, [user, localUser, isLoading, router]);

  // Show loading only if we're waiting for SWR and have no local data
  if (isLoading && !localUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if no user data is available
  if (!user && !localUser) {
    return null;
  }

  return <>{children}</>;
}
