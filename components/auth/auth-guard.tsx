"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      
      if (!isLoggedIn && pathname !== "/") {
        router.replace("/");
      } else if (isLoggedIn && pathname === "/") {
        router.replace("/overview");
      } else {
        setIsReady(true);
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (!mounted) return null;

  if (!isReady) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-white"></div>
      </div>
    );
  }

  return <>{children}</>;
}
