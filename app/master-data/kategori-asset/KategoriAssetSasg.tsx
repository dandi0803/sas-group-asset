"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/modal";
import { supabase } from "@/lib/supabase";

export default function KategoriAssetSasg({
  data,
}: {
  data: any[];
}) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [namaKategori, setNamaKategori] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const simpanKategori = async () => {
    if (!namaKategori.trim()) {
      alert("Nama kategori wajib diisi");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("categories")
      .insert({
        name: namaKategori,
      });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setNamaKategori("");
    setOpen(false);

    router.refresh();
  };

  const updateKategori = async () => {
    if (!namaKategori.trim()) {
      alert("Nama kategori wajib diisi");
      return;
    }

    const { error } = await supabase
      .from("categories")
      .update({
        name: namaKategori,
      })
      .eq("id", editId);

    if (error) {
      alert(error.message);
      return;
    }

    setOpen(false);
    setNamaKategori("");
    setEditId(null);

    router.refresh();
  };

  const hapusKategori = async (id: number) => {
    const konfirmasi = confirm(
      "Yakin ingin menghapus kategori ini?"
    );

    if (!konfirmasi) return;

    const { count, error: cekError } = await supabase
      .from("asset_types")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("category_id", id);

    if (cekError) {
      alert(cekError.message);
      return;
    }

    if ((count ?? 0) > 0) {
      alert(
        `Kategori masih digunakan oleh ${count} Jenis Asset dan tidak bisa dihapus.`
      );
      return;
    }

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Kategori berhasil dihapus");

    router.refresh();
  };

  return (
    <>
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
            fontSize: "32px",
            fontWeight: "bold",
          }}
        >
          Kategori Asset
        </h1>

        <button
          onClick={() => {
            setEditId(null);
            setNamaKategori("");
            setOpen(true);
          }}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "10px 16px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          + Tambah Kategori
        </button>
      </div>

      <table
        style={{
          width: "100%",
          background: "white",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr
            style={{
              background: "#1e293b",
              color: "white",
            }}
          >
            <th style={{ padding: "12px", textAlign: "left" }}>ID</th>
            <th style={{ padding: "12px", textAlign: "left" }}>
              Nama Kategori
            </th>
            <th style={{ padding: "12px", textAlign: "center" }}>
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
              <td style={{ padding: "12px" }}>{item.id}</td>

              <td style={{ padding: "12px" }}>{item.name}</td>

              <td
                style={{
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                <button
                  onClick={() => {
                    setEditId(item.id);
                    setNamaKategori(item.name);
                    setOpen(true);
                  }}
                  style={{
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    marginRight: "8px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => hapusKategori(item.id)}
                  style={{
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
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

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={
          editId
            ? "Edit Kategori Asset"
            : "Tambah Kategori Asset"
        }
      >
        <input
          type="text"
          value={namaKategori}
          onChange={(e) => setNamaKategori(e.target.value)}
          placeholder="Nama Kategori"
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            marginBottom: "15px",
          }}
        />

        <button
          onClick={() => {
            if (editId) {
              updateKategori();
            } else {
              simpanKategori();
            }
          }}
          disabled={loading}
          style={{
            background: "#16a34a",
            color: "white",
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