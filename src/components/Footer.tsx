import Link from "next/link";
import { FaLinkedinIn, FaXTwitter, FaGithub } from "react-icons/fa6";
import { PiArrowRightBold, PiSparkleDuotone, PiPlanetDuotone, PiChatTeardropTextDuotone } from "react-icons/pi";

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-[#1B2A4A] via-[#14213A] to-[#0A1224] text-neutral-bg pt-20 pb-10 overflow-hidden">
      {/* Decorative Blur Blobs */}
      <div className="absolute top-[-50px] left-[10%] w-[300px] h-[300px] rounded-full bg-accent/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-50px] right-[10%] w-[300px] h-[300px] rounded-full bg-secondary/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          
          {/* Brand Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Link href="/" className="font-display font-bold text-2xl flex items-center gap-2 group w-fit">
              <span className="text-accent group-hover:rotate-12 transition-transform duration-300">Travix</span> 
              <span className="text-white">AI</span>
            </Link>
            <p className="text-neutral-bg/70 text-sm leading-relaxed max-w-sm">
              Your intelligent boarding pass to everywhere. Explore destinations, generate tailored day-by-day itineraries, and experience hassle-free planning with our advanced AI travel assistant.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: <FaLinkedinIn size={16} />, href: "https://www.linkedin.com/in/kaowsar-azad", name: "LinkedIn" },
                { icon: <FaXTwitter size={16} />, href: "https://x.com/pranto17297", name: "X" },
                { icon: <FaGithub size={16} />, href: "https://github.com/Kaowsar-Azad", name: "GitHub" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-neutral-bg hover:bg-accent hover:border-accent hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-sm"
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column 1 (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold text-base mb-6 tracking-wider uppercase flex items-center gap-2">
              <PiPlanetDuotone className="text-accent" size={18} />
              Explore
            </h3>
            <ul className="flex flex-col gap-4 text-neutral-bg/75 text-sm">
              {[
                { name: "All Destinations", href: "/explore" },
                { name: "Adventure Trips", href: "/explore?category=adventure" },
                { name: "Cultural Rich", href: "/explore?category=culture" },
                { name: "Relaxation", href: "/explore?category=relax" },
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="hover:text-accent transition-colors flex items-center gap-1.5 group">
                    <span className="w-0 group-hover:w-1.5 h-[2px] bg-accent transition-all duration-200 rounded-full" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column 2 (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold text-base mb-6 tracking-wider uppercase flex items-center gap-2">
              <PiChatTeardropTextDuotone className="text-secondary" size={18} />
              Company
            </h3>
            <ul className="flex flex-col gap-4 text-neutral-bg/75 text-sm">
              {[
                { name: "About Us", href: "/about" },
                { name: "Contact Help", href: "/contact" },
                { name: "Travel Blog", href: "/blog" },
                { name: "FAQ Help", href: "/faq" },
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="hover:text-accent transition-colors flex items-center gap-1.5 group">
                    <span className="w-0 group-hover:w-1.5 h-[2px] bg-accent transition-all duration-200 rounded-full" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Assistant Status Column (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-6 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              </div>
              <span className="text-white font-medium text-sm">AI Copilot Online</span>
            </div>
            <p className="text-xs text-neutral-bg/60 leading-relaxed">
              Need assistance with your travel plan? Chat directly with our context-aware agent.
            </p>
            <Link href="/ai-assistant">
              <button className="w-full flex items-center justify-between bg-accent hover:bg-accent-hover text-white text-xs font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 cursor-pointer group">
                <span className="flex items-center gap-2">
                  <PiSparkleDuotone size={16} />
                  Ask AI Planner
                </span>
                <PiArrowRightBold size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-bg/50">
          <p>© {new Date().getFullYear()} Travix AI. All rights reserved.</p>
          <div className="flex items-center gap-2 font-mono">
            <span>Crafted with ❤️ for smart travelers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
