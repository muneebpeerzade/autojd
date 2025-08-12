"use client";
import { useResume } from "@/context/ResumeContext";
import JobDescriptionForm from "./JobDescriptionForm";

const AssistantView = () => {
  const { resumeDetails } = useResume();
  const handleFormSubmit = (data: FormData) => {
    console.log("Form submitted with data:", data);
  };

  return (
    <div className="overflow-y-scroll h-full">
      <JobDescriptionForm
        handleFormSubmit={handleFormSubmit}
        resumeDetails={resumeDetails}
      />
    </div>
  );
};

export default AssistantView;
// Hello, everything is alright
