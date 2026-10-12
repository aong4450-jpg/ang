"use client";

import { STATUSES, amountOf, formatBaht, isUnpaid } from "@/lib/data";
import { useOrders } from "@/lib/store";

function Card({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-slate-600">{label}</div>
      <div className={`mt-1 text-3xl font-bold ${tone ?? "text-slate-900"}`}>{value}</div>
    </div>
  );
}

export default function SummaryPage() {
  const orders = useOrders();

  const totalSales = orders.reduce((sum, o) => sum + amountOf(o), 0);
  const totalUnpaid = orders.filter(isUnpaid).reduce((sum, o) => sum + amountOf(o), 0);

  const byShop = new Map<string, number>();
  for (const o of orders) byShop.set(o.shop, (byShop.get(o.shop) ?? 0) + amountOf(o));
  const topShops = [...byShop.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topMax = topShops[0]?.[1] ?? 0;

  return (
    <div>
      <h1 className="text-3xl font-bold">สรุปยอด</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card label="ยอดขายรวม" value={formatBaht(totalSales)} tone="text-blue-800" />
        <Card label="ยอดค้างชำระรวม" value={formatBaht(totalUnpaid)} tone="text-red-700" />
      </div>

      <h2 className="mt-8 text-xl font-semibold">จำนวนคำสั่งซื้อแยกตามสถานะ</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-3">
        {STATUSES.map((s) => (
          <Card
            key={s}
            label={s}
            value={`${orders.filter((o) => o.status === s).length} รายการ`}
          />
        ))}
      </div>

      <h2 className="mt-8 text-xl font-semibold">ร้านที่ยอดสูงสุด 5 อันดับ</h2>
      <div className="mt-3 space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        {topShops.map(([shop, amount], i) => (
          <div key={shop}>
            <div className="flex flex-wrap justify-between gap-x-4">
              <span>
                {i + 1}. {shop}
              </span>
              <span className="font-semibold">{formatBaht(amount)}</span>
            </div>
            <div className="mt-1 h-5 rounded bg-slate-100">
              <div
                className="h-5 rounded bg-blue-600"
                style={{ width: `${topMax ? (amount / topMax) * 100 : 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
