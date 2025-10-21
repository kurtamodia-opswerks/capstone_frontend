import { SpinnerEmpty } from "@/components/SpinnerEmpty";

// app/charts/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center h-[80vh]">
      <SpinnerEmpty />
    </div>
  );
}
