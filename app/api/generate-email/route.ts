import { NextRequest } from "next/server";
import { JobDescriptionFormType } from "@/components/Assistant/JobDescriptionForm";
import { Resume } from "@/lib/parse-resume-from-pdf/resumeTypes";
import { generateEmailStream } from "@/lib/email-generator/email-service";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { resumeDetails, jobDescriptionDetails }: {
      resumeDetails: Resume;
      jobDescriptionDetails: JobDescriptionFormType;
    } = await request.json();

    // Validate required fields
    if (!resumeDetails || !jobDescriptionDetails) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Generate email stream using the service
    const stream = await generateEmailStream(resumeDetails, jobDescriptionDetails);

    // Create a ReadableStream to handle the streaming response
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (error) {
    console.error("Error generating email:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate personalized email" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}