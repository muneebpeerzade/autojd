"use client";
import React, { JSX } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, X } from "lucide-react";
import LinkedInBlueLogo from "@/public/LI-In-Bug.png";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";

type Platform = "email" | "y-combinator" | "wellfound" | "linkedin";

interface SplitButtonProps {
  form: UseFormReturn<any>; // You can type this more specifically if needed
  fieldName?: string; // defaults to "platform", but you can specify "platfrom" if that's your typo
}

const SplitButton = ({ form, fieldName = "platform" }: SplitButtonProps) => {
  // Get the current platform value from the form
  const currentPlatform = form.watch(fieldName) as Platform;
  
  const platformConfig: Record<
    Platform,
    {
      label: string;
      icon: JSX.Element;
      color: string;
    }
  > = {
    email: {
      label: "Create Personalized Email",
      icon: <Mail className="h-5 w-5 mr-1" />,
      color: "divide-gray-500",
    },
    wellfound: {
      label: "Personalized message on company interests",
      icon: <WellFoundIcon />,
      color: "divide-red-500",
    },
    "y-combinator": {
      label: "Write personalized message for the team",
      icon: <YCombinatorIcon />,
      color: "divide-orange-500",
    },
    linkedin: {
      label: "Personalized Referral Message",
      icon: <LinkedingBlueIcon />,
      color: "divide-blue-500",
    },
  };

  const { label, icon, color } = platformConfig[currentPlatform];

  const handlePlatformChange = (newPlatform: Platform) => {
    form.setValue(fieldName, newPlatform);
    // Trigger validation if needed
    form.trigger(fieldName);
  };

  return (
    <div
      className={cn(
        "[&>*]:rounded-none z-50 flex [&>button:first-child]:rounded-l [&>button:last-child]:rounded-r divide-x-2",
        color
      )}
    >
      <Button type="submit" className="flex-1" size={"lg"}>
        <Sparkles className="h-4 w-4 " />
        {label}
      </Button>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button type="button" size={"lg"} variant={"secondary"} className="">
            {icon}
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent align="center" className="">
            <DropdownMenuLabel className="flex items-center justify-between gap-2">
              Platforms
              <Button size="icon" variant="ghost" className="h-5 w-5">
                <X />
              </Button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handlePlatformChange("email")}>
              <Mail className="h-5 w-5 mr-1" /> Email
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handlePlatformChange("wellfound")}>
              <WellFoundIcon />
              What interests you about working for this company?
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handlePlatformChange("y-combinator")}>
              <YCombinatorIcon />
              Start a conversation with the team
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handlePlatformChange("linkedin")}>
              <LinkedingBlueIcon />
              Referral Message
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    </div>
  );
};

export default SplitButton;

function WellFoundIcon() {
  return (
    <p className="h-5 w-5 flex items-center justify-center font-bold py-2 mr-1 ">
      w<span className="text-red-500">:</span>
    </p>
  );
}

function YCombinatorIcon() {
  return (
    <p className="h-5 w-5 flex items-center justify-center bg-orange-500 py-2 mr-1">
      Y
    </p>
  );
}

function LinkedingBlueIcon() {
  return (
    <div className="h-fit w-5 mr-1">
      <Image
        src={LinkedInBlueLogo}
        className="h-full w-full"
        alt="linkedin-logo"
      />
    </div>
  );
}