"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 print:hidden"
    >
      🖨️ พิมพ์
    </button>
  );
}
