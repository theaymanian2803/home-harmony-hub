import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, Bed, Bath, Maximize, MapPin, Heart, Share2, Calendar, Eye, User,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewSection from "@/components/ReviewSection";
import { properties, reviews, formatPrice } from "@/data/mockData";

export default function PropertyDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const property = properties.find((p) => p.id === id);
  const [liked, setLiked] = useState(false);

  if (!property) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold">Property Not Found</h1>
          <Button asChild className="mt-4">
            <Link to="/search">Back to Search</Link>
          </Button>
        </div>
      </div>
    );
  }

  const propertyReviews = reviews.filter((r) => r.propertyId === property.id);

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message Sent!", description: "The seller will get back to you shortly." });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pb-16 pt-24">
        <Link to="/search" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to search
        </Link>

        {/* Image */}
        <div className="mt-2 overflow-hidden rounded-xl">
          <img
            src={property.images[0]}
            alt={property.title}
            className="aspect-[16/7] w-full object-cover"
          />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="font-display text-3xl font-bold text-foreground">
                    {property.title}
                  </h1>
                  <p className="mt-1 flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" /> {property.location}, {property.city}, {property.state}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => { setLiked(!liked); toast({ title: liked ? "Removed from favorites" : "Added to Favorites" }); }}>
                    <Heart className={`h-4 w-4 ${liked ? "fill-destructive text-destructive" : ""}`} />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => toast({ title: "Link Copied!" })}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <p className="mt-2 font-display text-3xl font-bold text-accent">
                {formatPrice(property.price)}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Bed className="h-4 w-4" /> {property.beds} Beds</span>
                <span className="flex items-center gap-1"><Bath className="h-4 w-4" /> {property.baths} Baths</span>
                <span className="flex items-center gap-1"><Maximize className="h-4 w-4" /> {property.sqft.toLocaleString()} ft²</span>
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Listed {property.createdAt}</span>
                <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {property.views.toLocaleString()} views</span>
              </div>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-foreground">About This Property</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">{property.description}</p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-foreground">Amenities</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {property.amenities.map((a) => (
                  <Badge key={a} variant="secondary" className="text-sm">{a}</Badge>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <ReviewSection reviews={propertyReviews} propertyId={property.id} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Seller card */}
              <div className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                    <User className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{property.sellerName}</p>
                    <p className="text-xs text-muted-foreground">Verified Seller</p>
                  </div>
                </div>
              </div>

              {/* Contact form */}
              <div className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-display text-lg font-semibold text-foreground">Contact Seller</h3>
                <form onSubmit={handleContact} className="mt-4 space-y-3">
                  <Input placeholder="Your Name" required />
                  <Input type="email" placeholder="Email Address" required />
                  <Input placeholder="Phone (optional)" />
                  <Textarea placeholder="I'm interested in this property…" rows={3} required />
                  <Button className="w-full bg-accent text-accent-foreground hover:bg-emerald-light" type="submit">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
