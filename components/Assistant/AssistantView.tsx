"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  Send,
  Smile,
  Sparkles,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
const AssistantView = () => {
  const [tone, setTone] = useState("corporate");
  const [style, setStyle] = useState("direct-and-concise");
  const [intent, setIntent] = useState<string[]>(["application"]);
  return (
    <div className="flex flex-col justify-between  h-full gap-2">
      <h2 className="scroll-m-20 font-serif  text-3xl font-semibold tracking-tight first:mt-0">
        Paste the Job Description Here
      </h2>
      <Textarea rows={28} className="resize-none" />
      <div className="space-y-1">
        <p className="text-muted-foreground">Tone</p>
        <ToggleGroup
          type="single"
          value={tone}
          onValueChange={(val) => val && setTone(val)}
          variant={"outline"}
          size={"sm"}
          className="gap-2   "
        >
          <ToggleGroupItem value="corporate">
            <BriefcaseBusiness />
            Corporate
          </ToggleGroupItem>
          <ToggleGroupItem value="startup">
            <Rocket />
            Startup
          </ToggleGroupItem>
          <ToggleGroupItem value="c">
            <FlaskConical /> Academic / Research
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="space-y-1">
        <p className="text-muted-foreground">Style</p>
        <ToggleGroup
          type="single"
          value={style}
          onValueChange={(val) => val && setStyle(val)}
          variant={"outline"}
          size={"sm"}
          className="gap-2  "
        >
          <ToggleGroupItem value="direct-and-concise">
            <ArrowRight />
            Direct & Concise
          </ToggleGroupItem>
          <ToggleGroupItem value="warm-and-friendly">
            <Smile />
            Warm & Friendly
          </ToggleGroupItem>
          <ToggleGroupItem value="story-telling">
            <Feather /> Storytelling
          </ToggleGroupItem>
          <ToggleGroupItem
            value="michael-scott"
            className="text-destructive-foreground bg-destructive"
          >
            <Coffee /> Michael Scott
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="space-y-1">
        <p className="text-muted-foreground">Intent</p>
        <ToggleGroup
          type="multiple"
          value={intent}
          onValueChange={(val) => val && setIntent(val)}
          variant={"outline"}
          size={"sm"}
          className="gap-2  "
        >
          <ToggleGroupItem value="application">
            <FileText />
            Application
          </ToggleGroupItem>
          <ToggleGroupItem value="follow-up">
            <Repeat />
            Follow Up
          </ToggleGroupItem>
          <ToggleGroupItem value="referral">
            <Handshake /> Referral
          </ToggleGroupItem>
          <ToggleGroupItem value="cold-outreach">
            <MessageSquare />
            Cold Outreach
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <Button className="w-full" size={"lg"}>
        <Sparkles className="" />
        Generate Email
      </Button>
    </div>
  );
};

export default AssistantView;
