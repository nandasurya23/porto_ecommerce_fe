"use client";

import * as React from "react";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ImageDropzoneProps = {
  label: string;
  description?: string;
  file?: File | null;
  previewUrl?: string | null;
  error?: string;
  disabled?: boolean;
  accept?: string;
  onChange: (file: File | null) => void;
};

export function ImageDropzone({
  label,
  description,
  file,
  previewUrl,
  error,
  disabled = false,
  accept = "image/*",
  onChange,
}: ImageDropzoneProps): React.JSX.Element {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [objectUrl, setObjectUrl] = React.useState("");

  React.useEffect(() => {
    if (!file) {
      setObjectUrl("");
      return;
    }

    const nextObjectUrl = URL.createObjectURL(file);
    setObjectUrl(nextObjectUrl);

    return () => {
      URL.revokeObjectURL(nextObjectUrl);
    };
  }, [file]);

  const currentPreview = objectUrl || previewUrl || "";

  function handleSelect(nextFile: File | null): void {
    if (!nextFile) {
      onChange(null);
      return;
    }

    if (!nextFile.type.startsWith("image/")) {
      onChange(null);
      return;
    }

    onChange(nextFile);
  }

  function handleFiles(files: FileList | null): void {
    handleSelect(files?.[0] ?? null);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-3">
        <div>
          <label className="block text-sm font-medium">{label}</label>
          {description ? <p className="text-xs text-fg-muted">{description}</p> : null}
        </div>
        {file || previewUrl ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() => {
              onChange(null);
              if (inputRef.current) {
                inputRef.current.value = "";
              }
            }}
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        ) : null}
      </div>

      <div
        className={cn(
          "cursor-pointer rounded-xl border border-dashed bg-white p-4 transition",
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/60",
          disabled ? "pointer-events-none opacity-60" : "",
        )}
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          handleFiles(event.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          disabled={disabled}
          onChange={(event) => handleFiles(event.target.files)}
        />

        {currentPreview ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <img
              src={currentPreview}
              alt={file?.name ?? label}
              className="h-28 w-full rounded-lg border border-border object-cover sm:h-24 sm:w-24"
            />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 text-sm font-medium">
                <ImageIcon className="h-4 w-4" />
                {file?.name ?? "Current image"}
              </p>
              <p className="mt-1 break-all text-xs text-fg-muted">
                {file ? "Drop another image or choose a different file." : "Click or drag to replace the current image."}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-fg-muted/10">
              <Upload className="h-5 w-5 text-fg-muted" />
            </div>
            <div>
              <p className="text-sm font-medium">Drag and drop image here</p>
              <p className="text-xs text-fg-muted">Or click to browse JPG, PNG, or WEBP files.</p>
            </div>
          </div>
        )}
      </div>

      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
