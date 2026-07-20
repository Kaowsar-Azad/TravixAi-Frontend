"use client";
import API_BASE_URL from "@/lib/apiUrl";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { 
  PiTrashDuotone, PiEyeDuotone, PiPlusDuotone, PiPencilDuotone, 
  PiCurrencyDollarDuotone, PiCalendarBlankDuotone, PiMapPinLine, PiArrowLeftBold
} from "react-icons/pi";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { LuCalendarDays, LuUsers } from "react-icons/lu";
import { toast } from "react-toastify";

export default function ManagePlansPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const [plans, setPlans] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Bookings Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isFetchingBookings, setIsFetchingBookings] = useState(false);
  
  const [viewingPlanDetails, setViewingPlanDetails] = useState<any>(null);
  const [viewingBooking, setViewingBooking] = useState<any>(null);
  const [isLoadingPlanDetails, setIsLoadingPlanDetails] = useState(false);

  const handleViewPlanDetails = async (booking: any) => {
    setViewingBooking(booking);
    setIsLoadingPlanDetails(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/items/${booking.planId}`);
      setViewingPlanDetails(res.data);
    } catch (e) {
      toast.error("Failed to load plan details");
      setViewingBooking(null);
    } finally {
      setIsLoadingPlanDetails(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(`/login?next=${pathname}`);
      } else if (user.role !== "admin" && user.role !== "travel_agent") {
        router.push("/");
      }
    }
  }, [user, isLoading, router, pathname]);

  useEffect(() => {
    if (user) {
      const fetchMyPlans = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/api/items/my-plans`, {
            withCredentials: true
          });
          setPlans(res.data);
        } catch (error) {
          console.error("Failed to fetch plans", error);
        } finally {
          setIsFetching(false);
        }
      };
      fetchMyPlans();
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this travel plan? This action cannot be undone.")) return;
    
    setDeletingId(id);
    try {
      await axios.delete(`${API_BASE_URL}/api/items/${id}`, {
        withCredentials: true
      });
      setPlans(prev => prev.filter(p => p._id !== id));
      toast.success("Plan deleted successfully");
    } catch (error) {
      console.error("Failed to delete plan", error);
      toast.error("Failed to delete the plan. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewBookings = async (planId: string) => {
    setSelectedPlanId(planId);
    setIsModalOpen(true);
    setIsFetchingBookings(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/bookings/plan/${planId}`, {
        withCredentials: true
      });
      setBookings(res.data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
      toast.error("Failed to load bookings.");
    } finally {
      setIsFetchingBookings(false);
    }
  };

  const handleUpdateStatus = async (bookingId: string, status: "Confirmed" | "Rejected") => {
    try {
      await axios.put(`${API_BASE_URL}/api/bookings/${bookingId}/status`, { status }, {
        withCredentials: true
      });
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status } : b));
      
      // Update the plan requests count in real-time
      setPlans(prev => prev.map(p => {
        if (p._id === selectedPlanId) {
          return {
            ...p,
            pendingRequests: Math.max(0, p.pendingRequests - 1)
          };
        }
        return p;
      }));

      toast.success(`Booking ${status.toLowerCase()} successfully`);
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update booking status.");
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
            <h1 className="font-display font-semibold text-3xl md:text-4xl text-primary mb-2">My Travel Plans</h1>
            <p className="text-text-muted text-sm md:text-base">Manage, update, or remove your personal itineraries.</p>
          </div>
          <Link href="/items/add">
            <Button variant="primary" icon={<PiPlusDuotone size={20} />}>Create New Plan</Button>
          </Link>
        </div>

        {/* Loading State */}
        {isFetching && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-surface h-72 rounded-2xl border border-border"></div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isFetching && plans.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-16 bg-surface border border-border border-dashed rounded-3xl text-center"
          >
            <div className="w-24 h-24 mb-6 rounded-full bg-primary/5 flex items-center justify-center text-primary">
              <PiMapPinLine size={48} />
            </div>
            <h3 className="text-2xl font-display font-semibold text-primary mb-3">No Plans Yet</h3>
            <p className="text-text-muted max-w-md mb-8">
              You haven't created any travel plans. Start designing your perfect getaway itinerary today!
            </p>
            <Link href="/items/add">
              <Button variant="cta" icon={<PiPlusDuotone size={20} />}>Create Your First Plan</Button>
            </Link>
          </motion.div>
        )}

        {/* Data Grid */}
        {!isFetching && plans.length > 0 && (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {plans.map((plan) => {
              const coverImage = (plan.images && plan.images.length > 0) ? plan.images[0] : (plan.imageUrl || "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=80");
              
              return (
                <motion.div 
                  key={plan._id} 
                  variants={itemVariant}
                  className="group flex flex-col bg-surface border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 relative"
                >
                  {/* Image Header */}
                  <div className="h-40 relative overflow-hidden bg-neutral-bg">
                    <img src={coverImage} alt={plan.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="backdrop-blur-md bg-white/70 text-primary border-none shadow-sm">
                        {plan.category || "Trip"}
                      </Badge>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-display font-semibold text-lg text-primary mb-2 line-clamp-1" title={plan.title}>
                      {plan.title}
                    </h3>
                    
                    <div className="flex flex-col gap-2 mt-2">
                      <div className="flex items-center gap-2 text-sm text-text-muted">
                        <LuCalendarDays size={18} className="text-secondary" />
                        <span>{plan.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-text-muted">
                        <PiCurrencyDollarDuotone size={18} className="text-accent" />
                        <span className="font-semibold text-text">{plan.price}</span>
                      </div>
                      <div className="text-xs text-text-muted/60 mt-2 font-mono">
                        Created: {new Date(plan.createdAt).toLocaleDateString()}
                      </div>
                      
                      <div className="mt-2">
                        {plan.pendingRequests > 0 ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            {plan.pendingRequests} New {plan.pendingRequests === 1 ? 'Request' : 'Requests'}
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-bg text-text-muted border border-border text-xs font-medium">
                            <span>{plan.totalBookings || 0} Bookings</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Footer */}
                    <div className="mt-6 pt-4 border-t border-dashed border-border flex justify-between items-center">
                      <div className="flex gap-2">
                        <Link href={`/explore/${plan._id}`}>
                          <Button variant="secondary" className="!px-3 !py-1.5 text-sm" icon={<PiEyeDuotone size={16} />}>View</Button>
                        </Link>
                        <Button 
                          variant="secondary" 
                          className="!px-3 !py-1.5 text-sm !bg-accent/10 !text-accent hover:!bg-accent/20 border-none" 
                          icon={<LuUsers size={16} />}
                          onClick={() => handleViewBookings(plan._id)}
                        >
                          Bookings
                        </Button>
                      </div>
                      
                      <div className="flex gap-2">
                        <Link href={`/items/edit/${plan._id}`}>
                          <button className="p-2 text-text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-colors" title="Edit Plan">
                            <PiPencilDuotone size={20} />
                          </button>
                        </Link>
                        <button 
                          onClick={() => handleDelete(plan._id)}
                          disabled={deletingId === plan._id}
                          className="p-2 text-text-muted hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete Plan"
                        >
                          <PiTrashDuotone size={20} />
                        </button>
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Bookings Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-surface w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
              >
                <div className="p-6 border-b border-border flex justify-between items-center bg-neutral-bg">
                  <div>
                    <h2 className="text-xl font-display font-semibold text-primary">
                      {viewingPlanDetails ? "Customized Plan Details" : "Booking Details"}
                    </h2>
                    <p className="text-sm text-text-muted mt-1">
                      {viewingPlanDetails ? "Review this plan before accepting the booking." : "People who have booked this plan"}
                    </p>
                  </div>
                  <button onClick={() => {
                    if (viewingPlanDetails) {
                      setViewingPlanDetails(null);
                      setViewingBooking(null);
                    } else {
                      setIsModalOpen(false);
                    }
                  }} className="p-2 bg-surface hover:bg-red-50 hover:text-red-500 rounded-full transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1">
                  {isLoadingPlanDetails ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full"></div>
                    </div>
                  ) : viewingPlanDetails ? (
                    <div className="flex flex-col gap-6">
                      <button onClick={() => { setViewingPlanDetails(null); setViewingBooking(null); }} className="flex items-center gap-2 text-sm text-text hover:text-primary font-medium w-fit transition-colors">
                        <PiArrowLeftBold /> Back to Bookings
                      </button>
                      
                      <div className="bg-neutral-bg p-5 rounded-2xl border border-border">
                        <h3 className="font-display text-xl font-bold mb-3 text-primary">{viewingPlanDetails.title}</h3>
                        <div className="flex gap-6 mb-5 text-sm">
                          <div className="flex items-center gap-2"><span className="font-semibold text-text">Price:</span> <span className="text-accent font-bold">{viewingPlanDetails.price}</span></div>
                          <div className="flex items-center gap-2"><span className="font-semibold text-text">Duration:</span> <span className="text-secondary font-medium">{viewingPlanDetails.duration}</span></div>
                        </div>
                        <div className="prose prose-sm max-w-none text-text">
                          <ReactMarkdown>{viewingPlanDetails.fullDescription}</ReactMarkdown>
                        </div>
                      </div>
                      
                      {viewingBooking?.status === "Requested" && (
                        <div className="flex items-center gap-3 pt-2">
                          <Button 
                            onClick={() => { handleUpdateStatus(viewingBooking._id, "Confirmed"); setViewingPlanDetails(null); }} 
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 border-none text-white shadow-sm"
                          >
                            Accept Booking
                          </Button>
                          <Button 
                            onClick={() => { handleUpdateStatus(viewingBooking._id, "Rejected"); setViewingPlanDetails(null); }} 
                            className="flex-1 bg-rose-600 hover:bg-rose-700 border-none text-white shadow-sm"
                          >
                            Reject Booking
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : isFetchingBookings ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full"></div>
                    </div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-neutral-bg rounded-full flex items-center justify-center mx-auto mb-4 text-text-muted">
                        <LuUsers size={32} />
                      </div>
                      <h3 className="text-lg font-medium text-text">No bookings yet</h3>
                      <p className="text-text-muted text-sm mt-1">When someone books this plan, they will appear here.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {bookings.map((booking: any) => (
                        <div key={booking._id} className="flex items-center justify-between p-4 bg-neutral-bg border border-border rounded-2xl hover:border-accent/30 transition-colors">
                          <div className="flex flex-col gap-3 flex-1 mr-4">
                            <div className="flex items-center gap-4">
                              {booking.user?.image ? (
                                <img src={booking.user.image} alt={booking.user.name} className="w-12 h-12 rounded-full border border-border object-cover" />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-lg">
                                  {booking.user?.name?.charAt(0) || "U"}
                                </div>
                              )}
                              <div>
                                <h4 className="font-medium text-text">{booking.user?.name || "Unknown User"}</h4>
                                <p className="text-sm text-text-muted">{booking.user?.email}</p>
                              </div>
                            </div>
                            
                            {booking.planTitle && booking.planTitle.includes('Customized') && (
                              <div className="bg-amber-50/80 border border-amber-200/60 rounded-lg p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm">
                                <span className="text-xs text-amber-900 font-medium line-clamp-1"><span className="font-bold text-amber-700">Booked:</span> {booking.planTitle}</span>
                                <button onClick={() => handleViewPlanDetails(booking)} className="text-xs font-bold text-amber-600 hover:text-amber-800 underline flex-shrink-0">
                                  View Plan
                                </button>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4">
                            {booking.status === "Requested" && !(booking.planTitle && booking.planTitle.includes('Customized')) && (
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleUpdateStatus(booking._id, "Confirmed")}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
                                >
                                  Accept
                                </button>
                                <button 
                                  onClick={() => handleUpdateStatus(booking._id, "Rejected")}
                                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                            
                            <div className="text-right">
                              <Badge 
                                variant="secondary" 
                                className={
                                  booking.status === "Confirmed" 
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-200 mb-1" 
                                    : booking.status === "Rejected"
                                      ? "bg-rose-50 text-rose-600 border-rose-200 mb-1"
                                      : "bg-amber-50 text-amber-600 border-amber-200 mb-1"
                                }
                              >
                                {booking.status === "Requested" ? "Awaiting Confirmation" : booking.status}
                              </Badge>
                              <p className="text-xs text-text-muted">
                                {new Date(booking.bookingDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
