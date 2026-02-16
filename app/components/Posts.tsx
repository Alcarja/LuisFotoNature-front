interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Art of Landscape Photography: Capturing Nature's Majesty",
    excerpt: "Discover the techniques and settings that help capture breathtaking mountain vistas and golden hour landscapes.",
    category: "Tutorial",
    author: "Luis García",
    date: "February 8, 2026",
    readTime: "8 min read",
    image: "/placeholder-post-1.jpg",
  },
  {
    id: 2,
    title: "Wildlife Photography: Patience and Persistence in the Field",
    excerpt: "A behind-the-scenes look at how I spent 3 months capturing elusive mountain lions in their natural habitat.",
    category: "Stories",
    author: "Luis García",
    date: "February 1, 2026",
    readTime: "12 min read",
    image: "/placeholder-post-2.jpg",
  },
  {
    id: 3,
    title: "Essential Gear for Adventure Photography",
    excerpt: "Complete breakdown of the camera equipment and lenses I use for all my photography expeditions.",
    category: "Gear",
    author: "Luis García",
    date: "January 25, 2026",
    readTime: "6 min read",
    image: "/placeholder-post-3.jpg",
  },
  {
    id: 4,
    title: "Editing Secrets: From RAW to Final Image",
    excerpt: "Learn my post-processing workflow and editing techniques that transform RAW files into stunning photographs.",
    category: "Tutorial",
    author: "Luis García",
    date: "January 18, 2026",
    readTime: "10 min read",
    image: "/placeholder-post-4.jpg",
  },
];

export default function Posts() {
  return (
    <section className="w-full py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-20">
          <span className="text-xs font-bold tracking-[0.2em] text-zinc-900 uppercase">
            Latest Stories
          </span>
          <h2 className="text-5xl md:text-6xl font-black mt-4 tracking-tight text-zinc-900">
            From the Blog
          </h2>
          <p className="text-lg font-light text-zinc-700 mt-6 max-w-2xl">
            Photography tips, travel stories, and behind-the-scenes insights from my adventures around the world.
          </p>
        </div>

        {/* Posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {blogPosts.map((post) => (
            <article key={post.id} className="group flex flex-col h-full cursor-pointer">
              {/* Image container */}
              <div className="relative h-48 bg-gray-300 rounded-xl overflow-hidden mb-6 flex-shrink-0">
                <div className="w-full h-full bg-linear-to-br from-gray-400 to-gray-300 flex items-center justify-center">
                  <span className="text-white/70 font-light text-sm">Featured Image</span>
                </div>
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-zinc-900/0 group-hover:bg-zinc-900/40 transition duration-300" />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-grow">
                {/* Category tag */}
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-zinc-100 text-zinc-900 text-xs font-bold uppercase tracking-wider rounded-full">
                    {post.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-black text-zinc-900 mb-3 group-hover:text-zinc-700 transition line-clamp-3">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm md:text-base font-light text-zinc-700 mb-6 flex-grow line-clamp-2">
                  {post.excerpt}
                </p>

                {/* Meta info */}
                <div className="space-y-3 border-t border-zinc-200 pt-4">
                  <div className="flex items-center justify-between text-xs font-light text-zinc-600">
                    <span>{post.author}</span>
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-light text-zinc-600">{post.readTime}</span>
                    <span className="text-zinc-900 font-bold opacity-0 group-hover:opacity-100 transition">→</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View all button */}
        <div className="text-center">
          <button className="px-10 py-4 border-2 border-zinc-900 text-zinc-900 font-bold rounded-lg hover:bg-zinc-900 hover:text-white transition-all duration-300 text-lg">
            View All Articles
          </button>
        </div>
      </div>
    </section>
  );
}
