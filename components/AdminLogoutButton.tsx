"use client";

import { useRouter } from "next/navigation";

export default function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-full border border-border-subtle px-4 py-2 text-sm font-semibold text-brand-dark hover:bg-surface"
    >
      ออกจากระบบ
    </button>
  );
}
