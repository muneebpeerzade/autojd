"use client";
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
import { Slider } from "@/components/ui/slider";
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
  SatelliteDish,
  Smile,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

const ToneEnumSchema = z.enum(["corporate", "startup", "academic-research"]);
const StyleEnumSchema = z.enum([
  "direct-and-concise",
  "warm-and-friendly",
  "story-telling",
  "michael-scott",
]);

const IntentEnumSchema = z.enum([
  "application",
  "follow-up",
  "referral",
  "cold-outreach",
  "introduction",
]);
const formSchema = z.object({
  jobDescription: z
    .string()
    .min(
      10,
      "Add more details about the job to create a better personalized email."
    ),
  tone: ToneEnumSchema,
  style: StyleEnumSchema,
  intent: z.array(IntentEnumSchema).min(1, "Please select atleast one intent"),
  wordCount: z
    .number()
    .min(30, "Email should be at least 30 words for meaningful content")
    .max(300, "Keep it under 300 words for better engagement"),
});
export type JobDescriptionFormType = z.infer<typeof formSchema>;
const JobDescriptionForm = ({
  handleFormSubmit,
  resumeDetails,
}: {
  handleFormSubmit: (data: JobDescriptionFormType) => void;
  resumeDetails: Resume | null;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobDescription: "",
      tone: "startup",
      style: "direct-and-concise",
      intent: ["application", "introduction"],
      wordCount: 100,
    },
  });
  const watchIntent = form.watch("intent");
  const watchedTone = form.watch("tone");
  const watchedIntent = form.watch("intent");
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!resumeDetails) {
      toast.error(
        "Almost ready! Please upload your resume so we can personalize your email"
      );
      return;
    }
    handleFormSubmit(values);
  }

  const getButtonLabel = (intent: string[]) => {
    if (intent.length === 0) {
      return "Write My Email";
    }

    if (intent.length > 1) {
      const hasApplication = intent.includes("application");
      const hasFollowUp = intent.includes("follow-up");
      const hasReferral = intent.includes("referral");
      const hasColdOutreach = intent.includes("cold-outreach");

      if (hasApplication && hasReferral && intent.length === 2) {
        return "Write My Referral Request";
      }
      if (hasApplication && hasFollowUp && intent.length === 2) {
        return "Write My Application Follow-Up";
      }
      if (hasReferral && hasColdOutreach && intent.length === 2) {
        return "Write My Referral Outreach";
      }
      if (hasFollowUp && hasColdOutreach && intent.length === 2) {
        return "Write My Follow-Up Message";
      }
      return "Write My Email";
    }

    if (intent.includes("follow-up")) {
      return "Write My Follow-Up";
    }
    if (intent.includes("referral")) {
      return "Write My Referral Email";
    }
    if (intent.includes("cold-outreach")) {
      return "Write My Outreach Email";
    }
    return "Write My Application Email";
  };

  const getSmartWordCountInfo = (
    wordCount: number,
    tone: z.infer<typeof ToneEnumSchema>,
    intent: z.infer<typeof IntentEnumSchema>[]
  ) => {
    // === Tone ranges based on multi-source research ===
    const toneRanges = {
      corporate: {
        ideal: [75, 100],
        max: 125,
        reasoning:
          "Corporate pros scan quickly — 75–100 words yields ~51% response rate (Boomerang, Drip).",
      },
      startup: {
        ideal: [100, 150],
        max: 175,
        reasoning:
          "Startup culture values some storytelling — 100–150 words keeps personality while staying tight.",
      },
      "academic-research": {
        ideal: [150, 200],
        max: 250,
        reasoning:
          "Academic audiences expect detail — 150–200 words balances depth and readability.",
      },
    };

    // === Intent modifiers based on email type research ===
    const intentModifiers = {
      "cold-outreach": 0.9, // Lean shorter (75–125 words sweet spot — Lemlist, Mailmeteor)
      "follow-up": 1.15, // Slightly longer follow-ups perform well (~150 words — Belkins, Artisan)
      referral: 1.05, // Extra context needed without bloating
      application: 1.0, // Baseline
      introduction: 0.7,
    };

    // Calculate composite modifier using arithmetic mean (more predictable)
    let modifier = 1;
    if (intent.length > 0) {
      const mods = intent.map((i) => intentModifiers[i] ?? 1.0);
      modifier = mods.reduce((a, b) => a + b, 0) / mods.length; // arithmetic mean
    }

    const range = toneRanges[tone] || toneRanges.corporate;
    const adjustedIdeal = [
      Math.round(range.ideal[0] * modifier),
      Math.round(range.ideal[1] * modifier),
    ];
    const adjustedMax = Math.round(range.max * modifier);
    const suggestedLength = Math.round(
      (adjustedIdeal[0] + adjustedIdeal[1]) / 2
    );

    // Intent description for messages
    const intentDesc = intent.length > 0 ? intent.join(" + ") : "general";

    // Performance indicator messages
    const getPerformanceIndicator = (status: string) => {
      switch (status) {
        case "short":
          return `📉 Emails ${(
            ((adjustedIdeal[0] - wordCount) / adjustedIdeal[0]) *
            100
          ).toFixed(
            0
          )}% shorter than ideal may drop reply rates by ~7–15% (Boomerang study).`;
        case "long":
          return `📉 Going beyond the ideal by ~${(
            ((wordCount - adjustedIdeal[1]) / adjustedIdeal[1]) *
            100
          ).toFixed(0)}% can reduce replies by 5–12%.`;
        case "perfect":
          return `🎯 You're in the ${adjustedIdeal[0]}–${adjustedIdeal[1]} word sweet spot for ~51% response rate.`;
        default:
          return "";
      }
    };

    // Status classification
    if (wordCount < adjustedIdeal[0]) {
      const shortfallPercentage = Math.round(
        ((adjustedIdeal[0] - wordCount) / adjustedIdeal[0]) * 100
      );
      return {
        status: "short" as const,
        message: `${shortfallPercentage}% below ideal for ${tone} ${intentDesc}, aim for ${adjustedIdeal[0]}–${adjustedIdeal[1]} words.`,
        detailedMessage: getPerformanceIndicator("short"),
        color: "text-amber-600",
        suggestedLength,
        showButton: true,
        adjustedRange: adjustedIdeal,
      };
    } else if (wordCount > adjustedMax) {
      const excessPercentage = Math.round(
        ((wordCount - adjustedMax) / adjustedMax) * 100
      );
      return {
        status: "too-long" as const,
        message: `${excessPercentage}% over max for ${tone} ${intentDesc},keep under ${adjustedMax} words.`,
        detailedMessage: `📉 Past ${adjustedMax} words, attention drops sharply (Drip, Lemlist).`,
        color: "text-red-600",
        suggestedLength,
        showButton: true,
        adjustedRange: adjustedIdeal,
      };
    } else if (wordCount > adjustedIdeal[1]) {
      return {
        status: "long" as const,
        message: `Above ideal but within safe range for ${tone} ${intentDesc} (${adjustedIdeal[0]}–${adjustedIdeal[1]} words).`,
        detailedMessage: getPerformanceIndicator("long"),
        color: "text-yellow-500",
        suggestedLength,
        showButton: true,
        adjustedRange: adjustedIdeal,
      };
    } else {
      return {
        status: "perfect" as const,
        message: `Perfect for ${tone} ${intentDesc} email! `,
        detailedMessage: getPerformanceIndicator("perfect"),
        color: "text-emerald-500",
        suggestedLength,
        showButton: false,
        adjustedRange: adjustedIdeal,
      };
    }
  };

  return (
    <div className="md:pr-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <ToggleGroupItem value="introduction">
                      <MessageSquare className="stroke-muted-foreground" />
                      Introduction
                    </ToggleGroupItem>
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
                      <SatelliteDish className="stroke-muted-foreground" />
                      Cold Outreach
                    </ToggleGroupItem>
                  </ToggleGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="wordCount"
            render={({ field }) => {
              const smartInfo = getSmartWordCountInfo(
                field.value,
                watchedTone,
                watchedIntent
              );
              return (
                <FormItem>
                  <FormLabel>What length works best for you?</FormLabel>
                  <FormControl>
                    <div className="space-y-3 w-full ">
                      {/* Slider */}
                      <Slider
                        value={[field.value]}
                        onValueChange={(values) => field.onChange(values[0])}
                        max={300}
                        min={30}
                        step={1}
                      />
                      {/* Info Box */}
                      <div className="border rounded-lg p-3 bg-muted/20 space-y-2 ">
                        {/* Main Status */}
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col text-sm">
                            <span className="text-muted-foreground">
                              Current word count: {field.value}
                            </span>
                            <span className={smartInfo.color + " font-medium"}>
                              {smartInfo.message}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {smartInfo.detailedMessage}
                            </span>
                          </div>

                          {/* Suggestion Button */}
                          {smartInfo.showButton && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className={`text-xs px-2 py-1`}
                              onClick={() =>
                                field.onChange(smartInfo.suggestedLength)
                              }
                            >
                              Use {smartInfo.suggestedLength} ✨
                            </Button>
                          )}
                        </div>

                        {/* Extra Data */}
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>
                            Ideal range: {smartInfo.adjustedRange[0]} -{" "}
                            {smartInfo.adjustedRange[1]} words
                          </div>
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button type="submit" className="w-full" size="lg">
            <Sparkles className=" h-4 w-4" />
            {getButtonLabel(watchIntent)}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default JobDescriptionForm;
