import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, Bed, Bath, Maximize, MapPin, Heart, Share2, Calendar, Eye, User,
  ChevronLeft, ChevronRight, Home, Car, Layers, Thermometer, Wind, TreePine, DollarSign,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSaveProperty } from "@/hooks/useSaveProperty";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewSection from "@/components/ReviewSection";
import PropertyMap from "@/components/PropertyMap";
import Lightbox from "@/components/Lightbox";
import MortgageCalculator from "@/components/MortgageCalculator";
import { properties as mockProperties, reviews, formatPrice, type Property } from "@/data/mockData";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

interface ExtendedProperty extends Property {
  lot_size?: number; year_built?: number | null; parking?: number; stories?: number;
  heating?: string; cooling?: string; flooring?: string; roof?: string;
  neighborhood?: string; zip_code?: string; latitude?: number | null; longitude?: number | null;
  hoa_fee?: number; property_style?: string;
}

interface SellerInfo {
  full_name: string | null;
  email: string | null;
  phone: string | null;
  company_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  website: string | null;
  show_phone: boolean;
  show_email: boolean;
}

export default function PropertyDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [property, setProperty] = useState<ExtendedProperty | null | undefined>(undefined);
  const [currentImage, setCurrentImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [seller, setSeller] = useState<SellerInfo | null>(null);
  const { saved, toggle, isLoggedIn } = useSaveProperty(property?.id ?? "");

  useEffect(() => {
    const fetchProperty = async () => {
      const { data } = await supabase.from("properties").select("*").eq("id", id!).single();
      if (data) {
        setProperty({
          id: data.id, title: data.title, description: data.description || "", price: data.price,
          location: data.location || "", city: data.city || "", state: data.state || "",
          beds: data.beds || 0, baths: data.baths || 0, sqft: data.sqft || 0,
          type: (data.type as Property["type"]) || "House", amenities: data.amenities || [],
          images: data.images && data.images.length > 0 ? data.images : ["/placeholder.svg"],
          featured: data.featured || false, sellerId: data.user_id, sellerName: "Property Owner",
          createdAt: new Date(data.created_at).toLocaleDateString(), views: data.views || 0,
          lot_size: (data as any).lot_size || 0, year_built: (data as any).year_built,
          parking: (data as any).parking || 0, stories: (data as any).stories || 1,
          heating: (data as any).heating || "", cooling: (data as any).cooling || "",
          flooring: (data as any).flooring || "", roof: (data as any).roof || "",
          neighborhood: (data as any).neighborhood || "", zip_code: (data as any).zip_code || "",
          latitude: (data as any).latitude, longitude: (data as any).longitude,
          hoa_fee: (data as any).hoa_fee || 0, property_style: (data as any).property_style || "",
        });
      } else {
        const mock = mockProperties.find((p) => p.id === id);
        if (mock) setProperty({ ...mock, latitude: null, longitude: null });
        else setProperty(null);
      }
    };
    if (id) fetchProperty();
  }, [id]);

  // Fetch seller profile
  useEffect(() => {
    if (!property?.sellerId) return;
    const fetchSeller = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, email, phone, company_name, bio, avatar_url, website, show_phone, show_email")
        .eq("id", property.sellerId)
        .single();
      if (data) setSeller(data as any);
    };
    fetchSeller();
  }, [property?.sellerId]);

  // Track view count
  useEffect(() => {
    if (id) {
      supabase.rpc("increment_property_views", { _property_id: id });
    }
  }, [id]);

  if (property === undefined) return null;

  if (!property) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold">{t("property.notFound")}</h1>
          <Button asChild className="mt-4"><Link to="/search">{t("property.backToSearch")}</Link></Button>
        </div>
      </div>
    );
  }
  const propertyReviews = reviews.filter((r) => r.propertyId === property.id);
  const hasMultipleImages = property.images.length > 1;
  const hasCoords = property.latitude != null && property.longitude != null;

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: t("property.messageSent"), description: t("property.messageSentDesc") });
  };

  const DetailItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) => {
    if (!value || value === 0) return null;
    return (
      <div className="flex items-center gap-2 rounded-lg neu-pressed px-3 py-2.5">
        <Icon className="h-4 w-4 text-accent shrink-0" />
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="text-sm font-medium text-foreground">{value}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pb-16 pt-24">
        <Link to="/search" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors">
          <ArrowLeft className="h-4 w-4" /> {t("property.backToSearch")}
        </Link>

        <div className="relative mt-2 overflow-hidden rounded-xl">
          <img src={property.images[currentImage]} alt={property.title} className="aspect-[16/7] w-full object-cover cursor-zoom-in" onClick={() => setLightboxOpen(true)} />
          {hasMultipleImages && (
            <>
              <button onClick={() => setCurrentImage((prev) => (prev === 0 ? property.images.length - 1 : prev - 1))} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-card/80 p-2 backdrop-blur-sm transition-colors hover:bg-card">
                <ChevronLeft className="h-5 w-5 text-foreground" />
              </button>
              <button onClick={() => setCurrentImage((prev) => (prev === property.images.length - 1 ? 0 : prev + 1))} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-card/80 p-2 backdrop-blur-sm transition-colors hover:bg-card">
                <ChevronRight className="h-5 w-5 text-foreground" />
              </button>
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {property.images.map((_, i) => (
                  <button key={i} onClick={() => setCurrentImage(i)} className={`h-2 w-2 rounded-full transition-colors ${i === currentImage ? "bg-accent" : "bg-card/60"}`} />
                ))}
              </div>
            </>
          )}
        </div>

        {hasMultipleImages && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {property.images.map((img, i) => (
              <button key={i} onClick={() => setCurrentImage(i)} className={`h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors ${i === currentImage ? "border-accent" : "border-transparent opacity-70 hover:opacity-100"}`}>
                <img src={img} alt={`View ${i + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">{property.type}</Badge>
                    {property.property_style && <Badge variant="outline" className="text-xs">{property.property_style}</Badge>}
                  </div>
                  <h1 className="mt-2 font-display text-3xl font-bold text-foreground">{property.title}</h1>
                  <p className="mt-1 flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" /> {property.location}{property.neighborhood ? `, ${property.neighborhood}` : ""}, {property.city}, {property.state} {property.zip_code}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => {
                    if (!isLoggedIn) { window.location.href = "/auth"; return; }
                    toggle().then((nowSaved) => { toast({ title: nowSaved ? t("property.saved") : t("property.removed") }); });
                  }}>
                    <Heart className={`h-4 w-4 ${saved ? "fill-destructive text-destructive" : ""}`} />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => toast({ title: t("property.linkCopied") })}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="mt-3 font-display text-3xl font-bold text-accent">{formatPrice(property.price)}</p>
              {property.hoa_fee ? <p className="text-sm text-muted-foreground">+ {formatPrice(property.hoa_fee)}/mo {t("property.hoa")}</p> : null}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              <DetailItem icon={Bed} label={t("property.bedrooms")} value={property.beds} />
              <DetailItem icon={Bath} label={t("property.bathrooms")} value={property.baths} />
              <DetailItem icon={Maximize} label={t("property.sqFt")} value={property.sqft?.toLocaleString()} />
              <DetailItem icon={TreePine} label={t("property.lotSize")} value={property.lot_size ? `${property.lot_size.toLocaleString()} ft²` : 0} />
              <DetailItem icon={Home} label={t("property.yearBuilt")} value={property.year_built ?? 0} />
              <DetailItem icon={Car} label={t("property.parking")} value={property.parking ? `${property.parking} spaces` : 0} />
              <DetailItem icon={Layers} label={t("property.stories")} value={property.stories ?? 0} />
              <DetailItem icon={Calendar} label={t("property.listed")} value={property.createdAt} />
              <DetailItem icon={Eye} label={t("property.views")} value={property.views.toLocaleString()} />
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-foreground">{t("property.aboutProperty")}</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">{property.description}</p>
            </div>

            {(property.heating || property.cooling || property.flooring || property.roof) && (
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">{t("property.interiorExterior")}</h2>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <DetailItem icon={Thermometer} label={t("property.heating")} value={property.heating || ""} />
                  <DetailItem icon={Wind} label={t("property.cooling")} value={property.cooling || ""} />
                  <DetailItem icon={Layers} label={t("property.flooring")} value={property.flooring || ""} />
                  <DetailItem icon={Home} label={t("property.roof")} value={property.roof || ""} />
                </div>
              </div>
            )}

            <div>
              <h2 className="font-display text-xl font-bold text-foreground">{t("property.amenities")}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {property.amenities.map((a) => (<Badge key={a} variant="secondary" className="text-sm">{a}</Badge>))}
              </div>
            </div>

            {hasCoords && (
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">{t("property.location")}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{property.location}, {property.city}, {property.state} {property.zip_code}</p>
                <div className="mt-3"><PropertyMap latitude={property.latitude!} longitude={property.longitude!} title={property.title} /></div>
              </div>
            )}

            <MortgageCalculator propertyPrice={property.price} />

            <ReviewSection reviews={propertyReviews} propertyId={property.id} />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 overflow-hidden">
                    {seller?.avatar_url ? (
                      <img src={seller.avatar_url} alt={seller.full_name || "Seller"} className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-5 w-5 text-accent" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{seller?.full_name || property.sellerName}</p>
                    {seller?.company_name && <p className="text-xs text-accent font-medium">{seller.company_name}</p>}
                    <p className="text-xs text-muted-foreground">{t("property.verifiedSeller")}</p>
                  </div>
                </div>
                {seller?.bio && <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{seller.bio}</p>}
                <div className="mt-3 space-y-1.5">
                  {seller?.show_phone && seller?.phone && (
                    <a href={`tel:${seller.phone}`} className="flex items-center gap-2 text-sm text-foreground hover:text-accent transition-colors">
                      📞 {seller.phone}
                    </a>
                  )}
                  {seller?.show_email && seller?.email && (
                    <a href={`mailto:${seller.email}`} className="flex items-center gap-2 text-sm text-foreground hover:text-accent transition-colors">
                      ✉️ {seller.email}
                    </a>
                  )}
                  {seller?.website && (
                    <a href={seller.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-foreground hover:text-accent transition-colors">
                      🌐 Website
                    </a>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-5 space-y-3">
                <h3 className="font-display text-lg font-semibold text-foreground">{t("property.quickFacts")}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">{t("property.type")}</span><span className="font-medium text-foreground">{property.type}</span></div>
                  {property.property_style && <div className="flex justify-between"><span className="text-muted-foreground">{t("property.style")}</span><span className="font-medium text-foreground">{property.property_style}</span></div>}
                  <div className="flex justify-between"><span className="text-muted-foreground">{t("property.bedrooms")}</span><span className="font-medium text-foreground">{property.beds}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">{t("property.bathrooms")}</span><span className="font-medium text-foreground">{property.baths}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">{t("property.sqFt")}</span><span className="font-medium text-foreground">{property.sqft?.toLocaleString()}</span></div>
                  {property.year_built && <div className="flex justify-between"><span className="text-muted-foreground">{t("property.yearBuilt")}</span><span className="font-medium text-foreground">{property.year_built}</span></div>}
                  {property.hoa_fee ? <div className="flex justify-between"><span className="text-muted-foreground">{t("property.hoa")}</span><span className="font-medium text-foreground">{formatPrice(property.hoa_fee)}/mo</span></div> : null}
                  <div className="flex justify-between"><span className="text-muted-foreground">{t("property.pricePerSqFt")}</span><span className="font-medium text-foreground">{property.sqft ? formatPrice(Math.round(property.price / property.sqft)) : "N/A"}</span></div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-display text-lg font-semibold text-foreground">{t("property.contactSeller")}</h3>
                <form onSubmit={handleContact} className="mt-4 space-y-3">
                  <Input placeholder={t("property.yourName")} required />
                  <Input type="email" placeholder={t("property.emailAddress")} required />
                  <Input placeholder={t("property.phoneOptional")} />
                  <Textarea placeholder={t("property.interestedMessage")} rows={3} required />
                  <Button className="w-full gradient-caramel text-accent-foreground hover:opacity-90" type="submit">{t("property.sendMessage")}</Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {lightboxOpen && (
        <Lightbox images={property.images} currentIndex={currentImage} onClose={() => setLightboxOpen(false)} onNavigate={(i) => setCurrentImage(i)} />
      )}
    </div>
  );
}
