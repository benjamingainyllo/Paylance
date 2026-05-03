import { TopFilters } from "@/components/dashboard/top-filters";

export default function SettingsPage() {
  return (
    <section className="space-y-4">
      <TopFilters />
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-5 flex items-center gap-2">
          <button className="rounded-lg bg-primary px-4 py-2 text-xs text-white">Profile</button>
          <button className="rounded-lg bg-muted px-4 py-2 text-xs text-subtle">Security</button>
        </div>

        <div className="grid gap-8 xl:grid-cols-2">
          <section>
            <h2 className="mb-3 text-sm font-semibold text-text">My profile</h2>
            <div className="space-y-3">
              <input
                defaultValue="Benjamin Gainyllo Joel"
                className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-text outline-none"
              />
              <input
                defaultValue="benjtech"
                className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-text outline-none"
              />
              <input
                defaultValue="benjamingainyllo@email.com"
                className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-text outline-none"
              />
              <textarea
                defaultValue="Here to teach you everything you need about creative design."
                rows={4}
                className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-text outline-none"
              />
              <button className="rounded-lg bg-primary px-6 py-2 text-sm text-white">Update</button>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-text">Social Links (URL)</h2>
            <div className="space-y-3">
              <input
                defaultValue="instagram.com/benjamingjoel"
                className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-text outline-none"
              />
              <input
                placeholder="TikTok URL"
                className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-text outline-none"
              />
              <input
                placeholder="LinkedIn URL"
                className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-text outline-none"
              />
              <input
                placeholder="YouTube URL"
                className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-text outline-none"
              />
            </div>
          </section>
        </div>

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
