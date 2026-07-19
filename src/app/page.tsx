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
        const res = await axios.get("http://localhost:5000/api/items");
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
              <Button variant="cta" size="lg" icon={<PiSparkleDuotone size={20} />}>Plan My Trip</Button>
              <Link href="/explore">
                <Button variant="secondary" size="lg">Explore Destinations</Button>
              </Link>
            </div>
          </div>
          
          {/* Hero Visual / Search Box */}
          <div className="relative bg-surface p-8 rounded-2xl border border-border shadow-xl flex flex-col gap-4">
            <h3 className="font-display font-semibold text-xl text-primary mb-2">Where to next?</h3>
            <Input icon={<PiMapPinLine size={20} />} placeholder="Destination (e.g. Kyoto, Japan)" />
            <div className="grid grid-cols-2 gap-4">
              <Input icon={<LuCalendarDays size={20} />} placeholder="Start Date" type="date" />
              <Input icon={<LuCalendarDays size={20} />} placeholder="End Date" type="date" />
            </div>
            <Button variant="cta" className="w-full mt-2" icon={<PiAirplaneTiltDuotone size={20} />}>Generate Itinerary</Button>
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
                          <span className="font-semibold text-primary whitespace-nowrap">{dest.price}</span>
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
      
      {/* Final CTA */}
      <section className="py-24 px-6 lg:px-8 bg-neutral-bg text-center">
        <h2 className="font-display font-semibold text-4xl text-primary mb-6">Ready for takeoff?</h2>
        <p className="text-text-muted mb-8 max-w-xl mx-auto text-lg">Join thousands of smart travelers who are already exploring the world with their personal AI travel assistant.</p>
        <Link href="/register">
          <Button variant="cta" size="lg">Start Planning Now</Button>
        </Link>
      </section>
    </div>
  );
}
