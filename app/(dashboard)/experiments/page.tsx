import { TopFilters } from "@/components/dashboard/top-filters";

const tests = [
  {
    name: "Headline test",
    hypothesis: "Benefit-first headline improves checkout conversion by 15%.",
    status: "Draft"
  },
  {
    name: "Offer pricing test",
    hypothesis: "$39 entry price may outperform $49 on conversion and total revenue.",
    status: "Queued"
  },
  {
    name: "Checkout CTA color test",
    hypothesis: "Emerald CTA could increase clicks against indigo control.",
    status: "Queued"
  }
];

export default function ExperimentsPage() {
  return (
    <section className="space-y-4">
      <TopFilters />
      <div className="rounded-xl border border-border bg-surface p-5">
        <h1 className="text-xl font-semibold text-text">Experiments</h1>
        <p className="mt-1 text-sm text-subtle">
          Launch growth tests on offers, pricing, and checkout without changing code.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {tests.map((test) => (
          <article key={test.name} className="rounded-xl border border-border bg-surface p-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text">{test.name}</h2>
              <span className="rounded-full bg-muted px-3 py-1 text-xs text-subtle">{test.status}</span>
            </div>
            <p className="text-sm text-subtle">{test.hypothesis}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
