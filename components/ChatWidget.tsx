"use client";

import { useEffect, useRef, useState } from "react";

type ChatMessage = { role: "user" | "assistant"; content: string };

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "สวัสดีค่ะ หนูชื่อ \"น้องเทคนิค\" ผู้ช่วย AI ของวิทยาลัยเทคนิคชัยภูมิ 🤖\nสอบถามเรื่องสาขาวิชา การรับสมัคร หรือข้อมูลทั่วไปของวิทยาลัยได้เลยค่ะ",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || isStreaming) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput("");
    setIsStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.body) throw new Error("no response body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      if (!res.ok) {
        const errText = await res.text();
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: errText || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
          return copy;
        });
        return;
      }

      let accumulated = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: accumulated };
          return copy;
        });
      }
    } catch {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "ขออภัยค่ะ ไม่สามารถเชื่อมต่อได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง",
        };
        return copy;
      });
    } finally {
      setIsStreaming(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end sm:bottom-6 sm:right-6 print:hidden">
      {open && (
        <div className="mb-3 flex h-[70vh] max-h-[560px] w-[92vw] max-w-sm flex-col overflow-hidden rounded-2xl border border-border-subtle bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-gradient-to-r from-brand to-brand-light px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg">🤖</span>
              <div>
                <p className="text-sm font-semibold">น้องเทคนิค AI</p>
                <p className="text-xs text-white/80">ผู้ช่วยตอบคำถามรับสมัคร</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="ปิดแชท"
              onClick={() => setOpen(false)}
              className="rounded-full p-1 hover:bg-white/10"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-surface px-3 py-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm ${
                    m.role === "user"
                      ? "bg-gradient-to-br from-brand to-brand-light text-white"
                      : "border border-border-subtle bg-white text-foreground"
                  }`}
                >
                  {m.content || (isStreaming && i === messages.length - 1 ? "กำลังพิมพ์..." : "")}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-end gap-2 border-t border-border-subtle bg-white p-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              placeholder="พิมพ์คำถาม เช่น สาขาไอทีเรียนอะไรบ้าง"
              className="max-h-24 flex-1 resize-none rounded-xl border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand"
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={isStreaming || input.trim().length === 0}
              className="rounded-xl bg-gradient-to-br from-brand to-brand-light px-3 py-2 text-sm font-semibold text-white disabled:opacity-40"
            >
              ส่ง ➤
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "ปิดแชทบอท" : "เปิดแชทบอทถามข้อมูลวิทยาลัย"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-light text-2xl text-white shadow-xl shadow-brand/40 transition-transform hover:scale-105"
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}
