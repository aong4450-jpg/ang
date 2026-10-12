"use client";

import Link from "next/link";
import { useState } from "react";
import StatusBadge from "../components/StatusBadge";
import {
  STATUSES,
  amountOf,
  formatBaht,
  formatThaiDate,
  isOverdue,
  nextStatus,
  type Status,
} from "@/lib/data";
import { advanceStatus, useOrders, useToday } from "@/lib/store";

const FILTERS: ("ทั้งหมด" | Status)[] = ["ทั้งหมด", ...STATUSES];

export default function OrdersPage() {
  const orders = useOrders();
  const today = useToday();
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ทั้งหมด");

  const word = keyword.trim().toLowerCase();
  const shown = orders
    .filter((o) => filter === "ทั้งหมด" || o.status === filter)
    .filter(
      (o) => !word || o.shop.toLowerCase().includes(word) || o.book.toLowerCase().includes(word),
    )
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">รายการคำสั่งซื้อ</h1>
        <Link
          href="/orders/new"
          className="rounded bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800"
        >
          เพิ่มคำสั่งซื้อ
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="ค้นหาชื่อร้านหรือชื่อหนังสือ"
          aria-label="ค้นหาชื่อร้านหรือชื่อหนังสือ"
          className="w-full rounded border border-slate-300 bg-white px-3 py-2 sm:w-80"
        />
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`rounded border px-3 py-2 font-medium ${
                filter === f
                  ? "border-blue-700 bg-blue-700 text-white"
                  : "border-slate-300 bg-white hover:border-blue-500"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-slate-600">
        แสดง {shown.length} จาก {orders.length} รายการ แถวสีแดงคือรายการที่ยังไม่ชำระและสั่งมาเกิน 30 วัน
      </p>

      <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-left">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-4 py-3">เลขที่</th>
              <th className="px-4 py-3">ร้าน</th>
              <th className="px-4 py-3">หนังสือ</th>
              <th className="px-4 py-3 text-right">จำนวน</th>
              <th className="px-4 py-3 text-right">ยอดเงิน</th>
              <th className="px-4 py-3">วันที่สั่ง</th>
              <th className="px-4 py-3">สถานะ</th>
              <th className="px-4 py-3">เปลี่ยนสถานะ</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((o) => {
              const overdue = isOverdue(o, today);
              const next = nextStatus(o.status);
              return (
                <tr
                  key={o.id}
                  className={`border-t border-slate-200 ${overdue ? "bg-red-50 text-red-800" : ""}`}
                >
                  <td className="whitespace-nowrap px-4 py-3">{o.id}</td>
                  <td className="px-4 py-3">{o.shop}</td>
                  <td className="px-4 py-3">{o.book}</td>
                  <td className="px-4 py-3 text-right">{o.qty.toLocaleString("en-US")}</td>
                  <td className="px-4 py-3 text-right font-semibold">{formatBaht(amountOf(o))}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {formatThaiDate(o.date)}
                    {overdue && <div className="text-sm font-semibold">ค้างเกิน 30 วัน</div>}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-4 py-3">
                    {next ? (
                      <button
                        type="button"
                        onClick={() => advanceStatus(o.id)}
                        className="whitespace-nowrap rounded border border-blue-700 bg-white px-3 py-1 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                      >
                        เปลี่ยนเป็น {next}
                      </button>
                    ) : (
                      <span className="text-sm text-slate-500">เสร็จสิ้น</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {shown.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                  ไม่พบรายการที่ตรงกับเงื่อนไข
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
