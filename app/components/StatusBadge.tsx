import type { Status } from "@/lib/data";

const COLORS: Record<Status, string> = {
  รอส่ง: "bg-amber-100 text-amber-900 border-amber-300",
  ส่งแล้ว: "bg-sky-100 text-sky-900 border-sky-300",
  ชำระแล้ว: "bg-green-100 text-green-900 border-green-300",
};

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full border px-3 py-0.5 text-sm font-semibold ${COLORS[status]}`}
    >
      {status}
    </span>
  );
}
