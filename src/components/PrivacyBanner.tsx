"use client";

import { useState } from "react";
import Link from "next/link";

export function PrivacyBanner() {
  const [expanded, setExpanded] = useState(false);

  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)]/50 px-4 py-4">
      <div className="mx-auto max-w-xl">
        <p className="text-center text-xs text-[var(--muted)]">
          Your data stays private. We don’t sell it.{" "}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] rounded"
          >
            {expanded ? "Less" : "Privacy & data"}
          </button>
        </p>
        {expanded && (
          <div className="mt-3 rounded-[var(--radius-sm)] bg-[var(--background)] p-3 text-xs text-[var(--muted)]">
            <ul className="list-inside list-disc space-y-1">
              <li>You can use the app without signing in.</li>
              <li>Session data is only used to improve your guidance and is not sold.</li>
              <li>You can delete your data anytime from <Link href="/settings" className="underline">Settings</Link>.</li>
              <li>We use industry-standard encryption.</li>
            </ul>
            <Link
              href="/privacy"
              className="mt-2 inline-block font-medium text-[var(--primary)] underline"
            >
              Full privacy policy
            </Link>
          </div>
        )}
      </div>
    </footer>
  );
}
