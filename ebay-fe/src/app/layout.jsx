"use client";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import "./globals.scss";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const hideHeaderFooterRoutes = [
    "/login",
    "/login/forgot-password",
    "/login/verify-email",
    "/register",
    "/register/verify-email",
    "/login/google",
  ];

  const shouldHideHeaderFooter = hideHeaderFooterRoutes.includes(pathname);

  return (
    <html lang="vi">
      <body>
        {!shouldHideHeaderFooter && <Header />}

        <main>
          <Suspense fallback={<div>Đang tải...</div>}>{children}</Suspense>
        </main>

        {!shouldHideHeaderFooter && <Footer />}
      </body>
    </html>
  );
}
