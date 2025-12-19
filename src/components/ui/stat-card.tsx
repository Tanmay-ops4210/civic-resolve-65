import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive' | 'info';
  className?: string;
}

const variantStyles = {
  default: 'bg-card border-border',
  primary: 'bg-primary/10 border-primary/20',
  success: 'bg-emerald-50 border-emerald-200',
  warning: 'bg-amber-50 border-amber-200',
  destructive: 'bg-red-50 border-red-200',
  info: 'bg-sky-50 border-sky-200',
};

const iconStyles = {
  default: 'text-muted-foreground bg-muted',
  primary: 'text-primary bg-primary/20',
  success: 'text-emerald-600 bg-emerald-100',
  warning: 'text-amber-600 bg-amber-100',
  destructive: 'text-red-600 bg-red-100',
  info: 'text-sky-600 bg-sky-100',
};

export function StatCard({ title, value, icon: Icon, trend, variant = 'default', className }: StatCardProps) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-lg border p-4 md:p-6 transition-shadow hover:shadow-md",
      variantStyles[variant],
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl md:text-3xl font-bold tracking-tight text-card-foreground">{value}</p>
          {trend && (
            <p className={cn(
              "text-xs font-medium",
              trend.isPositive ? "text-emerald-600" : "text-red-600"
            )}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
            </p>
          )}
        </div>
        <div className={cn("rounded-lg p-2.5", iconStyles[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
