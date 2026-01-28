"use client";

import Link from "next/link";
import { useState } from "react";

export default function LandingPage() {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen gradient-bg">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold">SharpML</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#how" className="text-gray-400 hover:text-white transition-colors">How It Works</Link>
            <Link href="#moments" className="text-gray-400 hover:text-white transition-colors">For Your Moments</Link>
            <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-400 hover:text-white transition-colors">Sign In</Link>
            <Link href="/upload" className="btn-primary text-sm">Create a Memory</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Step Back Into<br />
            <span className="gradient-text">Your Favorite Moments</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            What if you could walk through your wedding day again? Revisit grandma's kitchen 
            one more time? Your photos hold more than you think. We help you unlock it.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/upload" className="btn-primary text-lg px-8 py-4">
              Create Your First Memory
            </Link>
            <Link href="/view/demo" className="btn-secondary text-lg px-8 py-4">
              See an Example
            </Link>
          </div>
          
          <p className="text-gray-500 text-sm">
            No credit card needed · First memory is free
          </p>
        </div>
      </section>

      {/* Demo Preview */}
      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="aspect-video rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <Link href="/view/demo" className="group">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-colors cursor-pointer">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="text-gray-300 group-hover:text-white transition-colors">Click to explore in 3D</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - Human Stories */}
      <section className="py-16 px-6 bg-gradient-to-b from-transparent via-amber-950/10 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-6">
              <p className="text-gray-300 mb-4 italic">
                "I lost my dad two years ago. Being able to walk through his workshop again, 
                seeing his tools exactly where he left them... I didn't know I needed this."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
                <div>
                  <p className="font-medium text-sm">Sarah M.</p>
                  <p className="text-gray-500 text-xs">Memorial</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <p className="text-gray-300 mb-4 italic">
                "We converted our wedding venue into a memory. Now we revisit it every anniversary. 
                Way better than flipping through a photo album."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-rose-600"></div>
                <div>
                  <p className="font-medium text-sm">James & Priya K.</p>
                  <p className="text-gray-500 text-xs">Wedding</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <p className="text-gray-300 mb-4 italic">
                "My kids are growing so fast. I captured their playroom before they outgrow it. 
                Someday they'll thank me."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600"></div>
                <div>
                  <p className="font-medium text-sm">David L.</p>
                  <p className="text-gray-500 text-xs">Family</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Simple */}
      <section id="how" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
            No technical skills needed. If you can take photos on your phone, you can do this.
          </p>

          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center text-2xl font-bold text-amber-400 shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Walk around and snap photos</h3>
                <p className="text-gray-400">
                  Take 15-30 photos of your space from different angles. Walk slowly around the room 
                  or object you want to capture. More angles = better result.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center text-2xl font-bold text-rose-400 shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Upload and wait a few minutes</h3>
                <p className="text-gray-400">
                  Our technology stitches your photos into a navigable 3D space. 
                  Takes about 5-10 minutes depending on how many photos you uploaded.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center text-2xl font-bold text-purple-400 shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Revisit anytime, share with anyone</h3>
                <p className="text-gray-400">
                  Your memory lives at a unique link. Open it on any device — phone, tablet, computer. 
                  Share with family across the world. No app required.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/upload" className="btn-primary text-lg px-8 py-4">
              Try It Free
            </Link>
          </div>
        </div>
      </section>

      {/* For Your Moments */}
      <section id="moments" className="py-20 px-6 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">For Your Most Important Moments</h2>
          <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
            Some spaces matter more than others. These are worth preserving.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { emoji: "💒", title: "Weddings", desc: "Your venue, your day, forever explorable" },
              { emoji: "👶", title: "Baby Moments", desc: "The nursery before they outgrow it" },
              { emoji: "🕯️", title: "Memorials", desc: "Keep loved ones' spaces alive" },
              { emoji: "✈️", title: "Travel", desc: "That Airbnb you never want to forget" },
              { emoji: "🏠", title: "Homes", desc: "Before you move, after you renovate" },
              { emoji: "🎄", title: "Holidays", desc: "The tree, the decorations, the chaos" },
              { emoji: "🎓", title: "Milestones", desc: "Graduation, first apartment, big moments" },
              { emoji: "🐕", title: "Pets", desc: "Their favorite spot on the couch" },
            ].map((item, i) => (
              <div key={i} className="card p-5 text-center hover:border-gray-600 transition-colors">
                <div className="text-3xl mb-3">{item.emoji}</div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Pricing */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Simple Pricing</h2>
          <p className="text-gray-400 mb-12">Pay only when you create. No subscriptions, no surprises.</p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="card p-8">
              <h3 className="text-xl font-semibold mb-2">First Memory</h3>
              <div className="text-4xl font-bold mb-4">Free</div>
              <p className="text-gray-400 text-sm mb-6">Try it out, no credit card needed</p>
              <ul className="text-left text-sm text-gray-400 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Full quality 3D memory
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Shareable link
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Hosted forever
                </li>
              </ul>
              <Link href="/upload" className="btn-secondary w-full block text-center">
                Start Free
              </Link>
            </div>
            
            <div className="card p-8 border-amber-500/30">
              <h3 className="text-xl font-semibold mb-2">Additional Memories</h3>
              <div className="text-4xl font-bold mb-4">$5<span className="text-lg text-gray-400 font-normal"> each</span></div>
              <p className="text-gray-400 text-sm mb-6">Buy as you go, no commitment</p>
              <ul className="text-left text-sm text-gray-400 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Everything in Free
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Priority processing
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Higher resolution
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Download splat file
                </li>
              </ul>
              <Link href="/upload" className="btn-primary w-full block text-center">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Some moments deserve more than a flat photo.
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Start with one memory. See how it feels to step back inside.
          </p>
          <Link href="/upload" className="btn-primary text-lg px-10 py-4">
            Create Your First Memory — Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-amber-500 to-rose-600"></div>
            <span className="font-semibold">SharpML</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <a href="mailto:hello@sharpml.com" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-sm text-gray-500">Made with care in Denver</p>
        </div>
      </footer>
    </div>
  );
}
