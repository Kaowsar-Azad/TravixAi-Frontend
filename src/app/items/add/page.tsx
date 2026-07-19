"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { 
  PiMapPinLine, PiCurrencyDollarDuotone, PiImageDuotone, 
  PiCalendarBlankDuotone, PiTextTDuotone
} from "react-icons/pi";

export default function AddPlanPage() {
  return (
    <div className="flex-1 bg-neutral-bg py-12 px-6 lg:px-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        <div>
          <h1 className="font-display font-semibold text-3xl md:text-4xl text-primary">Add Travel Plan</h1>
          <p className="text-text-muted mt-2">Create a new destination itinerary or travel package.</p>
        </div>

        <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-border shadow-sm">
          <form className="flex flex-col gap-6">
            <Input 
              label="Title" 
              placeholder="e.g. Santorini Dream Vacation" 
              icon={<PiMapPinLine size={20} />} 
              required
            />
            
            <Input 
              label="Short Description" 
              placeholder="Brief summary of the trip..." 
              icon={<PiTextTDuotone size={20} />} 
              required
            />

            <div className="flex flex-col w-full gap-1.5">
              <label className="text-sm font-medium text-text">Full Description</label>
              <textarea 
                className="w-full min-h-[120px] rounded-lg border border-border bg-surface px-4 py-3 text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-y"
                placeholder="Detailed itinerary, highlights, and included activities..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Price / Budget" 
                type="text" 
                placeholder="$1,200" 
                icon={<PiCurrencyDollarDuotone size={20} />} 
                required
              />
              <Input 
                label="Duration" 
                type="text" 
                placeholder="5 Days, 4 Nights" 
                icon={<PiCalendarBlankDuotone size={20} />} 
                required
              />
            </div>

            <Input 
              label="Image URL" 
              type="url" 
              placeholder="https://images.unsplash.com/photo-..." 
              icon={<PiImageDuotone size={20} />} 
            />

            <div className="flex justify-end gap-4 mt-4 pt-6 border-t border-border">
              <Button variant="secondary" type="button">Cancel</Button>
              <Button variant="primary" type="submit">Publish Plan</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
