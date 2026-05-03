"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Layers3, Github, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export function AuthScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate a network request
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    localStorage.setItem("isLoggedIn", "true");
    if (name) {
      localStorage.setItem("userName", name.split(" ")[0]); // Store first name
      router.push("/onboarding");
    } else {
      router.push("/overview");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      {/* Background Blobs */}
      <div className="absolute -left-[10%] -top-[10%] h-[40%] w-[40%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse"></div>
      <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse delay-700"></div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-2xl shadow-white/20">
            <Layers3 className="h-7 w-7 text-black fill-current" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-white">Paylance</h1>
          <p className="mt-2 text-sm text-zinc-500">
            {isLogin ? "Welcome back to your creator command center." : "Join the next generation of creators."}
          </p>
        </div>

        {/* Auth Card */}
        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleAuth} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="Benjamin Joel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 w-full rounded-xl border border-zinc-800 bg-black px-4 text-sm text-white placeholder:text-zinc-600 focus:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full rounded-xl border border-zinc-800 bg-black pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500" htmlFor="password">
                  Password
                </label>
                {isLogin && (
                  <button type="button" className="text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors">
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full rounded-xl border border-zinc-800 bg-black pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-white text-sm font-bold text-black transition-all hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-3 text-zinc-500 backdrop-blur-xl">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex h-12 items-center justify-center gap-3 rounded-xl border border-zinc-800 bg-black text-sm font-medium text-white transition-colors hover:bg-zinc-900 active:scale-[0.98]">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>
            <button className="flex h-12 items-center justify-center gap-3 rounded-xl border border-zinc-800 bg-black text-sm font-medium text-white transition-colors hover:bg-zinc-900 active:scale-[0.98]">
              <Github className="h-5 w-5" />
              GitHub
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-zinc-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="font-semibold text-white hover:underline underline-offset-4"
          >
            {isLogin ? "Create account" : "Sign in instead"}
          </button>
        </p>
      </div>
    </div>
  );
}
