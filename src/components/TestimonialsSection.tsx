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
    <section className="section-padding bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <span className="inline-block rounded-full bg-accent/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-wider text-accent">
            Testimonials
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl">
            Loved by Thousands
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Real stories from real people who found their perfect property on EstateHub.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="relative rounded-2xl border border-border bg-card p-8">
              <Quote className="absolute right-6 top-6 h-10 w-10 text-accent/10" />
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground italic">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 font-display text-sm font-bold text-accent">
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
