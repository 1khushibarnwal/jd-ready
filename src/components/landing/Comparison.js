import { Check, X } from "lucide-react";

import FadeIn from "@/components/animations/FadeIn";
import { comparisonRows } from "@/data/landing";

export default function Comparison() {
  return (
    <section className="border-t border-border py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <FadeIn>
          <h2 className="font-display text-3xl font-bold">
            JDReady vs Manual Review
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="mt-10 overflow-x-auto rounded-xl border border-border">
            <div className="grid grid-cols-[2fr_1fr_1fr] bg-background font-semibold min-w-130">
              <div className="p-4">Feature</div>

              <div className="p-4 text-center">JDReady</div>

              <div className="p-4 text-center">Manual</div>
            </div>

            {comparisonRows.map((row, index) => (
              <div
                key={row.label}
                className={`grid grid-cols-[2fr_1fr_1fr] ${
                  index % 2 ? "bg-surface" : ""
                }`}
              >
                <div className="p-4">{row.label}</div>

                <div className="flex items-center justify-center">
                  {row.jdready ? (
                    <Check className="text-success" size={18} />
                  ) : (
                    <X className="text-danger" size={18} />
                  )}
                </div>

                <div className="flex items-center justify-center">
                  {row.manual ? (
                    <Check className="text-success" size={18} />
                  ) : (
                    <X className="text-danger" size={18} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
