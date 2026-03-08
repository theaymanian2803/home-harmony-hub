import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah & Mark Thompson",
    role: "First-time Buyers",
    quote: "EstateHub made finding our dream home effortless. The verified listings gave us confidence, and we closed in just 3 weeks!",
    rating: 5,
    avatar: "ST",
  },
  {
    name: "David Chen",
    role: "Property Investor",
    quote: "As an investor, I need reliable data. EstateHub's analytics and market insights helped me make smart purchasing decisions.",
    rating: 5,
    avatar: "DC",
  },
  {
    name: "Emily Rodriguez",
    role: "Home Seller",
    quote: "I listed my property and had 3 offers within a week. The dashboard made managing everything incredibly simple.",
    rating: 5,
    avatar: "ER",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="section-padding bg-secondary/30 relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute top-10 left-10 h-40 w-40 shape-blob bg-accent/5 animate-float" />
      <div className="absolute bottom-10 right-20 h-28 w-28 shape-blob-3 bg-caramel/5 animate-float-slow" />
      <div className="absolute top-1/2 left-1/3 h-8 w-8 rounded-full bg-accent/10 animate-float" style={{ animationDelay: "3s" }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          <span className="neu-card-sm inline-block px-5 py-2 text-sm font-semibold uppercase tracking-wider text-accent">
            Testimonials
          </span>
          <h2 className="mt-6 font-display text-3xl font-bold text-foreground md:text-5xl">
            Loved by <span className="text-gradient-chocolate">Thousands</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Real stories from real people who found their perfect property on EstateHub.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div key={t.name} className="neu-card p-8 relative transition-all duration-300 hover:translate-y-[-4px]">
              <Quote className="absolute right-6 top-6 h-12 w-12 text-accent/8" />
              
              {/* Stars */}
              <div className="mb-5 flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-caramel text-caramel" />
                ))}
              </div>
              
              <p className="text-sm leading-relaxed text-muted-foreground italic">"{t.quote}"</p>
              
              <div className="mt-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-caramel font-display text-sm font-bold text-accent-foreground shadow-md">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
