import React from "react";
import AssistantView from "@/components/Assistant/AssistantView";
const AssistantPanel = () => {
  return (
    <div className="border rounded p-2 space-y-2 relative">
      <AssistantView />
      {/* <AssistantInputBox/> */}
    </div>
  )
};

export default AssistantPanel;
