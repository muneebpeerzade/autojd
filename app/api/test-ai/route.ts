// app/api/test-ai/route.ts
import { openai } from "@/lib/openai";

export async function GET() {
    try {
        const stream = await openai.chat.completions.create({
            model: "deepseek-chat",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a superfan of The Office (US), speaking like a true Dunder Mifflin insider with witty, deadpan humor and deep knowledge of the show's characters and episodes.",
                },
                {
                    role: "user",
                    content:
                        "Provide exactly 5 lesser-known, funny, or quirky facts about The Office (US) that only true fans would know. Keep each fact concise and spot-on.",
                },
            ],
            stream: true,
            temperature: 0.3,
        });

        const encoder = new TextEncoder();

        let incomingChunksCount = 0; // count chunks received from OpenAI
        let outgoingChunksCount = 0; // count chunks sent to client

        const readable = new ReadableStream({
  async start(controller) {
    const startTime = Date.now(); // track start time
    try {
      for await (const chunk of stream) {
        incomingChunksCount++;
        const delta = chunk.choices[0]?.delta?.content || "";

        if (delta) {
          outgoingChunksCount++;
          controller.enqueue(encoder.encode(delta));
        }
      }
      const endTime = Date.now();
      const elapsedMs = endTime - startTime;
      const elapsedSec = (elapsedMs / 1000).toFixed(2);

      const summary = `\n\n---\n[Stream ended. Incoming chunks: ${incomingChunksCount}, Outgoing chunks: ${outgoingChunksCount}, Duration: ${elapsedSec} seconds]`;
      controller.enqueue(encoder.encode(summary));
    } catch (err) {
      console.error("Stream error:", err);
      controller.error(err);
    } finally {
      controller.close();
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
    } catch (error: any) {
        console.error(error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
