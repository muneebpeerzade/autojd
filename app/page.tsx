import AssistantPanel from "@/components/Assistant/AssistantPanel";
import Sidebar from "@/components/Sidebar/Sidebar";

export default function Home() {
  return (
    <div className="px-6 py-4 lg:px-0 grid grid-cols-1 grid-rows-[0.3fr_1fr] md:grid-rows-1 md:grid-cols-[0.4fr_1fr] gap-4 md:h-[calc(100dvh-6rem)]">
      <Sidebar />
      <AssistantPanel />
    </div>
  );
}
