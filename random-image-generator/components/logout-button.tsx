"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const res = await fetch("/api/auth/logout");
    if (res.ok) {
      router.push("/auth/login");
    } else {
      console.error("Logout failed");
    }
  };

  return <Button onClick={logout}>Logout</Button>;
}
