import { JobDescriptionFormType } from "@/components/Assistant/JobDescriptionForm";
import { Resume } from "@/lib/parse-resume-from-pdf/resumeTypes";

export function createEmailPrompt(
  resumeDetails: Resume,
  jobDescriptionDetails: JobDescriptionFormType,
): string {
  const { profile, workExperiences, projects, skills, educations } =
    resumeDetails;
  const { jobDescription, tone, style, intent, wordCount } =
    jobDescriptionDetails;

  // Extract relevant skills
  const skillsList = skills.descriptions.join(", ");

  // Get latest work experience
  const latestExperience = workExperiences[0];

  // Get recent projects
  const recentProjects = projects.slice(0, 2).map((p) => p.project).join(", ");

  const toneInstructions = {
    corporate:
      "using professional corporate language with business-focused terminology and formal structure",
    startup:
      "adopting a dynamic, innovative, and slightly casual startup tone that shows enthusiasm and agility",
    "academic-research":
      "maintaining scholarly, research-oriented language with intellectual depth and academic professionalism",
  };

  const styleInstructions = {
    "direct-and-concise":
      "being direct, concise, and to-the-point without unnecessary elaboration",
    "warm-and-friendly":
      "using a warm, approachable, and friendly tone that builds personal connection",
    "story-telling":
      "using narrative elements, personal anecdotes, and storytelling techniques to engage the reader",
    "michael-scott":
      "adopting a quirky, enthusiastic, and slightly unconventional approach with humor and personality (like Michael Scott from The Office)",
  };

  const intentInstructions = {
    application:
      "expressing strong interest in the position and requesting consideration for the role",
    "follow-up":
      "following up on previous communication, application, or meeting with appropriate next steps",
    referral:
      "leveraging a mutual connection or referral to establish credibility and request consideration",
    "cold-outreach":
      "making initial contact without prior connection, focusing on value proposition and building interest",
  };

  return `Write a personalized email based on the following information:

CANDIDATE INFORMATION:
- Name: ${profile.name}
- Email: ${profile.email}
- Current Role: ${latestExperience?.jobTitle || "Developer"}
- Company: ${latestExperience?.company || ""}
- Education: ${educations[0]?.degree} from ${educations[0]?.school}
- Key Skills: ${skillsList}
- Recent Projects: ${recentProjects}

JOB/CONTEXT:
${jobDescription}

EMAIL REQUIREMENTS:
- Tone: ${
    toneInstructions[tone as keyof typeof toneInstructions] ||
    "corporate professional"
  }
- Style: ${
    styleInstructions[style as keyof typeof styleInstructions] ||
    "direct and concise"
  }  
- Intent: ${
    intent.map((i) =>
      intentInstructions[i as keyof typeof intentInstructions]
    ).join(" and ") || "application"
  }
- Target Length: Approximately ${wordCount} words

INSTRUCTIONS:
1. Create a compelling subject line
2. Address the recipient professionally
3. Highlight relevant skills and experience from the candidate's background
4. Match the requested tone and style
5. Include a clear call-to-action based on the intent
6. Keep within the specified word count
7. Make it personalized and specific to the candidate's background

Format the response as:
Subject: [Email Subject]

[Email Body]

Best regards,
${profile.name}`;
}