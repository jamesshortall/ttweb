"use client";

export function LogoutButton() {
  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" }).catch(() => {});
    window.location.href = "/admin/login";
  }
  return (
    <button
      type="button"
      onClick={logout}
      className="rounded-full border border-navy-200 px-4 py-1.5 text-sm font-semibold text-navy-800 transition-colors hover:bg-navy-50"
    >
      Sign out
    </button>
  );
}
