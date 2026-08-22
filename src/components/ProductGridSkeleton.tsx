import { Card, CardContent } from "@/components/ui/card";

function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="h-64 bg-muted animate-pulse" />
      <CardContent className="p-6 space-y-3">
        <div className="h-3 w-1/3 bg-muted rounded animate-pulse" />
        <div className="h-5 w-full bg-muted rounded animate-pulse" />
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
        <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
        <div className="flex gap-2 pt-2">
          <div className="h-10 flex-1 bg-muted rounded animate-pulse" />
          <div className="h-10 flex-1 bg-muted rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
