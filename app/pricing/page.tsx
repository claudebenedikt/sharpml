"use client";

import { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    q: "What is a 'memory'?",
    a: "A memory is an interactive 3D capture of a place or moment. You upload photos, and we turn them into a navigable 3D scene you can walk through on any device.",
  },
  {
    q: "How many photos do I need?",
    a: "We recommend 15-30 photos taken from different angles. More photos generally produce better quality. Walk around the space and snap as you go.",
  },
  {
    q: "What can I do with my memory?",
    a: "View it anytime on any device, share it with anyone via a link, or download the file to use in your own projects. No special software needed to view.",
  },
  {
    q: "How long are memories stored?",
    a: "Forever. Once created, your memories are hosted indefinitely. Share them with family across generations.",
  },
  {
    q: "What happens to my photos?",
    a: "Your photos are processed securely and deleted after the memory is created. We never share or sell your data.",
  },
  {
    q: "Can I get a refund?",
    a: "If we can't create a good memory from your photos (due to quality issues or insufficient coverage), we'll refund your purchase or let you try again.",
  },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold">SharpML</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-400 hover:text-white transition-colors text-sm">
              Sign In
            </Link>
            <Link href="/upload" className="btn-primary text-sm">
              Create Memory
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Pay Only When You Create
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto">
          No subscriptions, no monthly fees. Just pay for each memory you create.
        </p>
      </section>

      {/* Pricing cards */}
      <section className="max-w-2xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Free tier */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-1">First Memory</h3>
            <div className="text-4xl font-bold mb-2">Free</div>
            <p className="text-gray-500 text-sm mb-6">Try it out, no credit card needed</p>
            
            <ul className="space-y-2.5 mb-6 text-sm">
              {[
                "Full quality 3D memory",
                "Shareable link",
                "Hosted forever",
                "View on any device",
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-300">
                  <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            
            <Link href="/upload" className="btn-secondary w-full block text-center text-sm">
              Create Free Memory
            </Link>
          </div>

          {/* Paid tier */}
          <div className="card p-6 border-amber-500/30">
            <h3 className="text-lg font-semibold mb-1">Additional Memories</h3>
            <div className="text-4xl font-bold mb-2">$5<span className="text-lg text-gray-400 font-normal"> each</span></div>
            <p className="text-gray-500 text-sm mb-6">Buy as you go, no commitment</p>
            
            <ul className="space-y-2.5 mb-6 text-sm">
              {[
                "Everything in Free",
                "Priority processing",
                "Higher resolution capture",
                "Download splat file",
                "Unlimited memories",
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-300">
                  <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            
            <Link href="/upload" className="btn-primary w-full block text-center text-sm">
              Get Started
            </Link>
          </div>
        </div>

        {/* Volume pricing */}
        <div className="mt-8 card p-5 text-center">
          <p className="text-gray-400 text-sm">
            <span className="text-amber-500 font-medium">Creating lots of memories?</span>
            {" "}Contact us for volume pricing.
          </p>
          <a href="mailto:hello@sharpml.com" className="text-amber-500 hover:text-amber-400 text-sm">
            hello@sharpml.com →
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="card overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <span className="font-medium text-sm">{faq.q}</span>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform shrink-0 ml-4 ${
                    openFaq === i ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-gray-400 text-sm">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-3">Ready to preserve a moment?</h2>
          <p className="text-gray-500 mb-6 text-sm">
            Start with your free memory. See what your photos can become.
          </p>
          <Link href="/upload" className="btn-primary px-6 py-3">
            Create Your First Memory — Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-amber-500 to-rose-600"></div>
            <span className="font-medium text-sm">SharpML</span>
          </div>
          <div className="flex items-center gap-5 text-xs text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <a href="mailto:hello@sharpml.com" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
