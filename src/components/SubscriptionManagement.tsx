import { useState } from "react";
import { Link } from "react-router-dom";
import { CreditCard, CheckCircle, XCircle, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { type SubscriptionDetails, getListingLimit } from "@/hooks/useSubscription";

interface Props {
  isSubscribed: boolean;
  details: SubscriptionDetails | null;
  onCancel: () => Promise<any>;
}

export default function SubscriptionManagement({ isSubscribed, details, onCancel }: Props) {
  const { toast } = useToast();
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await onCancel();
      toast({ title: "Subscription Cancelled", description: "Your Seller Pro subscription has been cancelled." });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setCancelling(false);
    }
  };

  if (!isSubscribed) {
    return (
      <div className="mt-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <CreditCard className="h-5 w-5 text-muted-foreground" /> Your Plan
            </CardTitle>
            <CardDescription>You're currently on the Free plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="secondary">Free</Badge>
              <span className="text-sm text-muted-foreground">2 listings included</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Upgrade to Seller Pro for unlimited listings, analytics, and priority support.
            </p>
            <Button className="gradient-caramel text-accent-foreground hover:opacity-90" asChild>
              <Link to="/pricing">Upgrade to Seller Pro <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const periodEnd = details?.currentPeriodEnd
    ? new Date(details.currentPeriodEnd).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      })
    : "—";

  const periodStart = details?.currentPeriodStart
    ? new Date(details.currentPeriodStart).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      })
    : "—";

  return (
    <div className="mt-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <CreditCard className="h-5 w-5 text-accent" /> Your Plan
          </CardTitle>
          <CardDescription>Manage your Seller Pro subscription</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-3">
            <Badge className="bg-accent/10 text-accent border-accent/20">{details?.plan === "unlimited" ? "Unlimited" : "Seller Pro"}</Badge>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" /> Active
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Billing Period Start</p>
              <p className="mt-1 text-sm font-medium text-foreground">{periodStart}</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Next Billing Date</p>
              <p className="mt-1 text-sm font-medium text-foreground">{periodEnd}</p>
            </div>
          </div>

          <div className="rounded-lg border border-border p-4">
            <p className="text-sm font-medium text-foreground">Plan Benefits</p>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-accent" /> {details?.plan === "unlimited" ? "Unlimited" : "Up to 25"} property listings</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-accent" /> Analytics & view tracking</li>
              {details?.plan === "unlimited" && <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-accent" /> Priority support</li>}
              {details?.plan === "unlimited" && <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-accent" /> Featured placement</li>}
            </ul>
          </div>

          <div className="border-t border-border pt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/5">
                  <XCircle className="mr-1.5 h-4 w-4" /> Cancel Subscription
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel Seller Pro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Your subscription will be cancelled immediately. You'll lose access to unlimited listings
                    and other Pro features. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {cancelling ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : null}
                    Yes, Cancel
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
