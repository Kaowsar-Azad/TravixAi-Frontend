"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PiEnvelopeDuotone, PiLockKeyDuotone, PiSparkleDuotone } from "react-icons/pi";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextRoute = searchParams?.get("next") || "/";

  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login();
      router.push(nextRoute);
    }, 800);
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
            <Button variant="secondary" className="w-full flex justify-center items-center gap-3 bg-white" icon={<FcGoogle size={22} />}>
              Continue with Google
            </Button>
            
            <div className="flex items-center gap-4 my-2">
              <div className="flex-1 border-t border-border"></div>
              <span className="text-text-muted text-sm font-medium">OR</span>
              <div className="flex-1 border-t border-border"></div>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleDemoLogin}>
              <Input 
                label="Email Address" 
                type="email" 
                placeholder="demo@travix.ai" 
                icon={<PiEnvelopeDuotone size={20} />} 
                defaultValue="demo@travix.ai"
              />
              <Input 
                label="Password" 
                type="password" 
                placeholder="••••••••" 
                icon={<PiLockKeyDuotone size={20} />} 
                defaultValue="password123"
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
            </form>
            
            <Button variant="cta" className="w-full" icon={<PiSparkleDuotone size={20} />} onClick={() => handleDemoLogin()} disabled={isLoading}>
              Demo Login
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
