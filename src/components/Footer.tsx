import Link from "next/link";
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";

export function Footer() {
  return (
    <footer className="bg-primary text-neutral-bg pt-16 pb-8 border-t border-primary-hover">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="font-display font-bold text-2xl flex items-center gap-2">
              <span className="text-accent">Travix</span> AI
            </Link>
            <p className="text-neutral-bg/80 text-sm leading-relaxed max-w-xs">
              Your personalized boarding pass to everywhere. Discover, plan, and manage your trips with our intelligent AI travel assistant.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-hover text-neutral-bg hover:bg-accent hover:text-white transition-colors">
                <FaFacebookF size={18} />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-hover text-neutral-bg hover:bg-accent hover:text-white transition-colors">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-hover text-neutral-bg hover:bg-accent hover:text-white transition-colors">
                <FaXTwitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-hover text-neutral-bg hover:bg-accent hover:text-white transition-colors">
                <FaYoutube size={18} />
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Explore</h3>
            <ul className="flex flex-col gap-4 text-neutral-bg/80 text-sm">
              <li><Link href="/explore" className="hover:text-accent transition-colors">Destinations</Link></li>
              <li><Link href="/explore?category=adventure" className="hover:text-accent transition-colors">Adventure</Link></li>
              <li><Link href="/explore?category=culture" className="hover:text-accent transition-colors">Culture & Arts</Link></li>
              <li><Link href="/explore?category=relax" className="hover:text-accent transition-colors">Relaxation</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Company</h3>
            <ul className="flex flex-col gap-4 text-neutral-bg/80 text-sm">
              <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
              <li><Link href="/blog" className="hover:text-accent transition-colors">Travel Blog</Link></li>
              <li><Link href="/faq" className="hover:text-accent transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Legal</h3>
            <ul className="flex flex-col gap-4 text-neutral-bg/80 text-sm">
              <li><Link href="#" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom with signature dashed line */}
        <div className="pt-8 border-t border-dashed border-primary-hover flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-bg/60">
          <p>© {new Date().getFullYear()} Travix AI. All rights reserved.</p>
          <div className="flex items-center gap-2 font-mono">
            <span>Built with ❤️ by Travix Team</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
