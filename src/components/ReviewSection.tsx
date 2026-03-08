import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Review } from "@/data/mockData";

function Stars({ rating, interactive, onRate }: { rating: number; interactive?: boolean; onRate?: (r: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-5 w-5 transition-colors ${
            i <= rating ? "fill-gold text-gold" : "text-muted"
          } ${interactive ? "cursor-pointer hover:text-gold" : ""}`}
          onClick={() => interactive && onRate?.(i)}
        />
      ))}
    </div>
  );
}

export default function ReviewSection({
  reviews,
  propertyId,
}: {
  reviews: Review[];
  propertyId: string;
}) {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [localReviews, setLocalReviews] = useState(reviews);

  const avgRating =
    localReviews.length > 0
      ? localReviews.reduce((s, r) => s + r.rating, 0) / localReviews.length
      : 0;

  const handleSubmit = () => {
    if (rating === 0) {
      toast({ title: "Please select a rating", variant: "destructive" });
      return;
    }
    const newReview: Review = {
      id: `r-${Date.now()}`,
      propertyId,
      userName: "You",
      rating,
      comment,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setLocalReviews([newReview, ...localReviews]);
    setRating(0);
    setComment("");
    toast({ title: "Review Submitted", description: "Thank you for your feedback!" });
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <h3 className="font-display text-xl font-bold text-foreground">
          Reviews ({localReviews.length})
        </h3>
        {localReviews.length > 0 && (
          <div className="flex items-center gap-2">
            <Stars rating={Math.round(avgRating)} />
            <span className="text-sm text-muted-foreground">
              {avgRating.toFixed(1)} avg
            </span>
          </div>
        )}
      </div>

      {/* Write review */}
      <div className="mb-8 rounded-lg border border-border bg-card p-4">
        <p className="mb-2 text-sm font-medium text-foreground">Write a Review</p>
        <Stars rating={rating} interactive onRate={setRating} />
        <Textarea
          className="mt-3"
          placeholder="Share your experience…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
        />
        <Button
          size="sm"
          className="mt-3 gradient-caramel text-accent-foreground hover:opacity-90"
          onClick={handleSubmit}
        >
          Submit Review
        </Button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {localReviews.map((r) => (
          <div key={r.id} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">{r.userName}</span>
              <span className="text-xs text-muted-foreground">{r.createdAt}</span>
            </div>
            <Stars rating={r.rating} />
            {r.comment && (
              <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
