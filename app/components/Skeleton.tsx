import { Skeleton } from "@/components/ui/skeleton";

export default function EventAnnouncementSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4 max-w-2xl m-5 h-[570px] md:w-full md:h-auto ">
      {/* Header with icon and date */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-32 rounded-xl" />
      </div>

      {/* Main title */}
      <Skeleton className="h-8 w-full" />

      {/* Badges row */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-12 rounded-full" />
          <Skeleton className="h-6 w-12 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>

      {/* Body text paragraphs */}
      <div className="space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>

      {/* Bottom action buttons */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-8 w-24 rounded" />
      </div>
    </div>
  );
}
