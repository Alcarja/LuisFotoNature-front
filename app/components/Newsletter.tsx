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
    <section className="w-full py-24 px-6 bg-zinc-950">
      <div className="max-w-xl mx-auto text-center">
        <span className="text-xs font-medium tracking-[0.2em] text-white/40 uppercase">
          Newsletter
        </span>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mt-3 mb-4">
          Stay Updated
        </h2>
        <p className="text-sm text-white/50 mb-10 leading-relaxed">
          New photo stories and collections delivered to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 px-5 py-3 rounded-lg bg-white/10 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-white/30 transition"
            required
          />
          <button
            type="submit"
            className="px-8 py-3 bg-white text-zinc-900 text-sm font-bold rounded-lg hover:bg-white/90 transition-all whitespace-nowrap"
          >
            {submitted ? "Done" : "Subscribe"}
          </button>
        </form>

        {submitted && (
          <p className="mt-6 text-sm text-white/50">
            Thanks for subscribing!
          </p>
        )}
      </div>
    </section>
  );
}
