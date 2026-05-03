"use client";

import { TopFilters } from "@/components/dashboard/top-filters";

export default function SettingsPage() {
  return (
    <section className="space-y-4">
      <TopFilters />
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-5 flex items-center gap-2 border-b border-border pb-4">
          <button className="rounded-lg bg-primary px-4 py-2 text-xs text-white">Security</button>
        </div>

        <section className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-text mb-1">Account Security</h2>
            <p className="text-xs text-subtle">Manage your password and account protection settings.</p>
          </div>
        </section>

        <section className="mt-8 border-t border-border pt-6">
          <h2 className="mb-3 text-sm font-semibold text-text">Password</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              type="password"
              placeholder="Current Password"
              className="rounded-lg border border-border bg-muted px-3 py-2 text-sm text-text outline-none"
            />
            <div />
            <input
              type="password"
              placeholder="New Password"
              className="rounded-lg border border-border bg-muted px-3 py-2 text-sm text-text outline-none"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="rounded-lg border border-border bg-muted px-3 py-2 text-sm text-text outline-none"
            />
          </div>
          <button className="mt-4 rounded-lg bg-muted px-6 py-2 text-sm text-text">Update</button>
        </section>
      </div>
    </section>
  );
}
