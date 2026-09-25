import Anthropic from "@anthropic-ai/sdk";
import { buildCollegeContext, college } from "@/lib/college-data";

export const runtime = "nodejs";

const MODEL = "claude-opus-5";
const MAX_TURNS = 12; // conversation turns kept (user+assistant messages)
const MAX_MESSAGE_LENGTH = 2000;

type ChatMessage = { role: "user" | "assistant"; content: string };

function buildSystemPrompt(): string {
  return `คุณคือ "น้องเทคนิค" ผู้ช่วย AI ประจำเว็บไซต์ของ${college.name} (${college.englishName})
มีหน้าที่ตอบคำถามของนักเรียน นักศึกษา และผู้ปกครองที่สนใจสมัครเรียน โดยใช้ข้อมูลอ้างอิงด้านล่างนี้เท่านั้น

${buildCollegeContext()}

กติกาการตอบ:
- ตอบเป็นภาษาไทยเสมอ ด้วยน้ำเสียงสุภาพ เป็นมิตร กระชับ เข้าใจง่าย เหมาะกับนักเรียนวัยมัธยมและผู้ปกครอง
- ใช้ข้อมูลจากบริบทด้านบนเป็นหลัก ห้ามกุตัวเลข วันที่ หรือรายละเอียดที่ไม่มีอยู่ในบริบท
- หากคำถามอยู่นอกเหนือข้อมูลที่มี ให้บอกตามตรงว่ายังไม่มีข้อมูลส่วนนี้ และแนะนำให้ติดต่องานทะเบียนของวิทยาลัยตามช่องทางที่ให้ไว้
- หากคำถามไม่เกี่ยวข้องกับวิทยาลัย การเรียนการสอน หรือการรับสมัคร ให้ปฏิเสธอย่างสุภาพและชวนกลับมาที่หัวข้อของวิทยาลัย
- ตอบให้กระชับ ไม่ยืดยาวเกินความจำเป็น`;
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

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      "ยังไม่ได้ตั้งค่า ANTHROPIC_API_KEY บนเซิร์ฟเวอร์ กรุณาติดต่อผู้ดูแลระบบเว็บไซต์",
      { status: 500 },
    );
  }

  const client = new Anthropic();
  const encoder = new TextEncoder();

  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const stream = client.messages.stream({
          model: MODEL,
          max_tokens: 2048,
          system: [
            {
              type: "text",
              text: buildSystemPrompt(),
              cache_control: { type: "ephemeral" },
            },
          ],
          output_config: { effort: "low" },
          messages,
        });

        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }

        const finalMessage = await stream.finalMessage();
        if (finalMessage.stop_reason === "refusal") {
          controller.enqueue(
            encoder.encode(
              "\n\nขออภัยค่ะ ไม่สามารถตอบคำถามนี้ได้ กรุณาลองถามใหม่ หรือติดต่องานทะเบียนของวิทยาลัยโดยตรง",
            ),
          );
        }
      } catch (err) {
        const message =
          err instanceof Anthropic.APIError
            ? `เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI (${err.status ?? "unknown"})`
            : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ กรุณาลองใหม่อีกครั้ง";
        controller.enqueue(encoder.encode(`\n\n${message}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
