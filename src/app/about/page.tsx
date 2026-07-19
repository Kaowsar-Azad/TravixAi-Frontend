import { Button } from "@/components/ui/Button";

const TEAM = [
  { name: "Sarah Connor", role: "CEO & Founder", image: "https://i.pravatar.cc/300?u=a" },
  { name: "Michael Chang", role: "Head of AI", image: "https://i.pravatar.cc/300?u=b" },
  { name: "Elena Rostova", role: "VP of Travel Experience", image: "https://i.pravatar.cc/300?u=c" },
  { name: "David Kim", role: "Lead Engineer", image: "https://i.pravatar.cc/300?u=d" },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col bg-neutral-bg">
      {/* Hero Banner */}
      <section className="bg-primary text-neutral-bg py-24 px-6">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <h1 className="font-display font-semibold text-5xl md:text-6xl mb-6">Redefining Travel with AI</h1>
          <p className="text-xl opacity-90 max-w-2xl">We believe technology shouldn't just book your trips, it should inspire them.</p>
        </div>
      </section>

      {/* Brand Story & Mission */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex-1">
            <h2 className="font-display font-semibold text-3xl text-primary mb-4">Our Story</h2>
            <p className="text-text leading-relaxed">
              Travix AI was born out of frustration with endless tabs, overwhelming choices, and generic itineraries. We wanted a travel agent that knew our tastes perfectly but possessed the computational power to scan millions of options in seconds.
            </p>
          </div>
          <div className="flex-1">
            <h2 className="font-display font-semibold text-3xl text-primary mb-4">Our Mission</h2>
            <p className="text-text leading-relaxed">
              To empower every traveler to explore the world with confidence, offering deeply personalized, sustainable, and stress-free journey planning powered by state-of-the-art Artificial Intelligence.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Block (Reused style) */}
      <section className="bg-surface py-16 px-6 border-y border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "50K+", label: "Happy Travelers" },
            { value: "120+", label: "Countries Covered" },
            { value: "1M+", label: "Itineraries Generated" },
            { value: "4.9/5", label: "Average Rating" },
          ].map((stat, i) => (
            <div key={i}>
              <p className="font-display font-semibold text-4xl text-accent mb-2">{stat.value}</p>
              <p className="text-text-muted font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display font-semibold text-4xl text-primary mb-4">Meet the Team</h2>
          <p className="text-text-muted max-w-xl mx-auto">The visionaries and engineers behind your AI travel companion.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {TEAM.map((member, i) => (
            <div key={i} className="flex flex-col items-center">
              <img src={member.image} alt={member.name} className="w-48 h-48 rounded-2xl object-cover mb-4 shadow-sm" />
              <h3 className="font-display font-semibold text-xl text-primary">{member.name}</h3>
              <p className="text-accent font-medium">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
