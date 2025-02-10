import { Navigation } from "@/components/navigation";
import { HomeContent } from "@/components/home/home-content";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HomeContent />
    </div>
  );
}
