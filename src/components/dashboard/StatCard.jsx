import { cn } from "@/lib/utils";

export default function StatCard({ title, value, subtitle, icon: Icon, trend, trendUp }) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <div className="flex items-center gap-1.5 pt-1">
              {trend && (
                <span className={cn(
                  "text-xs font-semibold px-1.5 py-0.5 rounded-full",
                  trendUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                )}>
                  {trend}
                </span>
              )}
              <span className="text-xs text-muted-foreground">{subtitle}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}