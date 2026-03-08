import { Link } from "react-router-dom";
import { ArrowRight, Search, MessageSquare, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useSiteContent } from "@/hooks/useSiteContent";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function HowItWorks() {
  const { getValue } = useSiteContent();

  const steps = [
    {
      step: "01",
      title: "Search & Discover",
      desc: "Browse thousands of verified listings with our powerful search tools and filters.",
      icon: Search,
      accent: "from-[hsl(var(--chocolate))] to-[hsl(var(--caramel))]",
    },
    {
      step: "02",
      title: "Connect & Negotiate",
      desc: "Contact sellers directly and schedule viewings — all within our secure platform.",
      icon: MessageSquare,
      accent: "from-[hsl(var(--caramel))] to-[hsl(var(--chocolate-light))]",
    },
    {
      step: "03",
      title: "Close the Deal",
      desc: "Complete your transaction with confidence using our guided closing process.",
      icon: Key,
      accent: "from-[hsl(var(--chocolate-light))] to-[hsl(var(--chocolate))]",
    },
  ];

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 bg-[hsl(var(--cocoa-dark))]" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--caramel)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--caramel)) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-[hsl(var(--chocolate)/0.15)] blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-[hsl(var(--caramel)/0.1)] blur-[100px]" />

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="inline-block rounded-full border border-[hsl(var(--caramel)/0.3)] bg-[hsl(var(--caramel)/0.08)] px-5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--caramel))]">
            {getValue("how_badge", "Simple Process")}
          </span>
          <h2 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-[hsl(var(--cream))] md:text-6xl">
            {getValue("how_title_start", "How It ")}{" "}
            <span className="bg-gradient-to-r from-[hsl(var(--caramel))] to-[hsl(var(--chocolate-light))] bg-clip-text text-transparent">
              {getValue("how_title_highlight", "Works")}
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base text-[hsl(var(--latte)/0.6)] md:text-lg">
            {getValue("how_subtitle", "Three simple steps to find and secure your perfect property.")}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-20 grid gap-6 md:grid-cols-3 md:gap-0"
        >
          {steps.map((s, i) => (
            <motion.div key={s.step} variants={cardVariants} className="relative flex">
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-1/2 z-20 hidden h-px w-full -translate-y-1/2 md:block">
                  <div className="mx-auto h-[2px] w-full bg-gradient-to-r from-transparent via-[hsl(var(--caramel)/0.25)] to-transparent" />
                </div>
              )}
              <div className="group relative z-10 flex w-full flex-col items-center rounded-3xl border border-[hsl(var(--cocoa-light)/0.3)] bg-[hsl(var(--cocoa)/0.6)] p-8 backdrop-blur-sm transition-all duration-500 hover:border-[hsl(var(--caramel)/0.4)] hover:bg-[hsl(var(--cocoa)/0.8)] md:mx-3 md:p-10">
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${s.accent} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-[0.07]`} />
                <span className="absolute right-6 top-4 font-display text-7xl font-black text-[hsl(var(--cream)/0.04)] transition-all duration-500 group-hover:text-[hsl(var(--caramel)/0.08)]">
                  {s.step}
                </span>
                <div className={`relative mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${s.accent} shadow-lg shadow-[hsl(var(--chocolate)/0.3)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                  <s.icon className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="font-display text-2xl font-bold text-[hsl(var(--cream))]">{s.title}</h3>
                <p className="mt-3 text-center text-sm leading-relaxed text-[hsl(var(--latte)/0.5)]">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <Button
            size="lg"
            className="gradient-caramel rounded-2xl px-10 py-6 text-base font-semibold text-accent-foreground shadow-xl shadow-[hsl(var(--chocolate)/0.3)] transition-all hover:opacity-90 hover:shadow-2xl"
            asChild
          >
            <Link to="/search">
              Start Browsing <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
