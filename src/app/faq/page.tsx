"use client";

import { useState } from "react";
import { LuChevronDown } from "react-icons/lu";

const FAQ_DATA = [
  {
    category: "Booking & Planning",
    items: [
      { q: "How does the AI create an itinerary?", a: "Our AI analyzes millions of data points including weather, traffic, reviews, and your personal preferences to generate a highly optimized, day-by-day plan." },
      { q: "Can I modify a generated trip?", a: "Absolutely! You can chat with our AI assistant to tweak specific days or manually edit activities directly in the itinerary builder." },
    ]
  },
  {
    category: "Payments & Pricing",
    items: [
      { q: "Is Travix AI free to use?", a: "Generating basic itineraries is free. We offer a premium subscription for advanced features like live real-time re-routing and exclusive deals." },
      { q: "Do you handle the actual bookings?", a: "Yes, once you finalize a plan, you can securely book flights and hotels through our integrated partner networks." },
    ]
  },
  {
    category: "Account & Support",
    items: [
      { q: "How do I reset my password?", a: "You can reset your password from the login page by clicking on 'Forgot password'." },
      { q: "How can I contact customer service?", a: "You can reach out to us 24/7 via the Chat Widget or visit our Contact page to send an email." },
    ]
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>("0-0");

  const toggle = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div className="flex-1 bg-neutral-bg py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display font-semibold text-4xl md:text-5xl text-primary mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-text-muted">Everything you need to know about Travix AI.</p>
        </div>

        <div className="flex flex-col gap-10">
          {FAQ_DATA.map((section, sIdx) => (
            <div key={sIdx}>
              <h2 className="font-display font-semibold text-2xl text-primary mb-4 border-b border-border pb-2">{section.category}</h2>
              <div className="flex flex-col gap-3">
                {section.items.map((item, iIdx) => {
                  const id = `${sIdx}-${iIdx}`;
                  const isOpen = openIndex === id;
                  return (
                    <div key={id} className={`border border-border rounded-2xl overflow-hidden transition-colors ${isOpen ? 'bg-surface shadow-sm' : 'bg-neutral-bg hover:bg-surface'}`}>
                      <button 
                        className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                        onClick={() => toggle(id)}
                      >
                        <span className="font-semibold text-primary">{item.q}</span>
                        <LuChevronDown size={20} className={`text-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <p className="p-5 pt-0 text-text leading-relaxed">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
