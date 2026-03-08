import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pb-20 pt-28">
        <h1 className="font-display text-4xl font-bold text-foreground">Terms of Service</h1>
        <p className="mt-2 text-muted-foreground">Last updated: March 2026</p>

        <div className="mt-10 max-w-3xl space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-display text-lg font-bold text-foreground">1. Acceptance of Terms</h2>
            <p className="mt-2">By accessing or using EstateHub, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
          </section>
          <section>
            <h2 className="font-display text-lg font-bold text-foreground">2. User Accounts</h2>
            <p className="mt-2">You are responsible for maintaining the security of your account and all activities that occur under your account. You must provide accurate and complete information when creating an account.</p>
          </section>
          <section>
            <h2 className="font-display text-lg font-bold text-foreground">3. Property Listings</h2>
            <p className="mt-2">All property listings are subject to review and approval. You must have the right to list any property you submit. Misrepresentation of property details may result in account suspension.</p>
          </section>
          <section>
            <h2 className="font-display text-lg font-bold text-foreground">4. Fees and Payments</h2>
            <p className="mt-2">Free accounts can list up to 2 properties. Seller Pro subscription provides unlimited listings and premium features for $10/month, billed through PayPal.</p>
          </section>
          <section>
            <h2 className="font-display text-lg font-bold text-foreground">5. Limitation of Liability</h2>
            <p className="mt-2">EstateHub is a marketplace platform. We do not guarantee the accuracy of listings or the outcome of any transaction. Users engage in transactions at their own risk.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
