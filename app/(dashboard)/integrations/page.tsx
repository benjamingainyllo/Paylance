import { TopFilters } from "@/components/dashboard/top-filters";

export default function IntegrationsPage() {
  return (
    <section className="space-y-4">
      <TopFilters />
      <div className="rounded-xl border border-border bg-surface p-5">
        <h1 className="text-xl font-semibold text-text">Integrations</h1>
        <p className="mt-1 text-sm text-subtle">Connect payment, email, and marketing tools.</p>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-muted p-4">
            <p className="text-sm font-medium text-text">Paystack</p>
            <p className="text-xs text-subtle">Primary NGN payment gateway</p>
          </div>
          <div className="rounded-lg border border-border bg-muted p-4">
            <p className="text-sm font-medium text-text">Supabase</p>
            <p className="text-xs text-subtle">Auth and database services</p>
          </div>
        </div>
      </div>
    </section>
  );
}
