import { EmailParametersFormType } from "@/components/Assistant/EmailParametersForm";
import { Resume } from "@/lib/parse-resume-from-pdf/resumeTypes";


// // Resume extraction functions
// const extractProfile = (profile: Resume['profile']) => ({
//   name: profile?.name || "Candidate",
//   email: profile?.email || "",
//   phone: profile?.phone || "",
//   location: profile?.location || "",
//   summary: profile?.summary || "",
// });

// const extractWorkExperience = (workExperiences: Resume['workExperiences']) =>
//   workExperiences?.map(exp =>
//     `${exp.jobTitle} at ${exp.company} (${exp.date}) - ${exp.descriptions?.join(". ")}`
//   ).join("\n") || "No work experience listed";

// const extractEducation = (educations: Resume['educations']) =>
//   educations?.map(edu =>
//     `${edu.degree} from ${edu.school} ${edu.gpa ? `(GPA: ${edu.gpa})` : ''}`
//   ).join("\n") || "No education listed";

// const extractProjects = (projects: Resume['projects']) =>
//   projects?.map(proj =>
//     `${proj.project}: ${proj.descriptions?.join(". ")}`
//   ).join("\n") || "No projects listed";

// const extractSkills = (skills: Resume['skills']) =>
//   skills?.descriptions?.join(", ") || "No skills listed";

// const extractCustomSections = (custom: Resume['custom']) =>
//   custom ? Object.entries(custom).map(([key, value]) =>
//     `${key}: ${Array.isArray(value) ? value.join(", ") : value}`
//   ).join("\n") : "";

// // Platform-specific configurations
// const getPlatformConfig = (platform: string) => {
//   const configs = {
//     email: { messageType: "email", greeting: "Dear Hiring Manager" },
//     linkedin: { messageType: "LinkedIn message", greeting: "Hi" },
//     "y-combinator": { messageType: "YC application message", greeting: "Hello" },
//     wellfound: { messageType: "Wellfound message", greeting: "Hi" },
//   };
//   return configs[platform as keyof typeof configs] || configs.email;
// };

// // Tone-specific instructions
// const getToneInstructions = (tone: string) => {
//   const instructions = {
//     corporate: "Use formal, professional language. Focus on qualifications and business value.",
//     startup: "Be conversational and show passion. Emphasize impact and growth mindset.",
//     "academic-research": "Use scholarly tone. Highlight research experience and intellectual curiosity.",
//   };
//   return instructions[tone as keyof typeof instructions] || instructions.corporate;
// };

// // Style-specific instructions
// const getStyleInstructions = (style: string) => {
//   const instructions = {
//     "direct-and-concise": "Be brief and to the point. No fluff.",
//     "warm-and-friendly": "Use warm, approachable language while staying professional.",
//     "story-telling": "Use narrative approach with specific examples and achievements.",
//     "michael-scott": "Inject appropriate personality and light humor while staying professional.",
//   };
//   return instructions[style as keyof typeof instructions] || instructions["direct-and-concise"];
// };

// // Intent-specific instructions
// const getIntentInstructions = (intent: string[]) => {
//   const intentMap = {
//     application: "applying for a specific position",
//     "follow-up": "following up on previous communication",
//     referral: "leveraging a mutual connection",
//     "cold-outreach": "making initial contact",
//     introduction: "introducing yourself for future opportunities",
//   };

//   return intent.map(i => intentMap[i as keyof typeof intentMap]).filter(Boolean).join(" and ");
// };

// // Main function
// export function createEmailPrompt(
//   resumeDetails: Resume,
//   jobDescriptionDetails: EmailParametersFormType,
// ): string {
//   const { profile, workExperiences, projects, skills, educations, custom } = resumeDetails;
//   const { jobDescription, tone, style, intent, wordCount, platform } = jobDescriptionDetails;

//   // Extract all resume data
//   const profileInfo = extractProfile(profile);
//   const workHistory = extractWorkExperience(workExperiences);
//   const educationHistory = extractEducation(educations);
//   const projectDetails = extractProjects(projects);
//   const skillsList = extractSkills(skills);
//   const customSections = extractCustomSections(custom);

//   // Get configurations
//   const platformConfig = getPlatformConfig(platform);
//   const toneInstructions = getToneInstructions(tone);
//   const styleInstructions = getStyleInstructions(style);
//   const intentInstructions = getIntentInstructions(intent);

//   return `Write a ${platformConfig.messageType} for ${intentInstructions}.

// CANDIDATE PROFILE:
// Name: ${profileInfo.name}
// Email: ${profileInfo.email}
// Phone: ${profileInfo.phone}
// Location: ${profileInfo.location}
// Summary: ${profileInfo.summary}

// WORK EXPERIENCE:
// ${workHistory}

// EDUCATION:
// ${educationHistory}

// PROJECTS:
// ${projectDetails}

// SKILLS:
// ${skillsList}

// ADDITIONAL INFO:
// ${customSections}

// JOB/OPPORTUNITY:
// ${jobDescription}

// WRITING GUIDELINES:
// - Platform: ${platform} (${platformConfig.messageType})
// - Tone: ${tone} - ${toneInstructions}
// - Style: ${style} - ${styleInstructions}
// - Purpose: ${intentInstructions}
// - Word limit: ${wordCount} words
// - Greeting: ${platformConfig.greeting}

// Instructions:
// 1. Use ALL candidate information above
// 2. Connect candidate's background to the opportunity
// 3. Create compelling subject line
// 4. Stay within word limit
// 5. Match tone and style requirements

// Format:
// Subject: [Compelling subject line]
// ${platformConfig.greeting},
// [Message body]
// Best regards,
// ${profileInfo.name}`;
// }

// 1. I need to extract candidate's profile - it'd be great if i extract all links instead of just first link

function extractProfile(profile: Resume["profile"]) {
  return {
    name: profile.name,
    email: profile.email,
    phone: profile.name,
    location: profile.location,
    summary: profile.summary,
    url: profile.url,
  };
}

export function createEmailPrompt(
  resumeDetails: Resume,
  jobDescriptionDetails: EmailParametersFormType,
): string {
  const {profile,workExperiences,projects,educations,skills} = resumeDetails
  return `CANDIDATE PROFILE
  Name: ${profile.name},
  Email: ${profile.email},
  Phone: ${profile.phone},
  Location: ${profile.location}
  Summary: ${profile.summary}

  `;
}
