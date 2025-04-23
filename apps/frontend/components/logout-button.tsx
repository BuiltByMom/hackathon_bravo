"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/useAuthContext";

export function LogoutButton() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <Button variant="outline" onClick={handleLogout}>
      {"Log Out"}
    </Button>
  );
}
