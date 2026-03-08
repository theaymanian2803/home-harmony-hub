import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyCard from "./PropertyCard";
import { properties } from "@/data/mockData";
import { useTranslation } from "react-i18next";

export default function FeaturedProperties() {
  const featured = properties.filter((p) => p.featured);
  const { t } = useTranslation();

  return (
    <section className="section-padding bg-secondary/20 relative overflow-hidden">
      <div className="absolute top-20 right-20 h-24 w-24 shape-blob bg-accent/5 animate-float" />
      <div className="absolute bottom-10 left-10 h-16 w-16 shape-blob-2 bg-caramel/5 animate-float-slow" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-14 text-center">
          <span className="neu-card-sm inline-block px-5 py-2 text-sm font-semibold uppercase tracking-wider text-accent">
            {t("featured.badge")}
          </span>
          <h2 className="mt-6 font-display text-3xl font-bold text-foreground md:text-5xl">
            {t("featured.title")} <span className="text-gradient-chocolate">{t("featured.titleHighlight")}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            {t("featured.subtitle")}
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
        <div className="mt-14 text-center">
          <Button size="lg" className="neu-button text-accent hover:text-accent-foreground hover:bg-accent border-0" asChild>
            <Link to="/search">
              {t("featured.viewAll")} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
