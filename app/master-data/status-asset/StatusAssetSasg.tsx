"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/modal";
import { supabase } from "@/lib/supabase";

export default function StatusAssetSasg({
  data,
}: {
  data: any[];
}) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [editId, setEditId] =
    useState<number | null>(null);

  const [namaStatus, setNamaStatus] =
    useState("");

  const simpanStatus = async () => {
    if (!namaStatus) {
      alert("Nama status wajib diisi");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("asset_statuses")
      .insert({
        name: namaStatus,
      });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setOpen(false);
    setNamaStatus("");

    router.refresh();
  };

  const updateStatus = async () => {
    const { error } = await supabase
      .from("asset_statuses")
      .update({
        name: namaStatus,
      })
      .eq("id", editId);

    if (error) {
      alert(error.message);
      return;
    }

    setOpen(false);
    setEditId(null);
    setNamaStatus("");

    router.refresh();
  };

  const hapusStatus = async (
    id: number
  ) => {
    if (
      !confirm(
        "Yakin hapus status asset?"
      )
    )
      return;

    const { error } = await supabase
      .from("asset_statuses")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    router.refresh();
  };

  return (
    <>
      <div
        style={{
          background: "#fff",
          padding: "24px",
          borderRadius: "12px",
          boxShadow:
            "0 1px 6px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: "bold",
            }}
          >
            Status Asset
          </h1>

          <button
            onClick={() => {
              setEditId(null);
              setNamaStatus("");
              setOpen(true);
            }}
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              padding: "12px 18px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            + Tambah Status
          </button>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#1e293b",
                color: "#fff",
              }}
            >
              <th
                style={{
                  width: "100px",
                  padding: "14px",
                  textAlign: "left",
                }}
              >
                ID
              </th>

              <th
                style={{
                  padding: "14px",
                  textAlign: "left",
                }}
              >
                Nama Status
              </th>

              <th
                style={{
                  width: "180px",
                  padding: "14px",
                  textAlign: "center",
                }}
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                style={{
                  borderBottom:
                    "1px solid #e5e7eb",
                }}
              >
                <td
                  style={{
                    padding: "14px",
                  }}
                >
                  {item.id}
                </td>

                <td
                  style={{
                    padding: "14px",
                  }}
                >
                  {item.name}
                </td>

                <td
                  style={{
                    padding: "14px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "center",
                      gap: "8px",
                    }}
                  >
                    <button
                      onClick={() => {
                        setEditId(item.id);
                        setNamaStatus(
                          item.name
                        );
                        setOpen(true);
                      }}
                      style={{
                        background:
                          "#2563eb",
                        color: "#fff",
                        border: "none",
                        padding:
                          "8px 14px",
                        borderRadius:
                          "6px",
                        cursor:
                          "pointer",
                      }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        hapusStatus(
                          item.id
                        )
                      }
                      style={{
                        background:
                          "#dc2626",
                        color: "#fff",
                        border: "none",
                        padding:
                          "8px 14px",
                        borderRadius:
                          "6px",
                        cursor:
                          "pointer",
                      }}
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        onClose={() =>
          setOpen(false)
        }
        title={
          editId
            ? "Edit Status Asset"
            : "Tambah Status Asset"
        }
      >
        <input
          type="text"
          placeholder="Nama Status"
          value={namaStatus}
          onChange={(e) =>
            setNamaStatus(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            border:
              "1px solid #d1d5db",
            borderRadius: "6px",
          }}
        />

        <button
          onClick={() => {
            if (editId) {
              updateStatus();
            } else {
              simpanStatus();
            }
          }}
          disabled={loading}
          style={{
            background: "#16a34a",
            color: "#fff",
            border: "none",
            padding: "10px 16px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {loading
            ? "Menyimpan..."
            : "Simpan"}
        </button>
      </Modal>
    </>
  );
}