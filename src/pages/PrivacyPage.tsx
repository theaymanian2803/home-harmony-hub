import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pb-20 pt-28">
        <h1 className="font-display text-4xl font-bold text-foreground">Privacy Policy</h1>
        <p className="mt-2 text-muted-foreground">Last updated: March 2026</p>

        <div className="mt-10 max-w-3xl space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-display text-lg font-bold text-foreground">1. Information We Collect</h2>
            <p className="mt-2">We collect information you provide directly, such as your name, email address, and property listing details when you create an account or list a property. We also collect usage data including pages visited, search queries, and interaction patterns to improve our service.</p>
          </section>
          <section>
            <h2 className="font-display text-lg font-bold text-foreground">2. How We Use Your Information</h2>
            <p className="mt-2">We use collected information to provide and improve our services, process transactions, send notifications about your listings, and communicate with you about your account. We never sell your personal information to third parties.</p>
          </section>
          <section>
            <h2 className="font-display text-lg font-bold text-foreground">3. Data Security</h2>
            <p className="mt-2">We implement industry-standard security measures to protect your data, including encryption in transit and at rest, regular security audits, and strict access controls for our team members.</p>
          </section>
          <section>
            <h2 className="font-display text-lg font-bold text-foreground">4. Your Rights</h2>
            <p className="mt-2">You have the right to access, update, or delete your personal information at any time through your account settings. You can also request a complete export of your data by contacting our support team.</p>
          </section>
          <section>
            <h2 className="font-display text-lg font-bold text-foreground">5. Contact Us</h2>
            <p className="mt-2">If you have questions about this privacy policy, please contact us at hello@estatehub.com or call 1-800-123-4567.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
