import OpenAI from "openai";
import { JobDescriptionFormType } from "@/components/Assistant/JobDescriptionForm";
import { Resume } from "@/lib/parse-resume-from-pdf/resumeTypes";
import { createEmailPrompt } from "@/lib/email-generator/email-generator";

function createDeepSeekClient() {
  return new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey: process.env.OPENAI_API_TESTKEY,
  });
}

export async function generateEmailStream(
  resumeDetails: Resume,
  jobDescriptionDetails: JobDescriptionFormType,
) {
  const openai = createDeepSeekClient();
  const prompt = createEmailPrompt(resumeDetails, jobDescriptionDetails);

  const stream = await openai.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      {
        role: "system",
        content:
          "You are an expert email writer who creates personalized, professional emails based on resume details and job requirements. Focus on highlighting relevant skills and experience.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    stream: true,
    temperature: 0.7,
    max_tokens: Math.min(jobDescriptionDetails.wordCount * 2, 1000),
  });

  return stream;
}

export async function generateEmailNonStreaming(
  resumeDetails: Resume,
  jobDescriptionDetails: JobDescriptionFormType,
) {
  const openai = createDeepSeekClient();
  const prompt = createEmailPrompt(resumeDetails, jobDescriptionDetails);

  const response = await openai.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      {
        role: "system",
        content:
          "You are an expert email writer who creates personalized, professional emails based on resume details and job requirements.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: Math.min(jobDescriptionDetails.wordCount * 2, 1000),
  });

  return response.choices[0]?.message?.content || "";
}