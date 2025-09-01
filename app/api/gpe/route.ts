import { NextRequest } from "next/server";
import { EmailParametersFormType } from "@/components/Assistant/EmailParametersForm";
import { Resume } from "@/lib/parse-resume-from-pdf/resumeTypes";
import { createDeepSeekClient } from "@/lib/services/deepseek";

export async function POST(request: NextRequest) {
    const { candidate, emailParameters }: {
        candidate: Resume;
        emailParameters: EmailParametersFormType;
    } = await request.json();

    if (!candidate || !emailParameters) {
        return new Response(
            JSON.stringify({ error: "Missing Required Fields" }),
            { status: 400, headers: { "Content-Type": "application/json" } },
        );
    }
    // console.log("Resume Details: ", candidate);
    // console.log("emailParameters: ", emailParameters);
    const deeepseek = createDeepSeekClient();
    const stream = await deeepseek.chat.completions.create({
        messages: [{
            role: "system",
            content:
                "You are an expert email writer for candidates that write personalized email to the companies based on the candidates detail",
        }, {
            role: "user",
            content:
                `Write a professional email for candidate ${candidate.profile.name} applying for ${emailParameters.jobDescription}`,
        }],
        model: "deepseek-chat",
        stream: true,
        temperature: 1,
    });
    // for await (const chunk of stream) {
    //     const content = chunk?.choices?.[0]?.delta?.content;
    //     if (content) {
    //         console.log(content); // logs as chunks arrive
    //     }

    //     // If model signals end-of-stream, break
    //     if (chunk.choices?.[0]?.finish_reason) {
    //         console.log("Stream finished:", chunk.choices[0].finish_reason);
    //         break;
    //     }
    // }
    const readableStream = new ReadableStream({
        async start(controller) {
            try {
                for await (const chunk of stream) {
                    const content = chunk.choices?.[0].delta?.content;
                    if (content) {
                        controller.enqueue(new TextEncoder().encode(content));
                    }
                    if (chunk.choices?.[0].finish_reason) {
                        controller.close();
                        break;
                    }
                }
            } catch (error) {
                controller.error(error);
            }
        },
    });
    return new Response(readableStream, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache",
        },
    });
}
