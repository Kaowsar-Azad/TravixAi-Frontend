import Link from "next/link";

const POSTS = [
  { slug: "ai-travel-future", title: "The Future of Travel: How AI is Changing the Way We Explore", excerpt: "Discover how artificial intelligence is making travel planning more personalized and seamless than ever before.", date: "Oct 12, 2026", image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=80" },
  { slug: "top-10-destinations-2027", title: "Top 10 Hidden Gem Destinations for 2027", excerpt: "Escape the crowds and discover these breathtaking locations that are still off the radar for most tourists.", date: "Sep 28, 2026", image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80" },
  { slug: "sustainable-travel-guide", title: "The Ultimate Guide to Sustainable Travel", excerpt: "Learn how you can reduce your carbon footprint while still enjoying the wonders of the world.", date: "Sep 15, 2026", image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80" },
];

export default function BlogPage() {
  return (
    <div className="flex-1 bg-neutral-bg py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-display font-semibold text-5xl text-primary mb-4">Travel Insights</h1>
        <p className="text-xl text-text-muted mb-12 max-w-2xl">Read our latest articles on travel tips, AI technology, and destination guides.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col bg-surface rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all">
              <div className="w-full h-48 bg-border overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <span className="text-sm font-semibold text-accent mb-2">{post.date}</span>
                <h2 className="font-display font-semibold text-xl text-primary mb-3 group-hover:text-accent transition-colors">{post.title}</h2>
                <p className="text-text-muted line-clamp-3">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
