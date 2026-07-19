"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { 
  PiMapPinLine, PiCurrencyDollarDuotone, PiImageDuotone, 
  PiCalendarBlankDuotone, PiTextTDuotone, PiUploadSimpleDuotone,
  PiXCircleDuotone, PiPlusDuotone
} from "react-icons/pi";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddPlanPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form State
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push(`/login?next=${pathname}`);
      } else if (user.role !== "admin" && user.role !== "travel_agent") {
        router.push("/");
      }
    }
  }, [user, authLoading, router, pathname]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...newFiles]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addUrl = () => {
    if (currentUrl.trim()) {
      setImageUrls(prev => [...prev, currentUrl.trim()]);
      setCurrentUrl("");
    }
  };

  const removeUrl = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      let finalImageUrls: string[] = [...imageUrls];
      if (currentUrl.trim()) {
        finalImageUrls.push(currentUrl.trim());
      }

      // 1. If there are files, upload them to our backend
      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("image", file);

          const uploadRes = await axios.post("http://localhost:5000/api/upload", formData, {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data"
            }
          });
          
          if (uploadRes.data.url) {
            return uploadRes.data.url;
          } else {
            throw new Error(`Failed to get image URL for ${file.name}`);
          }
        });

        const uploadedUrls = await Promise.all(uploadPromises);
        finalImageUrls = [...finalImageUrls, ...uploadedUrls];
      }

      // 2. Submit the Travel Plan to our backend
      const planRes = await axios.post("http://localhost:5000/api/items", {
        title,
        shortDescription,
        fullDescription,
        price,
        duration,
        images: finalImageUrls,
        category: "Uncategorized"
      }, {
        withCredentials: true
      });

      if (planRes.status === 201) {
        toast.success("Travel plan created successfully!");
        router.push("/items/manage");
      }
    } catch(err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || err.message || "Failed to create travel plan");
      setError(err.response?.data?.error || err.message || "Failed to create travel plan");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || !user) return null;
  return (
    <div className="flex-1 bg-neutral-bg py-12 px-6 lg:px-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        <div>
          <h1 className="font-display font-semibold text-3xl md:text-4xl text-primary">Add Travel Plan</h1>
          <p className="text-text-muted mt-2">Create a new destination itinerary or travel package.</p>
        </div>

        <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-border shadow-sm">
          {error && (
            <div className="p-3 mb-6 rounded-lg bg-red-100 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <Input 
              label="Title" 
              placeholder="e.g. Santorini Dream Vacation" 
              icon={<PiMapPinLine size={20} />} 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            
            <Input 
              label="Short Description" 
              placeholder="Brief summary of the trip..." 
              icon={<PiTextTDuotone size={20} />} 
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              required
            />

            <div className="flex flex-col w-full gap-1.5">
              <label className="text-sm font-medium text-text">Full Description</label>
              <textarea 
                className="w-full min-h-[120px] rounded-lg border border-border bg-surface px-4 py-3 text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-y"
                placeholder="Detailed itinerary, highlights, and included activities..."
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Price / Budget" 
                type="text" 
                placeholder="$1,200" 
                icon={<PiCurrencyDollarDuotone size={20} />} 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
              <Input 
                label="Duration" 
                type="text" 
                placeholder="5 Days, 4 Nights" 
                icon={<PiCalendarBlankDuotone size={20} />} 
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text">Images</label>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 flex gap-2">
                    <Input 
                      type="url" 
                      placeholder="Paste an Image URL..." 
                      icon={<PiImageDuotone size={20} />} 
                      value={currentUrl}
                      onChange={(e) => setCurrentUrl(e.target.value)}
                    />
                    <Button 
                      type="button" 
                      variant="secondary" 
                      icon={<PiPlusDuotone size={20} />}
                      onClick={addUrl}
                      className="shrink-0"
                    >
                      Add URL
                    </Button>
                  </div>
                  <div className="flex-shrink-0">
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    <Button 
                      type="button" 
                      variant="secondary" 
                      icon={<PiUploadSimpleDuotone size={20} />}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Upload Files
                    </Button>
                  </div>
                </div>

                {(imageFiles.length > 0 || imageUrls.length > 0) && (
                  <div className="flex flex-col gap-2 mt-2">
                    <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Selected Images</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {imageUrls.map((url, idx) => (
                        <div key={`url-${idx}`} className="flex items-center justify-between p-3 border border-border rounded-lg bg-neutral-bg">
                          <span className="text-sm text-text font-medium truncate flex-1">{url}</span>
                          <button type="button" onClick={() => removeUrl(idx)} className="text-text-muted hover:text-destructive transition-colors ml-4 shrink-0">
                            <PiXCircleDuotone size={20} />
                          </button>
                        </div>
                      ))}
                      {imageFiles.map((file, idx) => (
                        <div key={`file-${idx}`} className="flex items-center justify-between p-3 border border-border rounded-lg bg-neutral-bg">
                          <span className="text-sm text-text font-medium truncate flex-1">{file.name}</span>
                          <button type="button" onClick={() => removeFile(idx)} className="text-text-muted hover:text-destructive transition-colors ml-4 shrink-0">
                            <PiXCircleDuotone size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-4 pt-6 border-t border-border">
              <Button variant="secondary" type="button" onClick={() => router.back()}>Cancel</Button>
              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? "Publishing..." : "Publish Plan"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
