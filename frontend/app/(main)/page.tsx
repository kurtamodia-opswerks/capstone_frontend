import HeaderSection from "@/components/dataset/HeaderSection";
import ExpectedColumnsCard from "@/components/dataset/ExpectedColumnsCard";
import VisualizationModeCard from "@/components/dataset/VisualizationModeCard";

export default function DatasetUploadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <HeaderSection />
        <ExpectedColumnsCard />
        <VisualizationModeCard />
      </div>
    </div>
  );
}
