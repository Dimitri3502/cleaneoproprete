import { cn } from "@/lib/utils";
import type { DealDecision } from "@/lib/types";

const decisionStyles: Record<DealDecision, string> = {
  GO: "bg-emerald-100 text-emerald-800 border-emerald-200",
  NO_GO: "bg-rose-100 text-rose-800 border-rose-200",
  REVIEW: "bg-amber-100 text-amber-800 border-amber-200",
};

type BadgeProps = {
  decision: DealDecision;
  className?: string;
};

export const DecisionBadge = ({ decision, className }: BadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide",
        decisionStyles[decision],
        className,
      )}
    >
      {decision.replace("_", " ")}
    </span>
  );
};
