import { useState } from "react";
import { Mail, Phone, MapPin, Send, Clock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

export default function ContactPage() {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const { t } = useTranslation();

  const contactInfo = [
    { icon: Mail, label: t("contactPage.emailUs"), value: "hello@estatehub.com", href: "mailto:hello@estatehub.com" },
    { icon: Phone, label: t("contactPage.callUs"), value: "1-800-123-4567", href: "tel:+18001234567" },
    { icon: MapPin, label: t("contactPage.office"), value: "123 Market St, San Francisco, CA 94105", href: "#" },
    { icon: Clock, label: t("contactPage.hours"), value: t("contactPage.hoursValue"), href: "#" },
  ];

  const faqs = [
    { q: t("contactPage.faq1q"), a: t("contactPage.faq1a") },
    { q: t("contactPage.faq2q"), a: t("contactPage.faq2a") },
    { q: t("contactPage.faq3q"), a: t("contactPage.faq3a") },
    { q: t("contactPage.faq4q"), a: t("contactPage.faq4a") },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      toast({ title: t("contactPage.messageSent"), description: t("contactPage.messageSentDesc") });
      setSending(false);
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="gradient-chocolate pt-32 pb-20">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block rounded-full bg-caramel/20 px-4 py-1.5 text-sm font-semibold text-caramel">{t("contactPage.badge")}</span>
          <h1 className="mt-4 font-display text-4xl font-bold text-primary-foreground md:text-6xl">{t("contactPage.title")}</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/60">{t("contactPage.subtitle")}</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">{t("contactPage.reachOut")}</h2>
              <p className="mt-2 text-muted-foreground">{t("contactPage.reachOutSubtitle")}</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {contactInfo.map((c) => (
                  <a key={c.label} href={c.href} className="group neu-card p-6 transition-all duration-300 hover:translate-y-[-4px]">
                    <div className="mb-3 inline-flex rounded-xl neu-pressed p-2.5 group-hover:shadow-none transition-shadow">
                      <c.icon className="h-5 w-5 text-accent" />
                    </div>
                    <p className="font-display text-sm font-semibold text-foreground">{c.label}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{c.value}</p>
                  </a>
                ))}
              </div>
            </div>

            <div className="neu-card p-8">
              <h2 className="font-display text-2xl font-bold text-foreground">{t("contactPage.sendMessage")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t("contactPage.sendMessageSubtitle")}</p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">{t("contactPage.firstName")}</label>
                    <Input placeholder="John" required />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">{t("contactPage.lastName")}</label>
                    <Input placeholder="Doe" required />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">{t("contactPage.email")}</label>
                  <Input type="email" placeholder="john@example.com" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">{t("contactPage.subject")}</label>
                  <Input placeholder={t("contactPage.subjectPlaceholder")} required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">{t("contactPage.message")}</label>
                  <Textarea placeholder={t("contactPage.messagePlaceholder")} rows={5} required />
                </div>
                <Button type="submit" disabled={sending} className="w-full gradient-caramel text-accent-foreground hover:opacity-90 rounded-xl shadow-md" size="lg">
                  {sending ? t("contactPage.sending") : (<><Send className="mr-2 h-4 w-4" /> {t("contactPage.send")}</>)}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <span className="neu-card-sm inline-block px-5 py-2 text-sm font-semibold uppercase tracking-wider text-accent">{t("contactPage.faqBadge")}</span>
            <h2 className="mt-4 font-display text-3xl font-bold text-foreground">{t("contactPage.faqTitle")}</h2>
          </div>
          <div className="mx-auto mt-12 max-w-3xl space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="neu-card p-6">
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
