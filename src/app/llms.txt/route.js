import { createLlmsText } from "@/lib/agent/llms.js";

export const revalidate = 3600;

export function GET() {
  return new Response(createLlmsText(), {
    headers: {
      "Cache-Control": "public, max-age=3600, must-revalidate",
      "Content-Type": "text/plain; charset=utf-8",
      Link: "</llms.txt>; rel=\"self\"",
    },
  });
}
