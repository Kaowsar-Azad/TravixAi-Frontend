import API_BASE_URL from "@/lib/apiUrl";
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { motion } from "framer-motion";
import { PiUsersDuotone, PiMapPinDuotone, PiUserCircleDuotone, PiSuitcaseDuotone, PiShieldStarDuotone } from "react-icons/pi";

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  const [stats, setStats] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "admin") {
        router.push("/"); // Redirect non-admins
      }
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.role === "admin") {
      const fetchStats = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/api/admin/stats`, {
            withCredentials: true
          });
          setStats(res.data);
        } catch (error) {
          console.error("Failed to fetch admin stats", error);
        } finally {
          setIsFetching(false);
        }
      };
      fetchStats();
    }
  }, [user]);

  if (isLoading || !user || user.role !== "admin") return null;

  const statCards = stats ? [
    { label: "Total Users", value: stats.totalUsers, icon: <PiUsersDuotone size={32} />, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Travelers", value: stats.totalTravelers, icon: <PiUserCircleDuotone size={32} />, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Travel Agents", value: stats.totalAgents, icon: <PiSuitcaseDuotone size={32} />, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Admins", value: stats.totalAdmins, icon: <PiShieldStarDuotone size={32} />, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Total Plans", value: stats.totalPlans, icon: <PiMapPinDuotone size={32} />, color: "text-rose-500", bg: "bg-rose-50" }
  ] : [];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex-1 bg-neutral-bg py-12 px-6 lg:px-8 min-h-screen">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className="font-display font-semibold text-3xl md:text-4xl text-primary mb-2">Admin Dashboard</h1>
            <p className="text-text-muted text-sm md:text-base">Platform overview and statistics.</p>
          </div>
        </div>

        {isFetching ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse bg-surface h-32 rounded-2xl border border-border"></div>
            ))}
          </div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
          >
            {statCards.map((stat, i) => (
              <motion.div 
                key={i}
                variants={itemVariant}
                className="bg-surface border border-border p-6 rounded-2xl flex flex-col items-center text-center gap-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  {stat.icon}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-text-muted">{stat.label}</h3>
                  <p className="text-3xl font-display font-bold text-primary mt-1">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!isFetching && stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-surface border border-border rounded-2xl p-6">
              <h2 className="text-xl font-display font-semibold text-primary mb-4 border-b border-border pb-4">Top Agents</h2>
              <div className="flex flex-col gap-3">
                {stats.topAgents?.length > 0 ? stats.topAgents.map((agent: any, i: number) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-neutral-bg border border-border">
                    <div className="flex flex-col">
                      <span className="font-semibold text-text">{agent.name || "System"}</span>
                      {agent.email && <span className="text-xs text-text-muted">{agent.email}</span>}
                      {!agent.name && agent._id && <span className="text-xs text-text-muted font-mono">ID: {agent._id.substring(0,8)}...</span>}
                    </div>
                    <span className="text-sm font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">{agent.planCount} Plans</span>
                  </div>
                )) : (
                  <p className="text-text-muted text-sm py-4">No agents found.</p>
                )}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-surface border border-border rounded-2xl p-6">
              <h2 className="text-xl font-display font-semibold text-primary mb-4 border-b border-border pb-4">Recently Added Plans</h2>
              <div className="flex flex-col gap-3">
                {stats.recentPlans?.length > 0 ? stats.recentPlans.map((plan: any, i: number) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-neutral-bg border border-border">
                    <span className="font-medium text-text truncate max-w-[200px]">{plan.title}</span>
                    <span className="text-xs text-text-muted">{new Date(plan.createdAt).toLocaleDateString()}</span>
                  </div>
                )) : (
                  <p className="text-text-muted text-sm py-4">No plans found.</p>
                )}
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
}
