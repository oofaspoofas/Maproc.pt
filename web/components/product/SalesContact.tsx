import Image from "next/image";
import type { SalesContact as SalesContactType } from "@/lib/content";
import { Arrow } from "@/components/ui/Arrow";
export function SalesContact({
  sales,
  compact = false,
}: {
  sales: SalesContactType;
  compact?: boolean;
}) {
  return (
    <div className={`sales-contact ${compact ? "compact" : ""}`}>
      <Image
        src="/assets/maproc/helder-ramires2.webp"
        alt="Helder Ramires"
        width={80}
        height={90}
      />
      <div>
        <p>{sales.role}</p>
        <h3>Helder Ramires</h3>
        <a href={`tel:${sales.phone.replace(/\s/g, "")}`}>
          {sales.phone}
          <Arrow diagonal size={16} />
        </a>
        <p>
          {sales.availability} · {sales.territory}
        </p>
      </div>
    </div>
  );
}
