import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: t("auth.loginFailed"), description: error.message, variant: "destructive" });
      } else {
        toast({ title: t("auth.welcomeBack") + "!" });
        navigate("/dashboard");
      }
    } else {
      const { error } = await signUp(email, password, fullName);
      if (error) {
        toast({ title: t("auth.signUpFailed"), description: error.message, variant: "destructive" });
      } else {
        toast({ title: t("auth.accountCreated"), description: t("auth.welcomeToEstateHub") });
        navigate("/dashboard");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto flex items-center justify-center px-4 pb-20 pt-28">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8">
          <h1 className="font-display text-2xl font-bold text-foreground">
            {isLogin ? t("auth.welcomeBack") : t("auth.createAccount")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLogin ? t("auth.signInSubtitle") : t("auth.signUpSubtitle")}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {!isLogin && (
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">{t("auth.fullName")}</label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" required />
              </div>
            )}
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">{t("auth.email")}</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">{t("auth.password")}</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
            </div>
            <Button type="submit" className="w-full gradient-caramel text-accent-foreground hover:opacity-90" disabled={loading}>
              {loading ? t("auth.pleaseWait") : isLogin ? t("auth.signIn") : t("auth.createAccount")}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            {isLogin ? t("auth.dontHaveAccount") : t("auth.alreadyHaveAccount")}{" "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-accent hover:underline">
              {isLogin ? t("auth.signUp") : t("auth.signIn")}
            </button>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
