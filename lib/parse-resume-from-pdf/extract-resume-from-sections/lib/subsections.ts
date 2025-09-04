import { BULLET_POINTS } from "@/lib/parse-resume-from-pdf/extract-resume-from-sections/lib/bullet-points";
import { isBold } from "@/lib/parse-resume-from-pdf/extract-resume-from-sections/lib/common-features";
import type { Lines, Line, Subsections, TextItem } from "@/lib/parse-resume-from-pdf/types";

// Add the same JOB_TITLES array from your extractWorkExperience function
const JOB_TITLES = ['Accountant', 'Administrator', 'Advisor', 'Agent', 'Analyst', 'Apprentice', 'Architect', 'Assistant', 'Associate', 'Auditor', 'Bartender', 'Biologist', 'Bookkeeper', 'Buyer', 'Carpenter', 'Cashier', 'CEO', 'Clerk', 'Co-op', 'Co-Founder', 'Consultant', 'Coordinator', 'CTO', 'Developer', 'Designer', 'Director', 'Driver', 'Editor', 'Electrician', 'Engineer', 'Extern', 'Founder', 'Freelancer', 'Head', 'Intern', 'Janitor', 'Journalist', 'Laborer', 'Lawyer', 'Lead', 'Manager', 'Mechanic', 'Member', 'Nurse', 'Officer', 'Operator', 'Operation', 'Photographer', 'President', 'Producer', 'Recruiter', 'Representative', 'Researcher', 'Sales', 'Server', 'Scientist', 'Specialist', 'Supervisor', 'Teacher', 'Technician', 'Trader', 'Trainee', 'Treasurer', 'Tutor', 'Vice', 'VP', 'Volunteer', 'Webmaster', 'Worker'];

const hasJobTitle = (item: TextItem) =>
  JOB_TITLES.some((jobTitle) =>
    item.text.split(/\s/).some((word) => word === jobTitle)
  );

// Check if a line contains a job title (likely a new subsection)
const isLineJobTitle = (line: Line): boolean => {
  return line.some(item => hasJobTitle(item));
};

// Check if a line contains a date pattern (supporting job title detection)
const hasDatePattern = (item: TextItem): boolean => {
  // Match common date patterns: "Nov 2024", "Dec 2022 -- Feb 2023", etc.
  const datePattern = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}|(\d{4})\s*--?\s*(\d{4}|\w+\s+\d{4})/i;
  return datePattern.test(item.text);
};

const isLineDatePattern = (line: Line): boolean => {
  return line.some(item => hasDatePattern(item));
};

/**
 * Enhanced version that can detect job titles as subsection boundaries
 */
export const divideSectionIntoSubsections = (lines: Lines): Subsections => {
  // First, try the job title heuristic for work experience sections
  const isLineNewSubsectionByJobTitle = (line: Line, prevLine: Line, lineIndex: number) => {
    // Skip the first line
    if (lineIndex === 0) return false;
    
    // Check if this line contains a job title and the pattern suggests it's a new job entry
    if (isLineJobTitle(line)) {
      // Additional validation: check if there's a date nearby (same line or next line)
      const nextLine = lineIndex < lines.length - 1 ? lines[lineIndex + 1] : null;
      const hasDateInCurrentLine = isLineDatePattern(line);
      const hasDateInNextLine = nextLine ? isLineDatePattern(nextLine) : false;
      
      // If we have a job title with a date pattern, it's likely a new subsection
      if (hasDateInCurrentLine || hasDateInNextLine) {
        return true;
      }
      
      // Additional check: if we've seen bullet points or descriptions before this job title,
      // it's likely a new subsection
      const hasSeenDescriptions = lines.slice(0, lineIndex).some(prevLine => 
        prevLine.some(item => BULLET_POINTS.some(bullet => item.text.includes(bullet))) ||
        prevLine.some(item => item.text.split(/\s/).filter(word => /^[^0-9]+$/.test(word)).length >= 8)
      );
      
      if (hasSeenDescriptions) {
        return true;
      }
    }
    
    return false;
  };

  // Try job title-based subsection detection first
  let subsections = createSubsectionsWithJobTitleDetection(lines, isLineNewSubsectionByJobTitle);

  // If job title detection found multiple subsections, use it
  if (subsections.length > 1) {
    return subsections;
  }

  // Otherwise, fall back to the original heuristics
  const isLineNewSubsectionByLineGap = createIsLineNewSubsectionByLineGap(lines);
  subsections = createSubsections(lines, isLineNewSubsectionByLineGap);

  // Fallback heuristic if the main heuristic doesn't apply to check if the text item is bolded
  if (subsections.length === 1) {
    const isLineNewSubsectionByBold = (line: Line, prevLine: Line) => {
      if (
        !isBold(prevLine[0]) &&
        isBold(line[0]) &&
        // Ignore bullet points that sometimes being marked as bolded
        !BULLET_POINTS.includes(line[0].text)
      ) {
        return true;
      }
      return false;
    };

    subsections = createSubsections(lines, isLineNewSubsectionByBold);
  }

  return subsections;
};

type IsLineNewSubsection = (line: Line, prevLine: Line) => boolean;
type IsLineNewSubsectionWithIndex = (line: Line, prevLine: Line, lineIndex: number) => boolean;

const createSubsectionsWithJobTitleDetection = (
  lines: Lines,
  isLineNewSubsection: IsLineNewSubsectionWithIndex
): Subsections => {
  const subsections: Subsections = [];
  let subsection: Lines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (i === 0) {
      subsection.push(line);
      continue;
    }
    
    if (isLineNewSubsection(line, lines[i - 1], i)) {
      subsections.push(subsection);
      subsection = [];
    }
    subsection.push(line);
  }
  
  if (subsection.length > 0) {
    subsections.push(subsection);
  }
  
  return subsections;
};

const createIsLineNewSubsectionByLineGap = (
  lines: Lines
): IsLineNewSubsection => {
  // Extract the common typical line gap
  const lineGapToCount: { [lineGap: number]: number } = {};
  const linesY = lines.map((line) => line[0].y);
  let lineGapWithMostCount: number = 0;
  let maxCount = 0;
  for (let i = 1; i < linesY.length; i++) {
    const lineGap = Math.round(linesY[i - 1] - linesY[i]);
    if (!lineGapToCount[lineGap]) lineGapToCount[lineGap] = 0;
    lineGapToCount[lineGap] += 1;
    if (lineGapToCount[lineGap] > maxCount) {
      lineGapWithMostCount = lineGap;
      maxCount = lineGapToCount[lineGap];
    }
  }
  // Use common line gap to set a sub section threshold
  const subsectionLineGapThreshold = lineGapWithMostCount * 1.4;

  const isLineNewSubsection = (line: Line, prevLine: Line) => {
    return Math.round(prevLine[0].y - line[0].y) > subsectionLineGapThreshold;
  };

  return isLineNewSubsection;
};

const createSubsections = (
  lines: Lines,
  isLineNewSubsection: IsLineNewSubsection
): Subsections => {
  const subsections: Subsections = [];
  let subsection: Lines = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (i === 0) {
      subsection.push(line);
      continue;
    }
    if (isLineNewSubsection(line, lines[i - 1])) {
      subsections.push(subsection);
      subsection = [];
    }
    subsection.push(line);
  }
  if (subsection.length > 0) {
    subsections.push(subsection);
  }
  return subsections;
};