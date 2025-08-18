import { DraftingCompass } from "lucide-react";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import LinkedingLogo from "@/public/InBugWhite.png";
const Navbar = () => {
  return (
    <nav className="h-16  py-10 flex items-center justify-between border-b lg:border-0 px-6 lg:px-0">
      <Link
        href={"/"}
        className="flex items-center gap-2 hover:bg-primary/20 px-2 py-1 rounded group transition-colors duration-150"
      >
        <DraftingCompass className="h-6 w-6  stroke-secondary group-hover:stroke-primary" />
        <h1 className="scroll-m-20 text-2xl  tracking-tight text-primary  font-serif ">
          autoJD
        </h1>
      </Link>
      <div className="flex items-center gap-8">
        <Link
          href={"https://github.com/muneebpeerzade/autojd"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="./github-mark-white.svg"
            width={24}
            height={24}
            alt="github-link"
            priority
          />
        </Link>
        <Link
          href={"https://www.linkedin.com/in/muneeb-peerzade/"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={LinkedingLogo}
            width={24}
            height={24}
            alt="github-link"
            priority
          />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
