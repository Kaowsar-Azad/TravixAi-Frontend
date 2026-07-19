import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PiMapPinLineDuotone } from "react-icons/pi";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-neutral-bg text-center px-6">
      <div className="bg-surface p-10 rounded-3xl border border-border shadow-xl flex flex-col items-center max-w-md w-full">
        <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
          <PiMapPinLineDuotone size={48} />
        </div>
        <h1 className="font-display font-semibold text-7xl text-primary mb-2">404</h1>
        <h2 className="font-display font-semibold text-2xl text-text mb-4">Lost in translation?</h2>
        <p className="text-text-muted mb-8">
          The page you are looking for doesn't exist or has been moved to another destination.
        </p>
        <Link href="/" className="w-full">
          <Button variant="primary" className="w-full">Return Home</Button>
        </Link>
      </div>
    </div>
  );
}
