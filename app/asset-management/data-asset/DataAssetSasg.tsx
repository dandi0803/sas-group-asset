"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { supabase } from "@/lib/supabase";
import AddAssetSasg from "./AddAssetSasg";

type Props = {
  assets: any[];
  categories: any[];
  assetTypes: any[];
  locations: any[];
  statuses: any[];
};

export default function DataAssetSasg({
  assets,
  categories,
  assetTypes,
  locations,
  statuses,
}: Props) {
  const [openTambah, setOpenTambah] =
    useState(false);

  const [selectedAsset,
    setSelectedAsset] =
    useState<any>(null);

  const [search,
  setSearch] =
  useState("");

const [
  showExportMenu,
  setShowExportMenu,
] = useState(false);

const exportExcel = () => {
  const data = filteredAssets.map(
    (item: any) => ({
      Kode: item.asset_code,
      Asset: item.asset_name,
      Brand: item.brand,
      Status: item.status,
      Lokasi: item.location,
      Kondisi: item.condition,
      User: item.user_assigned,
      "Serial Number": item.serial_number,
      "Tanggal Beli": item.purchase_date,
      Harga: item.purchase_price,
      Catatan: item.notes,
    })
  );

  const worksheet =
    XLSX.utils.json_to_sheet(data);

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Data Asset"
  );

 const today = new Date();

const fileDate =
  String(today.getDate()).padStart(2, "0") +
  String(today.getMonth() + 1).padStart(2, "0") +
  today.getFullYear();

XLSX.writeFile(
  workbook,
  `Data_Asset_${fileDate}.xlsx`
);

  setShowExportMenu(false);
};

const exportPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(
    "Laporan Data Asset",
    14,
    20
  );

  autoTable(doc, {
    startY: 30,
    head: [[
      "Kode",
      "Asset",
      "Brand",
      "Status",
      "Lokasi",
    ]],
    body: filteredAssets.map(
      (item: any) => [
        item.asset_code,
        item.asset_name,
        item.brand,
        item.status,
        item.location,
      ]
    ),
  });

  const today = new Date();

const fileDate =
  String(today.getDate()).padStart(2, "0") +
  String(today.getMonth() + 1).padStart(2, "0") +
  today.getFullYear();

doc.save(
  `Data_Asset_${fileDate}.pdf`
);

  setShowExportMenu(false);
};

  const hapusAsset = async (
    id: number
  ) => {
    const confirmDelete =
      confirm(
        "Yakin ingin menghapus asset ini?"
      );

    if (!confirmDelete)
      return;

    const { error } =
      await supabase
        .from("assets")
        .delete()
        .eq("id", id);

    if (error) {
      alert(
        error.message
      );
      return;
    }

    alert(
      "Asset berhasil dihapus"
    );

    window.location.reload();
  };

  const filteredAssets =
    assets.filter(
      (item: any) => {
        const keyword =
          search.toLowerCase();

        return (
          item.asset_code
            ?.toLowerCase()
            .includes(
              keyword
            ) ||
          item.asset_name
            ?.toLowerCase()
            .includes(
              keyword
            ) ||
          item.brand
            ?.toLowerCase()
            .includes(
              keyword
            ) ||
          item.location
            ?.toLowerCase()
            .includes(
              keyword
            )
        );
      }
    );

  const getStatusBadge =
    (status: string) => {
      if (
        status ===
        "Tersedia"
      ) {
        return (
          <span
            style={{
              background:
                "#dcfce7",
              color:
                "#166534",
              padding:
                "4px 10px",
              borderRadius:
                "999px",
              fontSize:
                "12px",
              fontWeight:
                600,
            }}
          >
            Tersedia
          </span>
        );
      }

      if (
        status ===
        "Dipakai"
      ) {
        return (
          <span
            style={{
              background:
                "#dbeafe",
              color:
                "#1d4ed8",
              padding:
                "4px 10px",
              borderRadius:
                "999px",
              fontSize:
                "12px",
              fontWeight:
                600,
            }}
          >
            Dipakai
          </span>
        );
      }

      return (
        <span
          style={{
            background:
              "#fee2e2",
            color:
              "#dc2626",
            padding:
              "4px 10px",
            borderRadius:
              "999px",
            fontSize:
              "12px",
            fontWeight:
              600,
          }}
        >
          {status}
        </span>
      );
    };

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
              Data Asset
            </h1>

            <p
              style={{
                marginTop:
                  "6px",
                color:
                  "#64748b",
              }}
            >
              Kelola data
              asset
              perusahaan
            </p>
          </div>

          <div
  style={{
    display:
      "flex",
    gap: "10px",
    position:
      "relative",
  }}
>
  <div
    style={{
      position:
        "relative",
    }}
  >
    <button
      onClick={() =>
        setShowExportMenu(
          !showExportMenu
        )
      }
      style={{
        background:
          "#16a34a",
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
      Export ▼
    </button>

    {showExportMenu && (
  <div
    style={{
      position:
        "absolute",
      top: "50px",
      right: 0,
      background:
        "#fff",
      border:
        "1px solid #ddd",
      borderRadius:
        "8px",
      minWidth:
        "180px",
      boxShadow:
        "0 4px 12px rgba(0,0,0,.1)",
      zIndex:
        999,
    }}
  >
    <button
  onClick={exportExcel}
  style={{
        width: "100%",
        padding: "12px",
        border: "none",
        background: "white",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      📊 Excel
    </button>

    <button
  onClick={exportPDF}
  style={{
        width: "100%",
        padding: "12px",
        border: "none",
        background: "white",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      📄 PDF
    </button>
  </div>
)}
  </div>
  <button
    onClick={() => {
      setSelectedAsset(
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
    + Tambah Asset
  </button>
</div>
</div>

        <div
          style={{
            marginBottom:
              "20px",
          }}
        >
          <input
            placeholder="Cari Asset..."
            value={
              search
            }
            onChange={(
              e
            ) =>
              setSearch(
                e.target
                  .value
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
              background:
                "#fff",
            }}
          />
        </div>
                <div
          style={{
            background:
              "#fff",
            borderRadius:
              "12px",
            overflow:
              "hidden",
            boxShadow:
              "0 2px 10px rgba(0,0,0,.08)",
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
                    "#0f172a",
                  color:
                    "#fff",
                }}
              >
                <th
                  style={
                    th
                  }
                >
                  Kode
                </th>

                <th
                  style={
                    th
                  }
                >
                  Asset
                </th>

                <th
                  style={
                    th
                  }
                >
                  Brand
                </th>

                <th
                  style={
                    th
                  }
                >
                  Status
                </th>

                <th
                  style={
                    th
                  }
                >
                  Lokasi
                </th>

                <th
                  style={
                    th
                  }
                >
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredAssets.map(
                (
                  item: any
                ) => (
                  <tr
                    key={
                      item.id
                    }
                    style={{
                      borderBottom:
                        "1px solid #e5e7eb",
                    }}
                  >
                    <td
                      style={
                        td
                      }
                    >
                      {
                        item.asset_code
                      }
                    </td>

                    <td
                      style={
                        td
                      }
                    >
                      {
                        item.asset_name
                      }
                    </td>

                    <td
                      style={
                        td
                      }
                    >
                      {
                        item.brand
                      }
                    </td>

                    <td
                      style={
                        td
                      }
                    >
                      {getStatusBadge(
                        item.status
                      )}
                    </td>

                    <td
                      style={
                        td
                      }
                    >
                      {
                        item.location
                      }
                    </td>

                    <td
                      style={
                        td
                      }
                    >
                      <div
                        style={{
                          display:
                            "flex",
                          gap:
                            "8px",
                        }}
                      >
                        <button
                          onClick={() => {
                            setSelectedAsset(
                              item
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
                              "8px 12px",
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
                            hapusAsset(
                              item.id
                            )
                          }
                          style={{
                            background:
                              "#dc2626",
                            color:
                              "#fff",
                            border:
                              "none",
                            padding:
                              "8px 12px",
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
                )
              )}

              {filteredAssets.length ===
                0 && (
                <tr>
                  <td
                    colSpan={
                      6
                    }
                    style={{
                      padding:
                        "30px",
                      textAlign:
                        "center",
                    }}
                  >
                    Tidak ada
                    data asset
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
              </div>

      <AddAssetSasg
        open={
          openTambah
        }
        asset={
          selectedAsset
        }
        onClose={() => {
          setOpenTambah(
            false
          );

          setSelectedAsset(
            null
          );
        }}
        categories={
          categories
        }
        assetTypes={
          assetTypes
        }
        locations={
          locations
        }
        statuses={
          statuses
        }
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