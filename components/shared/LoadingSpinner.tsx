import { cn } from "@/lib/utils";

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "size-8 animate-spin rounded-full border-2 border-muted border-t-primary",
        className
      )}
      aria-label="Loading"
    />
  );
}