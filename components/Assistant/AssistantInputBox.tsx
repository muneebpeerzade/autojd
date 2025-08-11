import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
const AssistantInputBox = () => {
  return (
    <div className="absolute bottom-0 left-0 w-full">
      <div className="p-2 relative">
        <Textarea placeholder="Type your message here." className="w-full" />
        <Button size={"icon"} className="absolute top-5 right-5">
          <ArrowUp />
        </Button>
      </div>
    </div>
  );
};

export default AssistantInputBox;
