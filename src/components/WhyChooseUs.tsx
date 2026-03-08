import { Search, Shield, TrendingUp, Clock, Headphones, Globe } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Smart Search",
    description: "Find properties with advanced filters for price, location, amenities, and more.",
  },
  {
    icon: Shield,
    title: "Verified Listings",
    description: "Every property goes through admin approval to ensure quality and authenticity.",
  },
  {
    icon: TrendingUp,
    title: "Market Insights",
    description: "Access real-time views and analytics to make informed buying decisions.",
  },
  {
    icon: Clock,
    title: "Quick Listing",
    description: "Sellers can list properties in under 2 minutes with our streamlined process.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description: "Our team is available to help you every step of the way, from search to close.",
  },
  {
    icon: Globe,
    title: "Nationwide Coverage",
    description: "Browse properties across all 50 states — from city penthouses to countryside homes.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <span className="inline-block rounded-full bg-accent/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-wider text-accent">
            Why EstateHub
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl">
            Everything You Need in One Place
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            We've built the tools to make buying and selling property simple, safe, and transparent.
          </p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:border-accent/30 hover:shadow-lg"
            >
              <div className="mb-5 inline-flex rounded-xl bg-accent/10 p-3 transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <f.icon className="h-6 w-6 text-accent group-hover:text-accent-foreground" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
