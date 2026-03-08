import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";
import property6 from "@/assets/property-6.jpg";

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  city: string;
  state: string;
  beds: number;
  baths: number;
  sqft: number;
  type: "House" | "Apartment" | "Condo" | "Townhouse" | "Villa";
  amenities: string[];
  images: string[];
  featured: boolean;
  sellerId: string;
  sellerName: string;
  createdAt: string;
  views: number;
  latitude?: number;
  longitude?: number;
}

export interface Review {
  id: string;
  propertyId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const properties: Property[] = [
  {
    id: "1",
    title: "Modern Luxury Estate",
    description: "Stunning contemporary home with floor-to-ceiling windows, open-concept living, gourmet kitchen, and resort-style backyard with pool. Smart home features throughout.",
    price: 1250000,
    location: "1234 Oakwood Dr",
    city: "Beverly Hills",
    state: "CA",
    beds: 5,
    baths: 4,
    sqft: 4200,
    type: "House",
    amenities: ["Pool", "Smart Home", "Garage", "Garden", "Fireplace"],
    images: [property1, property2, property3],
    featured: true,
    sellerId: "s1",
    sellerName: "James Morrison",
    createdAt: "2026-02-15",
    views: 1243,
    latitude: 34.0736,
    longitude: -118.4004,
  },
  {
    id: "2",
    title: "Classic Family Home",
    description: "Charming brick and stone family home in a quiet neighborhood. Features hardwood floors, updated kitchen, spacious bedrooms, and a beautiful garden.",
    price: 485000,
    location: "567 Maple Lane",
    city: "Naperville",
    state: "IL",
    beds: 4,
    baths: 3,
    sqft: 2800,
    type: "House",
    amenities: ["Garden", "Garage", "Basement", "Fireplace"],
    images: [property2, property4, property6],
    featured: true,
    sellerId: "s2",
    sellerName: "Sarah Chen",
    createdAt: "2026-02-20",
    views: 876,
    latitude: 41.7508,
    longitude: -88.1535,
  },
  {
    id: "3",
    title: "Skyline Penthouse",
    description: "Breathtaking penthouse with panoramic city views. Features private terrace, chef's kitchen, marble bathrooms, and concierge service.",
    price: 3200000,
    location: "One Park Avenue, PH-42",
    city: "New York",
    state: "NY",
    beds: 3,
    baths: 3,
    sqft: 3100,
    type: "Apartment",
    amenities: ["Concierge", "Terrace", "Gym", "Doorman", "City View"],
    images: [property3, property1, property5],
    featured: true,
    sellerId: "s1",
    sellerName: "James Morrison",
    createdAt: "2026-01-10",
    views: 2105,
    latitude: 40.7484,
    longitude: -73.9857,
  },
  {
    id: "4",
    title: "Cozy Woodland Cottage",
    description: "Charming cottage surrounded by mature trees. Perfect retreat with wrap-around porch, updated interior, and peaceful setting.",
    price: 275000,
    location: "89 Forest Trail",
    city: "Asheville",
    state: "NC",
    beds: 2,
    baths: 1,
    sqft: 1200,
    type: "House",
    amenities: ["Porch", "Garden", "Fireplace"],
    images: [property4, property5, property2],
    featured: false,
    sellerId: "s3",
    sellerName: "Emily Rodriguez",
    createdAt: "2026-03-01",
    views: 432,
    latitude: 35.5951,
    longitude: -82.5515,
  },
  {
    id: "5",
    title: "Mediterranean Villa with Pool",
    description: "Stunning Mediterranean-style villa with private pool, sun terrace, and modern interiors. Open-plan living with seamless indoor-outdoor flow.",
    price: 890000,
    location: "45 Costa Blanca Way",
    city: "Scottsdale",
    state: "AZ",
    beds: 4,
    baths: 3,
    sqft: 3400,
    type: "Villa",
    amenities: ["Pool", "Terrace", "Garden", "Smart Home", "Solar"],
    images: [property5, property3, property6, property1],
    featured: true,
    sellerId: "s2",
    sellerName: "Sarah Chen",
    createdAt: "2026-02-28",
    views: 1567,
    latitude: 33.4942,
    longitude: -111.9261,
  },
  {
    id: "6",
    title: "Historic Brownstone Townhouse",
    description: "Beautifully restored brownstone in a historic district. Original architectural details with modern amenities. Steps from parks and dining.",
    price: 1650000,
    location: "312 Park Slope Ave",
    city: "Brooklyn",
    state: "NY",
    beds: 3,
    baths: 2,
    sqft: 2200,
    type: "Townhouse",
    amenities: ["Garden", "Fireplace", "Basement", "Rooftop"],
    images: [property6, property2, property4],
    featured: false,
    sellerId: "s3",
    sellerName: "Emily Rodriguez",
    createdAt: "2026-03-05",
    views: 987,
    latitude: 40.6782,
    longitude: -73.9772,
  },
];

export const reviews: Review[] = [
  { id: "r1", propertyId: "1", userName: "Alex Turner", rating: 5, comment: "Absolutely stunning property. The pool area is even better in person!", createdAt: "2026-03-01" },
  { id: "r2", propertyId: "1", userName: "Maria Lopez", rating: 4, comment: "Beautiful home, great neighborhood. Slightly overpriced but worth a visit.", createdAt: "2026-03-03" },
  { id: "r3", propertyId: "3", userName: "David Kim", rating: 5, comment: "The views from this penthouse are unbelievable. A once-in-a-lifetime home.", createdAt: "2026-02-15" },
  { id: "r4", propertyId: "5", userName: "Rachel Green", rating: 4, comment: "Loved the pool and outdoor area. The kitchen could use an update.", createdAt: "2026-03-06" },
  { id: "r5", propertyId: "2", userName: "Tom Harris", rating: 5, comment: "Perfect family home. The garden is a dream for kids.", createdAt: "2026-03-02" },
];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(price);
