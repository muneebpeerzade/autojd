"use server";

import { JobDescriptionFormType } from "@/components/Assistant/JobDescriptionForm";
import { Resume } from "@/lib/parse-resume-from-pdf/resumeTypes";

export async function generatePersonalizedEmail(
    { resumeDetails, jobDescriptionDetails }: {
        resumeDetails: Resume;
        jobDescriptionDetails: JobDescriptionFormType;
    },
) {
    console.log("User resume details: ", resumeDetails)
    console.log("User Job Description with their preferences", jobDescriptionDetails)
}



