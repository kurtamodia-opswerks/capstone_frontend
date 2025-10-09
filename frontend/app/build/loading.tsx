// app/charts/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="text-center space-y-3">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-muted-foreground text-sm">Loading charts...</p>
      </div>
    </div>
  );
}
