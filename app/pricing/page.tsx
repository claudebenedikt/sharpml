"use client";

import { useState } from "react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out SharpML",
    features: [
      "3 splats per month",
      "720p quality",
      "7-day storage",
      "Basic support",
      "Watermark on exports",
    ],
    notIncluded: [
      "Priority processing",
      "Custom branding",
      "API access",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    description: "For creators and enthusiasts",
    features: [
      "Unlimited splats",
      "4K quality",
      "Forever storage",
      "Priority processing",
      "No watermark",
      "Email support",
      "Download in multiple formats",
    ],
    notIncluded: [
      "API access",
      "Team features",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Team",
    price: "$39",
    period: "/month",
    description: "For businesses and agencies",
    features: [
      "Everything in Pro",
      "5 team members",
      "API access",
      "Custom branding",
      "White-label embeds",
      "Priority support",
      "Analytics dashboard",
      "SSO authentication",
    ],
    notIncluded: [],
    cta: "Contact Sales",
    popular: false,
  },
];

const faqs = [
  {
    q: "What is a Gaussian splat?",
    a: "Gaussian splatting is a cutting-edge 3D reconstruction technique that creates photorealistic 3D scenes from photographs. Unlike traditional 3D models, splats capture fine details and realistic lighting.",
  },
  {
    q: "How many photos do I need?",
    a: "For best results, we recommend 20-50 photos taken from different angles. More photos generally produce better quality, but even 5-10 photos can create impressive results.",
  },
  {
    q: "Can I download my splats?",
    a: "Yes! Pro and Team plans allow you to download splats in .splat format for use in your own applications, or embed them directly on your website.",
  },
  {
    q: "What happens to my photos?",
    a: "Your photos are processed securely and deleted after the splat is generated. We never share or sell your data. Only the final splat is stored in your account.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Absolutely. You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.",
  },
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const yearlyDiscount = 0.8; // 20% off

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold">SharpML</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/upload" className="btn-primary text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Simple, Transparent <span className="gradient-text">Pricing</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
          Start free, upgrade when you need more. No hidden fees, no surprises.
        </p>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={billingPeriod === "monthly" ? "text-white" : "text-gray-500"}>
            Monthly
          </span>
          <button
            onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly")}
            className="relative w-14 h-7 rounded-full bg-gray-700 transition-colors"
          >
            <div
              className={`absolute top-1 w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all ${
                billingPeriod === "yearly" ? "left-8" : "left-1"
              }`}
            ></div>
          </button>
          <span className={billingPeriod === "yearly" ? "text-white" : "text-gray-500"}>
            Yearly
            <span className="ml-2 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">
              Save 20%
            </span>
          </span>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`card p-8 relative ${
                plan.popular ? "border-blue-500/50 scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold">
                  {plan.price === "$0"
                    ? "$0"
                    : billingPeriod === "yearly"
                    ? `$${Math.round(parseInt(plan.price.slice(1)) * yearlyDiscount)}`
                    : plan.price}
                </span>
                <span className="text-gray-400">
                  {plan.price === "$0" ? "" : billingPeriod === "yearly" ? "/month, billed yearly" : plan.period}
                </span>
              </div>

              <button
                className={`w-full py-3 rounded-lg font-semibold transition-all mb-8 ${
                  plan.popular
                    ? "btn-primary"
                    : "border border-gray-700 hover:border-gray-600"
                }`}
              >
                {plan.cta}
              </button>

              <ul className="space-y-3">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm">
                    <svg
                      className="w-5 h-5 text-green-500 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
                {plan.notIncluded.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-gray-500">
                    <svg
                      className="w-5 h-5 text-gray-600 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Feature comparison */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Compare Plans</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-4 px-4">Feature</th>
                <th className="text-center py-4 px-4">Free</th>
                <th className="text-center py-4 px-4">Pro</th>
                <th className="text-center py-4 px-4">Team</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Splats per month", "3", "Unlimited", "Unlimited"],
                ["Quality", "720p", "4K", "4K"],
                ["Storage", "7 days", "Forever", "Forever"],
                ["Processing speed", "Standard", "Priority", "Priority"],
                ["Watermark-free", "✗", "✓", "✓"],
                ["API access", "✗", "✗", "✓"],
                ["Team members", "1", "1", "5"],
                ["Custom branding", "✗", "✗", "✓"],
                ["Analytics", "Basic", "Basic", "Advanced"],
              ].map((row, i) => (
                <tr key={i} className="border-b border-gray-800/50">
                  <td className="py-4 px-4 text-gray-300">{row[0]}</td>
                  <td className="py-4 px-4 text-center">
                    {row[1] === "✓" ? (
                      <span className="text-green-500">✓</span>
                    ) : row[1] === "✗" ? (
                      <span className="text-gray-600">✗</span>
                    ) : (
                      <span className="text-gray-400">{row[1]}</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {row[2] === "✓" ? (
                      <span className="text-green-500">✓</span>
                    ) : row[2] === "✗" ? (
                      <span className="text-gray-600">✗</span>
                    ) : (
                      <span className="text-gray-400">{row[2]}</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {row[3] === "✓" ? (
                      <span className="text-green-500">✓</span>
                    ) : row[3] === "✗" ? (
                      <span className="text-gray-600">✗</span>
                    ) : (
                      <span className="text-gray-400">{row[3]}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="card overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <span className="font-medium">{faq.q}</span>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    openFaq === i ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-gray-400">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="card p-12 text-center bg-gradient-to-br from-blue-950/50 to-purple-950/50 border-blue-500/20">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Creating?</h2>
          <p className="text-gray-400 mb-8">
            Join thousands of creators making stunning 3D memories.
          </p>
          <Link href="/upload" className="btn-primary text-lg px-8 py-4">
            Start Free — No Credit Card Required
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-purple-600"></div>
            <span className="font-semibold">SharpML</span>
          </div>
          <p className="text-sm text-gray-500">© 2025 SharpML. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
