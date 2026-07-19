"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PiTrashDuotone, PiEyeDuotone, PiPlusDuotone } from "react-icons/pi";

const MOCK_PLANS = [
  { id: "1", title: "Santorini Dream Vacation", price: "$1,200", duration: "5 Days", date: "Oct 12, 2026", status: "Active" },
  { id: "2", title: "Bali Adventure Trip", price: "$850", duration: "7 Days", date: "Nov 05, 2026", status: "Active" },
  { id: "3", title: "Swiss Alps Ski Retreat", price: "$2,100", duration: "4 Days", date: "Dec 20, 2026", status: "Draft" },
];

export default function ManagePlansPage() {
  return (
    <div className="flex-1 bg-neutral-bg py-12 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-display font-semibold text-3xl md:text-4xl text-primary">Manage Plans</h1>
            <p className="text-text-muted mt-2">View, edit, and delete your created travel plans.</p>
          </div>
          <Link href="/items/add">
            <Button variant="primary" icon={<PiPlusDuotone size={20} />}>Add New Plan</Button>
          </Link>
        </div>

        <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary/5 border-b border-border text-sm text-text-muted">
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Duration</th>
                <th className="px-6 py-4 font-medium hidden sm:table-cell">Created At</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PLANS.map((plan) => (
                <tr key={plan.id} className="border-b border-border/50 hover:bg-neutral-bg/50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-primary">{plan.title}</td>
                  <td className="px-6 py-4 text-text">{plan.price}</td>
                  <td className="px-6 py-4 text-text">{plan.duration}</td>
                  <td className="px-6 py-4 text-text-muted hidden sm:table-cell">{plan.date}</td>
                  <td className="px-6 py-4">
                    <Badge variant={plan.status === "Active" ? "accent" : "secondary"}>{plan.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <Link href={`/explore/${plan.id}`}>
                        <button className="p-2 text-secondary hover:bg-secondary/10 rounded-lg transition-colors" title="View Details">
                          <PiEyeDuotone size={20} />
                        </button>
                      </Link>
                      <button className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors" title="Delete">
                        <PiTrashDuotone size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {MOCK_PLANS.length === 0 && (
            <div className="p-12 text-center flex flex-col items-center justify-center text-text-muted">
              <p>No travel plans found.</p>
              <Link href="/items/add" className="text-accent hover:underline mt-2">Create your first plan</Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
