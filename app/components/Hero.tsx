export default function Hero() {
  return (
    <section className="relative w-full h-[70vh] bg-white overflow-hidden mt-16">
      <div className="flex h-full">
        {/* Left side - Image */}
        <div className="hidden md:block md:w-1/2 relative overflow-hidden">
          {/* Placeholder image with gradient overlay */}
          <div className="w-full h-full bg-linear-to-br from-gray-300 to-gray-400" />
          <div className="absolute inset-0 bg-linear-to-r from-zinc-900/30 via-transparent to-transparent" />
        </div>

        {/* Right side - Content */}
        <div className="w-full md:w-1/2 flex items-center px-6 md:px-8 lg:px-12">
          <div className="w-full max-w-md">
            {/* Badge */}
            <div className="mb-8 inline-block">
              <span className="text-xs font-bold tracking-[0.2em] text-zinc-900 uppercase">
                ★ Featured This Week
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-8 leading-[1.1] text-zinc-900">
              Moments Frozen in Time
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg font-light text-zinc-700 mb-10 leading-relaxed">
              Explore stunning landscapes and wildlife photography from the world's most remote and beautiful locations. Each image tells a story of adventure and discovery.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-14">
              <button className="px-8 py-3 bg-zinc-900 text-white font-bold rounded-lg hover:bg-zinc-800 transition-all duration-300">
                View Gallery
              </button>
              <button className="px-8 py-3 border-2 border-zinc-900 text-zinc-900 font-bold rounded-lg hover:bg-zinc-900 hover:text-white transition-all duration-300">
                Latest Post
              </button>
            </div>

            {/* Quick stats */}
            <div className="border-t border-zinc-200 pt-8 flex gap-8">
              <div>
                <p className="text-3xl font-black text-zinc-900">500+</p>
                <p className="text-sm text-zinc-600 font-light mt-1">Photos</p>
              </div>
              <div>
                <p className="text-3xl font-black text-zinc-900">25+</p>
                <p className="text-sm text-zinc-600 font-light mt-1">Countries</p>
              </div>
              <div>
                <p className="text-3xl font-black text-zinc-900">8</p>
                <p className="text-sm text-zinc-600 font-light mt-1">Years</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile - Image background */}
        <div className="md:hidden absolute inset-0 w-full h-full bg-linear-to-br from-gray-300 to-gray-400 -z-10" />
        <div className="md:hidden absolute inset-0 bg-linear-to-r from-white via-white/80 to-transparent -z-10" />
      </div>
    </section>
  );
}
