import Link from "next/link";

export default function BlogPost() {
  return (
    <div className="flex-1 bg-neutral-bg">
      <article className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/blog" className="text-accent hover:underline font-medium text-sm mb-8 inline-block">&larr; Back to Blog</Link>
        <span className="block text-sm font-semibold text-text-muted mb-4">Oct 12, 2026 &bull; 5 min read</span>
        <h1 className="font-display font-semibold text-4xl md:text-5xl text-primary mb-8 leading-tight">The Future of Travel: How AI is Changing the Way We Explore</h1>
        
        <div className="w-full h-[400px] rounded-3xl overflow-hidden mb-12">
          <img src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&q=80" alt="Cover" className="w-full h-full object-cover" />
        </div>

        <div className="prose prose-lg max-w-none text-text font-serif leading-relaxed" style={{ fontFamily: "var(--font-newsreader)" }}>
          <p className="text-xl text-text-muted mb-6">
            Artificial Intelligence is no longer a sci-fi concept. It&apos;s here, and it&apos;s completely transforming the travel industry. From smart itineraries to personalized recommendations, the way we plan our trips is evolving.
          </p>
          <p className="mb-6">
            Imagine waking up and knowing exactly what the perfect day in a new city looks like for you. Not a generic top 10 list, but a curated experience based on your love for modern art, vegan food, and sunset viewpoints. That is the power of AI.
          </p>
          <h3 className="font-display font-semibold text-2xl text-primary mb-4 mt-8">Hyper-Personalization</h3>
          <p className="mb-6">
            Travel agencies of the past relied on human memory and static brochures. Today, machine learning models process millions of reviews, weather patterns, and traffic updates in milliseconds to build dynamic routes that adapt on the fly.
          </p>
          <blockquote className="border-l-4 border-accent pl-6 italic text-xl text-primary my-8">
            &quot;The best travel companion is one that knows you better than you know yourself.&quot;
          </blockquote>
          <p className="mb-6">
            As we move towards 2030, expect to see even more immersive technologies like AR-powered translation and predictive budgeting directly integrated into your travel assistant.
          </p>
        </div>
      </article>

      {/* Related Posts */}
      <section className="bg-surface border-t border-border py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display font-semibold text-3xl text-primary mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link href="/blog/sustainable-travel-guide" className="group flex flex-col bg-neutral-bg rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all">
              <div className="w-full h-48 bg-border overflow-hidden">
                <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80" alt="Sustainable" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <span className="text-sm font-semibold text-accent mb-2 block">Sep 15, 2026</span>
                <h3 className="font-display font-semibold text-xl text-primary group-hover:text-accent transition-colors">The Ultimate Guide to Sustainable Travel</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
