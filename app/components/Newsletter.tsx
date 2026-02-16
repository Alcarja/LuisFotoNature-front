"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section className="w-full py-32 px-6 bg-zinc-900">
      <div className="max-w-2xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-block mb-8">
          <span className="text-xs font-bold tracking-[0.2em] text-white/70 uppercase">
            Stay in the Loop
          </span>
        </div>

        {/* Content */}
        <h2 className="text-5xl md:text-6xl font-black tracking-tight text-white mb-6">
          New Collections Weekly
        </h2>
        <p className="text-lg font-light text-white/70 mb-12 leading-relaxed">
          Get notified about stunning new photo collections and exclusive photography tips delivered straight to your inbox
        </p>

        {/* Social proof */}
        <div className="mb-12">
          <p className="text-sm text-white/50 font-light">
            Joined by 5,000+ photography enthusiasts worldwide
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 px-6 py-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/50 transition font-light"
            required
          />
          <button
            type="submit"
            className="px-10 py-4 bg-white text-zinc-900 font-bold rounded-lg hover:bg-white/90 transition-all duration-300 whitespace-nowrap"
          >
            {submitted ? "✓ Subscribed" : "Subscribe"}
          </button>
        </form>

        {/* Confirmation message */}
        {submitted && (
          <p className="mt-6 text-white/70 font-light">
            Thank you for subscribing! Check your inbox for a welcome message.
          </p>
        )}

        {/* Privacy note */}
        <p className="mt-6 text-xs text-white/40 font-light">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
