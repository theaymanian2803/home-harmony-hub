import { useState } from "react";
import { Mail, Phone, MapPin, Send, Clock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const contactInfo = [
  { icon: Mail, label: "Email Us", value: "hello@estatehub.com", href: "mailto:hello@estatehub.com" },
  { icon: Phone, label: "Call Us", value: "1-800-123-4567", href: "tel:+18001234567" },
  { icon: MapPin, label: "Office", value: "123 Market St, San Francisco, CA 94105", href: "#" },
  { icon: Clock, label: "Hours", value: "Mon–Fri, 9AM–6PM PST", href: "#" },
];

const faqs = [
  { q: "How do I list a property?", a: "Sign up for a free account, go to your Seller Dashboard, and click 'New Listing'. You can list up to 2 properties for free." },
  { q: "Is it free to browse properties?", a: "Yes! Browsing and searching properties on EstateHub is completely free. No account required." },
  { q: "How long does listing approval take?", a: "Our admin team reviews new listings within 24 hours. You'll receive a notification once your listing is approved." },
  { q: "Can I edit my listing after publishing?", a: "Absolutely. Go to your Seller Dashboard → Manage tab, and click the edit icon on any listing to update details and images." },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      toast({ title: "Message Sent!", description: "We'll get back to you within 24 hours." });
      setSending(false);
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="gradient-navy pt-32 pb-20">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block rounded-full bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
            Get in Touch
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold text-primary-foreground md:text-6xl">
            Contact Us
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/60">
            Have questions? We'd love to hear from you. Our team is ready to help with anything you need.
          </p>
        </div>
      </section>

      {/* Contact info + Form */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact cards */}
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">Reach Out Anytime</h2>
              <p className="mt-2 text-muted-foreground">
                Whether you have a question about listings, pricing, or anything else, our team is here to help.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {contactInfo.map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-accent/30 hover:shadow-md"
                  >
                    <div className="mb-3 inline-flex rounded-xl bg-accent/10 p-2.5 group-hover:bg-accent transition-colors">
                      <c.icon className="h-5 w-5 text-accent group-hover:text-accent-foreground transition-colors" />
                    </div>
                    <p className="font-display text-sm font-semibold text-foreground">{c.label}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{c.value}</p>
                  </a>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="rounded-2xl border border-border bg-card p-8">
              <h2 className="font-display text-2xl font-bold text-foreground">Send a Message</h2>
              <p className="mt-1 text-sm text-muted-foreground">Fill out the form and we'll respond within 24 hours.</p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">First Name</label>
                    <Input placeholder="John" required />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Last Name</label>
                    <Input placeholder="Doe" required />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
                  <Input type="email" placeholder="john@example.com" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Subject</label>
                  <Input placeholder="How can we help?" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Message</label>
                  <Textarea placeholder="Tell us more about your inquiry…" rows={5} required />
                </div>
                <Button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-accent text-accent-foreground hover:bg-emerald-light rounded-xl"
                  size="lg"
                >
                  {sending ? "Sending…" : (
                    <><Send className="mr-2 h-4 w-4" /> Send Message</>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <span className="inline-block rounded-full bg-accent/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-wider text-accent">
              FAQ
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold text-foreground">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="mx-auto mt-12 max-w-3xl space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-start gap-3">
                  <MessageSquare className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                  <div>
                    <h3 className="font-display text-sm font-bold text-foreground">{f.q}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{f.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
