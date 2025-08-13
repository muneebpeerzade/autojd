import React from "react";
import AssistantView from "@/components/Assistant/AssistantView";
const AssistantPanel = () => {
  return (
    <div className="border rounded px-2 pt-2 pb-4 space-y-2 relative">
      <AssistantView />
      {/* <AssistantInputBox/> */}
    </div>
  )
};

export default AssistantPanel;
