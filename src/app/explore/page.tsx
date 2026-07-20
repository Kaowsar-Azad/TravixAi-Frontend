"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MatchScore } from "@/components/ui/MatchScore";
import { 
  PiMagnifyingGlassDuotone, PiFadersDuotone, PiStarFill
} from "react-icons/pi";
import { LuCalendarDays } from "react-icons/lu";
import Link from "next/link";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 6;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["explore-items", page, limit, debouncedSearch],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:5000/api/items?page=${page}&limit=${limit}&search=${debouncedSearch}`
      );
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const items = data?.items || [];
  const pagination = data?.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 };

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

        {/* Filters Sidebar & Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters */}
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
              <p className="text-sm text-text-muted">
                Showing {items.length} of {pagination.totalItems || 0} results
              </p>
              <select className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent">
                <option>Sort by: Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating</option>
              </select>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="animate-pulse bg-surface border border-border rounded-2xl h-[380px]"></div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="py-12 text-center text-text-muted bg-surface border border-border rounded-2xl">
                No travel plans found.
              </div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.05 } }
                }}
              >
                {items.map((dest: any) => (
                  <motion.div 
                    key={dest._id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
                    }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  >
                    <Link href={`/explore/${dest._id}`} className="block h-full">
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
                      >
                        <div className="mt-2">
                          <MatchScore score={95} />
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
            
            {!isLoading && pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-4">
                <Button 
                  variant="secondary"
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="text-sm text-text-muted">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <Button 
                  variant="secondary"
                  disabled={page === pagination.totalPages}
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
