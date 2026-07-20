"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PiEnvelopeDuotone, PiLockKeyDuotone, PiSparkleDuotone } from "react-icons/pi";

import { signIn } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { FaGoogle } from "react-icons/fa6";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextRoute = searchParams?.get("next") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await signIn.email({
        email,
        password,
        callbackURL: nextRoute,
        fetchOptions: {
          onError: (ctx: any) => {
            const msg = ctx.error.message || "Invalid credentials.";
            setError(msg);
            toast.error(msg);
          },
          onSuccess: () => {
            toast.success("Logged in successfully!");
            router.push(nextRoute);
          }
        }
      });
    } catch (err: any) {
      console.error(err);
      const msg = err.message || "An unexpected error occurred.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
      await signIn.social({
        provider: "google",
        callbackURL: `${origin}${nextRoute}`,
      });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to log in with Google.");
    }
  };

  const handleDemoLogin = async (role: "traveler" | "agent") => {
    const emailToUse = role === "traveler" ? "traveler@travix.ai" : "agent@travix.ai";
    setEmail(emailToUse);
    setPassword("password123");
    setIsLoading(true);
    setError("");

    try {
      await signIn.email({
        email: emailToUse,
        password: "password123",
        callbackURL: nextRoute,
        fetchOptions: {
          onError: (ctx: any) => {
            const msg = ctx.error.message || "Invalid credentials.";
            setError(msg);
            toast.error(msg);
            setIsLoading(false);
          },
          onSuccess: () => {
            toast.success(`Logged in as Demo ${role === "traveler" ? "Traveler" : "Agent"}!`);
            router.push(nextRoute);
          }
        }
      });
    } catch (err: any) {
      console.error(err);
      const msg = err.message || "An unexpected error occurred.";
      setError(msg);
      toast.error(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex min-h-[calc(100vh-64px)]">
      {/* Left side - Marketing/Image */}
      <div className="hidden lg:flex w-1/2 bg-primary relative overflow-hidden flex-col justify-center p-16">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80" 
            alt="Travel background" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
        </div>
        <div className="relative z-10 text-neutral-bg">
          <h2 className="font-display font-semibold text-5xl mb-6">Welcome back to the world.</h2>
          <p className="text-xl text-neutral-bg/80 max-w-md">Your personal AI travel assistant is ready to plan your next adventure.</p>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-16 bg-surface">
        <div className="w-full max-w-md flex flex-col gap-8">
          <div className="text-center lg:text-left">
            <h1 className="font-display font-semibold text-3xl text-primary mb-2">Sign in to Travix AI</h1>
            <p className="text-text-muted">Enter your details to access your account.</p>
          </div>

          <div className="flex flex-col gap-4">

            {error && (
              <div className="p-3 rounded-lg bg-red-100 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <form className="flex flex-col gap-4" onSubmit={handleLogin}>
              <Input 
                label="Email Address" 
                type="email" 
                placeholder="you@example.com" 
                icon={<PiEnvelopeDuotone size={20} />} 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input 
                label="Password" 
                type="password" 
                placeholder="••••••••" 
                icon={<PiLockKeyDuotone size={20} />} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              
              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-accent focus:ring-accent" />
                  <span className="text-sm text-text">Remember me</span>
                </label>
                <Link href="#" className="text-sm font-medium text-accent hover:underline">Forgot password?</Link>
              </div>

              <Button variant="primary" type="submit" className="w-full mt-4" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="grid grid-cols-2 gap-3 mt-2">
                <Button 
                  variant="secondary" 
                  type="button" 
                  className="w-full text-xs font-semibold py-2 border border-amber-500/20 hover:border-amber-500/40 bg-amber-500/5 text-amber-700 hover:bg-amber-500/10"
                  onClick={() => handleDemoLogin("traveler")}
                  disabled={isLoading}
                >
                  Demo Traveler
                </Button>
                <Button 
                  variant="secondary" 
                  type="button" 
                  className="w-full text-xs font-semibold py-2 border border-indigo-500/20 hover:border-indigo-500/40 bg-indigo-500/5 text-indigo-700 hover:bg-indigo-500/10"
                  onClick={() => handleDemoLogin("agent")}
                  disabled={isLoading}
                >
                  Demo Agent
                </Button>
              </div>
            </form>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-surface px-2 text-text-muted">Or continue with</span>
              </div>
            </div>

            <Button 
              variant="secondary" 
              type="button" 
              className="w-full flex items-center justify-center gap-2 border border-border"
              onClick={handleGoogleLogin}
            >
              <FaGoogle className="text-red-500" size={18} /> Continue with Google
            </Button>
          </div>

          <p className="text-center text-sm text-text-muted mt-4">
            Don&apos;t have an account? <Link href="/register" className="font-medium text-accent hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex justify-center items-center h-[50vh]">
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
