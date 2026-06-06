"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

type Props = {
  open: boolean;
  onClose: () => void;
  user?: any;
};

export default function AddUser({
  open,
  onClose,
  user,
}: Props) {
  const [loading,
    setLoading] =
    useState(false);

  const [username,
    setUsername] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const [fullName,
    setFullName] =
    useState("");

  const [role,
    setRole] =
    useState("Admin");

  const [isActive,
    setIsActive] =
    useState(true);

  useEffect(() => {
    if (user) {
      setUsername(
        user.username || ""
      );

      setPassword(
        user.password || ""
      );

      setFullName(
        user.full_name || ""
      );

      setRole(
        user.role || "Admin"
      );

      setIsActive(
        user.is_active
      );
    } else {
      setUsername("");
      setPassword("");
      setFullName("");
      setRole("Admin");
      setIsActive(true);
    }
  }, [user]);

  const saveUser =
    async () => {
      try {
        setLoading(true);

        if (
          !username ||
          !password ||
          !fullName
        ) {
          alert(
            "Lengkapi data terlebih dahulu"
          );
          return;
        }

        if (user) {
          const {
            error,
          } =
            await supabase
              .from(
                "users"
              )
              .update({
                username,
                password,
                full_name:
                  fullName,
                role,
                is_active:
                  isActive,
              })
              .eq(
                "id",
                user.id
              );

          if (error)
            throw error;

          alert(
            "User berhasil diupdate"
          );
        } else {
          const {
            error,
          } =
            await supabase
              .from(
                "users"
              )
              .insert([
                {
                  username,
                  password,
                  full_name:
                    fullName,
                  role,
                  is_active:
                    isActive,
                },
              ]);

          if (error)
            throw error;

          alert(
            "User berhasil ditambahkan"
          );
        }

        window.location.reload();
      } catch (
        err: any
      ) {
        alert(
          err.message
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  if (!open)
    return null;

  return (
    <div
      style={{
        position:
          "fixed",
        inset: 0,
        background:
          "rgba(0,0,0,.4)",
        display:
          "flex",
        justifyContent:
          "center",
        alignItems:
          "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background:
            "#fff",
          width:
            "500px",
          borderRadius:
            "16px",
          padding:
            "24px",
        }}
      >
        <h2
          style={{
            marginTop: 0,
          }}
        >
          {user
            ? "Edit User"
            : "Tambah User"}
        </h2>

        <div
          style={{
            display:
              "flex",
            flexDirection:
              "column",
            gap: "12px",
          }}
        >
          <input
            placeholder="Username"
            value={
              username
            }
            onChange={(
              e
            ) =>
              setUsername(
                e.target
                  .value
              )
            }
            style={
              inputStyle
            }
          />

          <input
            placeholder="Password"
            value={
              password
            }
            onChange={(
              e
            ) =>
              setPassword(
                e.target
                  .value
              )
            }
            style={
              inputStyle
            }
          />

          <input
            placeholder="Nama Lengkap"
            value={
              fullName
            }
            onChange={(
              e
            ) =>
              setFullName(
                e.target
                  .value
              )
            }
            style={
              inputStyle
            }
          />

          <select
            value={role}
            onChange={(
              e
            ) =>
              setRole(
                e.target
                  .value
              )
            }
            style={
              inputStyle
            }
          >
            <option>
              Admin
            </option>

            <option>
              Super Admin
            </option>
          </select>

          <label>
            <input
              type="checkbox"
              checked={
                isActive
              }
              onChange={(
                e
              ) =>
                setIsActive(
                  e.target
                    .checked
                )
              }
            />{" "}
            User Aktif
          </label>
        </div>

        <div
          style={{
            display:
              "flex",
            justifyContent:
              "flex-end",
            gap: "10px",
            marginTop:
              "20px",
          }}
        >
          <button
            onClick={
              onClose
            }
            style={{
              padding:
                "10px 16px",
            }}
          >
            Batal
          </button>

          <button
            onClick={
              saveUser
            }
            disabled={
              loading
            }
            style={{
              background:
                "#2563eb",
              color:
                "#fff",
              border:
                "none",
              padding:
                "10px 16px",
              borderRadius:
                "8px",
            }}
          >
            {loading
              ? "Menyimpan..."
              : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "12px",
  border:
    "1px solid #d1d5db",
  borderRadius:
    "8px",
  width: "100%",
};