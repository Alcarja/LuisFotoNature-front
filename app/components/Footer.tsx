"use client";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full py-20 px-6 bg-white border-t-2 border-zinc-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded bg-zinc-900" />
              <span className="font-black text-lg tracking-tight text-zinc-900">LUIS FOTO</span>
            </div>
            <p className="text-zinc-700 font-light leading-relaxed">
              Celebrating the raw beauty of nature through photography. Capturing moments from the world's most breathtaking locations.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-6 text-zinc-900">
              Explore
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-zinc-700 font-light hover:text-zinc-900 transition">Gallery</a></li>
              <li><a href="#" className="text-zinc-700 font-light hover:text-zinc-900 transition">Collections</a></li>
              <li><a href="#" className="text-zinc-700 font-light hover:text-zinc-900 transition">About</a></li>
              <li><a href="#" className="text-zinc-700 font-light hover:text-zinc-900 transition">Blog</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-6 text-zinc-900">
              Connect
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-zinc-700 font-light hover:text-zinc-900 transition">Instagram</a></li>
              <li><a href="#" className="text-zinc-700 font-light hover:text-zinc-900 transition">Twitter</a></li>
              <li><a href="#" className="text-zinc-700 font-light hover:text-zinc-900 transition">Email</a></li>
              <li><a href="#" className="text-zinc-700 font-light hover:text-zinc-900 transition">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm font-light text-zinc-600">
              &copy; 2026 Luis Foto Nature. All rights reserved.
            </p>
            <div className="flex gap-6 mt-6 md:mt-0 items-center">
              <a href="#" className="text-sm font-light text-zinc-700 hover:text-zinc-900 transition">Privacy</a>
              <a href="#" className="text-sm font-light text-zinc-700 hover:text-zinc-900 transition">Terms</a>
              <button
                onClick={scrollToTop}
                className="ml-4 p-2 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7-7m0 0l-7 7m7-7v12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
