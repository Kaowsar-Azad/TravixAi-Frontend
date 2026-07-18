"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { 
  PiMagnifyingGlassDuotone, PiFadersDuotone, PiStarFill
} from "react-icons/pi";
import { LuCalendarDays } from "react-icons/lu";
import Link from "next/link";

const MOCK_DATA = [
  { id: "1", title: "Santorini, Greece", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5f1?w=600&q=80", price: "$1,200", days: "5 Days", rating: "4.9", category: "Relaxation" },
  { id: "2", title: "Bali, Indonesia", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80", price: "$850", days: "7 Days", rating: "4.8", category: "Adventure" },
  { id: "3", title: "Swiss Alps", img: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600&q=80", price: "$2,100", days: "4 Days", rating: "4.9", category: "Adventure" },
  { id: "4", title: "Kyoto, Japan", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80", price: "$1,500", days: "6 Days", rating: "4.7", category: "Culture" },
  { id: "5", title: "Maldives", img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80", price: "$3,200", days: "5 Days", rating: "5.0", category: "Relaxation" },
  { id: "6", title: "Rome, Italy", img: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80", price: "$1,100", days: "5 Days", rating: "4.6", category: "Culture" },
];

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="flex-1 bg-neutral-bg py-8 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="font-display font-semibold text-3xl md:text-4xl text-primary">Explore Destinations</h1>
            <p className="text-text-muted mt-2">Find your next adventure from our curated list of trips.</p>
          </div>
          
          <div className="w-full md:w-auto flex items-center gap-2">
            <div className="w-full md:w-80">
              <Input 
                icon={<PiMagnifyingGlassDuotone size={20} />} 
                placeholder="Search destinations..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button 
              variant="secondary" 
              className="px-3"
              onClick={() => setShowFilters(!showFilters)}
            >
              <PiFadersDuotone size={24} />
            </Button>
          </div>
        </div>

        {/* Filters Sidebar/BottomSheet & Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters (Desktop Sidebar / Mobile Expandable) */}
          <div className={`lg:w-64 flex flex-col gap-6 bg-surface p-6 rounded-2xl border border-border h-fit ${showFilters ? 'block' : 'hidden lg:flex'}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg text-primary">Filters</h3>
              <button className="text-sm text-accent hover:underline">Reset</button>
            </div>
            
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-medium text-text-muted">Category</h4>
              <div className="flex flex-col gap-2">
                {["Adventure", "Relaxation", "Culture", "Food & Drink"].map(cat => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-accent focus:ring-accent" />
                    <span className="text-sm text-text">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-medium text-text-muted">Budget</h4>
              <select className="w-full h-10 rounded-lg border border-border bg-surface px-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent">
                <option>Any Budget</option>
                <option>Under $1000</option>
                <option>$1000 - $2000</option>
                <option>$2000+</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-medium text-text-muted">Duration</h4>
              <select className="w-full h-10 rounded-lg border border-border bg-surface px-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent">
                <option>Any Duration</option>
                <option>1-3 Days</option>
                <option>4-7 Days</option>
                <option>8+ Days</option>
              </select>
            </div>

            <Button variant="primary" className="w-full mt-4">Apply Filters</Button>
          </div>

          {/* Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-text-muted">Showing {MOCK_DATA.length} results</p>
              <select className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent">
                <option>Sort by: Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating</option>
              </select>
            </div>

            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.05 } }
              }}
            >
              {MOCK_DATA.map((dest, i) => (
                <motion.div 
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
                  }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                >
                  <Link href={`/explore/${dest.id}`} className="block h-full">
                    <Card 
                      title={dest.title} 
                      image={dest.img}
                      description={`A perfect ${dest.category.toLowerCase()} trip designed just for you.`}
                      meta={
                        <>
                          <span className="flex items-center gap-1 text-secondary"><LuCalendarDays size={16}/> {dest.days}</span>
                          <span className="flex items-center gap-1 text-accent"><PiStarFill size={16}/> {dest.rating}</span>
                          <span className="font-semibold text-primary">{dest.price}</span>
                        </>
                      }
                    />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
            
            <div className="mt-12 flex justify-center">
              <Button variant="secondary">Load More</Button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
