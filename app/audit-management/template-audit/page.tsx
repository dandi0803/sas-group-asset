"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TemplateAuditPage() {
  const [templates, setTemplates] =
    useState<any[]>([]);

  const [assetTypes, setAssetTypes] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showModal, setShowModal] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [templateName, setTemplateName] =
    useState("");

  const [assetTypeId, setAssetTypeId] =
    useState("");

  const loadData = async () => {
    try {
      const { data: templateData } =
        await supabase
          .from("audit_templates")
          .select("*")
          .order("id", {
            ascending: false,
          });

      const { data: assetTypeData } =
        await supabase
          .from("asset_types")
          .select("*")
          .order("name");

      setTemplates(
        templateData || []
      );

      setAssetTypes(
        assetTypeData || []
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const simpanTemplate =
    async () => {
      if (
        !templateName ||
        !assetTypeId
      ) {
        alert(
          "Lengkapi data"
        );
        return;
      }

      const { error } =
        await supabase
          .from(
            "audit_templates"
          )
          .insert({
            template_name:
              templateName,
            asset_type_id:
              Number(
                assetTypeId
              ),
          });

      if (error) {
        alert(
          error.message
        );
        return;
      }

      setTemplateName("");
      setAssetTypeId("");

      setShowModal(false);

      loadData();
    };

  const hapusTemplate =
    async (
      id: number
    ) => {
      if (
        !confirm(
          "Hapus Template Audit?"
        )
      )
        return;

      await supabase
        .from(
          "audit_templates"
        )
        .delete()
        .eq("id", id);

      loadData();
    };

  const filteredData =
    templates.filter(
      (item: any) =>
        item.template_name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );
      return (
    <>
      <div
        style={{
          background:
            "#ffffff",
          borderRadius:
            "12px",
          padding: "25px",
          boxShadow:
            "0 2px 10px rgba(0,0,0,.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            marginBottom:
              "25px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
              }}
            >
              Template Audit
            </h1>

            <p
              style={{
                color:
                  "#64748b",
                marginTop:
                  "8px",
              }}
            >
              Kelola Template
              Audit Inspection
            </p>
          </div>

          <button
            onClick={() =>
              setShowModal(
                true
              )
            }
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
            + Tambah Template
          </button>
        </div>

        <input
          placeholder="Cari Template..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          style={{
            width: "350px",
            padding: "12px",
            border:
              "1px solid #d1d5db",
            borderRadius:
              "8px",
            marginBottom:
              "20px",
          }}
        />

        <table
          style={{
            width: "100%",
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
                  "white",
              }}
            >
              <th
                style={
                  thStyle
                }
              >
                ID
              </th>

              <th
                style={
                  thStyle
                }
              >
                Template
              </th>

              <th
                style={
                  thStyle
                }
              >
                Asset Type
              </th>

              <th
                style={
                  thStyle
                }
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map(
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
                      tdStyle
                    }
                  >
                    {item.id}
                  </td>

                  <td
                    style={
                      tdStyle
                    }
                  >
                    {
                      item.template_name
                    }
                  </td>

                  <td
                    style={
                      tdStyle
                    }
                  >
                    {
                      assetTypes.find(
                        (
                          x: any
                        ) =>
                          x.id ===
                          item.asset_type_id
                      )
                        ?.name
                    }
                  </td>

                  <td
                    style={
                      tdStyle
                    }
                  >
                    <Link
  href={`/audit-management/template-audit-items/${item.id}`}
>
  <button
    style={{
      background:
        "#16a34a",
      color:
        "#fff",
      border:
        "none",
      padding:
        "8px 12px",
      borderRadius:
        "6px",
      marginRight:
        "5px",
      cursor:
        "pointer",
    }}
  >
    Item
  </button>
</Link>
                    <button
                      onClick={() =>
                        hapusTemplate(
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
                      }}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
            {/* MODAL */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,.4)",
            display: "flex",
            justifyContent:
              "center",
            alignItems:
              "center",
          }}
        >
          <div
            style={{
              width: "500px",
              background: "#fff",
              borderRadius: "12px",
              padding: "25px",
            }}
          >
            <h2>
              Tambah Template
              Audit
            </h2>

            <div
              style={{
                marginTop:
                  "20px",
              }}
            >
              <label>
                Nama Template
              </label>

              <input
                value={
                  templateName
                }
                onChange={(
                  e
                ) =>
                  setTemplateName(
                    e.target
                      .value
                  )
                }
                style={{
                  width:
                    "100%",
                  padding:
                    "10px",
                  marginTop:
                    "5px",
                  border:
                    "1px solid #d1d5db",
                  borderRadius:
                    "8px",
                }}
              />
            </div>

            <div
              style={{
                marginTop:
                  "15px",
              }}
            >
              <label>
                Jenis Asset
              </label>

              <select
                value={
                  assetTypeId
                }
                onChange={(
                  e
                ) =>
                  setAssetTypeId(
                    e.target
                      .value
                  )
                }
                style={{
                  width:
                    "100%",
                  padding:
                    "10px",
                  marginTop:
                    "5px",
                  border:
                    "1px solid #d1d5db",
                  borderRadius:
                    "8px",
                }}
              >
                <option value="">
                  Pilih
                  Jenis
                  Asset
                </option>

                {assetTypes.map(
                  (
                    item: any
                  ) => (
                    <option
                      key={
                        item.id
                      }
                      value={
                        item.id
                      }
                    >
                      {
                        item.name
                      }
                    </option>
                  )
                )}
              </select>
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
                onClick={() =>
                  setShowModal(
                    false
                  )
                }
              >
                Batal
              </button>

              <button
                onClick={
                  simpanTemplate
                }
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const thStyle = {
  padding: "12px",
  textAlign:
    "left" as const,
};

const tdStyle = {
  padding: "12px",
  borderBottom:
    "1px solid #e5e7eb",
};