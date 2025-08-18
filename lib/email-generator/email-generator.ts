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

  // Helper function to safely extract candidate information
  const extractCandidateInfo = () => {
    const skillsList = skills?.descriptions?.filter(Boolean).join(", ") ||
      "Various technical skills";
    const latestExperience = workExperiences?.[0];
    const recentProjects = projects
      ?.slice(0, 2)
      .map((p) => p.project)
      .filter(Boolean)
      .join(", ") || "Multiple projects";

    // Check if candidate is currently working
    const isCurrentlyWorking =
      latestExperience?.date?.split("-")[1] === "present";

    const roleDescription = isCurrentlyWorking
      ? `Currently working as ${latestExperience?.jobTitle || "Professional"}`
      : `Previously ${
        latestExperience?.jobTitle || "Professional"
      } with proven track record`;

    return {
      name: profile?.name || "Candidate",
      email: profile?.email || "",
      roleDescription,
      company: latestExperience?.company || "",
      workSummary: latestExperience?.descriptions?.slice(0, 2).join(". ") || "",
      education: educations?.[0]
        ? `${educations[0].degree || "Degree"} from ${
          educations[0].school || "University"
        }`
        : "Strong educational background",
      skills: skillsList,
      projects: recentProjects,
      isCurrentlyWorking,
    };
  };

  const candidateInfo = extractCandidateInfo();

  // Helper functions for tone-specific instructions
  const getToneInstructions = (selectedTone: string) => {
    switch (selectedTone) {
      case "corporate":
        return {
          context: "professional corporate environment",
          instructions:
            `You are writing a formal business email for a corporate position. This email will be sent to HR professionals, department heads, or senior executives at established companies.

CRITICAL INSTRUCTIONS FOR CORPORATE EMAILS:
1. **Subject Line**: Professional and clear, following corporate email conventions (e.g., "Application for [Position] - [Your Name]")
2. **Formal Opening**: Use proper business salutations and formal language throughout
3. **Professional Structure**: Organized, well-structured paragraphs with clear hierarchy
4. **Corporate Fit**: ${
              candidateInfo.isCurrentlyWorking
                ? "Emphasize your current professional role, responsibilities, and how they align with corporate standards"
                : "Highlight your professional accomplishments, industry experience, and proven results in previous corporate roles"
            }
5. **Business Value**: Focus on ROI, efficiency improvements, and measurable business impact
6. **Formal Credentials**: Emphasize education, certifications, and formal qualifications
7. **Professional Tone**: Maintain formal, respectful, and business-appropriate language
8. **Structured Closing**: Use traditional business email closings

CORPORATE CONTEXT AWARENESS:
- These are established organizations with formal processes
- They value stability, proven track records, and systematic approaches
- Emphasize compliance, best practices, and industry standards
- Show understanding of corporate hierarchy and formal business processes`,
          avoid: `- Casual language or slang
- Overly creative or unconventional approaches
- Startup terminology or entrepreneurial buzzwords
- Informal greetings or closings
- Personal anecdotes unless highly relevant`,
        };

      case "startup":
        return {
          context: "startup/entrepreneurial environment",
          instructions:
            `You are writing a personalized email for a startup application/outreach. This email will be sent to founders, hiring managers, or team leads at startups found on YCombinator, Wellfound, and similar platforms.

CRITICAL INSTRUCTIONS FOR STARTUP EMAILS:
1. **Subject Line**: Create something that stands out in a founder's busy inbox - be specific and intriguing
2. **Hook**: Start with something that immediately shows value or connection to their mission
3. **Proof Points**: Use specific numbers, results, or achievements - startups love data and impact
4. **Startup Fit**: ${
              candidateInfo.isCurrentlyWorking
                ? "Show how your current experience translates to startup speed and versatility"
                : "Highlight specific accomplishments and results from previous roles that demonstrate startup-ready skills"
            }
5. **Research**: Demonstrate you understand their product, market, or recent developments
6. **Value Proposition**: Be clear about what you bring to their growth story
7. **Human Touch**: Let personality shine through - startups hire people, not just skills
8. **Call to Action**: Be specific and make it easy for them to respond

STARTUP CONTEXT AWARENESS:
- These are fast-moving, resource-conscious teams
- They value builders, problem-solvers, and people who can wear multiple hats
- Show entrepreneurial mindset and adaptability
- Demonstrate you understand the startup journey and challenges`,
          avoid: `- Generic corporate-speak or buzzwords
- Overly formal language that sounds like a big company
- Long paragraphs (startups scan quickly)
- Being pushy or desperate
- Copying obvious template language`,
        };

      case "academic-research":
        return {
          context: "academic or research institution",
          instructions:
            `You are writing a scholarly email for an academic or research position. This email will be sent to professors, research directors, or academic administrators at universities, research institutes, or R&D departments.

CRITICAL INSTRUCTIONS FOR ACADEMIC EMAILS:
1. **Subject Line**: Clear and academic in nature, mentioning specific research interests or positions
2. **Scholarly Opening**: Demonstrate familiarity with their research, publications, or academic work
3. **Research Focus**: ${
              candidateInfo.isCurrentlyWorking
                ? "Connect your current work to academic research, highlighting any publications, presentations, or research contributions"
                : "Emphasize your research experience, academic achievements, and scholarly contributions from previous positions"
            }
4. **Intellectual Merit**: Discuss theoretical frameworks, methodologies, or research questions you're interested in
5. **Academic Credentials**: Highlight relevant education, publications, conference presentations, and research experience
6. **Collaborative Approach**: Show interest in contributing to their research community and collaborative projects
7. **Thoughtful Analysis**: Demonstrate deep thinking and analytical capabilities
8. **Academic Networking**: Reference relevant academic networks, conferences, or scholarly communities

ACADEMIC CONTEXT AWARENESS:
- These are knowledge-focused environments that value intellectual rigor
- Emphasize research potential, critical thinking, and scholarly contributions
- Show understanding of academic culture, peer review, and research processes
- Demonstrate commitment to advancing knowledge in the field`,
          avoid: `- Purely commercial or business-focused language
- Superficial understanding of their research
- Overemphasis on salary or benefits
- Casual or unprofessional tone
- Lack of intellectual depth or curiosity`,
        };

      default:
        return getToneInstructions("startup");
    }
  };

  const getStyleInstruction = (selectedStyle: string): string => {
    const styleInstructions = {
      "direct-and-concise": tone === "corporate"
        ? "professional and efficient communication style, respecting the recipient's time with clear, structured points"
        : tone === "startup"
        ? "straight to the point, no fluff - show value quickly like a busy founder would appreciate"
        : "concise and focused academic writing that gets to the research/intellectual point efficiently",
      "warm-and-friendly": tone === "corporate"
        ? "approachable yet professional tone that builds rapport while maintaining business decorum"
        : tone === "startup"
        ? "conversational and genuine, like you're talking to a potential teammate over coffee"
        : "collegial and warm academic tone that shows genuine interest in collaborative scholarly work",
      "story-telling": tone === "corporate"
        ? "structured narrative approach highlighting career progression and professional achievements"
        : tone === "startup"
        ? "share your journey and wins with specific examples that paint a picture of your impact"
        : "narrative approach connecting personal research journey with broader academic questions and discoveries",
      "michael-scott": tone === "corporate"
        ? "inject appropriate personality while maintaining professional boundaries and corporate appropriateness"
        : tone === "startup"
        ? "inject personality and humor while staying professional - show you're human and fun to work with"
        : "show personality and intellectual humor while maintaining scholarly credibility and academic respect",
    };
    return styleInstructions[selectedStyle as keyof typeof styleInstructions] ||
      styleInstructions["direct-and-concise"];
  };

  const getIntentInstructions = (intents: string[]): string => {
    if (!intents || intents.length === 0) {
      return "expressing professional interest";
    }

    const intentMap = {
      application: tone === "corporate"
        ? "formally applying for the position with emphasis on qualifications and fit"
        : tone === "startup"
        ? "showing genuine excitement for the role and explaining why you're the right fit for their startup journey"
        : "expressing scholarly interest in the position and research opportunities",
      "follow-up": tone === "corporate"
        ? "professional follow-up maintaining appropriate business communication protocols"
        : tone === "startup"
        ? "following up with additional value or context, showing persistence and continued interest"
        : "scholarly follow-up with additional research insights or academic context",
      referral: tone === "corporate"
        ? "leveraging professional network connections and mutual business relationships"
        : tone === "startup"
        ? "leveraging your network connection to build trust and credibility in the startup ecosystem"
        : "utilizing academic network connections and scholarly recommendations",
      "cold-outreach": tone === "corporate"
        ? "making professional first contact with clear business value proposition"
        : tone === "startup"
        ? "making a memorable first impression by leading with value and showing you've done your homework"
        : "initiating scholarly contact based on research interests and academic alignment",
      introduction: tone === "corporate"
        ? "establishing professional relationship for potential business opportunities"
        : tone === "startup"
        ? "starting a meaningful professional relationship with potential for future collaboration"
        : "beginning academic relationship with focus on research collaboration and scholarly exchange",
    };

    return intents
      .map((i) => intentMap[i as keyof typeof intentMap])
      .filter(Boolean)
      .join(" while also ");
  };

  const toneConfig = getToneInstructions(tone);

  return `${toneConfig.instructions}

CANDIDATE PROFILE:
- Name: ${candidateInfo.name}
- ${candidateInfo.roleDescription}
- Company: ${candidateInfo.company}
- Key Achievements: ${candidateInfo.workSummary}
- Technical Skills: ${candidateInfo.skills}
- Notable Projects: ${candidateInfo.projects}
- Education: ${candidateInfo.education}

${tone.toUpperCase()}/ROLE CONTEXT:
${jobDescription}

COMMUNICATION STYLE:
- Writing Style: ${getStyleInstruction(style)}
- Primary Intent: ${getIntentInstructions(intent)}
- Length: ${wordCount} words (strict limit)

AVOID:
${toneConfig.avoid}

Write an email that perfectly matches the ${tone} environment and makes the recipient interested in learning more about this candidate.

FORMAT:
Subject: [${
    tone === "corporate"
      ? "Professional Subject Line"
      : tone === "startup"
      ? "Compelling Subject Line"
      : "Academic Subject Line"
  }]

[Email Body - ${
    tone === "corporate"
      ? "formal and structured"
      : tone === "startup"
      ? "conversational, specific, and compelling"
      : "scholarly and thoughtful"
  }]

${
    tone === "corporate"
      ? "Sincerely"
      : tone === "startup"
      ? "Best"
      : "Best regards"
  },
${candidateInfo.name}`;
}
