"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/modal";
import { supabase } from "@/lib/supabase";

export default function JenisAssetSasg({
  data,
  kategori,
}: {
  data: any[];
  kategori: any[];
}) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [editId, setEditId] = useState<number | null>(null);
  const [namaAsset, setNamaAsset] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const simpanJenisAsset = async () => {
    if (!namaAsset || !categoryId) {
      alert("Lengkapi data");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("asset_types")
      .insert({
        name: namaAsset,
        category_id: Number(categoryId),
      });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setOpen(false);
    setNamaAsset("");
    setCategoryId("");

    router.refresh();
  };

  const updateJenisAsset = async () => {
    const { error } = await supabase
      .from("asset_types")
      .update({
        name: namaAsset,
        category_id: Number(categoryId),
      })
      .eq("id", editId);

    if (error) {
      alert(error.message);
      return;
    }

    setOpen(false);
    setEditId(null);
    setNamaAsset("");
    setCategoryId("");

    router.refresh();
  };

  const hapusJenisAsset = async (id: number) => {
    if (!confirm("Yakin hapus jenis asset?")) return;

    const { error } = await supabase
      .from("asset_types")
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
          boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
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
            Jenis Asset
          </h1>

          <button
            onClick={() => {
              setEditId(null);
              setNamaAsset("");
              setCategoryId("");
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
            + Tambah Jenis Asset
          </button>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            tableLayout: "fixed",
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
                  width: "80px",
                  padding: "14px",
                  textAlign: "left",
                }}
              >
                ID
              </th>

              <th
                style={{
                  width: "300px",
                  padding: "14px",
                  textAlign: "left",
                }}
              >
                Kategori
              </th>

              <th
                style={{
                  padding: "14px",
                  textAlign: "left",
                }}
              >
                Nama Asset
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
            {data.map((item) => {
              const kategoriAsset = kategori.find(
                (k) => k.id === item.category_id
              );

              return (
                <tr
                  key={item.id}
                  style={{
                    borderBottom:
                      "1px solid #e5e7eb",
                  }}
                >
                  <td style={{ padding: "14px" }}>
                    {item.id}
                  </td>

                  <td style={{ padding: "14px" }}>
                    {kategoriAsset?.name}
                  </td>

                  <td style={{ padding: "14px" }}>
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
                          setNamaAsset(
                            item.name
                          );
                          setCategoryId(
                            String(
                              item.category_id
                            )
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
                          hapusJenisAsset(
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
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={
          editId
            ? "Edit Jenis Asset"
            : "Tambah Jenis Asset"
        }
      >
        <select
          value={categoryId}
          onChange={(e) =>
            setCategoryId(e.target.value)
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "12px",
            border:
              "1px solid #d1d5db",
            borderRadius: "6px",
          }}
        >
          <option value="">
            Pilih Kategori
          </option>

          {kategori.map((item) => (
            <option
              key={item.id}
              value={item.id}
            >
              {item.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Nama Asset"
          value={namaAsset}
          onChange={(e) =>
            setNamaAsset(e.target.value)
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
              updateJenisAsset();
            } else {
              simpanJenisAsset();
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