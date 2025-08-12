"use client";
// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   ArrowRight,
//   BriefcaseBusiness,
//   Coffee,
//   Feather,
//   FileText,
//   FlaskConical,
//   Handshake,
//   MessageSquare,
//   Repeat,
//   Rocket,
//   Send,
//   Smile,
//   Sparkles,
// } from "lucide-react";
// import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
// import { Resume } from "@/lib/parse-resume-from-pdf/resumeTypes";

// // Zod-like validation schema
// const validateFormData = (data: {
//   jobDescription: string;
//   tone: string;
//   style: string;
//   intent: string[];
// }) => {
//   const errors: { [key: string]: string } = {};

//   if (data.jobDescription.length < 10) {
//     errors.jobDescription =
//       "Job description must be at least 10 characters long.";
//   }

//   if (!data.tone) {
//     errors.tone = "Please select a tone.";
//   }

//   if (!data.style) {
//     errors.style = "Please select a style.";
//   }

//   if (data.intent.length === 0) {
//     errors.intent = "Please select at least one intent.";
//   }

//   return {
//     isValid: Object.keys(errors).length === 0,
//     errors,
//   };
// };

// export type FormData = {
//   jobDescription: string;
//   tone: string;
//   style: string;
//   intent: string[];
// };

// // Separate JobDescriptionForm component
// const JobDescriptionForm = ({
//   onSubmit,
//   resumeDetails,
// }: {
//   onSubmit: (data: FormData) => void;
//   resumeDetails: Resume | null;
// }) => {
//   const [formData, setFormData] = useState<FormData>({
//     jobDescription: "",
//     tone: "corporate",
//     style: "direct-and-concise",
//     intent: ["application"],
//   });

//   const [errors, setErrors] = useState<{ [key: string]: string }>({});

//   const handleSubmit = () => {
//     const validation = validateFormData(formData);
//     if (validation.isValid) {
//       setErrors({});
//       onSubmit(formData);
//     } else {
//       setErrors(validation.errors);
//     }
//   };

//   return (
//     <div className="flex flex-col  h-full gap-2">
//       <div className="space-y-4">
//         <h2 className="scroll-m-20 font-serif text-3xl font-semibold tracking-tight first:mt-0">
//           Paste the Job Description Here
//         </h2>

//         <div className="space-y-2">
//           <Textarea
//             rows={24}
//             className="resize-none"
//             placeholder="Enter the job description..."
//             value={formData.jobDescription}
//             onChange={(e) =>
//               setFormData((prev) => ({
//                 ...prev,
//                 jobDescription: e.target.value,
//               }))
//             }
//           />
//           {errors.jobDescription && (
//             <p className="text-sm text-destructive">{errors.jobDescription}</p>
//           )}
//         </div>

//         <div className="space-y-1">
//           <p className="text-muted-foreground">Tone</p>
//           <ToggleGroup
//             type="single"
//             value={formData.tone}
//             onValueChange={(val) =>
//               val && setFormData((prev) => ({ ...prev, tone: val }))
//             }
//             variant="outline"
//             size="sm"
//             className="gap-2"
//           >
//             <ToggleGroupItem value="corporate">
//               <BriefcaseBusiness className="stroke-muted-foreground" />
//               Corporate
//             </ToggleGroupItem>
//             <ToggleGroupItem value="startup">
//               <Rocket className="stroke-muted-foreground" />
//               Startup
//             </ToggleGroupItem>
//             <ToggleGroupItem value="academic">
//               <FlaskConical className="stroke-muted-foreground" />
//               Academic / Research
//             </ToggleGroupItem>
//           </ToggleGroup>
//           {errors.tone && (
//             <p className="text-sm text-destructive">{errors.tone}</p>
//           )}
//         </div>

//         <div className="space-y-1">
//           <p className="text-muted-foreground">Style</p>
//           <ToggleGroup
//             type="single"
//             value={formData.style}
//             onValueChange={(val) =>
//               val && setFormData((prev) => ({ ...prev, style: val }))
//             }
//             variant="outline"
//             size="sm"
//             className="gap-2"
//           >
//             <ToggleGroupItem value="direct-and-concise">
//               <ArrowRight className="stroke-muted-foreground" />
//               Direct & Concise
//             </ToggleGroupItem>
//             <ToggleGroupItem value="warm-and-friendly">
//               <Smile className="stroke-muted-foreground" />
//               Warm & Friendly
//             </ToggleGroupItem>
//             <ToggleGroupItem value="story-telling">
//               <Feather className="stroke-muted-foreground" />
//               Storytelling
//             </ToggleGroupItem>
//             <ToggleGroupItem
//               value="michael-scott"
//               className="group border-dashed text-primary"
//             >
//               <Coffee className="group-hover:animate-spin stroke-primary" />
//               Michael Scott
//             </ToggleGroupItem>
//           </ToggleGroup>
//           {errors.style && (
//             <p className="text-sm text-destructive">{errors.style}</p>
//           )}
//         </div>

//         <div className="space-y-1">
//           <p className="text-muted-foreground">Intent</p>
//           <ToggleGroup
//             type="multiple"
//             value={formData.intent}
//             onValueChange={(val) =>
//               val && setFormData((prev) => ({ ...prev, intent: val }))
//             }
//             variant="outline"
//             size="sm"
//             className="gap-2"
//           >
//             <ToggleGroupItem value="application">
//               <FileText className="stroke-muted-foreground" />
//               Application
//             </ToggleGroupItem>
//             <ToggleGroupItem value="follow-up">
//               <Repeat className="stroke-muted-foreground" />
//               Follow Up
//             </ToggleGroupItem>
//             <ToggleGroupItem value="referral">
//               <Handshake className="stroke-muted-foreground" />
//               Referral
//             </ToggleGroupItem>
//             <ToggleGroupItem value="cold-outreach">
//               <MessageSquare className="stroke-muted-foreground" />
//               Cold Outreach
//             </ToggleGroupItem>
//           </ToggleGroup>
//           {errors.intent && (
//             <p className="text-sm text-destructive">{errors.intent}</p>
//           )}
//         </div>
//       </div>

//       <Button onClick={handleSubmit} className="w-full mt-4" size="lg">
//         <Sparkles />
//         Generate Email
//       </Button>
//     </div>
//   );
// };

// export default JobDescriptionForm;

import { Resume } from "@/lib/parse-resume-from-pdf/resumeTypes";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  ArrowRight,
  BriefcaseBusiness,
  Coffee,
  Feather,
  FileText,
  FlaskConical,
  Handshake,
  MessageSquare,
  Repeat,
  Rocket,
  Smile,
  Sparkles,
} from "lucide-react";
import { toast, Toaster } from "sonner";

const IntentEnumSchema = z.enum([
  "application",
  "follow-up",
  "referral",
  "cold-outreach",
]);
const formSchema = z.object({
  jobDescription: z
    .string()
    .min(
      10,
      "Add more details about the job to create a better personalized email."
    ),
  tone: z.enum(["corporate", "startup", "academic-research"], {}),
  style: z.enum([
    "direct-and-concise",
    "warm-and-friendly",
    "story-telling",
    "michael-scott",
  ]),
  intent: z.array(IntentEnumSchema).min(1, "Please select atleast one intent"),
});

const JobDescriptionForm = ({
  handleFormSubmit,
  resumeDetails,
}: {
  handleFormSubmit: (data: FormData) => void;
  resumeDetails: Resume | null;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobDescription: "",
      tone: "corporate",
      style: "direct-and-concise",
      intent: ["application"],
    },
  });
  const intentValue = form.watch("intent");
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!resumeDetails) {
      form.setError("root", {
        type: "manual",
        message: "Please drop your resume before submitting.",
      });
      toast.error(" Please drop your resume before submitting.");
      return;
    }
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  const getButtonLabel = (intent: string[]) => {
    if (intent.length === 0) {
      return "Generate Email";
    }

    if (intent.length > 1) {
      const hasApplication = intent.includes("application");
      const hasFollowUp = intent.includes("follow-up");
      const hasReferral = intent.includes("referral");
      const hasColdOutreach = intent.includes("cold-outreach");

      if (hasApplication && hasReferral && intent.length === 2) {
        return "Generate Referral Application";
      }
      if (hasApplication && hasFollowUp && intent.length === 2) {
        return "Generate Application Follow-Up";
      }
      if (hasReferral && hasColdOutreach && intent.length === 2) {
        return "Generate Referral Outreach";
      }
      if (hasFollowUp && hasColdOutreach && intent.length === 2) {
        return "Generate Follow-Up Outreach";
      }

      return "Generate Multi-Purpose Email";
    }

    if (intent.includes("follow-up")) {
      return "Generate Follow-Up Email";
    }
    if (intent.includes("referral")) {
      return "Create Referral Email";
    }
    if (intent.includes("cold-outreach")) {
      return "Generate Outreach Email";
    }
    return "Generate Application Email";
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="jobDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-serif text-2xl font-medium">
                  Job Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Paste the job description to generate your personalized application email ✨"
                    rows={26}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How should you sound ?</FormLabel>
                <FormControl>
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    value={field.value}
                    onValueChange={(value) => {
                      if (value) {
                        field.onChange(value);
                      }
                    }}
                  >
                    <ToggleGroupItem value="corporate">
                      <BriefcaseBusiness className="stroke-muted-foreground" />
                      Corporate
                    </ToggleGroupItem>
                    <ToggleGroupItem value="startup">
                      <Rocket className="stroke-muted-foreground" />
                      Startup
                    </ToggleGroupItem>
                    <ToggleGroupItem value="academic-research">
                      <FlaskConical className="stroke-muted-foreground" />
                      Academic / Research
                    </ToggleGroupItem>
                  </ToggleGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="style"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What's your writing style ?</FormLabel>
                <FormControl>
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    value={field.value}
                    onValueChange={(value) => {
                      if (value) {
                        field.onChange(value);
                      }
                    }}
                  >
                    <ToggleGroupItem value="direct-and-concise">
                      <ArrowRight className="stroke-muted-foreground" />
                      Direct & Concise
                    </ToggleGroupItem>
                    <ToggleGroupItem value="warm-and-friendly">
                      <Smile className="stroke-muted-foreground" />
                      Warm & Friendly
                    </ToggleGroupItem>
                    <ToggleGroupItem value="story-telling">
                      <Feather className="stroke-muted-foreground" />
                      Storytelling
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="michael-scott"
                      className="group border-dashed text-primary"
                    >
                      <Coffee className="group-hover:animate-spin stroke-primary" />
                      Michael Scott
                    </ToggleGroupItem>
                  </ToggleGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="intent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What's this email for ?</FormLabel>
                <FormControl>
                  <ToggleGroup
                    type="multiple"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    value={field.value}
                    onValueChange={(value) => {
                      if (value.length > 0) {
                        field.onChange(value);
                      }
                    }}
                  >
                    <ToggleGroupItem value="application">
                      <FileText className="stroke-muted-foreground" />
                      Application
                    </ToggleGroupItem>
                    <ToggleGroupItem value="follow-up">
                      <Repeat className="stroke-muted-foreground" />
                      Follow Up
                    </ToggleGroupItem>
                    <ToggleGroupItem value="referral">
                      <Handshake className="stroke-muted-foreground" />
                      Referral
                    </ToggleGroupItem>
                    <ToggleGroupItem value="cold-outreach">
                      <MessageSquare className="stroke-muted-foreground" />
                      Cold Outreach
                    </ToggleGroupItem>
                  </ToggleGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" size="lg">
            <Sparkles className="mr-2 h-4 w-4" />
            {getButtonLabel(intentValue)}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default JobDescriptionForm;
