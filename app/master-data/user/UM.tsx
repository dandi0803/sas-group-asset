"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AddUser from "./AddUser";

export default function UserManagement() {
  const [users, setUsers] =
    useState<any[]>([]);
    const [currentUser,
  setCurrentUser] =
  useState<any>(null);

  const [search, setSearch] =
    useState("");

  const [openTambah,
    setOpenTambah] =
    useState(false);

  const [selectedUser,
    setSelectedUser] =
    useState<any>(null);

  useEffect(() => {

  const userData =
    localStorage.getItem(
      "user"
    );

  if (userData) {
    setCurrentUser(
      JSON.parse(userData)
    );
  }

  loadUsers();

}, []);

  const loadUsers =
    async () => {
      const {
        data,
        error,
      } = await supabase
        .from("users")
        .select("*")
        .order("id");

      if (error) {
        console.log(error);
        return;
      }

      setUsers(data || []);
    };

  const hapusUser =
    async (
      id: number
    ) => {
      if (
        !confirm(
          "Yakin hapus user?"
        )
      )
        return;

      const { error } =
        await supabase
          .from("users")
          .delete()
          .eq(
            "id",
            id
          );

      if (error) {
        alert(
          error.message
        );
        return;
      }

      window.location.reload();
    };

  const toggleStatus =
    async (
      id: number,
      status: boolean
    ) => {
      const { error } =
        await supabase
          .from("users")
          .update({
            is_active:
              !status,
          })
          .eq(
            "id",
            id
          );

      if (error) {
        alert(
          error.message
        );
        return;
      }

      window.location.reload();
    };

  const filteredUsers =
    users.filter(
      (item: any) =>
        item.username
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        item.full_name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );
    if (
  currentUser &&
  currentUser.role !==
    "Super Admin"
) {
  return (
    <div
      style={{
        padding: "30px",
        fontSize: "20px",
        fontWeight: "bold",
      }}
    >
      Akses Ditolak
    </div>
  );
}

  return (
    <>
      <div
        style={{
          padding:
            "24px",
          background:
            "#f8fafc",
          minHeight:
            "100vh",
        }}
      >
        <div
          style={{
            display:
              "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            marginBottom:
              "20px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize:
                  "32px",
                fontWeight:
                  700,
              }}
            >
              User Management
            </h1>

            <p
              style={{
                color:
                  "#64748b",
              }}
            >
              Kelola user sistem
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedUser(
                null
              );

              setOpenTambah(
                true
              );
            }}
            style={{
              background:
                "#2563eb",
              color:
                "#fff",
              border:
                "none",
              padding:
                "12px 18px",
              borderRadius:
                "8px",
              cursor:
                "pointer",
              fontWeight:
                "bold",
            }}
          >
            + Tambah User
          </button>
        </div>

        <input
          placeholder="Cari User..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          style={{
            width:
              "350px",
            padding:
              "10px 14px",
            border:
              "1px solid #d1d5db",
            borderRadius:
              "8px",
            marginBottom:
              "20px",
          }}
        />

        <div
          style={{
            background:
              "#fff",
            borderRadius:
              "12px",
            overflow:
              "hidden",
          }}
        >
          <table
            style={{
              width:
                "100%",
              borderCollapse:
                "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  background:
                    "#081028",
                  color:
                    "#fff",
                }}
              >
                <th style={th}>
                  Username
                </th>

                <th style={th}>
                  Nama
                </th>

                <th style={th}>
                  Role
                </th>

                <th style={th}>
                  Status
                </th>

                <th style={th}>
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map(
                (
                  item: any
                ) => (
                  <tr
                    key={
                      item.id
                    }
                  >
                    <td
                      style={
                        td
                      }
                    >
                      {
                        item.username
                      }
                    </td>

                    <td
                      style={
                        td
                      }
                    >
                      {
                        item.full_name
                      }
                    </td>

                    <td
                      style={
                        td
                      }
                    >
                      {
                        item.role
                      }
                    </td>

                    <td
                      style={
                        td
                      }
                    >
                      <button
                        onClick={() =>
                          toggleStatus(
                            item.id,
                            item.is_active
                          )
                        }
                      >
                        {item.is_active
                          ? "Aktif"
                          : "Nonaktif"}
                      </button>
                    </td>

                    <td style={td}>
  <div
    style={{
      display: "flex",
      gap: "8px",
      alignItems: "center",
    }}
  >
    <button
      onClick={() => {
        setSelectedUser(item);
        setOpenTambah(true);
      }}
      style={{
        background: "#2563eb",
        color: "#fff",
        border: "none",
        padding: "10px 14px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px",
      }}
    >
      Edit
    </button>

    <button
      onClick={() =>
        hapusUser(item.id)
      }
      style={{
        background: "#dc2626",
        color: "#fff",
        border: "none",
        padding: "10px 14px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px",
      }}
    >
      Hapus
    </button>
  </div>
</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddUser
        open={
          openTambah
        }
        user={
          selectedUser
        }
        onClose={() => {
          setOpenTambah(
            false
          );

          setSelectedUser(
            null
          );
        }}
      />
    </>
  );
}

const th = {
  padding:
    "14px",
  textAlign:
    "left" as const,
};

const td = {
  padding:
    "14px",
};