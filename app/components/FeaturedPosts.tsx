interface Post {
  id: number;
  title: string;
  category: string;
  description: string;
  date: string;
  image: string;
}

const posts: Post[] = [
  {
    id: 1,
    title: "Mountain Peaks at Dawn",
    category: "Landscapes",
    description: "Exploring the highest peaks under the golden morning light",
    date: "February 10, 2026",
    image: "/placeholder-1.jpg",
  },
  {
    id: 2,
    title: "Wildlife in Motion",
    category: "Wildlife",
    description: "Capturing the raw beauty of animals in their natural habitat",
    date: "February 8, 2026",
    image: "/placeholder-2.jpg",
  },
  {
    id: 3,
    title: "Ocean Sunsets",
    category: "Nature",
    description: "The perfect blend of colors as day transitions to night",
    date: "February 5, 2026",
    image: "/placeholder-3.jpg",
  },
];

export default function FeaturedPosts() {
  return (
    <section className="w-full py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-20">
          <span className="text-xs font-bold tracking-[0.2em] text-zinc-900 uppercase">
            Featured Collections
          </span>
          <h2 className="text-5xl md:text-6xl font-black mt-4 tracking-tight text-zinc-900">
            Latest Work
          </h2>
        </div>

        {/* Asymmetric Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Featured post - spans 2 columns and 2 rows */}
          <article className="md:col-span-2 md:row-span-2 group cursor-pointer">
            <div className="relative h-80 md:h-full min-h-96 bg-gray-300 rounded-2xl overflow-hidden mb-0">
              <div className="w-full h-full bg-linear-to-br from-gray-400 to-gray-300 flex items-center justify-center">
                <span className="text-white/70 font-light">Featured Image</span>
              </div>
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-zinc-900/0 group-hover:bg-zinc-900/40 transition duration-500 flex items-end p-8">
                <div className="opacity-0 group-hover:opacity-100 transition duration-500 text-white">
                  <div className="inline-block px-4 py-2 bg-zinc-900 rounded-full mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest">
                      {posts[0].category}
                    </span>
                  </div>
                  <h3 className="text-3xl font-black mb-2">{posts[0].title}</h3>
                  <p className="text-sm font-light opacity-90">{posts[0].description}</p>
                </div>
              </div>
            </div>
          </article>

          {/* Secondary posts */}
          {posts.slice(1).map((post) => (
            <article key={post.id} className="group cursor-pointer">
              <div className="relative h-64 bg-gray-300 rounded-2xl overflow-hidden mb-6">
                <div className="w-full h-full bg-linear-to-br from-gray-400 to-gray-300 flex items-center justify-center">
                  <span className="text-white/70 font-light">Featured Image</span>
                </div>
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-zinc-900/0 group-hover:bg-zinc-900/50 transition duration-500 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition duration-500 text-white text-center">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-900">
                    {post.category}
                  </span>
                  <span className="text-xs font-light text-zinc-600">
                    {post.date}
                  </span>
                </div>
                <h3 className="text-xl font-black text-zinc-900 group-hover:text-zinc-700 transition">
                  {post.title}
                </h3>
                <p className="text-zinc-700 font-light leading-relaxed">
                  {post.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* View All button */}
        <div className="mt-16 text-center">
          <button className="px-10 py-4 border-2 border-zinc-900 text-zinc-900 font-bold rounded-lg hover:bg-zinc-900 hover:text-white transition-all duration-300 text-lg">
            View All Collections
          </button>
        </div>
      </div>
    </section>
  );
}
