import API_BASE_URL from "@/lib/apiUrl";
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { 
  PiMapPinLine, PiAirplaneTiltDuotone, 
  PiMagnifyingGlassDuotone, PiSparkleDuotone, PiAirplaneTakeoffDuotone,
  PiUmbrellaDuotone, PiMountainsDuotone, PiBuildingsDuotone, PiBankDuotone,
  PiStarFill
} from "react-icons/pi";
import { LuCalendarDays } from "react-icons/lu";
import Link from "next/link";
import axios from "axios";

export default function Home() {
  const [trendingItems, setTrendingItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/items`);
        // Get the latest 4 items for trending
        setTrendingItems(res.data.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch trending items:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[70dvh] flex items-center justify-center pt-24 pb-16 px-6 lg:px-8 bg-neutral-bg overflow-hidden">
        {/* Ambient Gradient Blob */}
        <motion.div 
          className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-accent/10 blur-3xl pointer-events-none"
          animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <h1 className="font-display font-semibold text-4xl sm:text-5xl lg:text-6xl text-primary leading-tight">
              Your intelligent <br/>
              <span className="text-accent relative">
                boarding pass
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-accent/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <motion.path d="M0,5 Q50,10 100,5" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="8 8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.8, ease: "easeOut" }} />
                </svg>
              </span> <br/>
              to everywhere.
            </h1>
            <p className="text-text-muted text-lg sm:text-xl max-w-xl mx-auto lg:mx-0">
              Generate personalized day-by-day itineraries instantly. Discover, plan, and manage your dream trips with Travix AI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-center lg:justify-start">
              <Link href="/ai-assistant">
                <Button variant="cta" size="lg" icon={<PiSparkleDuotone size={20} />}>Plan My Trip</Button>
              </Link>
              <Link href="/explore">
                <Button variant="secondary" size="lg">Explore Destinations</Button>
              </Link>
            </div>
          </div>
          
          {/* Hero Visual - Premium AI Boarding Pass */}
          <div className="relative flex justify-center lg:justify-end z-10 hidden sm:flex perspective-1000">
            <motion.div 
              initial={{ opacity: 0, rotateY: -15, rotateX: 10, y: 30 }}
              animate={{ opacity: 1, rotateY: -5, rotateX: 5, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              whileHover={{ rotateY: 0, rotateX: 0, scale: 1.05, transition: { duration: 0.4 } }}
              className="relative w-full max-w-md bg-gradient-to-br from-surface to-neutral-bg rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-border group"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Top Banner */}
              <div className="bg-primary px-8 py-5 flex justify-between items-center relative overflow-hidden">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <div className="flex items-center gap-2 text-neutral-bg relative z-10">
                  <PiSparkleDuotone className="text-accent" size={24} />
                  <span className="font-display font-bold text-lg tracking-wider">TRAVIX AI</span>
                </div>
                <div className="text-neutral-bg/80 text-xs font-mono font-medium relative z-10">
                  FIRST CLASS
                </div>
              </div>

              {/* Pass Content */}
              <div className="p-8 relative">
                {/* Decorative background map pattern or watermark could go here */}
                <div className="absolute right-[-20%] top-1/4 opacity-5 pointer-events-none">
                  <PiAirplaneTakeoffDuotone size={200} />
                </div>

                <div className="flex justify-between items-end mb-8 border-b border-border/50 pb-6 relative z-10">
                  <div className="flex flex-col">
                    <span className="text-text-muted text-xs font-medium uppercase tracking-wider mb-1">Origin</span>
                    <span className="font-display font-bold text-4xl text-primary">YOU</span>
                  </div>
                  
                  <div className="flex flex-col items-center flex-1 px-4 relative">
                    <span className="text-xs text-accent font-semibold mb-2">ANYWHERE</span>
                    <div className="w-full relative flex items-center justify-center">
                      <div className="absolute w-full h-[2px] bg-border border-dashed"></div>
                      <motion.div 
                        animate={{ x: [0, 100, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-10 bg-surface px-2"
                      >
                        <PiAirplaneTiltDuotone size={24} className="text-primary" />
                      </motion.div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-text-muted text-xs font-medium uppercase tracking-wider mb-1">Destination</span>
                    <span className="font-display font-bold text-4xl text-primary">WRLD</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8 relative z-10">
                  <div className="flex flex-col">
                    <span className="text-text-muted text-xs font-medium mb-1 uppercase">Passenger</span>
                    <span className="font-semibold text-text">Smart Traveler</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-text-muted text-xs font-medium mb-1 uppercase">Date</span>
                    <span className="font-semibold text-text text-accent">Whenever</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-text-muted text-xs font-medium mb-1 uppercase">Gate</span>
                    <span className="font-semibold text-text">AI-01</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-text-muted text-xs font-medium mb-1 uppercase">Boarding</span>
                    <span className="font-semibold text-text">Now</span>
                  </div>
                </div>

                {/* Barcode Section */}
                <div className="pt-6 border-t border-dashed border-border/80 flex flex-col items-center justify-center relative z-10">
                  <div className="flex gap-1 h-12 w-full justify-between items-center opacity-80 px-2">
                    {/* Generative Barcode Lines */}
                    {[...Array(35)].map((_, i) => {
                      const width = ((i * 7) % 4) + 2; // Deterministic width between 2px and 5px
                      const height = ((i * 13) % 60) + 40; // Deterministic height between 40% and 100%
                      return (
                        <div key={i} className="bg-primary rounded-full" style={{ 
                          width: `${width}px`,
                          height: `${height}%`
                        }}></div>
                      );
                    })}
                  </div>
                  <span className="font-mono text-[10px] text-text-muted mt-2 tracking-[0.2em]">01101001 01110100 01110010 01100001</span>
                </div>
              </div>
              
              {/* Left & Right cutouts for boarding pass look */}
              <div className="absolute top-[88px] -left-4 w-8 h-8 rounded-full bg-neutral-bg border-r border-border"></div>
              <div className="absolute top-[88px] -right-4 w-8 h-8 rounded-full bg-neutral-bg border-l border-border"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 px-6 lg:px-8 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-display font-semibold text-3xl md:text-4xl text-primary">Trending Destinations</h2>
              <p className="text-text-muted mt-2">Discover where the world is traveling right now.</p>
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse bg-neutral-bg border border-border rounded-2xl h-[350px]"></div>
              ))}
            </div>
          ) : trendingItems.length === 0 ? (
            <div className="py-12 text-center text-text-muted border border-border rounded-2xl">
              No trending destinations found.
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}
            >
              {trendingItems.map((dest) => (
                <motion.div 
                  key={dest._id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                  }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                >
                  <Link href={`/explore/${dest._id}`} className="block h-full">
                    <Card 
                      title={dest.title} 
                      image={(dest.images && dest.images.length > 0) ? dest.images[0] : (dest.imageUrl || "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5f1?w=600&q=80")}
                      meta={
                        <>
                          <span className="flex items-center gap-1 text-secondary whitespace-nowrap"><LuCalendarDays size={16}/> {dest.duration}</span>
                          <span className="flex items-center gap-1 text-accent whitespace-nowrap"><PiStarFill size={16}/> 4.9</span>
                          <span className="font-semibold text-primary whitespace-nowrap">Budget: {dest.price}</span>
                        </>
                      }
                    />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
      
      {/* Categories */}
      <section className="py-20 px-6 lg:px-8 bg-neutral-bg">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display font-semibold text-3xl md:text-4xl text-primary text-center mb-12">Find Your Vibe</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Beach Relax", icon: <PiUmbrellaDuotone size={40} className="text-secondary" /> },
              { name: "Mountain Trek", icon: <PiMountainsDuotone size={40} className="text-primary" /> },
              { name: "City Explore", icon: <PiBuildingsDuotone size={40} className="text-accent" /> },
              { name: "Cultural Rich", icon: <PiBankDuotone size={40} className="text-secondary" /> },
            ].map((cat, i) => (
              <div key={i} className="flex flex-col items-center justify-center gap-4 bg-surface p-8 rounded-2xl border border-border hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
                {cat.icon}
                <span className="font-medium text-text">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-6 lg:px-8 bg-surface border-t border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "50K+", label: "Trips Planned" },
              { value: "120+", label: "Countries Covered" },
              { value: "98%", label: "Happy Travelers" },
              { value: "24/7", label: "AI Copilot Support" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-2">
                <span className="font-display font-semibold text-4xl sm:text-5xl text-accent">{stat.value}</span>
                <span className="text-sm font-medium text-text-muted uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works & AI Teaser */}
      <section className="py-24 px-6 lg:px-8 bg-primary text-neutral-bg">
        <div className="max-w-7xl mx-auto text-center">
          <PiSparkleDuotone size={48} className="text-accent mx-auto mb-6" />
          <h2 className="font-display font-semibold text-3xl md:text-4xl mb-6">Powered by Advanced AI</h2>
          <p className="max-w-2xl mx-auto text-neutral-bg/80 text-lg mb-12">
            Just tell us what you love, and our AI travel agent will generate a customized boarding pass, complete with day-by-day itineraries, smart pricing, and continuous live chat support.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-primary-hover p-6 rounded-2xl border border-primary/50">
              <PiMagnifyingGlassDuotone size={32} className="text-secondary mb-4" />
              <h3 className="font-semibold text-xl mb-2">1. Tell us your dream</h3>
              <p className="text-neutral-bg/70">Enter your destination, dates, and budget.</p>
            </div>
            <div className="bg-primary-hover p-6 rounded-2xl border border-primary/50">
              <PiSparkleDuotone size={32} className="text-accent mb-4" />
              <h3 className="font-semibold text-xl mb-2">2. AI Magic</h3>
              <p className="text-neutral-bg/70">Our agent drafts a perfect day-by-day plan.</p>
            </div>
            <div className="bg-primary-hover p-6 rounded-2xl border border-primary/50">
              <PiAirplaneTakeoffDuotone size={32} className="text-neutral-bg mb-4" />
              <h3 className="font-semibold text-xl mb-2">3. Bon Voyage</h3>
              <p className="text-neutral-bg/70">Refine the plan and start your adventure.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6 lg:px-8 bg-neutral-bg">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display font-semibold text-3xl md:text-4xl text-primary text-center mb-16">What Travelers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "The AI recommendation engine built an itinerary for Tokyo in 10 seconds that would have taken me 10 hours. Absolutely mind-blowing!",
                author: "Alex Johnson",
                role: "Backpacker",
              },
              {
                quote: "Customizing my family vacation to Italy using the AI Assistant was so easy. The seasonal price trend charts helped us save a lot of money.",
                author: "Emily Davis",
                role: "Family Traveler",
              },
              {
                quote: "Having the sticky chat assistant on hand while exploring Rome was like having a private local guide in my pocket. Highly recommended!",
                author: "Marcus Aurelius",
                role: "Solo Explorer",
              },
            ].map((test, i) => (
              <div key={i} className="bg-surface p-8 rounded-2xl border border-border shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow">
                <p className="text-text leading-relaxed italic mb-6">"{test.quote}"</p>
                <div>
                  <h4 className="font-semibold text-text">{test.author}</h4>
                  <span className="text-xs text-text-muted">{test.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-24 px-6 lg:px-8 bg-neutral-bg text-center">
        <h2 className="font-display font-semibold text-4xl text-primary mb-6">Ready for takeoff?</h2>
        <p className="text-text-muted mb-8 max-w-xl mx-auto text-lg">Join thousands of smart travelers who are already exploring the world with their personal AI travel assistant.</p>
        <Link href="/ai-assistant">
          <Button variant="cta" size="lg">Start Planning Now</Button>
        </Link>
      </section>
    </div>
  );
}
