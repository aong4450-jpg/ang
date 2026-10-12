"use client";

import { useSyncExternalStore } from "react";
import { SEED_ORDERS, nextStatus, todayISO, type Order } from "./data";

// รอบแรกเก็บข้อมูลไว้ในเบราว์เซอร์ของเครื่องนี้ รอบบ่ายจะเปลี่ยนไฟล์นี้ไปใช้ Supabase
const KEY = "ang-orders-v1";

let cache: Order[] | null = null;
const listeners = new Set<() => void>();

function read(): Order[] {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as Order[]) : SEED_ORDERS;
  } catch {
    cache = SEED_ORDERS;
  }
  return cache;
}

function write(next: Order[]) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // เบราว์เซอร์ไม่ให้บันทึก ก็ยังใช้งานต่อได้จนกว่าจะปิดหน้า
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useOrders() {
  return useSyncExternalStore(subscribe, read, () => SEED_ORDERS);
}

// วันนี้ต้องอ่านจากเครื่องผู้ใช้เท่านั้น ฝั่งเซิร์ฟเวอร์จึงคืนค่าว่างไปก่อน
export function useToday() {
  return useSyncExternalStore(subscribeNever, todayISO, () => "");
}

function subscribeNever() {
  return () => {};
}

export function addOrder(input: Omit<Order, "id">) {
  const orders = read();
  const max = orders.reduce((m, o) => Math.max(m, Number(o.id.split("-")[1]) || 0), 0);
  const id = "อมต-" + String(max + 1).padStart(4, "0");
  write([...orders, { id, ...input }]);
}

export function advanceStatus(id: string) {
  write(
    read().map((o) => {
      if (o.id !== id) return o;
      const next = nextStatus(o.status);
      return next ? { ...o, status: next } : o;
    }),
  );
}
