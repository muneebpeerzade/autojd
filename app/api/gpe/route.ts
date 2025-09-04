import { NextRequest } from "next/server";
import { EmailParametersFormType } from "@/components/Assistant/EmailParametersForm";
import { Resume } from "@/lib/parse-resume-from-pdf/resumeTypes";
import { createDeepSeekClient } from "@/lib/services/deepseek";
import generatePrompts from "@/lib/email-generator/generatePrompts";

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
    const {systemPrompt, userPrompt} = generatePrompts(candidate, emailParameters)
    const deeepseek = createDeepSeekClient();
    const stream = await deeepseek.chat.completions.create({
        messages: [{
            role: "system",
            content:
                systemPrompt
        }, {
            role: "user",
            content:
                userPrompt
        }],
        model: "deepseek-chat",
        stream: true,
        temperature: 1,
    });
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
