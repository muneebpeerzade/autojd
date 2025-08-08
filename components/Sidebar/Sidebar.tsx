"use client";
import React from "react";
import Toolbar from "@/components/Sidebar/Toolbar";
import { useState } from "react";
import FileUploadForm from "./FileUploadForm/FileUploadForm";
import { Resume } from "@/lib/parse-resume-from-pdf/resumeTypes";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Mail,
  Phone,
  Globe,
  Calendar,
  Building,
  GraduationCap,
  Code,
  Star,
} from "lucide-react";

const Sidebar = () => {
  const [resumeDetails, setResumeDetails] = useState<Resume | null>(null);

  const saveResumeDetails = (values: Resume | null) => {
    setResumeDetails(values);
    if (!values) {
      console.warn("No resume data provided");
      return;
    }
    console.log("Profile");
    console.table(values.profile);
    console.log("Work Experiences", values.workExperiences.length);
    console.log(values.workExperiences);
    console.log("Educations");
    console.table(values.educations);
    console.log("Projects");
    console.table(values.projects);
    console.log("Skills");
    console.table(values.skills);
    console.log("Custom");
    console.table(values.custom);
  };

  return (
    <div className="border rounded p-2 space-y-2">
      <FileUploadForm onResumeSave={saveResumeDetails} />
      {resumeDetails ? <ResumeDetails resume={resumeDetails} /> : null}
    </div>
  );
};

export default Sidebar;

const ResumeDetails = ({ resume }: { resume: Resume }) => {
  return (
    <div className="space-y-3 text-xs">
      {/* Profile Section */}
      <section className="space-y-2">
        <h3 className="font-semibold text-sm flex items-center gap-1">
          <span className="h-2 w-2 bg-accent rounded-full"></span> Profile
        </h3>
        <Card className="p-3">
          <div className="space-y-1 text-xs text-muted-foreground">
            <h4 className="font-medium text-sm text-foreground">{resume.profile.name}</h4>
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
        <section className="">
          <h3 className="font-semibold text-sm flex items-center gap-1">
            <span className="h-2 w-2 bg-accent rounded-full"></span> Work
            Experience
          </h3>
          <Card className="p-3">
    
          </Card>
        </section>
      )}
    </div>
  );
};

// <div className="space-y-3 text-xs">
//   {/* Profile Section */}
//   <section className="space-y-2">
//     <h3 className="font-semibold text-sm flex items-center gap-1">
//       <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//       Profile
//     </h3>
//     <Card className="p-3">
//       <div className="space-y-2">
//         <h4 className="font-medium text-sm">{resume.profile.name}</h4>
//   <div className="space-y-1 text-xs text-muted-foreground">
//     {resume.profile.email && (
//       <div className="flex items-center gap-1">
//         <Mail className="w-3 h-3" />
//         <span className="truncate">{resume.profile.email}</span>
//       </div>
//     )}
//     {resume.profile.phone && (
//       <div className="flex items-center gap-1">
//         <Phone className="w-3 h-3" />
//         <span>{resume.profile.phone}</span>
//       </div>
//     )}
//     {resume.profile.location && (
//       <div className="flex items-center gap-1">
//         <MapPin className="w-3 h-3" />
//         <span>{resume.profile.location}</span>
//       </div>
//     )}
//     {resume.profile.url && (
//       <div className="flex items-center gap-1">
//         <Globe className="w-3 h-3" />
//         <span className="truncate">{resume.profile.url}</span>
//       </div>
//     )}
//   </div>
//   {resume.profile.summary && (
//     <p className="text-xs text-muted-foreground line-clamp-3 mt-2">
//       {resume.profile.summary}
//     </p>
//   )}
// </div>
//     </Card>
//   </section>

//   {/* Work Experience Section */}
//   {resume.workExperiences.length > 0 && (
//     <section className="space-y-2">
//       <h3 className="font-semibold text-sm flex items-center gap-1">
//         <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//         Experience ({resume.workExperiences.length})
//       </h3>
//       <div className="space-y-2">
//         {resume.workExperiences.slice(0, 3).map((exp, index) => (
//           <Card key={index} className="p-3">
//             <div className="space-y-1">
//               <div className="flex items-start justify-between">
//                 <h4 className="font-medium text-xs leading-tight">{exp.jobTitle}</h4>
//                 {exp.date && (
//                   <Badge variant="outline" className="text-[10px] px-1 py-0">
//                     {exp.date}
//                   </Badge>
//                 )}
//               </div>
//               <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
//                 <Building className="w-3 h-3" />
//                 <span>{exp.company}</span>
//               </div>
//               {exp.descriptions.length > 0 && (
//                 <p className="text-[11px] text-muted-foreground line-clamp-2">
//                   {exp.descriptions[0]}
//                 </p>
//               )}
//             </div>
//           </Card>
//         ))}
//         {resume.workExperiences.length > 3 && (
//           <p className="text-[11px] text-muted-foreground text-center">
//             +{resume.workExperiences.length - 3} more experiences
//           </p>
//         )}
//       </div>
//     </section>
//   )}

//   {/* Education Section */}
//   {resume.educations.length > 0 && (
//     <section className="space-y-2">
//       <h3 className="font-semibold text-sm flex items-center gap-1">
//         <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
//         Education ({resume.educations.length})
//       </h3>
//       <div className="space-y-2">
//         {resume.educations.slice(0, 2).map((edu, index) => (
//           <Card key={index} className="p-3">
//             <div className="space-y-1">
//               <div className="flex items-start justify-between">
//                 <h4 className="font-medium text-xs leading-tight">{edu.degree}</h4>
//                 {edu.date && (
//                   <Badge variant="outline" className="text-[10px] px-1 py-0">
//                     {edu.date}
//                   </Badge>
//                 )}
//               </div>
//               <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
//                 <GraduationCap className="w-3 h-3" />
//                 <span>{edu.school}</span>
//               </div>
//               {edu.gpa && (
//                 <p className="text-[11px] text-muted-foreground">GPA: {edu.gpa}</p>
//               )}
//             </div>
//           </Card>
//         ))}
//         {resume.educations.length > 2 && (
//           <p className="text-[11px] text-muted-foreground text-center">
//             +{resume.educations.length - 2} more education entries
//           </p>
//         )}
//       </div>
//     </section>
//   )}

//   {/* Skills Section */}
//   {(resume.skills.featuredSkills.length > 0 || resume.skills.descriptions.length > 0) && (
//     <section className="space-y-2">
//       <h3 className="font-semibold text-sm flex items-center gap-1">
//         <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
//         Skills
//       </h3>
//       <Card className="p-3">
//         <div className="space-y-2">
//           {resume.skills.featuredSkills.length > 0 && (
//             <div className="space-y-2">
//               <h4 className="text-xs font-medium">Featured Skills</h4>
//               <div className="space-y-1">
//                 {resume.skills.featuredSkills.slice(0, 5).map((skill, index) => (
//                   <div key={index} className="flex items-center justify-between">
//                     <span className="text-[11px]">{skill.skill}</span>

//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//           {resume.skills.descriptions.length > 0 && (
//             <div className="flex flex-wrap gap-4">
//               {resume.skills.descriptions.slice(0, 8).map((skill, index) => (
//                 <Badge key={index} variant="secondary" className="text-[10px] px-1 py-0">
//                   {skill}
//                 </Badge>
//               ))}
//               {resume.skills.descriptions.length > 8 && (
//                 <Badge variant="outline" className="text-[10px] px-1 py-0">
//                   +{resume.skills.descriptions.length - 8}
//                 </Badge>
//               )}
//             </div>
//           )}
//         </div>
//       </Card>
//     </section>
//   )}

//   {/* Projects Section */}
//   {resume.projects.length > 0 && (
//     <section className="space-y-2">
//       <h3 className="font-semibold text-sm flex items-center gap-1">
//         <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
//         Projects ({resume.projects.length})
//       </h3>
//       <div className="space-y-2">
//         {resume.projects.slice(0, 3).map((project, index) => (
//           <Card key={index} className="p-3">
//             <div className="space-y-1">
//               <div className="flex items-start justify-between">
//                 <h4 className="font-medium text-xs leading-tight">{project.project}</h4>
//                 {project.date && (
//                   <Badge variant="outline" className="text-[10px] px-1 py-0">
//                     {project.date}
//                   </Badge>
//                 )}
//               </div>
//               {project.descriptions.length > 0 && (
//                 <p className="text-[11px] text-muted-foreground line-clamp-2">
//                   {project.descriptions[0]}
//                 </p>
//               )}
//             </div>
//           </Card>
//         ))}
//         {resume.projects.length > 3 && (
//           <p className="text-[11px] text-muted-foreground text-center">
//             +{resume.projects.length - 3} more projects
//           </p>
//         )}
//       </div>
//     </section>
//   )}

//   {/* Custom Section */}
//   {resume.custom.descriptions.length > 0 && (
//     <section className="space-y-2">
//       <h3 className="font-semibold text-sm flex items-center gap-1">
//         <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
//         Additional Info
//       </h3>
//       <Card className="p-3">
//         <div className="space-y-1">
//           {resume.custom.descriptions.slice(0, 3).map((desc, index) => (
//             <p key={index} className="text-[11px] text-muted-foreground">
//               • {desc}
//             </p>
//           ))}
//           {resume.custom.descriptions.length > 3 && (
//             <p className="text-[11px] text-muted-foreground">
//               +{resume.custom.descriptions.length - 3} more items
//             </p>
//           )}
//         </div>
//       </Card>
//     </section>
//   )}
// </div>
