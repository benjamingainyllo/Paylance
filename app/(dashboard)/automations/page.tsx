import { TopFilters } from "@/components/dashboard/top-filters";

const automations = [
  {
    title: "Abandoned checkout follow-up",
    description: "Send reminder email and WhatsApp message 30 minutes after drop-off.",
    status: "Coming next"
  },
  {
    title: "Post-purchase onboarding",
    description: "Deliver product access links and onboarding checklist automatically.",
    status: "Planned"
  },
  {
    title: "Lead magnet delivery",
    description: "Send free resource after form submission and tag contact in CRM.",
    status: "Planned"
  }
];

export default function AutomationsPage() {
  return (
    <section className="space-y-4">
      <TopFilters />
      <div className="rounded-xl border border-border bg-surface p-5">
        <h1 className="text-xl font-semibold text-text">Automations</h1>
        <p className="mt-1 text-sm text-subtle">
          Build no-code flows for lead capture, checkout recovery, and customer lifecycle.
        </p>
      </div>
      <div className="grid gap-4">
        {automations.map((item) => (
          <div key={item.title} className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text">{item.title}</h2>
              <span className="rounded-full bg-muted px-3 py-1 text-xs text-subtle">{item.status}</span>
            </div>
            <p className="mt-2 text-sm text-subtle">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
