import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

export default function PrivacyPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pb-20 pt-28">
        <h1 className="font-display text-4xl font-bold text-foreground">{t("privacyPage.title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("privacyPage.lastUpdated")}</p>

        <div className="mt-10 max-w-3xl space-y-8 text-sm leading-relaxed text-muted-foreground">
          {[1, 2, 3, 4, 5].map((n) => (
            <section key={n}>
              <h2 className="font-display text-lg font-bold text-foreground">{t(`privacyPage.s${n}title`)}</h2>
              <p className="mt-2">{t(`privacyPage.s${n}text`)}</p>
            </section>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
