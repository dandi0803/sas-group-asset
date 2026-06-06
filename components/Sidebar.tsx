"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const [masterOpen, setMasterOpen] =
    useState(false);

  const [assetOpen, setAssetOpen] =
    useState(false);

  const [auditOpen, setAuditOpen] =
    useState(false);

  const [user, setUser] =
    useState<any>(null);

  useEffect(() => {
    const userData =
      localStorage.getItem("user");

    if (userData) {
      setUser(
        JSON.parse(userData)
      );
    }
  }, []);

  const logout = () => {
    localStorage.removeItem(
      "user"
    );

    window.location.href =
      "/login";
  };

  return (
    <aside
      style={{
        width: "260px",
        background: "#0f172a",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div>
        <h2
          style={{
            marginBottom: "30px",
            paddingBottom: "10px",
            fontSize: "28px",
            fontWeight: "bold",
            borderBottom:
              "5px solid #334155",
          }}
        >
          SAS Group
        </h2>

        <Link
  href="/Dashboard"
  style={{
    display: "block",
    color: "white",
    textDecoration: "none",
    padding: "10px 0",
    fontWeight: "bold",
    marginBottom: "10px",
  }}
>
  📊 Dashboard
</Link>
        {/* MASTER DATA */}
        <div
          onClick={() =>
            setMasterOpen(
              !masterOpen
            )
          }
          style={{
            cursor: "pointer",
            padding: "10px 0",
            fontWeight: "bold",
          }}
        >
          {masterOpen
            ? "▼"
            : "▶"}{" "}
          📂 Master Data
        </div>

        {masterOpen && (
          <div
            style={{
              paddingLeft: "20px",
            }}
          >
            <Link
              href="/master-data/kategori-asset"
              style={linkStyle}
            >
              📁 Kategori Asset
            </Link>

            <Link
              href="/master-data/jenis-asset"
              style={linkStyle}
            >
              📋 Jenis Asset
            </Link>

            <Link
              href="/master-data/lokasi-asset"
              style={linkStyle}
            >
              📍 Lokasi Asset
            </Link>

            <Link
              href="/master-data/status-asset"
              style={linkStyle}
            >
              📌 Status Asset
            </Link>


{user?.role === "Super Admin" && (
  <Link
    href="/master-data/user"
    style={linkStyle}
  >
    👤 User Management
  </Link>
)}

</div>
)}
        {/* ASSET MANAGEMENT */}
        <div
          onClick={() =>
            setAssetOpen(
              !assetOpen
            )
          }
          style={{
            cursor: "pointer",
            padding: "10px 0",
            fontWeight: "bold",
            marginTop: "10px",
          }}
        >
          {assetOpen
            ? "▼"
            : "▶"}{" "}
          📦 Asset Management
        </div>

        {assetOpen && (
          <div
            style={{
              paddingLeft: "20px",
            }}
          >
            <Link
              href="/asset-management/data-asset"
              style={linkStyle}
            >
              📄 Data Asset
            </Link>
          </div>
        )}

        {/* AUDIT MANAGEMENT */}
        <div
          onClick={() =>
            setAuditOpen(
              !auditOpen
            )
          }
          style={{
            cursor: "pointer",
            padding: "10px 0",
            fontWeight: "bold",
            marginTop: "10px",
          }}
        >
          {auditOpen
            ? "▼"
            : "▶"}{" "}
          📝 Audit Management
        </div>

        {auditOpen && (
          <div
            style={{
              paddingLeft: "20px",
            }}
          >
            <Link
              href="/audit-management/template-audit"
              style={linkStyle}
            >
              📋 Template Audit
            </Link>

            <Link
              href="/audit-management/audit-asset"
              style={linkStyle}
            >
              ✔ Audit Asset
            </Link>

            <Link
              href="/audit-management/riwayat-audit"
              style={linkStyle}
            >
              📜 Riwayat Audit
            </Link>
          </div>
        )}
      </div>

      {/* USER PANEL */}
      <div
        style={{
          marginTop: "auto",
          borderTop:
            "1px solid #334155",
          paddingTop: "15px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "15px",
          }}
        >
          <div
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              background: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
            }}
          >
            👤
          </div>

          <div>
            <div
              style={{
                fontWeight: "bold",
              }}
            >
              {user?.full_name ||
                "Guest"}
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "#94a3b8",
              }}
            >
              {user?.role ||
                "-"}
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          style={{
            width: "100%",
            border: "none",
            padding: "10px",
            borderRadius: "8px",
            background: "#dc2626",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}

const linkStyle = {
  display: "block",
  color: "white",
  textDecoration: "none",
  padding: "8px 0",
};