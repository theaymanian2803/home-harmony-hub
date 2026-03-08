import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, Bed, Bath, Maximize, MapPin, Heart, Share2, Calendar, Eye, User, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewSection from "@/components/ReviewSection";
import { properties as mockProperties, reviews, formatPrice, type Property } from "@/data/mockData";
import { supabase } from "@/integrations/supabase/client";

export default function PropertyDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [liked, setLiked] = useState(false);
  const [property, setProperty] = useState<Property | null | undefined>(undefined);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      // Try database first
      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id!)
        .single();

      if (data) {
        setProperty({
          id: data.id,
          title: data.title,
          description: data.description || "",
          price: data.price,
          location: data.location || "",
          city: data.city || "",
          state: data.state || "",
          beds: data.beds || 0,
          baths: data.baths || 0,
          sqft: data.sqft || 0,
          type: (data.type as Property["type"]) || "House",
          amenities: data.amenities || [],
          images: data.images && data.images.length > 0 ? data.images : ["/placeholder.svg"],
          featured: data.featured || false,
          sellerId: data.user_id,
          sellerName: "Property Owner",
          createdAt: new Date(data.created_at).toLocaleDateString(),
          views: data.views || 0,
        });
      } else {
        // Fallback to mock data
        setProperty(mockProperties.find((p) => p.id === id) || null);
      }
    };
    if (id) fetchProperty();
  }, [id]);

  if (property === undefined) return null;

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
  const hasMultipleImages = property.images.length > 1;

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

        {/* Image gallery */}
        <div className="relative mt-2 overflow-hidden rounded-xl">
          <img
            src={property.images[currentImage]}
            alt={property.title}
            className="aspect-[16/7] w-full object-cover"
          />
          {hasMultipleImages && (
            <>
              <button
                onClick={() => setCurrentImage((prev) => (prev === 0 ? property.images.length - 1 : prev - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-card/80 p-2 backdrop-blur-sm transition-colors hover:bg-card"
              >
                <ChevronLeft className="h-5 w-5 text-foreground" />
              </button>
              <button
                onClick={() => setCurrentImage((prev) => (prev === property.images.length - 1 ? 0 : prev + 1))}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-card/80 p-2 backdrop-blur-sm transition-colors hover:bg-card"
              >
                <ChevronRight className="h-5 w-5 text-foreground" />
              </button>
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {property.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`h-2 w-2 rounded-full transition-colors ${i === currentImage ? "bg-accent" : "bg-card/60"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {hasMultipleImages && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {property.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                  i === currentImage ? "border-accent" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`View ${i + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

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

              <div className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-display text-lg font-semibold text-foreground">Contact Seller</h3>
                <form onSubmit={handleContact} className="mt-4 space-y-3">
                  <Input placeholder="Your Name" required />
                  <Input type="email" placeholder="Email Address" required />
                  <Input placeholder="Phone (optional)" />
                  <Textarea placeholder="I'm interested in this property…" rows={3} required />
                  <Button className="w-full gradient-caramel text-accent-foreground hover:opacity-90" type="submit">
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
