"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { 
  PiMapPinLine, PiStarFill, PiCheckCircleDuotone, 
  PiUsersThreeDuotone, PiCameraDuotone, PiClockDuotone
} from "react-icons/pi";
import { LuCalendarDays } from "react-icons/lu";
import Link from "next/link";
import { TrendChart } from "@/components/charts/TrendChart";
import { MatchScore } from "@/components/ui/MatchScore";

export default function DetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="flex-1 bg-neutral-bg py-8 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        
        {/* Breadcrumb & Title */}
        <div>
          <div className="text-sm text-text-muted mb-4 flex items-center gap-2">
            <Link href="/explore" className="hover:text-accent transition-colors">Explore</Link>
            <span>/</span>
            <span className="text-text">Destination Details</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="font-display font-semibold text-4xl md:text-5xl text-primary">Santorini Dream Vacation</h1>
            <MatchScore score={95} />
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm font-medium">
            <span className="flex items-center gap-1 text-text-muted"><PiMapPinLine size={18} /> Santorini, Greece</span>
            <span className="flex items-center gap-1 text-accent"><PiStarFill size={18} /> 4.9 (120 reviews)</span>
            <Badge variant="secondary">Relaxation</Badge>
          </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[400px] md:h-[500px]">
          <div className="md:col-span-2 h-full rounded-2xl overflow-hidden group">
            <img src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5f1?w=1200&q=80" alt="Santorini" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="hidden md:flex flex-col gap-4 h-full">
            <div className="flex-1 rounded-2xl overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=600&q=80" alt="Santorini 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="flex-1 rounded-2xl overflow-hidden relative group">
              <img src="https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600&q=80" alt="Santorini 3" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/30 transition-colors">
                <span className="text-white font-medium flex items-center gap-2"><PiCameraDuotone size={24} /> View All Photos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content & Sidebar */}
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Details */}
          <div className="flex-1 flex flex-col gap-10">
            <section>
              <h2 className="font-display font-semibold text-2xl text-primary mb-4">About this trip</h2>
              <p className="text-text leading-relaxed">
                Experience the magic of Santorini with this carefully curated 5-day itinerary. From the iconic blue-domed churches of Oia to the stunning sunsets over the caldera, every moment is planned for maximum relaxation and cultural immersion. Enjoy local wine tastings, private boat tours, and authentic Greek cuisine.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-2xl text-primary mb-4">Trip Highlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {["Sunset catamaran cruise", "Wine tasting tour", "Oia village walking tour", "Akrotiri archaeological site", "Red Beach visit", "Authentic Greek cooking class"].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <PiCheckCircleDuotone size={24} className="text-secondary shrink-0" />
                    <span className="text-text">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-display font-semibold text-2xl text-primary mb-4">Itinerary Overview</h2>
              <div className="flex flex-col gap-6 border-l-2 border-border ml-3 pl-6 relative">
                {[
                  { day: "Day 1", title: "Arrival & Oia Sunset", desc: "Settle into your hotel and enjoy your first spectacular sunset over the caldera." },
                  { day: "Day 2", title: "Caldera Boat Tour", desc: "Sail around the volcano, swim in hot springs, and dine on board." },
                  { day: "Day 3", title: "Wine & Culture", desc: "Visit traditional wineries and ancient Akrotiri ruins." },
                ].map((day, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[35px] top-1 w-4 h-4 rounded-full bg-accent ring-4 ring-neutral-bg" />
                    <h3 className="font-semibold text-lg text-primary">{day.day}: {day.title}</h3>
                    <p className="text-text-muted mt-1">{day.desc}</p>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h2 className="font-display font-semibold text-2xl text-primary mb-4">Seasonal Price Trend</h2>
              <p className="text-text-muted mb-4">See how average prices fluctuate throughout the year to plan your budget perfectly.</p>
              <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
                <TrendChart />
              </div>
            </section>
          </div>

          {/* Sticky Booking Card */}
          <div className="lg:w-80 lg:shrink-0">
            <div className="sticky top-24 bg-surface p-6 rounded-2xl border border-border shadow-xl">
              <div className="flex items-end gap-2 mb-6">
                <span className="font-display font-semibold text-3xl text-primary">$1,200</span>
                <span className="text-text-muted pb-1">/ person</span>
              </div>
              
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center gap-3 text-sm text-text">
                  <LuCalendarDays size={20} className="text-secondary" />
                  <span>5 Days, 4 Nights</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-text">
                  <PiUsersThreeDuotone size={20} className="text-secondary" />
                  <span>Perfect for couples/groups</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-text">
                  <PiClockDuotone size={20} className="text-secondary" />
                  <span>Flexible dates available</span>
                </div>
              </div>
              
              <Button variant="cta" className="w-full mb-4">Book this Plan</Button>
              <Button variant="secondary" className="w-full">Customize with AI</Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
