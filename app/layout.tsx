import type { Metadata } from "next";
import { Lora, Fira_Code, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import { ResumeProvider } from "@/context/ResumeContext";
import { Toaster } from "@/components/ui/sonner";
import SplitButton from "@/components/SplitButton";
//sans
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
// serif
const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});
// mono
const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AutoJD-Smart Job Application Email Generator",
  description:
    "Simplify and personalize job applications using AI  with privacy-first design and a laser-focused UX.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${lora.variable} ${firaCode.variable}  antialiased max-w-[70rem]  mx-auto`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ResumeProvider>
            <Navbar />
            {children}
            <Toaster closeButton richColors />
          </ResumeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
