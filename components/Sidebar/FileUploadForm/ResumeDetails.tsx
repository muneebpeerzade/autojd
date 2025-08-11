import { Card } from "@/components/ui/card";
import { Resume } from "@/lib/parse-resume-from-pdf/resumeTypes";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion";
import { BriefcaseBusiness, CircleUser, Folder, Globe, GraduationCap, Lightbulb, Mail, MapPin, Phone } from "lucide-react";

const ResumeDetails = ({ resume }: { resume: Resume }) => {
  const parseSkill = (skill: string) => {
    const colonIndex = skill.indexOf(":");

    if (colonIndex === -1) {
      return { category: null, technologies: skill };
    }

    return {
      category: skill.substring(0, colonIndex).trim(),
      technologies: skill.substring(colonIndex + 1).trim(),
    };
  };

  return (
    <div className="space-y-3 text-xs">
      {/* Profile Section */}
      <section className="space-y-2">
        <h3 className="font-semibold text-sm flex items-center gap-1">
          <span className="h-2 w-2 bg-accent rounded-full"></span>{" "}
          <CircleUser className="w-4 h-4 stroke-accent" /> Profile
        </h3>
        <Card className="p-3">
          <div className="space-y-1 text-xs text-muted-foreground">
            <h4 className="font-medium text-sm text-foreground">
              {resume.profile.name}
            </h4>
            {resume.profile.email && (
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span className="truncate">{resume.profile.email}</span>
              </div>
            )}
            {resume.profile.phone && (
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>{resume.profile.phone}</span>
              </div>
            )}
            {resume.profile.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{resume.profile.location}</span>
              </div>
            )}
            {resume.profile.url && (
              <div className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                <span className="truncate">{resume.profile.url}</span>
              </div>
            )}
          </div>
          {resume.profile.summary && (
            <p className="text-xs text-muted-foreground line-clamp-3 mt-2">
              {resume.profile.summary}
            </p>
          )}
        </Card>
      </section>
      {/* Work Experience Section */}
      {resume.workExperiences.length > 0 && (
        <section className="space-y-2">
          <h3 className="font-semibold text-sm flex items-center gap-1">
            <span className="h-2 w-2 bg-accent rounded-full"></span>{" "}
            <BriefcaseBusiness className="w-4 h-4 stroke-accent" /> Work
            Experience
          </h3>
          <Card className="p-3 gap-3">
            {resume.workExperiences.map((work, idx) => (
              <div key={idx} className="space-y-1  rounded ">
                <h3 className="font-semibold text-sm flex items-center gap-1">
                  {work.jobTitle}
                </h3>
                <h4>{work.company}</h4>
                <p className="text-muted-foreground">{work.date}</p>
                <Accordion type="single" className="" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="p-0">
                      <span className="">
                        view all points
                        <span className="bg-secondary mx-1 px-3 rounded">
                          {work.descriptions.length}
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-decimal space-y-0.5 list-inside text-xs text-muted-foreground">
                        {work.descriptions.map((description, idx) => (
                          <li key={idx}>{description}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            ))}
          </Card>
        </section>
      )}
      {resume.projects.length > 0 && (
        <section className="space-y-2">
          <h3 className="font-semibold text-sm flex items-center gap-1">
            <span className="h-2 w-2 bg-accent rounded-full"></span>{" "}
            <Folder className="w-4 h-4 stroke-accent" />
            Projects
          </h3>
          <Card className="p-3 gap-3">
            {resume.projects.map((project, idx) => (
              <div key={idx} className="space-y-1  rounded ">
                <h3 className="font-semibold text-sm flex items-center gap-1">
                  {project.project}
                </h3>
                <p className="text-muted-foreground">{project.date}</p>
                <Accordion type="single" className="" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="p-0">
                      <span className="">
                        view all points
                        <span className="text-xs text-muted-foreground ml-1">
                          ({project.descriptions.length})
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-decimal space-y-0.5 list-inside text-xs text-muted-foreground">
                        {project.descriptions.map((description, idx) => (
                          <li key={idx}>{description}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            ))}
          </Card>
        </section>
      )}
      {/* Skills Section */}
      {resume.skills.descriptions.length > 0 && (
        <section className="space-y-2">
          <h3 className="font-semibold text-sm flex items-center gap-1">
            <span className="w-2 h-2 bg-accent rounded-full"></span>
            <Lightbulb className="w-4 h-4 stroke-accent" />
            Skills
          </h3>
          <Card className="p-3 gap-1">
            {resume.skills.descriptions.map((skill, idx) => {
              const { category, technologies } = parseSkill(skill);

              return (
                <div key={idx} className="space-y-1">
                  <p className="text-muted-foreground">
                    {category ? (
                      <>
                        <span className="font-semibold text-foreground">
                          {category}
                        </span>
                        : {technologies}
                      </>
                    ) : (
                      technologies
                    )}
                  </p>
                </div>
              );
            })}
          </Card>
        </section>
      )}

      {resume.educations.length > 0 && (
        <section className="space-y-2">
          <h3 className="font-semibold text-sm flex items-center gap-1">
            <span className="h-2 w-2 bg-accent rounded-full"></span>{" "}
            <GraduationCap className="w-4 h-4 stroke-accent" />
            Education
            <span className="text-xs text-muted-foreground">
              ({resume.educations.length})
            </span>
          </h3>
          <Card className="p-3 gap-1">
            {resume.educations.map((edu, idx) => (
              <div key={idx} className="space-y-1">
                <h3 className="font-semibold text-sm flex items-center gap-1">
                  {edu.degree}
                </h3>
                <p>{edu.school}</p>
                <p className="text-muted-foreground">{edu.date}</p>
              </div>
            ))}
          </Card>
        </section>
      )}
    </div>
  );
};

export default ResumeDetails