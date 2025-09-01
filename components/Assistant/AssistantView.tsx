"use client";

import { useState } from "react";
import { useResume } from "@/context/ResumeContext";
import JobDescriptionForm, {
  EmailParametersFormType,
} from "@/components/Assistant/EmailParametersForm";
import { Button } from "@/components/ui/button";
import {
  Copy,
  RotateCcw,
  Loader2,
  SquareChevronLeft,
  ChevronLeft,
  ChevronRight,
  History,
  SquareChevronRight,
} from "lucide-react";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";

const AssistantView = () => {
  const { resumeDetails } = useResume();
  const [showResponse, setShowResponse] = useState(false);
  const [generatingEmail, setGeneratingEmail] = useState<boolean>(false);
  const [generatedEmail, setGeneratedEmail] = useState<string | null>(null);
  // Store last form data for retry functionality
  const [lastFormData, setLastFormData] =
    useState<EmailParametersFormType | null>(null);

  const handleFormSubmit = async (data: EmailParametersFormType) => {
    if (!resumeDetails) return;
    // console.log("Data", resumeDetails, data);
    setGeneratedEmail("");
    setGeneratingEmail(true);
    setShowResponse(true);
    setLastFormData(data);
    const payload = {
      candidate: resumeDetails,
      emailParameters: data,
    };
    const res = await fetch("api/gpe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader?.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      setGeneratedEmail((prev) => prev + chunk);
    }
    setGeneratingEmail(false);
  };

  const handleRetry = () => {
    if (lastFormData) {
      handleFormSubmit(lastFormData);
    }
  };

  const openResult = () => {
    setShowResponse(true);
  };

  return (
    <div className="relative overflow-x-hidden  border rounded overflow-y-auto">
      {/* Toggle Button */}
      <Button
        className="absolute z-20 right-5 top-4 group shadow-lg"
        size={"sm"}
        variant={"secondary"}
        onClick={() => setShowResponse((prev) => !prev)}
      >
        {showResponse ? <ChevronLeft /> : <ChevronRight />}
      </Button>

      {/* Container for sliding panels */}
      <div className="relative">
        {/* Form Panel - Always rendered but slides out of view */}
        <div
          className={`p-4 transition-transform duration-300 ease-in-out ${
            showResponse
              ? "-translate-x-full opacity-50"
              : "translate-x-0 opacity-100"
          }`}
        >
          <JobDescriptionForm
            handleFormSubmit={handleFormSubmit}
            resumeDetails={resumeDetails}
            emailGenerated={true}
            openResult={openResult}
          />
        </div>

        {/* Results Panel - Slides in from the right */}
        <div
          className={`absolute top-0 left-0 w-full p-4 transition-all duration-300 ease-in-out ${
            showResponse
              ? "translate-x-0 opacity-100 pointer-events-auto"
              : "translate-x-full opacity-0 pointer-events-none"
          }`}
        >
          {generatedEmail ? (
            <div>
              <AutosizeTextarea
                value={generatedEmail}
                onChange={(e) => setGeneratedEmail(e.target.value)}
              />
            </div>
          ) : (
            <div>
              <h2>Your Result Will Appear here</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssistantView;
