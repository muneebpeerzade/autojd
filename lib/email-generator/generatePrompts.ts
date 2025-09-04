import { EmailParametersFormType } from "@/components/Assistant/EmailParametersForm";
import { Resume } from "@/lib/parse-resume-from-pdf/resumeTypes";

interface PromptResult {
    systemPrompt: string;
    userPrompt: string;
}

// Platform-specific configurations
const PLATFORM_CONFIGS = {
    email: {
        format: "professional email",
        subjectLine: true,
        signature: true,
        greeting: "formal greeting",
        structure:
            "subject line, greeting, body paragraphs, closing, signature",
    },
    linkedin: {
        format: "LinkedIn message",
        subjectLine: false,
        signature: false,
        greeting: "casual greeting",
        structure: "brief introduction, value proposition, call to action",
    },
    "y-combinator": {
        format: "Y Combinator application message",
        subjectLine: false,
        signature: false,
        greeting: "direct approach",
        structure: "problem statement, solution, traction, ask",
    },
    wellfound: {
        format: "Wellfound (AngelList) message",
        subjectLine: false,
        signature: false,
        greeting: "startup-friendly greeting",
        structure:
            "brief intro, relevant experience, interest in role, next steps",
    },
};

// Tone configurations
const TONE_CONFIGS = {
    corporate: {
        language: "formal, professional language",
        vocabulary: "business terminology and industry jargon",
        approach: "structured and hierarchical",
    },
    startup: {
        language: "casual yet professional language",
        vocabulary: "growth-focused and innovative terms",
        approach: "agile and results-oriented",
    },
    "academic-research": {
        language: "scholarly and precise language",
        vocabulary: "research-oriented and technical terms",
        approach: "methodical and evidence-based",
    },
};

// Style configurations
const STYLE_CONFIGS = {
    "direct-and-concise": {
        approach: "get straight to the point",
        sentences: "short, impactful sentences",
        structure: "bullet points where appropriate",
    },
    "warm-and-friendly": {
        approach: "build rapport and connection",
        sentences: "conversational and approachable tone",
        structure: "flowing paragraphs with personal touches",
    },
    "story-telling": {
        approach: "use narrative elements and examples",
        sentences: "descriptive and engaging language",
        structure: "chronological flow with specific anecdotes",
    },
    "michael-scott": {
        approach: "enthusiastic and slightly quirky",
        sentences: "energetic and memorable phrasing",
        structure: "conversational with unexpected analogies",
    },
};

// Intent-specific messaging
const INTENT_CONFIGS = {
    application: "applying for this specific position",
    "follow-up": "following up on a previous interaction or application",
    referral: "seeking a referral or introduction",
    "cold-outreach": "initiating contact without prior connection",
    introduction: "introducing yourself and exploring opportunities",
};

/**
 * Generates system and user prompts for creating personalized job outreach messages
 */
export function generatePrompts(
    resume: Resume,
    emailParameters: EmailParametersFormType,
): PromptResult {
    const { tone, style, intent, wordCount, platform, jobDescription } =
        emailParameters;

    const platformConfig = PLATFORM_CONFIGS[platform];
    const toneConfig = TONE_CONFIGS[tone];
    const styleConfig = STYLE_CONFIGS[style];

    // Create system prompt
    const systemPrompt =
        `You are an expert career coach and professional communication specialist. Your task is to create a highly personalized ${platformConfig.format} that matches the user's resume to a specific job opportunity.

PLATFORM REQUIREMENTS:
- Format: ${platformConfig.format}
- Structure: ${platformConfig.structure}
- Include subject line: ${platformConfig.subjectLine ? "Yes" : "No"}
- Include signature: ${platformConfig.signature ? "Yes" : "No"}
- Greeting style: ${platformConfig.greeting}

COMMUNICATION STYLE:
- Tone: ${tone} (${toneConfig.language}, ${toneConfig.vocabulary}, ${toneConfig.approach})
- Style: ${style} (${styleConfig.approach}, ${styleConfig.sentences}, ${styleConfig.structure})
- Word count: Approximately ${wordCount} words
- Intent: ${intent.map((i) => INTENT_CONFIGS[i]).join(", ")}

PERSONALIZATION REQUIREMENTS:
1. Analyze the job description to identify key requirements, skills, and company culture
2. Match relevant experiences from the resume to job requirements
3. Highlight specific achievements and quantifiable results where available
4. Reference company-specific details or recent news/developments when relevant
5. Create natural connections between the candidate's background and the role
6. Avoid generic templates - make each message feel uniquely crafted

QUALITY STANDARDS:
- Professional yet authentic voice
- Clear value proposition
- Specific examples over generic statements
- Appropriate call-to-action for the platform
- Error-free grammar and formatting
- Respectful of the recipient's time

Remember: The goal is to create a compelling message that demonstrates genuine interest and clear value alignment while respecting the platform's norms and the recipient's context.`;

    // Extract relevant resume information for user prompt
    const relevantExperiences = resume.workExperiences
        .map((exp) =>
            `${exp.jobTitle} at ${exp.company} (${exp.date}): ${
                exp.descriptions.join("; ")
            }`
        )
        .join("\n");

    const relevantProjects = resume.projects
        .map((proj) =>
            `${proj.project} (${proj.date}): ${proj.descriptions.join("; ")}`
        )
        .join("\n");

    const topSkills = resume.skills.descriptions.join(", ");

    const education = resume.educations
        .map((edu) =>
            `${edu.degree} from ${edu.school} (${edu.date})${
                edu.gpa ? ` - GPA: ${edu.gpa}` : ""
            }`
        )
        .join("\n");

    // Create user prompt with resume data and job description
    const userPrompt =
        `Please create a personalized ${platformConfig.format} for the following job opportunity:

JOB DESCRIPTION:
${jobDescription}

CANDIDATE INFORMATION:
Name: ${resume.profile.name}
Email: ${resume.profile.email}
Location: ${resume.profile.location}
Professional Summary: ${resume.profile.summary}
${resume.profile.url ? `Portfolio/LinkedIn: ${resume.profile.url}` : ""}

WORK EXPERIENCE:
${relevantExperiences || "No work experience listed"}

PROJECTS:
${relevantProjects || "No projects listed"}

EDUCATION:
${education || "No education listed"}

KEY SKILLS:
${topSkills || "No skills listed"}

${
            resume.custom.descriptions.length > 0
                ? `ADDITIONAL INFORMATION:\n${
                    resume.custom.descriptions.join("\n")
                }`
                : ""
        }

SPECIFIC REQUIREMENTS:
- Target word count: ${wordCount} words
- Platform: ${platform}
- Tone: ${tone}
- Style: ${style}
- Intent: ${intent.join(", ")}

Please analyze the job requirements and create a compelling message that highlights the most relevant qualifications and experiences from the resume. Focus on creating genuine connections between the candidate's background and the specific role/company.`;

    return {
        systemPrompt,
        userPrompt,
    };
}

export default generatePrompts;
