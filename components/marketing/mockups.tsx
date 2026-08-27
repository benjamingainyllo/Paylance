/**
 * Product mockups, built in markup rather than screenshotted.
 *
 * Showing the thing beats describing it, and these stay honest: every number
 * here is obviously illustrative and sits inside a frame that reads as a
 * picture of the product, not a live figure in the reader's account.
 */

export function EventCardMock() {
  return (
    <div className="w-full max-w-[300px] overflow-hidden rounded-2xl border-2 border-[var(--ink)] bg-white shadow-[6px_6px_0_var(--ink)]">
      <div className="relative h-28 bg-gradient-to-br from-[#FF6A45] via-[#FF9E7A] to-[#FFDE59]">
        <span className="absolute bottom-3 left-3 rounded-full bg-[var(--ink)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          ₦5,000 / ticket
        </span>
      </div>
      <div className="p-4">
        <p className="text-[15px] font-bold leading-tight text-[var(--ink)]">
          Sunday Listening Party
        </p>
        <p className="mt-1 text-[11px] text-[var(--ink-soft)]">Sat 14 Jun · 6pm · Yaba</p>

        <div className="mt-4 flex items-center gap-2">
          <div className="flex -space-x-2">
            {["#FFB3C7", "#9BE3C0", "#B7C4FF", "#DDBBF5"].map((c, i) => (
              <span
                key={c}
                className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[9px] font-bold text-[var(--ink)]"
                style={{ background: c }}
              >
                {["A", "K", "T", "M"][i]}
              </span>
            ))}
          </div>
          <span className="text-[11px] font-semibold text-[var(--ink-soft)]">+23 going</span>
        </div>
      </div>
    </div>
  );
}

export function PayoutMock() {
  return (
    <div className="w-full max-w-[300px] rounded-2xl border-2 border-[var(--ink)] bg-white p-5 shadow-[6px_6px_0_var(--ink)]">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-soft)]">
        Settled to your bank
      </p>
      <p className="mt-1 text-3xl font-bold tracking-tight text-[var(--ink)]">₦184,500</p>

      <div className="mt-4 space-y-2 border-t-2 border-dashed border-[var(--rule)] pt-4 text-[11px]">
        {[
          ["Gross", "₦202,000"],
          ["Platform fee", "−₦18,180"],
          ["Processing", "−₦2,320"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <span className="text-[var(--ink-soft)]">{k}</span>
            <span className="font-semibold text-[var(--ink)]">{v}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#9BE3C0]/40 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-emerald-600" />
        <span className="text-[11px] font-semibold text-[var(--ink)]">
          Paid straight to GTBank ···· 4471
        </span>
      </div>
    </div>
  );
}

export function OrdersMock() {
  const rows = [
    ["Amara O.", "Preset Pack", "₦12,000", "#FFB3C7"],
    ["Tunde B.", "Listening Party", "₦5,000", "#B7C4FF"],
    ["Zainab I.", "1:1 Session", "₦45,000", "#9BE3C0"],
  ];

  return (
    <div className="w-full max-w-[340px] rounded-2xl border-2 border-[var(--ink)] bg-white p-4 shadow-[6px_6px_0_var(--ink)]">
      <div className="flex items-center justify-between px-1 pb-3">
        <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--ink-soft)]">
          Orders
        </p>
        <span className="rounded-full bg-[#FFDE59] px-2 py-0.5 text-[9px] font-bold text-[var(--ink)]">
          TODAY
        </span>
      </div>

      <div className="space-y-1.5">
        {rows.map(([who, what, amount, tone]) => (
          <div key={who} className="flex items-center gap-3 rounded-xl bg-[var(--paper-deep)] p-2.5">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-[var(--ink)]"
              style={{ background: tone }}
            >
              {who[0]}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold text-[var(--ink)]">{who}</p>
              <p className="truncate text-[10px] text-[var(--ink-soft)]">{what}</p>
            </div>
            <span className="shrink-0 text-[12px] font-bold text-[var(--ink)]">{amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LinkMock() {
  return (
    <div className="w-full max-w-[280px] rounded-2xl border-2 border-[var(--ink)] bg-white p-4 shadow-[6px_6px_0_var(--ink)]">
      <div className="flex items-center gap-2 rounded-xl bg-[var(--paper-deep)] px-3 py-2.5">
        <span className="h-2 w-2 rounded-full bg-[#FF6A45]" />
        <span className="truncate text-[12px] font-semibold text-[var(--ink)]">
          paylance.me/amara
        </span>
      </div>

      <div className="mt-3 space-y-2">
        {[
          ["Preset Pack Vol. 2", "₦12,000", "#FFB3C7"],
          ["Sunday Listening Party", "₦5,000", "#B7C4FF"],
          ["1:1 Portfolio Review", "₦45,000", "#DDBBF5"],
        ].map(([title, price, tone]) => (
          <div
            key={title}
            className="flex items-center gap-2.5 rounded-xl border border-[var(--rule)] p-2.5"
          >
            <span className="h-8 w-8 shrink-0 rounded-lg" style={{ background: tone }} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-semibold text-[var(--ink)]">{title}</p>
            </div>
            <span className="shrink-0 text-[11px] font-bold text-[var(--ink)]">{price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
