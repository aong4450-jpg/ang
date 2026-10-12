"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BOOKS, SHOPS, formatBaht } from "@/lib/data";
import { addOrder, useToday } from "@/lib/store";

const FIELD = "mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2";

export default function NewOrderPage() {
  const router = useRouter();
  const [shop, setShop] = useState("");
  const [book, setBook] = useState("");
  const [qty, setQty] = useState("");
  const today = useToday();
  const [pickedDate, setDate] = useState<string | null>(null);
  const date = pickedDate ?? today;
  const [errors, setErrors] = useState<string[]>([]);

  const price = BOOKS.find((b) => b.title === book)?.price ?? 0;
  const qtyNumber = Number(qty);
  const qtyValid = Number.isInteger(qtyNumber) && qtyNumber > 0;
  const total = qtyValid ? price * qtyNumber : 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found: string[] = [];
    if (!shop) found.push("กรุณาเลือกร้าน");
    if (!book) found.push("กรุณาเลือกหนังสือ");
    if (!qty) found.push("กรุณาใส่จำนวน");
    else if (!qtyValid) found.push("จำนวนต้องเป็นตัวเลขจำนวนเต็มที่มากกว่า 0");
    if (!date) found.push("กรุณาเลือกวันที่สั่ง");
    setErrors(found);
    if (found.length > 0) return;

    addOrder({ shop, book, qty: qtyNumber, price, date, status: "รอส่ง" });
    router.push("/orders");
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold">เพิ่มคำสั่งซื้อ</h1>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-6 space-y-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >
        {errors.length > 0 && (
          <div role="alert" className="rounded border border-red-300 bg-red-50 p-4 text-red-800">
            <p className="font-semibold">ยังบันทึกไม่ได้ กรุณาแก้ไขดังนี้</p>
            <ul className="mt-1 list-disc pl-6">
              {errors.map((msg) => (
                <li key={msg}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        <label className="block font-medium">
          ร้าน
          <select value={shop} onChange={(e) => setShop(e.target.value)} className={FIELD}>
            <option value="">เลือกร้าน</option>
            {SHOPS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>

        <label className="block font-medium">
          หนังสือ
          <select value={book} onChange={(e) => setBook(e.target.value)} className={FIELD}>
            <option value="">เลือกหนังสือ</option>
            {BOOKS.map((b) => (
              <option key={b.title} value={b.title}>
                {b.title} (เล่มละ {formatBaht(b.price)})
              </option>
            ))}
          </select>
        </label>

        <label className="block font-medium">
          จำนวน (เล่ม)
          <input
            type="number"
            min={1}
            step={1}
            inputMode="numeric"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className={FIELD}
          />
        </label>

        <label className="block font-medium">
          วันที่สั่ง
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={FIELD}
          />
        </label>

        <div className="rounded bg-blue-50 p-4">
          <div className="text-slate-600">ยอดเงิน (คิดให้อัตโนมัติ)</div>
          <div className="text-3xl font-bold text-blue-800">{formatBaht(total)}</div>
        </div>

        <p className="text-slate-600">คำสั่งซื้อใหม่จะเริ่มที่สถานะ รอส่ง</p>

        <button
          type="submit"
          className="rounded bg-blue-700 px-6 py-2 text-lg font-semibold text-white hover:bg-blue-800"
        >
          บันทึก
        </button>
      </form>
    </div>
  );
}
