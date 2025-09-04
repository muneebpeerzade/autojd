"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Resume } from "@/lib/parse-resume-from-pdf/resumeTypes";


// Define the context type
interface ResumeContextType {
  resumeDetails: Resume | null;
  setResumeDetails: (resume: Resume | null) => void;
  saveResumeDetails: (resume: Resume | null) => void;
}

// Create the context
const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

// Provider component
interface ResumeProviderProps {
  children: ReactNode;
}

export const ResumeProvider: React.FC<ResumeProviderProps> = ({ children }) => {
  const [resumeDetails, setResumeDetails] = useState<Resume | null>(null);

  const saveResumeDetails = (values: Resume | null) => {
    // console.log(values)
    setResumeDetails(values);
    if (!values) {
      console.warn("No resume data provided");
      return;
    }
  };

  const value: ResumeContextType = {
    resumeDetails,
    setResumeDetails,
    saveResumeDetails,
  };

  return (
    <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
  );
};

// Custom hook to use the context
export const useResume = (): ResumeContextType => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
};
