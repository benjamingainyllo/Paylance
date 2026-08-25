"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [timedOut, setTimedOut] = useState(false);

  // If loading takes more than 5 seconds, redirect to login
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setTimedOut(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [loading]);

  // Redirect to login if timed out or no user after loading
  useEffect(() => {
    if (timedOut || (!loading && !user)) {
      router.replace("/login");
    }
  }, [timedOut, loading, user, router]);

  if (loading && !timedOut) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-white"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-white"></div>
      </div>
    );
  }

  return <>{children}</>;
}
