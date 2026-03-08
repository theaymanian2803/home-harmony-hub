import { useState, useCallback } from "react";
import { Image, X, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  userId: string;
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ userId, images, onImagesChange, maxImages = 10 }: ImageUploadProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const fileName = `${userId}/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from("property-images")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("property-images")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const remaining = maxImages - images.length;
      if (remaining <= 0) {
        toast({ title: "Limit reached", description: `Maximum ${maxImages} images allowed.`, variant: "destructive" });
        return;
      }

      const toUpload = Array.from(files).slice(0, remaining);
      setUploading(true);

      const urls: string[] = [];
      for (const file of toUpload) {
        if (!file.type.startsWith("image/")) continue;
        const url = await uploadFile(file);
        if (url) urls.push(url);
      }

      if (urls.length > 0) {
        onImagesChange([...images, ...urls]);
      }
      setUploading(false);
    },
    [images, maxImages, onImagesChange, userId]
  );

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.multiple = true;
          input.accept = "image/*";
          input.onchange = () => handleFiles(input.files);
          input.click();
        }}
        className="flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 text-muted-foreground transition-colors hover:border-accent"
      >
        <div className="text-center">
          {uploading ? (
            <>
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-accent" />
              <p className="mt-1 text-sm">Uploading…</p>
            </>
          ) : (
            <>
              <Upload className="mx-auto h-8 w-8" />
              <p className="mt-1 text-sm">Drag & drop or click to upload</p>
              <p className="text-xs">{images.length}/{maxImages} images</p>
            </>
          )}
        </div>
      </div>

      {images.length > 0 && (
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
          {images.map((url, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-md border border-border">
              <img src={url} alt={`Upload ${i + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
