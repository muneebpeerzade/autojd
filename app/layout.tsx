import type { Metadata } from "next";
import { Geist, Lora, Fira_Code } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import { ResumeProvider } from "@/context/ResumeContext";
//sans
const geistSans = Geist({
  variable: "--font-geist-sans",
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
        className={`${geistSans.variable} ${lora.variable} ${firaCode.variable}  antialiased max-w-[70rem]  mx-auto`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ResumeProvider>
            <Navbar />
            {children}
          </ResumeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
