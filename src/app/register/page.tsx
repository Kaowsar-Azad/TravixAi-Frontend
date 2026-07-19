import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PiEnvelopeDuotone, PiLockKeyDuotone, PiUserDuotone } from "react-icons/pi";
import { FcGoogle } from "react-icons/fc";

export default function RegisterPage() {
  return (
    <div className="flex-1 flex min-h-[calc(100vh-64px)]">
      {/* Left side - Marketing/Image */}
      <div className="hidden lg:flex w-1/2 bg-primary relative overflow-hidden flex-col justify-center p-16">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80" 
            alt="Travel background" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
        </div>
        <div className="relative z-10 text-neutral-bg">
          <h2 className="font-display font-semibold text-5xl mb-6">Start your journey.</h2>
          <p className="text-xl text-neutral-bg/80 max-w-md">Join Travix AI and let our intelligent assistant craft your perfect itineraries.</p>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-16 bg-surface">
        <div className="w-full max-w-md flex flex-col gap-8">
          <div className="text-center lg:text-left">
            <h1 className="font-display font-semibold text-3xl text-primary mb-2">Create an account</h1>
            <p className="text-text-muted">Sign up to start planning with AI.</p>
          </div>

          <div className="flex flex-col gap-4">
            <Button variant="secondary" className="w-full flex justify-center items-center gap-3 bg-white" icon={<FcGoogle size={22} />}>
              Sign up with Google
            </Button>
            
            <div className="flex items-center gap-4 my-2">
              <div className="flex-1 border-t border-border"></div>
              <span className="text-text-muted text-sm font-medium">OR</span>
              <div className="flex-1 border-t border-border"></div>
            </div>

            <form className="flex flex-col gap-4">
              <Input 
                label="Full Name" 
                type="text" 
                placeholder="John Doe" 
                icon={<PiUserDuotone size={20} />} 
              />
              <Input 
                label="Email Address" 
                type="email" 
                placeholder="you@example.com" 
                icon={<PiEnvelopeDuotone size={20} />} 
              />
              <Input 
                label="Password" 
                type="password" 
                placeholder="Create a strong password" 
                icon={<PiLockKeyDuotone size={20} />} 
              />
              
              <Button variant="primary" className="w-full mt-4">Create Account</Button>
            </form>
          </div>

          <p className="text-center text-sm text-text-muted mt-4">
            Already have an account? <Link href="/login" className="font-medium text-accent hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
