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
  CopyCheck,
} from "lucide-react";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
const AssistantView = () => {
  const { resumeDetails } = useResume();
  const [showResult, setShowResult] = useState(false);
  const [emailGenerating, setEmailGenerating] = useState<boolean>(false);
  const [emailGenerated, setEmailGenerated] = useState<string | null>(null);
  const [emailCopied, setEmailCopied] = useState<boolean>(false);
  // Store last form data for retry functionality
  const [lastFormData, setLastFormData] =
    useState<EmailParametersFormType | null>(null);

  const handleFormSubmit = async (data: EmailParametersFormType) => {
    if (!resumeDetails) return;
    setEmailGenerating(true);
    // console.log("Data", resumeDetails, data);
    setEmailGenerated("");
    setShowResult(true);
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
      setEmailGenerated((prev) => prev + chunk);
    }
    setEmailGenerating(false);
  };

  const handleRetry = () => {
    if (lastFormData) {
      handleFormSubmit(lastFormData);
    }
  };
  const handleCopy = async () => {
    if (!emailGenerated) return;
    try {
      setEmailCopied(true);
      await navigator.clipboard.writeText(emailGenerated);
      setTimeout(() => {
        setEmailCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy", error);
    }
  };

  return (
    <div className="relative overflow-x-hidden  border rounded overflow-y-auto">
      {/* Toggle Button */}
      <Button
        className="absolute z-20 right-5 top-4 group shadow-lg"
        size={"sm"}
        variant={"secondary"}
        disabled={emailGenerating}
        onClick={() => setShowResult((prev) => !prev)}
      >
        {showResult ? <ChevronLeft /> : <ChevronRight />}
      </Button>

      {/* Container for sliding panels */}
      <div className="relative">
        {/* Form Panel - Always rendered but slides out of view */}
        <div
          className={`p-4 transition-transform duration-300 ease-in-out ${
            showResult
              ? "-translate-x-full opacity-50"
              : "translate-x-0 opacity-100"
          }`}
        >
          <JobDescriptionForm
            handleFormSubmit={handleFormSubmit}
            resumeDetails={resumeDetails}
          />
        </div>

        {/* Results Panel - Slides in from the right */}
        <div
          className={`absolute top-0 left-0 w-full p-4 transition-all duration-300 ease-in-out ${
            showResult
              ? "translate-x-0 opacity-100 pointer-events-auto"
              : "translate-x-full opacity-0 pointer-events-none"
          }`}
        >
          <div className="space-y-3">
            <h2 className="text-2xl font-medium font-serif">
              {emailGenerating ? (
                <Loader2 className="inline-block h-5 w-5 stroke-muted-foreground animate-spin mr-1" />
              ) : null}
              Your Personalized Result
            </h2>
            <AutosizeTextarea
              value={emailGenerated || ""}
              maxHeight={500}
              disabled={emailGenerating || emailGenerated === null}
              onChange={(e) => setEmailGenerated(e.target.value)}
              placeholder="Your Generated email will display here for review and editing."
              className="resize-none"
            />
            <div className="flex items-center justify-end gap-3">
              <Button
                variant={"outline"}
                size={"lg"}
                onClick={handleRetry}
                disabled={emailGenerating || emailGenerated === null}
              >
                <RotateCcw className="stroke-muted-foreground" />
                retry
              </Button>
              <Button
                size={"lg"}
                disabled={emailGenerating || emailGenerated === null}
                onClick={handleCopy}
              >
                {emailCopied ? (
                  <>
                    <CopyCheck className="stroke-primary-foreground/50" />
                    copied
                  </>
                ) : (
                  <>
                    <Copy className="stroke-primary-foreground/50" />
                    copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantView;
