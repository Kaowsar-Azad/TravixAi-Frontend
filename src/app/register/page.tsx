"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PiEnvelopeDuotone, PiLockKeyDuotone, PiUserDuotone, PiImageDuotone, PiUploadSimpleDuotone, PiXCircleDuotone } from "react-icons/pi";
import { FcGoogle } from "react-icons/fc";
import { signUp } from "@/lib/auth-client";
import axios from "axios";

export default function RegisterPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("traveler");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setAvatarUrl(""); 
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = () => {
    setAvatarFile(null);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      let finalAvatarUrl = avatarUrl.trim();

      // Upload file if selected
      if (avatarFile) {
        const formData = new FormData();
        formData.append("image", avatarFile);

        const uploadRes = await axios.post("http://localhost:5000/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        
        if (uploadRes.data.url) {
          finalAvatarUrl = uploadRes.data.url;
        } else {
          throw new Error("Failed to get image URL from upload response");
        }
      }

      const signUpData: any = {
        name,
        email,
        password,
        callbackURL: "/login",
        role,
        fetchOptions: {
          onError: (ctx: any) => {
            setError(ctx.error.message || "Something went wrong during registration.");
          },
          onSuccess: () => {
            router.push("/login");
          }
        }
      };

      if (finalAvatarUrl) {
        signUpData.image = finalAvatarUrl;
      }

      await signUp.email(signUpData);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

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

            {error && (
              <div className="p-3 rounded-lg bg-red-100 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <form className="flex flex-col gap-4" onSubmit={handleRegister}>
              <Input 
                label="Full Name" 
                type="text" 
                placeholder="John Doe" 
                icon={<PiUserDuotone size={20} />} 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
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
                placeholder="Create a strong password" 
                icon={<PiLockKeyDuotone size={20} />} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="flex flex-col gap-2 mt-2">
                <label className="text-sm font-medium text-text">I want to:</label>
                <div className="flex gap-4">
                  <label className={`flex-1 border rounded-xl p-4 cursor-pointer transition-all ${role === 'traveler' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-primary">Explore & Book</span>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${role === 'traveler' ? 'border-primary' : 'border-border'}`}>
                        {role === 'traveler' && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                    </div>
                    <p className="text-xs text-text-muted">I'm a Traveler</p>
                    <input type="radio" name="role" value="traveler" checked={role === 'traveler'} onChange={() => setRole('traveler')} className="hidden" />
                  </label>
                  <label className={`flex-1 border rounded-xl p-4 cursor-pointer transition-all ${role === 'travel_agent' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-primary">Create Plans</span>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${role === 'travel_agent' ? 'border-primary' : 'border-border'}`}>
                        {role === 'travel_agent' && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                    </div>
                    <p className="text-xs text-text-muted">I'm a Travel Agent</p>
                    <input type="radio" name="role" value="travel_agent" checked={role === 'travel_agent'} onChange={() => setRole('travel_agent')} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <label className="text-sm font-medium text-text">Profile Picture (Optional)</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    {avatarFile ? (
                      <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-neutral-bg h-[46px]">
                        <span className="text-sm text-text font-medium truncate flex-1">{avatarFile.name}</span>
                        <button type="button" onClick={removeFile} className="text-text-muted hover:text-destructive transition-colors ml-4 shrink-0">
                          <PiXCircleDuotone size={20} />
                        </button>
                      </div>
                    ) : (
                      <Input 
                        type="url" 
                        placeholder="Paste URL or upload..." 
                        icon={<PiImageDuotone size={20} />} 
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        disabled={!!avatarFile}
                      />
                    )}
                  </div>
                  
                  <div className="flex-shrink-0">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    <Button 
                      type="button" 
                      variant="secondary" 
                      className="h-[46px]"
                      icon={<PiUploadSimpleDuotone size={20} />}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Upload File
                    </Button>
                  </div>
                </div>
              </div>
              
              <Button type="submit" variant="primary" className="w-full mt-4" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
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
