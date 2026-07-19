import { PiSparkleDuotone } from "react-icons/pi";

interface MatchScoreProps {
  score: number; // 0-100
  className?: string;
}

export function MatchScore({ score, className = "" }: MatchScoreProps) {
  let color = "text-success border-success/20 bg-success/10";
  if (score < 70) color = "text-secondary border-secondary/20 bg-secondary/10";
  if (score < 50) color = "text-text-muted border-border bg-surface";

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold border ${color} ${className}`}>
      <PiSparkleDuotone size={14} />
      {score}% Match
    </div>
  );
}
