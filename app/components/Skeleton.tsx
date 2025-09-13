import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="rounded-xl border shadow-sm p-5 space-y-4 animate-pulse">
      {/* Title + Date */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-2/3 rounded-md" />
        <Skeleton className="h-4 w-20 rounded-md" />
      </div>

      {/* Announcement type */}
      <Skeleton className="h-5 w-32 rounded-full" />

      {/* Branch badges */}
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-12 rounded-full" />
        ))}
      </div>

      {/* Preview text */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-5/6 rounded-md" />
        <Skeleton className="h-4 w-4/6 rounded-md" />
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-4">
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </div>
  );
}
