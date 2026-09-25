import { buildCollegeContext, college } from "@/lib/college-data";

export const runtime = "nodejs";

// รันโมเดลผ่าน Ollama (โฮสต์เอง ไม่มีค่าใช้จ่าย) แทน Claude API
// เปลี่ยนโมเดล/ที่อยู่เซิร์ฟเวอร์ได้ผ่านตัวแปรแวดล้อม OLLAMA_MODEL / OLLAMA_BASE_URL
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "llama3.2:3b";

const MAX_TURNS = 12; // conversation turns kept (user+assistant messages)
const MAX_MESSAGE_LENGTH = 2000;

type ChatMessage = { role: "user" | "assistant"; content: string };

function buildSystemPrompt(): string {
  return `คุณคือ "น้องเทคนิค" ผู้ช่วย AI ประจำเว็บไซต์ของ${college.name} (${college.englishName})
มีหน้าที่ตอบคำถามของนักเรียน นักศึกษา และผู้ปกครองที่สนใจสมัครเรียน โดยใช้ข้อมูลอ้างอิงด้านล่างนี้เท่านั้น

${buildCollegeContext()}

กติกาการตอบ:
- ตอบคำถามของผู้ใช้โดยตรงทันที ห้ามถามกลับหรือขอให้ผู้ใช้พูดใหม่ ถ้ามีข้อมูลอยู่แล้วให้ตอบเลย
- ตอบเป็นภาษาไทยเสมอ ด้วยน้ำเสียงสุภาพ เป็นมิตร กระชับ เข้าใจง่าย เหมาะกับนักเรียนวัยมัธยมและผู้ปกครอง
- ใช้ข้อมูลจากบริบทด้านบนเป็นหลัก ห้ามกุตัวเลข วันที่ หรือรายละเอียดที่ไม่มีอยู่ในบริบท
- หากคำถามอยู่นอกเหนือข้อมูลที่มี ให้บอกตามตรงว่ายังไม่มีข้อมูลส่วนนี้ และแนะนำให้ติดต่องานทะเบียนของวิทยาลัยตามช่องทางที่ให้ไว้
- หากคำถามไม่เกี่ยวข้องกับวิทยาลัย การเรียนการสอน หรือการรับสมัคร ให้ปฏิเสธอย่างสุภาพและชวนกลับมาที่หัวข้อของวิทยาลัย
- ตอบให้กระชับที่สุด ไม่เกิน 3-4 ประโยค`;
}

function sanitizeMessages(raw: unknown): ChatMessage[] {
  if (!Array.isArray(raw)) return [];
  const cleaned: ChatMessage[] = [];
  for (const item of raw) {
    if (
      item &&
      typeof item === "object" &&
      (item as { role?: unknown }).role &&
      typeof (item as { content?: unknown }).content === "string"
    ) {
      const role = (item as { role: unknown }).role;
      if (role !== "user" && role !== "assistant") continue;
      const content = (item as { content: string }).content.slice(0, MAX_MESSAGE_LENGTH);
      if (content.trim().length === 0) continue;
      cleaned.push({ role, content });
    }
  }
  // เก็บเฉพาะบทสนทนาล่าสุด และให้ข้อความแรกต้องเป็นของ user เสมอ
  const trimmed = cleaned.slice(-MAX_TURNS);
  const firstUserIndex = trimmed.findIndex((m) => m.role === "user");
  return firstUserIndex === -1 ? [] : trimmed.slice(firstUserIndex);
}

type OllamaChatChunk = {
  message?: { content?: string };
  done?: boolean;
  error?: string;
};

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("คำขอไม่ถูกต้อง", { status: 400 });
  }

  const messages = sanitizeMessages(
    (body as { messages?: unknown } | null)?.messages,
  );
  if (messages.length === 0) {
    return new Response("กรุณาระบุข้อความคำถาม", { status: 400 });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const ollamaRes = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: OLLAMA_MODEL,
            messages: [{ role: "system", content: buildSystemPrompt() }, ...messages],
            stream: true,
            options: { num_predict: 300 },
          }),
        });

        if (!ollamaRes.ok || !ollamaRes.body) {
          throw new Error(`Ollama responded with status ${ollamaRes.status}`);
        }

        const reader = ollamaRes.body.getReader();
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.trim()) continue;
            let chunk: OllamaChatChunk;
            try {
              chunk = JSON.parse(line);
            } catch {
              continue;
            }
            if (chunk.error) {
              throw new Error(chunk.error);
            }
            if (chunk.message?.content) {
              controller.enqueue(encoder.encode(chunk.message.content));
            }
          }
        }
      } catch (err) {
        console.error("Ollama error:", err);
        controller.enqueue(
          encoder.encode(
            `\n\nไม่สามารถเชื่อมต่อกับ AI ได้ กรุณาตรวจสอบว่า Ollama กำลังทำงานอยู่ (${OLLAMA_BASE_URL}) และดาวน์โหลดโมเดล "${OLLAMA_MODEL}" เรียบร้อยแล้ว`,
          ),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
