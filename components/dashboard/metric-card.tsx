import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
}

export function MetricCard({ title, value, change, icon: Icon, iconColor, iconBgColor }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 flex flex-col justify-between h-[140px]">
      <div className="flex items-start justify-between">
        <p className="text-[13px] font-medium text-subtle">{title}</p>
        <div 
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ backgroundColor: iconBgColor }}
        >
          <Icon className="h-4 w-4" style={{ color: iconColor }} strokeWidth={2} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-text">{value}</p>
        <p className="mt-1 flex items-center text-[12px] text-subtle">
          {change} <span className="ml-1 text-subtle">→</span>
        </p>
      </div>
    </div>
  );
}
