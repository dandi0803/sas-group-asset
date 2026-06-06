"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const login = async () => {
    try {
      setLoading(true);

      const { data, error } =
        await supabase
          .from("users")
          .select("*");

      if (error) {
        alert(error.message);
        return;
      }

      const user =
        data?.find(
          (item: any) =>
            item.username ===
              username &&
            item.password ===
              password &&
            item.is_active ===
              true
        );

      if (!user) {
        alert(
          "Username atau Password salah"
        );
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      window.location.href =
        "/asset-management/data-asset";
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg,#0f172a,#1e3a8a)",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "460px",
          background: "#ffffff",
          borderRadius: "24px",
          padding: "45px",
          boxShadow:
            "0 25px 50px rgba(0,0,0,.25)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
      

          <h2
            style={{
              margin: 0,
              color: "#0f172a",
              fontSize: "28px",
              fontWeight: 700,
            }}
          >
            Asset Management
          </h2>

          <p
            style={{
              marginTop: "8px",
              color: "#64748b",
            }}
          >
            Login ke Sistem Asset SAS Group
          </p>
        </div>

        <div
          style={{
            marginBottom: "18px",
          }}
        >
          <label
            style={{
              fontWeight: 600,
              color: "#334155",
            }}
          >
            Username
          </label>

          <input
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value
              )
            }
            placeholder="Masukkan Username"
            style={{
              width: "100%",
              padding: "14px",
              marginTop: "8px",
              border:
                "1px solid #cbd5e1",
              borderRadius: "10px",
              boxSizing:
                "border-box",
              fontSize: "15px",
            }}
          />
        </div>

        <div
          style={{
            marginBottom: "25px",
          }}
        >
          <label
            style={{
              fontWeight: 600,
              color: "#334155",
            }}
          >
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            placeholder="Masukkan Password"
            style={{
              width: "100%",
              padding: "14px",
              marginTop: "8px",
              border:
                "1px solid #cbd5e1",
              borderRadius: "10px",
              boxSizing:
                "border-box",
              fontSize: "15px",
            }}
          />
        </div>

        <button
          onClick={login}
          disabled={loading}
          style={{
            width: "100%",
            padding: "15px",
            background:
              "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "16px",
            transition:
              "0.2s",
          }}
        >
          {loading
            ? "Loading..."
            : "Login"}
        </button>

        <div
          style={{
            textAlign: "center",
            marginTop: "25px",
            color: "#94a3b8",
            fontSize: "13px",
          }}
        >
          © 2026 SAS Group
        </div>
      </div>
    </div>
  );
}