import { useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface LightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({ images, currentIndex, onClose, onNavigate }: LightboxProps) {
  const prev = useCallback(() => onNavigate(currentIndex === 0 ? images.length - 1 : currentIndex - 1), [currentIndex, images.length, onNavigate]);
  const next = useCallback(() => onNavigate(currentIndex === images.length - 1 ? 0 : currentIndex + 1), [currentIndex, images.length, onNavigate]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose, prev, next]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={onClose}>
      <button onClick={onClose} className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20">
        <X className="h-6 w-6" />
      </button>

      <div className="relative flex h-full w-full items-center justify-center px-16" onClick={(e) => e.stopPropagation()}>
        {images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-4 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button onClick={next} className="absolute right-4 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20">
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        <img
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
        />
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); onNavigate(i); }}
              className={`h-12 w-16 overflow-hidden rounded border-2 transition-all ${i === currentIndex ? "border-white scale-110" : "border-transparent opacity-50 hover:opacity-80"}`}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <p className="absolute top-5 left-1/2 -translate-x-1/2 text-sm text-white/60">
        {currentIndex + 1} / {images.length}
      </p>
    </div>
  );
}
