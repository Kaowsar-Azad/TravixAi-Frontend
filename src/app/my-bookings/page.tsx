import API_BASE_URL from "@/lib/apiUrl";
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { 
  PiEyeDuotone, PiMapPinLine, PiCalendarBlankDuotone, PiCurrencyDollarDuotone
} from "react-icons/pi";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function MyBookingsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  const [bookings, setBookings] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(`/login?next=/my-bookings`);
      }
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      const fetchMyBookings = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/api/bookings/my-bookings`, {
            withCredentials: true
          });
          setBookings(res.data);
        } catch (error) {
          console.error("Failed to fetch bookings", error);
        } finally {
          setIsFetching(false);
        }
      };
      fetchMyBookings();
    }
  }, [user]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking request?")) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/api/bookings/${bookingId}/cancel`, {
        withCredentials: true
      });
      setBookings(prev => prev.filter(b => b._id !== bookingId));
      toast.success("Booking request cancelled successfully");
    } catch (error) {
      console.error("Failed to cancel booking", error);
      toast.error("Failed to cancel booking. Please try again.");
    }
  };

  if (isLoading || !user) return null;

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex-1 bg-neutral-bg py-12 px-6 lg:px-8 min-h-screen">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className="font-display font-semibold text-3xl md:text-4xl text-primary mb-2">My Bookings</h1>
            <p className="text-text-muted text-sm md:text-base">View your upcoming trips and booking statuses.</p>
          </div>
          <Link href="/explore">
            <Button variant="primary">Explore More Plans</Button>
          </Link>
        </div>

        {isFetching ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-accent border-t-transparent rounded-full"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-surface border border-border rounded-3xl shadow-sm">
            <div className="w-20 h-20 bg-neutral-bg rounded-full flex items-center justify-center mb-4 text-text-muted">
              <PiMapPinLine size={40} />
            </div>
            <h2 className="text-2xl font-display font-semibold text-primary mb-2">No bookings yet</h2>
            <p className="text-text-muted mb-6 max-w-md">You haven't booked any travel plans. Explore our amazing destinations and book your next adventure!</p>
            <Link href="/explore">
              <Button variant="primary">Start Exploring</Button>
            </Link>
          </div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {bookings.map((booking: any) => (
              <motion.div key={booking._id} variants={itemVariant} className="bg-surface rounded-3xl border border-border overflow-hidden flex flex-col hover:shadow-xl hover:border-accent/30 transition-all duration-300 group">
                
                {/* Image header */}
                <div className="h-48 relative overflow-hidden bg-neutral-bg">
                  {booking.plan?.images && booking.plan.images.length > 0 ? (
                    <img src={booking.plan.images[0]} alt={booking.planTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted">No Image</div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge 
                      variant="secondary" 
                      className={`backdrop-blur-md border-none shadow-sm font-semibold ${
                        booking.status === "Confirmed" 
                          ? "bg-emerald-500/90 text-white" 
                          : booking.status === "Rejected"
                            ? "bg-rose-500/90 text-white"
                            : "bg-amber-500/90 text-white"
                      }`}
                    >
                      {booking.status === "Requested" ? "Awaiting Confirmation" : booking.status}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  {booking.planTitle && booking.planTitle.includes('Customized') && (
                    <div className="mb-2">
                       <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">✨ Customized Plan</span>
                    </div>
                  )}
                  <h3 className="font-display font-semibold text-xl text-primary mb-3 line-clamp-2" title={booking.planTitle}>
                    {booking.planTitle}
                  </h3>
                  
                  <div className="flex flex-col gap-2 mt-auto">
                    {booking.plan?.duration && (
                      <div className="flex items-center gap-2 text-sm text-text-muted">
                        <PiCalendarBlankDuotone size={18} className="text-secondary" />
                        <span>{booking.plan.duration}</span>
                      </div>
                    )}
                    {booking.plan?.price && (
                      <div className="flex items-center gap-2 text-sm text-text-muted">
                        <PiCurrencyDollarDuotone size={18} className="text-accent" />
                        <span className="font-semibold text-text">{booking.plan.price}</span>
                      </div>
                    )}
                    <div className="text-xs text-text-muted mt-2 pt-3 border-t border-dashed border-border">
                      Booked on: {new Date(booking.bookingDate).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="mt-5 pt-1 flex gap-2">
                    <Link href={`/explore/${booking.planId}`} className={booking.status === "Requested" ? "w-1/2" : "w-full"}>
                      <Button variant="secondary" className="w-full text-sm py-2" icon={<PiEyeDuotone size={16} />}>View Details</Button>
                    </Link>
                    {booking.status === "Requested" && (
                      <Button 
                        variant="secondary" 
                        className="w-1/2 text-sm py-2 !bg-rose-50/50 !text-rose-600 !border-rose-200 hover:!bg-rose-100 hover:!border-rose-300"
                        onClick={() => handleCancelBooking(booking._id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
