import { cn } from "@/lib/utils";

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex min-h-[50vh] w-full items-center justify-center",
        className
      )}
    >
      <div
        className="size-8 animate-spin rounded-full border-2 border-muted border-t-primary"
        aria-label="Loading"
      />
    </div>
  );
}