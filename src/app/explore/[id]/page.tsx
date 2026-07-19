"use client";

import { useEffect, useState } from "react";
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
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function DetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const [item, setItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [hasBooked, setHasBooked] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      const fetchItem = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/items/${id}`);
          setItem(res.data);
        } catch (error) {
          console.error("Failed to fetch item details", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      const checkBookingStatus = async () => {
        if (!user) return;
        try {
          const res = await axios.get(`http://localhost:5000/api/bookings/check/${id}`, {
            withCredentials: true
          });
          setHasBooked(res.data.hasBooked);
        } catch (error) {
          console.error("Failed to check booking status", error);
        }
      };

      fetchItem();
      checkBookingStatus();
    }
  }, [id, user]);

  if (isLoading) {
    return (
      <div className="flex-1 bg-neutral-bg py-8 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col gap-8">
          <div className="animate-pulse bg-surface h-20 rounded-lg"></div>
          <div className="animate-pulse bg-surface h-96 rounded-lg"></div>
          <div className="animate-pulse bg-surface h-48 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex-1 flex justify-center items-center h-[50vh] text-text-muted">
        Destination not found.
      </div>
    );
  }

  const primaryImage = (item.images && item.images.length > 0) ? item.images[0] : (item.imageUrl || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80");
  const secondaryImage = (item.images && item.images.length > 1) ? item.images[1] : primaryImage;
  const tertiaryImage = (item.images && item.images.length > 2) ? item.images[2] : primaryImage;

  const handleBook = async () => {
    if (!user) {
      router.push(`/login?next=/explore/${id}`);
      return;
    }

    setIsBooking(true);
    try {
      await axios.post("http://localhost:5000/api/bookings", { planId: id }, { withCredentials: true });
      toast.success("Booking successful! Enjoy your trip!");
      setHasBooked(true);
    } catch (error: any) {
      if (error.response?.data?.error === "You have already booked this plan") {
        toast.warning("You have already booked this plan.");
        setHasBooked(true);
      } else {
        toast.error("Failed to book plan. Please try again.");
      }
    } finally {
      setIsBooking(false);
    }
  };

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
            <h1 className="font-display font-semibold text-4xl md:text-5xl text-primary">{item.title}</h1>
            <MatchScore score={95} />
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm font-medium">
            <span className="flex items-center gap-1 text-text-muted"><PiMapPinLine size={18} /> {item.title}</span>
            <span className="flex items-center gap-1 text-accent"><PiStarFill size={18} /> 4.9 (120 reviews)</span>
            <Badge variant="secondary">{item.category || "Uncategorized"}</Badge>
          </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[400px] md:h-[500px]">
          <div className="md:col-span-2 h-full rounded-2xl overflow-hidden group">
            <img src={primaryImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="hidden md:flex flex-col gap-4 h-full">
            <div className="flex-1 rounded-2xl overflow-hidden group">
              <img src={secondaryImage} alt={`${item.title} 2`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="flex-1 rounded-2xl overflow-hidden relative group">
              <img src={tertiaryImage} alt={`${item.title} 3`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
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
              <p className="text-text leading-relaxed whitespace-pre-wrap">
                {item.fullDescription || item.shortDescription}
              </p>
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
                <span className="font-display font-semibold text-3xl text-primary">{item.price}</span>
                <span className="text-text-muted pb-1">/ person</span>
              </div>
              
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center gap-3 text-sm text-text">
                  <LuCalendarDays size={20} className="text-secondary" />
                  <span>{item.duration}</span>
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
              
              <Button 
                variant="cta" 
                className={`w-full mb-4 ${hasBooked ? 'bg-emerald-500 hover:bg-emerald-600 border-emerald-500' : ''}`} 
                onClick={handleBook} 
                disabled={isBooking || hasBooked}
                icon={hasBooked ? <PiCheckCircleDuotone size={20} /> : undefined}
              >
                {hasBooked ? "Already Booked" : isBooking ? "Booking..." : "Book this Plan"}
              </Button>
              <Button variant="secondary" className="w-full">Customize with AI</Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
