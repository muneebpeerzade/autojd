"use client";

import { useState } from "react";
import { useResume } from "@/context/ResumeContext";
import JobDescriptionForm, {
  JobDescriptionFormType,
} from "./JobDescriptionForm";
import { Button } from "@/components/ui/button";
import { Copy, RotateCcw, Loader2 } from "lucide-react";

const AssistantView = () => {
  const { resumeDetails } = useResume();
  const [showResponse, setShowResponse] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFormSubmit = async (data: JobDescriptionFormType) => {
    if (!resumeDetails) return;

    setShowResponse(true);
    setIsGenerating(true);
    setGeneratedEmail("");
    setError(null);

    try {
      const response = await fetch("/api/generate-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeDetails,
          jobDescriptionDetails: data,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate email");
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let fullEmail = "";
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullEmail += chunk;
          setGeneratedEmail(fullEmail);
        }
      }
    } catch (error) {
      console.error("Error generating email:", error);
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(generatedEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy email:", error);
    }
  };

  const handleRetry = () => {
    setShowResponse(false);
    setGeneratedEmail("");
    setError(null);
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left half - form */}
      <div
        className={`h-full overflow-y-scroll transition-all duration-300 ${
          showResponse ? "w-1/2" : "w-full"
        }`}
      >
        <JobDescriptionForm
          handleFormSubmit={handleFormSubmit}
          resumeDetails={resumeDetails}
        />
      </div>

      {/* Right half - response */}
      {showResponse && (
        <div className="w-1/2 h-full border text-accent-foreground p-4 overflow-y-scroll rounded-md">
          <div className="flex flex-wrap gap-2 justify-between items-center mb-4">
            <p className="font-serif text-2xl font-medium">
              Your personalized email
            </p>
            {!isGenerating && generatedEmail && (
              <div className="flex gap-2">
                <Button
                  onClick={handleCopyEmail}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button
                  onClick={handleRetry}
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retry
                </Button>
              </div>
            )}
          </div>

          {/* Loading state */}
          {isGenerating && (
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Crafting your personalized email...</span>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-600 text-sm">{error}</p>
              <Button
                onClick={handleRetry}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Email content */}
          {generatedEmail && (
            <div className="rounded-lg p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap min-h-[200px] border">
              {generatedEmail}
              {isGenerating && <span className="animate-pulse">|</span>}
            </div>
          )}

          {/* Retry button when not generating */}
          {!isGenerating && !error && generatedEmail && (
            <div className="mt-4 flex justify-end">
              <Button onClick={handleRetry} variant="secondary">
                Generate New Email
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssistantView;
