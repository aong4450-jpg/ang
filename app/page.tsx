import Link from "next/link";

const PAGES = [
  {
    href: "/orders",
    title: "รายการคำสั่งซื้อ",
    detail: "ดูคำสั่งซื้อทั้งหมด ค้นหา กรอง และเปลี่ยนสถานะ",
  },
  {
    href: "/orders/new",
    title: "เพิ่มคำสั่งซื้อ",
    detail: "บันทึกคำสั่งซื้อใหม่จากร้านค้า",
  },
  {
    href: "/summary",
    title: "สรุปยอด",
    detail: "ยอดขายรวม ยอดค้างชำระ และร้านที่ยอดสูงสุด",
  },
];

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold">ระบบติดตามคำสั่งซื้อหนังสือ</h1>
      <p className="mt-2 text-lg text-slate-600">สำนักพิมพ์อมตะ</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {PAGES.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:border-blue-500"
          >
            <h2 className="text-xl font-semibold text-blue-700">{p.title}</h2>
            <p className="mt-2 text-slate-600">{p.detail}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
