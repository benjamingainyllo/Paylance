"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Layers3, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, CheckCircle2, XCircle, User } from "lucide-react";

export function AuthScreen() {
  const router = useRouter();
  const supabase = createClient();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const passwordChecks = {
    length: password.length >= 8,
    letter: /[a-zA-Z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const allPasswordChecksPass = passwordChecks.length && passwordChecks.letter && passwordChecks.number;
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Sign In
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast.error(error.message);
          setIsLoading(false);
          return;
        }

        toast.success("Welcome back!");
        router.push("/overview");
        router.refresh();
      } else {
        // Sign Up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
            },
            // Skip email confirmation for v1
            emailRedirectTo: `${window.location.origin}/onboarding`,
          },
        });

        if (error) {
          toast.error(error.message);
          setIsLoading(false);
          return;
        }

        // If email confirmation is disabled, user is immediately signed in
        if (data.session) {
          toast.success("Account created! Let's set up your profile.");
          router.push("/onboarding");
          router.refresh();
        } else {
          // Email confirmation is enabled
          toast.success("Check your email to confirm your account!");
          setIsLoading(false);
        }
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/onboarding`,
      },
    });
    if (error) {
      toast.error(error.message);
    }
  };

  const stats = [
    { value: "₦12M+", label: "paid to creators" },
    { value: "3,200+", label: "active creators" },
    { value: "50K+", label: "products sold" },
  ];

  return (
    <div className="flex min-h-screen bg-black">
      {/* Left Column — Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-[440px]">
          {/* Logo */}
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
              <Layers3 className="h-6 w-6 text-black fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Paylance</span>
          </div>

          {/* Progress Steps (signup only) */}
          {!isLogin && (
            <div className="mb-8 flex gap-2">
              <div className="h-1 flex-1 rounded-full bg-blue-500" />
              <div className="h-1 flex-1 rounded-full bg-zinc-800" />
              <div className="h-1 flex-1 rounded-full bg-zinc-800" />
            </div>
          )}

          <h1 className="text-2xl font-bold text-white">
            {isLogin ? "Welcome back" : "Create your Paylance account"}
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            {isLogin ? "Sign in to your creator command center." : "Already have an account? "}
            {!isLogin && (
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="font-semibold text-blue-500 hover:text-blue-400 transition-colors"
              >
                Log in
              </button>
            )}
          </p>

          <form onSubmit={handleAuth} className="mt-8 space-y-5">
            {/* Name fields — signup only */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    required
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 text-sm text-white placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    required
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 text-sm text-white placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="janedoe@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 text-sm text-white placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-400" htmlFor="password">
                  Password
                </label>
                {isLogin && (
                  <button type="button" className="text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 pr-12 text-sm text-white placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Password validation — signup only */}
            {!isLogin && password.length > 0 && (
              <div className="space-y-2 rounded-xl bg-zinc-900/50 border border-zinc-800 p-4">
                {[
                  { check: passwordChecks.length, label: "Must contain 8 characters" },
                  { check: passwordChecks.letter, label: "Must contain a letter" },
                  { check: passwordChecks.number, label: "Must contain a number" },
                ].map((rule) => (
                  <div key={rule.label} className="flex items-center gap-2.5">
                    {rule.check ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-xs ${rule.check ? "text-emerald-400" : "text-red-400"}`}>
                      {rule.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Confirm Password — signup only */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 pr-12 text-sm text-white placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-500 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            )}

            {/* Terms — signup only */}
            {!isLogin && (
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-blue-500 focus:ring-blue-500/20"
                />
                <span className="text-xs leading-relaxed text-zinc-500 group-hover:text-zinc-400 transition-colors">
                  Signing up for a Paylance account means you agree to our{" "}
                  <span className="text-blue-500 hover:underline cursor-pointer">privacy policy</span>{" "}
                  and{" "}
                  <span className="text-blue-500 hover:underline cursor-pointer">terms & conditions</span>
                </span>
              </label>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || (!isLogin && (!allPasswordChecksPass || !passwordsMatch || !agreed))}
              className="group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-blue-600 text-sm font-bold text-white transition-all hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black px-3 text-zinc-600">OR</span>
            </div>
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleGoogleLogin}
              className="flex h-12 items-center justify-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/30 text-sm font-medium text-white transition-colors hover:bg-zinc-800 active:scale-[0.98]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
            <button className="flex h-12 items-center justify-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/30 text-sm font-medium text-white transition-colors hover:bg-zinc-800 active:scale-[0.98]">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.18 0-.36-.02-.53-.06.018-.18.035-.37.035-.55 0-1.15.46-2.22 1.195-3.08.375-.44.88-.8 1.44-1.06.56-.26 1.09-.42 1.58-.43.02.18.04.35.04.49h-.002zm3.995 17.48c-.26.64-.54 1.25-.99 1.87-.62.87-1.27 1.75-2.18 1.77-.86.02-1.14-.56-2.37-.56s-1.56.54-2.48.58c-.92.03-1.62-.95-2.25-1.82-1.28-1.76-2.26-4.97-0.95-7.14.65-1.08 1.8-1.77 3.06-1.79.9-.01 1.75.61 2.3.61.55 0 1.58-.75 2.66-.64.45.02 1.73.18 2.55 1.37-.07.04-1.52.89-1.51 2.66.02 2.11 1.86 2.81 1.88 2.82-.02.06-.3 1.01-.76 2.27zm-6.8-13.17h0z" />
              </svg>
              Apple
            </button>
          </div>

          {/* Toggle login/signup */}
          {isLogin && (
            <p className="mt-8 text-center text-sm text-zinc-500">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="font-semibold text-white hover:text-blue-400 transition-colors"
              >
                Create account
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Right Column — Marketing Panel */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] flex-col justify-center bg-gradient-to-br from-blue-950 via-[#0c1a3a] to-[#0a0a14] border-l border-zinc-800/50 p-12 xl:p-16">
        <div>
          <h2 className="text-3xl font-bold leading-tight text-white">
            Join <span className="text-blue-400">3,200+</span> African creators building with Paylance
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            Paylance allows you to sell any kind of digital product or service to your audience seamlessly. Set up your store in minutes.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm"
            >
              <p className="text-lg font-bold text-blue-400">{stat.value}</p>
              <p className="mt-1 text-[11px] text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Features List */}
        <div className="mt-10 space-y-4">
          {[
            "Sell digital products, courses & memberships",
            "Accept payments via Paystack in Naira",
            "Built-in audience CRM & analytics",
            "Only 3 min to set up your store",
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />
              </div>
              <span className="text-sm text-zinc-300">{feature}</span>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="mt-10 rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
          <p className="text-sm italic leading-relaxed text-zinc-300">
            &ldquo;Paylance helped me go from 0 to ₦2M in revenue in my first 3 months as a creator. The dashboard is fire.&rdquo;
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
            <div>
              <p className="text-xs font-semibold text-white">Amara Okafor</p>
              <p className="text-[11px] text-zinc-500">Content Creator, Lagos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
