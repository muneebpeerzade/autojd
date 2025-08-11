"use client";
import React from "react";
import Toolbar from "@/components/Sidebar/Toolbar";
import { useState } from "react";
import FileUploadForm from "./FileUploadForm/FileUploadForm";
import { Resume } from "@/lib/parse-resume-from-pdf/resumeTypes";
import ResumeDetails from "@/components/Sidebar/FileUploadForm/ResumeDetails";
import { useResume } from "@/context/ResumeContext";
const Sidebar = () => {
  const { resumeDetails, saveResumeDetails } = useResume();

  return (
    <div className="border rounded p-2 space-y-2 overflow-y-scroll">
      <FileUploadForm onResumeSave={saveResumeDetails} />
      {resumeDetails ? <ResumeDetails resume={resumeDetails} /> : null}
    </div>
  );
};

export default Sidebar;
