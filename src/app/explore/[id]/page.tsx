import API_BASE_URL from "@/lib/apiUrl";
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { 
  PiMapPinLine, PiStarFill, PiCheckCircleDuotone, 
  PiUsersThreeDuotone, PiCameraDuotone, PiClockDuotone,
  PiXCircleDuotone
} from "react-icons/pi";
import { LuCalendarDays } from "react-icons/lu";
import Link from "next/link";
import { TrendChart } from "@/components/charts/TrendChart";
import { MatchScore } from "@/components/ui/MatchScore";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";

export default function DetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const [item, setItem] = useState<any>(null);
  const [relatedItems, setRelatedItems] = useState<any[]>([]);
  const [isRelatedLoading, setIsRelatedLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isReviewsLoading, setIsReviewsLoading] = useState(true);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [preferences, setPreferences] = useState("");
  const [budget, setBudget] = useState("");
  const [days, setDays] = useState("");
  const [nights, setNights] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const customizeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCustomizing && customizeRef.current) {
      setTimeout(() => {
        customizeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [isCustomizing]);

  useEffect(() => {
    // Restore customizing state if returning from login
    const savedPlanId = sessionStorage.getItem('customizingPlanId');
    if (savedPlanId === id) {
      setIsCustomizing(true);
      setBudget(sessionStorage.getItem('customizingBudget') || "");
      setDays(sessionStorage.getItem('customizingDays') || "");
      setNights(sessionStorage.getItem('customizingNights') || "");
      setPreferences(sessionStorage.getItem('customizingPreferences') || "");
      
      // Clear after restoring
      sessionStorage.removeItem('customizingPlanId');
      sessionStorage.removeItem('customizingBudget');
      sessionStorage.removeItem('customizingDays');
      sessionStorage.removeItem('customizingNights');
      sessionStorage.removeItem('customizingPreferences');
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      const fetchItem = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/api/items/${id}`);
          setItem(res.data);
        } catch (error) {
          console.error("Failed to fetch item details", error);
        } finally {
          setIsLoading(false);
        }
      };

      const fetchRelated = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/api/items/${id}/related`);
          setRelatedItems(res.data);
        } catch (error) {
          console.error("Failed to fetch related items", error);
        } finally {
          setIsRelatedLoading(false);
        }
      };

      const fetchReviews = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/api/items/${id}/reviews`);
          setReviews(res.data);
        } catch (error) {
          console.error("Failed to fetch reviews", error);
        } finally {
          setIsReviewsLoading(false);
        }
      };
      
      const checkBookingStatus = async () => {
        if (!user) return;
        try {
          const res = await axios.get(`${API_BASE_URL}/api/bookings/check/${id}`, {
            withCredentials: true
          });
          setBookingStatus(res.data.status);
          setBookingId(res.data.bookingId);
        } catch (error) {
          console.error("Failed to check booking status", error);
        }
      };

      fetchItem();
      fetchRelated();
      fetchReviews();
      checkBookingStatus();
    }
  }, [id, user]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmittingReview(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/items/${id}/reviews`, {
        rating: newRating,
        comment: newComment
      }, {
        withCredentials: true
      });

      if (res.status === 201) {
        toast.success("Review submitted successfully!");
        setNewComment("");
        setNewRating(5);
        // Refresh reviews list
        const reviewsRes = await axios.get(`${API_BASE_URL}/api/items/${id}/reviews`);
        setReviews(reviewsRes.data);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return "0.0";
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const getRatingPercentage = (star: number) => {
    if (reviews.length === 0) return "0%";
    const count = reviews.filter(r => r.rating === star).length;
    return `${(count / reviews.length) * 100}%`;
  };

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
      const res = await axios.post(`${API_BASE_URL}/api/bookings`, { planId: id }, { withCredentials: true });
      toast.success("Booking successful! Enjoy your trip!");
      setBookingStatus("Requested");
      setBookingId(res.data.bookingId);
    } catch (error: any) {
      if (error.response?.data?.error === "You have already booked this plan") {
        toast.warning("You have already booked this plan.");
        setBookingStatus("Requested"); // Or fetch status again
      } else {
        toast.error("Failed to book plan. Please try again.");
      }
    } finally {
      setIsBooking(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!bookingId) return;
    if (!window.confirm("Are you sure you want to cancel this booking request?")) return;
    
    setIsBooking(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/bookings/${bookingId}/cancel`, {
        withCredentials: true
      });
      toast.success("Booking request cancelled successfully");
      setBookingStatus(null);
      setBookingId(null);
    } catch (error) {
      console.error("Failed to cancel booking", error);
      toast.error("Failed to cancel booking. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  const handleCustomize = async () => {
    if (!user) {
      sessionStorage.setItem('customizingPlanId', id);
      sessionStorage.setItem('customizingBudget', budget);
      sessionStorage.setItem('customizingDays', days);
      sessionStorage.setItem('customizingNights', nights);
      sessionStorage.setItem('customizingPreferences', preferences);
      router.push(`/login?next=/explore/${id}`);
      return;
    }
    
    if (!budget.trim() || !days.trim() || !nights.trim()) {
      toast.warning("Please fill in the Budget, Days, and Nights to get a proper plan.");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/ai/customize`, {
        basePlanId: id,
        budget,
        days,
        nights,
        preferences
      }, { withCredentials: true });
      
      const newPlanId = res.data.newPlanId;
      toast.success("Custom plan generated successfully!");
      router.push(`/explore/${newPlanId}`);
    } catch (error) {
      console.error("Failed to generate plan", error);
      toast.error("Failed to generate custom plan. Please try again.");
    } finally {
      setIsGenerating(false);
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
              <div className="text-text leading-relaxed">
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-primary mt-6 mb-3" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-primary mt-6 mb-3" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg font-medium text-primary mt-4 mb-2" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 text-text space-y-2" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 text-text space-y-2" {...props} />,
                    li: ({node, ...props}) => <li className="text-text" {...props} />,
                    p: ({node, ...props}) => <p className="text-text leading-relaxed mb-4" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-semibold text-gray-900" {...props} />,
                  }}
                >
                  {item.fullDescription || item.shortDescription}
                </ReactMarkdown>
              </div>
            </section>

            <section>
              <h2 className="font-display font-semibold text-2xl text-primary mb-4">Seasonal Price Trend</h2>
              <p className="text-text-muted mb-4">See how average prices fluctuate throughout the year to plan your budget perfectly.</p>
              <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
                {(() => {
                  const priceStr = item.price || "";
                  const match = priceStr.replace(/,/g, '').match(/(\d+)/);
                  const numericalPrice = match ? parseInt(match[1]) : 1000;
                  const isBdt = priceStr.toLowerCase().includes("bdt") || priceStr.toLowerCase().includes("টাকা");
                  const currencySymbol = isBdt ? "৳" : "$";
                  return <TrendChart basePrice={numericalPrice} currencySymbol={currencySymbol} />;
                })()}
              </div>
            </section>

            <section>
              <h2 className="font-display font-semibold text-2xl text-primary mb-4">Reviews & Ratings</h2>
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4 border-b border-border pb-6">
                  <div className="flex flex-col items-center justify-center p-4 bg-amber-50 rounded-2xl border border-amber-100 min-w-[120px]">
                    <span className="text-4xl font-display font-bold text-amber-600">{calculateAverageRating()}</span>
                    <div className="flex text-amber-500 mt-1 gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <PiStarFill 
                          key={i} 
                          size={16} 
                          className={i < Math.round(parseFloat(calculateAverageRating())) ? "text-amber-500" : "text-gray-300"} 
                        />
                      ))}
                    </div>
                    <span className="text-xs text-text-muted mt-1">{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</span>
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center gap-2 text-sm">
                        <span className="text-text-muted w-3">{star}</span>
                        <PiStarFill className="text-amber-500" size={14} />
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-500 rounded-full" 
                            style={{ width: getRatingPercentage(star) }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {isReviewsLoading ? (
                  <p className="text-text-muted text-sm italic">Loading reviews...</p>
                ) : reviews.length === 0 ? (
                  <p className="text-text-muted text-sm italic">No reviews yet for this travel plan.</p>
                ) : (
                  <div className="flex flex-col gap-6 mt-2">
                    {reviews.map((rev: any) => (
                      <div key={rev._id} className="flex gap-4 border-b border-border/30 pb-4">
                        {rev.userImage ? (
                          <img src={rev.userImage} alt={rev.userName} className="w-10 h-10 rounded-full border border-border object-cover shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                            {rev.userName.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-text">{rev.userName}</span>
                            <span className="text-xs text-text-muted">{new Date(rev.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex text-amber-500 gap-0.5 mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <PiStarFill 
                                key={i} 
                                size={14} 
                                className={i < rev.rating ? "text-amber-500" : "text-gray-300"} 
                              />
                            ))}
                          </div>
                          <p className="text-sm text-text leading-relaxed">{rev.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Submit Review Form */}
                {user && bookingStatus === "Confirmed" && !reviews.some(r => r.userId === user.id) && (
                  <div className="mt-4 p-6 bg-amber-50/20 border border-amber-500/10 rounded-2xl">
                    <h3 className="font-display font-semibold text-lg text-primary mb-4">Share Your Experience</h3>
                    <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-text">Your Rating:</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewRating(star)}
                              className="text-amber-500 hover:scale-110 transition-transform focus:outline-none"
                            >
                              <PiStarFill size={22} className={newRating >= star ? "text-amber-500" : "text-gray-300"} />
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-text">Comment:</label>
                        <textarea
                          rows={3}
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Write your review here..."
                          className="w-full text-sm p-3.5 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                          disabled={isSubmittingReview}
                          required
                        />
                      </div>
                      
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={isSubmittingReview || !newComment.trim()}
                        className="w-fit self-end text-xs py-2 px-4"
                      >
                        {isSubmittingReview ? "Submitting..." : "Submit Review"}
                      </Button>
                    </form>
                  </div>
                )}
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
              
              {user?.id === item.userId ? (
                <div className="mb-4 p-4 bg-primary/5 border border-primary/10 text-primary text-sm font-medium rounded-xl text-center shadow-sm">
                  This is your own travel plan.
                </div>
              ) : (
                <>
                  {bookingStatus === "Rejected" && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2 shadow-sm">
                  <PiXCircleDuotone size={18} className="text-rose-500 shrink-0 mt-0.5" />
                  <span>Your previous booking request was rejected by the agent. You can request again if you wish.</span>
                </div>
              )}

              {bookingStatus === "Confirmed" && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-start gap-2 shadow-sm">
                  <PiCheckCircleDuotone size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>Your booking request has been confirmed by the agent! Enjoy your trip!</span>
                </div>
              )}

              <Button 
                variant="cta" 
                className={`w-full mb-4 ${
                  bookingStatus === 'Confirmed' 
                    ? 'bg-emerald-500 hover:bg-emerald-600 border-emerald-500 text-white' 
                    : bookingStatus === 'Requested'
                      ? 'bg-amber-500 hover:bg-amber-600 border-amber-500 text-white font-medium'
                      : ''
                }`} 
                onClick={handleBook} 
                disabled={isBooking || bookingStatus === 'Confirmed' || bookingStatus === 'Requested'}
                icon={bookingStatus === 'Confirmed' ? <PiCheckCircleDuotone size={20} /> : undefined}
              >
                {bookingStatus === 'Confirmed' 
                  ? "Already Booked" 
                  : bookingStatus === 'Requested'
                    ? "Awaiting Confirmation"
                    : isBooking 
                      ? "Booking..." 
                      : "Book this Plan"}
              </Button>
              
              {bookingStatus === 'Requested' && (
                <Button 
                  variant="secondary" 
                  className="w-full mb-4 !bg-rose-50/50 !text-rose-600 !border-rose-200 hover:!bg-rose-100 hover:!border-rose-300 transition-all shadow-sm"
                  onClick={handleCancelBooking}
                  disabled={isBooking}
                >
                  Cancel Booking Request
                </Button>
              )}
              
              {(bookingStatus !== 'Confirmed' && bookingStatus !== 'Requested') && (
                !isCustomizing ? (
                  <Button 
                    variant="secondary" 
                    className="w-full !text-amber-700 !hover:text-amber-900 !border-amber-500/30 !hover:border-amber-500 !bg-amber-50/20 !hover:bg-amber-50/80 transition-all duration-200 shadow-sm" 
                    onClick={() => setIsCustomizing(true)}
                    icon={<PiStarFill className="text-amber-500" />}
                  >
                    Customize with AI
                  </Button>
                ) : (
                  <div ref={customizeRef} className="mt-4 p-4 bg-amber-50/50 border border-amber-100 rounded-xl">
                    <p className="text-xs font-medium text-amber-800 mb-3 flex items-center gap-1">
                      <PiStarFill /> Plan your dream trip
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-xs text-text-muted mb-1 block font-medium">Days</label>
                        <input 
                          type="number"
                          className="w-full text-sm p-2 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                          placeholder="e.g. 3"
                          value={days}
                          onChange={(e) => setDays(e.target.value)}
                          disabled={isGenerating}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-text-muted mb-1 block font-medium">Nights</label>
                        <input 
                          type="number"
                          className="w-full text-sm p-2 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                          placeholder="e.g. 2"
                          value={nights}
                          onChange={(e) => setNights(e.target.value)}
                          disabled={isGenerating}
                        />
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="text-xs text-text-muted mb-1 block font-medium">Target Budget (BDT)</label>
                      <input 
                        type="number"
                        className="w-full text-sm p-2 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                        placeholder="e.g. 6000"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        disabled={isGenerating}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="text-xs text-text-muted mb-1 block font-medium">Additional Preferences (Optional)</label>
                      <textarea
                        className="w-full text-sm p-2.5 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white resize-none"
                        rows={2}
                        placeholder="E.g., Suggest budget friendly hostels, vegetarian food..."
                        value={preferences}
                        onChange={(e) => setPreferences(e.target.value)}
                        disabled={isGenerating}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="secondary" 
                        className="flex-1 text-xs py-1.5"
                        onClick={() => setIsCustomizing(false)}
                        disabled={isGenerating}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="cta" 
                        className="flex-1 text-xs py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 border-none text-white hover:from-amber-600 hover:to-orange-600 shadow-sm"
                        onClick={handleCustomize}
                        disabled={isGenerating}
                      >
                        {isGenerating ? "Generating..." : "Generate"}
                      </Button>
                    </div>
                  </div>
                )
              )}
                </>
              )}
            </div>
          </div>

        </div>

        {/* Related Items Section */}
        <div className="mt-4 pt-12 border-t border-border">
          <h2 className="font-display font-semibold text-2xl text-primary mb-6">Similar Travel Plans</h2>
          {isRelatedLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-surface border border-border rounded-2xl h-[380px]"></div>
              ))}
            </div>
          ) : relatedItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedItems.map((dest: any) => (
                <Link key={dest._id} href={`/explore/${dest._id}`} className="block h-full group hover:-translate-y-1.5 transition-transform duration-300">
                  <Card 
                    title={dest.title} 
                    image={(dest.images && dest.images.length > 0) ? dest.images[0] : (dest.imageUrl || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80")}
                    description={dest.shortDescription}
                    meta={
                      <>
                        <span className="flex items-center gap-1 text-secondary whitespace-nowrap"><LuCalendarDays size={16}/> {dest.duration}</span>
                        <span className="flex items-center gap-1 text-accent whitespace-nowrap"><PiStarFill size={16}/> 4.9</span>
                        <span className="font-semibold text-primary whitespace-nowrap">Budget: {dest.price}</span>
                      </>
                    }
                  />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-text-muted">No similar plans found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
