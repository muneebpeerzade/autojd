import AssistantPanel from "@/components/Assistant/AssistantPanel";
import Sidebar from "@/components/Sidebar/Sidebar";

export default function Home() {
  return (
    <div className="px-6 py-4 lg:px-0 grid grid-cols-[0.5fr_1fr] gap-4 h-[calc(100dvh-6rem)]">
      <Sidebar />
      <AssistantPanel />
    </div>
  );
}
