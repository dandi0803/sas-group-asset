"use client";

import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isLoginPage =
    pathname === "/login";

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
        }}
      >
        {isLoginPage ? (
          children
        ) : (
          <div
            style={{
              display: "flex",
              minHeight: "100vh",
              background: "#f1f5f9",
            }}
          >
            <Sidebar />

            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <Header />

              <main
                style={{
                  flex: 1,
                  width: "100%",
                  padding: "24px",
                  boxSizing: "border-box",
                }}
              >
                {children}
              </main>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}