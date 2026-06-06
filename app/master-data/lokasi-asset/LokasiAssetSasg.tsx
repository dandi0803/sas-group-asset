"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/modal";
import { supabase } from "@/lib/supabase";

export default function LokasiAssetSasg({
  data,
}: {
  data: any[];
}) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [namaLokasi, setNamaLokasi] = useState("");
  const [site, setSite] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const simpanLokasi = async () => {
    if (!namaLokasi.trim()) {
      alert("Nama lokasi wajib diisi");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("locations")
      .insert({
        name: namaLokasi,
        site: site,
      });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setNamaLokasi("");
    setSite("");
    setOpen(false);

    router.refresh();
  };

  const updateLokasi = async () => {
    const { error } = await supabase
      .from("locations")
      .update({
        name: namaLokasi,
        site: site,
      })
      .eq("id", editId);

    if (error) {
      alert(error.message);
      return;
    }

    setOpen(false);
    setEditId(null);
    setNamaLokasi("");
    setSite("");

    router.refresh();
  };

  const hapusLokasi = async (id: number) => {
    if (!confirm("Yakin hapus lokasi?")) return;

    const { error } = await supabase
      .from("locations")
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
            Lokasi Asset
          </h1>

          <button
            onClick={() => {
              setEditId(null);
              setNamaLokasi("");
              setSite("");
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
            + Tambah Lokasi
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
              <th style={{ padding: "14px", textAlign: "left" }}>
                ID
              </th>

              <th style={{ padding: "14px", textAlign: "left" }}>
                Site
              </th>

              <th style={{ padding: "14px", textAlign: "left" }}>
                Nama Lokasi
              </th>

              <th style={{ padding: "14px", textAlign: "center" }}>
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                style={{
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <td style={{ padding: "14px" }}>
                  {item.id}
                </td>

                <td style={{ padding: "14px" }}>
                  {item.site || "-"}
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
                  <button
                    onClick={() => {
                      setEditId(item.id);
                      setNamaLokasi(item.name);
                      setSite(item.site || "");
                      setOpen(true);
                    }}
                    style={{
                      background: "#2563eb",
                      color: "#fff",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: "6px",
                      marginRight: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      hapusLokasi(item.id)
                    }
                    style={{
                      background: "#dc2626",
                      color: "#fff",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={
          editId
            ? "Edit Lokasi Asset"
            : "Tambah Lokasi Asset"
        }
      >
        <input
          type="text"
          placeholder="Site"
          value={site}
          onChange={(e) =>
            setSite(e.target.value)
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "12px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
          }}
        />

        <input
          type="text"
          placeholder="Nama Lokasi"
          value={namaLokasi}
          onChange={(e) =>
            setNamaLokasi(e.target.value)
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
          }}
        />

        <button
          onClick={() => {
            if (editId) {
              updateLokasi();
            } else {
              simpanLokasi();
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
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </Modal>
    </>
  );
}