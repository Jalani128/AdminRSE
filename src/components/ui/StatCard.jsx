import { cn } from "@/lib/utils";

export default function StatCard({ title, value, icon: Icon, color = "gold", description }) {
  const colorMap = {
    gold: "bg-gold-50 text-gold-600 border-gold-200",
    navy: "bg-navy-50 text-navy-700 border-navy-200",
    green: "bg-emerald-50 text-emerald-600 border-emerald-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
  };

  return (
    <div className="bg-white rounded-xl border border-border p-6 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold mt-2 text-navy-900">{value ?? "—"}</p>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
        <div className={cn("h-12 w-12 rounded-xl border flex items-center justify-center transition-transform duration-300 group-hover:scale-110", colorMap[color])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}