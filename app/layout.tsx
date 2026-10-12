import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import SiteHeader from "./components/SiteHeader";
import "./globals.css";

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ang | ระบบติดตามคำสั่งซื้อหนังสือ สำนักพิมพ์อมตะ",
  description: "ระบบติดตามคำสั่งซื้อหนังสือจากร้านค้า สำหรับสำนักพิมพ์อมตะ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${sarabun.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
