"use client";
import React, { useState } from "react";
import FileUploadForm from "./FileUploadForm/FileUploadForm";

import ResumeDetails from "@/components/Sidebar/FileUploadForm/ResumeDetails";
import { useResume } from "@/context/ResumeContext";
import Image from "next/image";
import { Button } from "../ui/button";
import { Eye, EyeClosed, SquareChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const { resumeDetails, saveResumeDetails } = useResume();
  const [showMichael, setShowMichael] = useState(true);

  return (
    <div
      className={cn(
        "border bg-background rounded p-2 flex flex-col gap-4",
        resumeDetails && "overflow-y-scroll"
      )}
    >
      <div className="h-full">
        <FileUploadForm onResumeSave={saveResumeDetails} />
      </div>


      {resumeDetails ? (
        <ResumeDetails resume={resumeDetails} />
      ) : (
        <MichaelSection
          showMichael={showMichael}
          setShowMichael={setShowMichael}
        />
      )}
    </div>
  );
};
export default Sidebar;

const MichaelSection = ({
  showMichael,
  setShowMichael,
}: {
  showMichael: boolean;
  setShowMichael: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <div className="mx-auto w-full flex flex-col gap-2">
    {showMichael && (
      <Image
        src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZzFlNWV0Mzh2MWVsc2R1a2hxbXRydmhkbXJldWppNWtyZ3FvYnFvciZlcD12MV9naWZzX3NlYXJjaCZjdD1n/12MgUpnxEq3ypy/giphy.gif"
        height={500}
        width={500}
        alt="micheal-scott-gif"
        className="rounded-lg"
        unoptimized
      />
    )}
    <Button variant="outline" onClick={() => setShowMichael((val) => !val)}>
      {showMichael ? (
        <>
          <EyeClosed className="stroke-muted-foreground" />
          Hide Michael
        </>
      ) : (
        <>
          <Eye className="stroke-muted-foreground" />
          See Michael Again
        </>
      )}
    </Button>
  </div>
);
