"use client";

import { useState } from "react";
import { useResume } from "@/context/ResumeContext";
import JobDescriptionForm, {
  JobDescriptionFormType,
} from "@/components/Assistant/JobDescriptionForm";
import { Button } from "@/components/ui/button";
import {
  Copy,
  RotateCcw,
  Loader2,
  SquareChevronLeft,
  ChevronLeft,
  ChevronRight,
  History,
} from "lucide-react";
import { Textarea } from "../ui/textarea";
import { AutosizeTextarea } from "../ui/autosize-textarea";

// Type for stored email responses
interface EmailResponse {
  id: string;
  email: string;
  formData: JobDescriptionFormType;
  timestamp: Date;
}

const AssistantView = () => {
  const { resumeDetails } = useResume();
  const [showResponse, setShowResponse] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // History management state
  const [emailHistory, setEmailHistory] = useState<EmailResponse[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);

  // Store last form data for retry functionality
  const [lastFormData, setLastFormData] =
    useState<JobDescriptionFormType | null>(null);

  const handleFormSubmit = async (data: JobDescriptionFormType) => {
    if (!resumeDetails) return;

    // Store the form data for retry functionality
    setLastFormData(data);

    if (!showResponse) {
      setShowResponse(true);
    }
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

        // After email is fully generated, add it to history
        if (fullEmail) {
          const newEmailResponse: EmailResponse = {
            id: Date.now().toString(),
            email: fullEmail,
            formData: data,
            timestamp: new Date(),
          };

          setEmailHistory((prev) => [...prev, newEmailResponse]);
          setCurrentHistoryIndex(emailHistory.length); // Set to the new latest index
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
    // Rerun the form submission with the last form data instead of going back to form
    if (lastFormData) {
      handleFormSubmit(lastFormData);
    }
  };

  const openResult = () => {
    setShowResponse(true);
  };

  // History navigation functions
  const goToPreviousEmail = () => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1;
      setCurrentHistoryIndex(newIndex);
      setGeneratedEmail(emailHistory[newIndex].email);
    }
  };

  const goToNextEmail = () => {
    if (currentHistoryIndex < emailHistory.length - 1) {
      const newIndex = currentHistoryIndex + 1;
      setCurrentHistoryIndex(newIndex);
      setGeneratedEmail(emailHistory[newIndex].email);
    }
  };

  const clearHistory = () => {
    setGeneratedEmail("");
    setShowResponse(false);
    setEmailHistory([]);
    setCurrentHistoryIndex(-1);
  };

  // Handle textarea changes
  const handleEmailChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGeneratedEmail(e.target.value);
  };

  // Get current email info for display
  const getCurrentEmailInfo = () => {
    if (currentHistoryIndex >= 0 && emailHistory[currentHistoryIndex]) {
      const current = emailHistory[currentHistoryIndex];
      return {
        position: currentHistoryIndex + 1,
        total: emailHistory.length,
        timestamp: current.timestamp,
        formData: current.formData,
      };
    }
    return null;
  };

  const currentEmailInfo = getCurrentEmailInfo();

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left half - form */}
      <div
        className={`h-full overflow-y-scroll transition-all duration-300 ${
          showResponse ? "w-0" : "w-full"
        }`}
      >
        <JobDescriptionForm
          handleFormSubmit={handleFormSubmit}
          resumeDetails={resumeDetails}
          emailGenerated={!isGenerating && generatedEmail.length !== 0}
          openResult={openResult}
        />
      </div>

      {/* Right half - response */}
      {showResponse && (
        <div className="w-full h-full text-accent-foreground p-4 overflow-y-scroll rounded-md">
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <p className="font-serif text-2xl font-medium">
                Your personalized email
              </p>

              {/* History info and controls */}
              {emailHistory.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <History className="w-4 h-4" />
                  <span>
                    {currentEmailInfo?.position || 0} of {emailHistory.length}
                  </span>
                </div>
              )}
            </div>

            {/* History navigation */}
            {emailHistory.length > 1 && (
              <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToPreviousEmail}
                  disabled={currentHistoryIndex <= 0 || isGenerating}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="text-center">
                  {currentEmailInfo && (
                    <div className="text-xs text-muted-foreground">
                      <p>
                        Generated:{" "}
                        {currentEmailInfo.timestamp.toLocaleTimeString()}
                      </p>
                      <p className="capitalize">
                        {currentEmailInfo.formData.tone} •{" "}
                        {currentEmailInfo.formData.style}
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToNextEmail}
                  disabled={
                    currentHistoryIndex >= emailHistory.length - 1 ||
                    isGenerating
                  }
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
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
            <div className="bg-destructive border-destructive rounded-lg p-4 mb-4">
              <p className="text-destructive-foreground font-medium">Error</p>
              <p className="text-destructive-foreground text-sm">{error}</p>
              <Button
                onClick={handleRetry}
                variant="default"
                size="sm"
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Email content - now as textarea */}
          {(generatedEmail || isGenerating) && (
            <AutosizeTextarea
              value={generatedEmail}
              onChange={handleEmailChange}
              disabled={isGenerating}
              className="w-full bg-secondary text-secondary-foreground  rounded-lg p-4 font-mono text-sm leading-relaxed min-h-[36rem] "
              placeholder={
                isGenerating
                  ? "Crafting your personalized email..."
                  : "Your email will appear here"
              }
            />
          )}

          {!isGenerating && generatedEmail && (
            <div className="flex justify-between mt-4">
              <div className="flex gap-2">
                <Button
                  variant={"outline"}
                  onClick={() => setShowResponse(false)}
                >
                  <SquareChevronLeft className="w-4 h-4" />
                  Back to form
                </Button>

                {/* Clear history button */}
                {emailHistory.length > 1 && (
                  <Button
                    onClick={clearHistory}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    Clear History
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleCopyEmail}
                  variant="default"
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
                  disabled={!lastFormData}
                >
                  <RotateCcw className="w-4 h-4" />
                  Retry
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssistantView;
