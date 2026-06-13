"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuditAssetPage() {
  const [assets, setAssets] =
    useState<any[]>([]);

  const [selectedAsset, setSelectedAsset] =
    useState<any>(null);

  const [auditItems, setAuditItems] =
    useState<any[]>([]);


    const [notes, setNotes] =
  useState("");

const [auditPhotos, setAuditPhotos] =
  useState<any>({});
  const [searchAsset, setSearchAsset] =
  useState("");

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    const { data, error } =
      await supabase
        .from("assets")
        .select("*")
        .order("asset_name");

    if (error) {
      console.log(error);
      return;
    }

    setAssets(data || []);
  };

  const pilihAsset = async (
    assetId: number
  ) => {
    const asset =
      assets.find(
        (x) =>
          x.id === assetId
      );

    setSelectedAsset(asset);

    if (!asset) {
      setAuditItems([]);
      return;
    }

    const {
      data: template,
    } = await supabase
      .from(
        "audit_templates"
      )
      .select("*")
      .eq(
        "asset_type_id",
        asset.asset_type_id
      )
      .single();

    if (!template) {
      setAuditItems([]);
      return;
    }

    const {
      data: items,
    } = await supabase
      .from(
        "audit_template_items"
      )
      .select("*")
      .eq(
        "template_id",
        template.id
      )
      .order(
        "item_order"
      );

    setAuditItems(
      (items || []).map(
        (item) => ({
          ...item,
          condition: "",
          remarks: "",
        })
      )
    );
  };

  const updateItem = (
    id: number,
    field: string,
    value: string
  ) => {
    setAuditItems(
      auditItems.map(
        (item) =>
          item.id === id
            ? {
                ...item,
                [field]: value,
              }
            : item
      )
    );
  };
    const simpanAudit =
    async () => {
      if (
        !selectedAsset
      ) {
        alert(
          "Pilih asset terlebih dahulu"
        );
        return;
      }

      const auditNumber =
        "AUD-" +
        Date.now();

      const {
        data:
          auditHeader,
        error:
          headerError,
      } =
        await supabase
          .from(
            "audit_header"
          )
          .insert([
            {
              audit_number:
                auditNumber,
              asset_id:
                selectedAsset.id,
              auditor:
                "Administrator",
              audit_date:
                new Date(),
              notes:
                notes,
            },
          ])
          .select()
          .single();

      if (
        headerError
      ) {
        console.log(
          headerError
        );
        alert(
          "Gagal simpan header audit"
        );
        return;
      }

      const details =
        auditItems.map(
          (
            item
          ) => ({
            audit_id:
              auditHeader.id,
            audit_item_id:
              item.id,
            condition:
              item.condition,
            remarks:
              item.remarks,
          })
        );

      const {
  data: detailData,
  error: detailError,
} =
  await supabase
    .from("audit_detail")
    .insert(details)
    .select();

if (detailError) {
  console.log(detailError);
  alert("Gagal simpan detail audit");
  return;
}

for (const detail of detailData || []) {
  const files = auditPhotos[detail.audit_item_id];

  if (!files || files.length === 0) {
    continue;
  }

  for (const file of Array.from(files) as File[]) {
    const ext = file.name.split(".").pop();

    const fileName = `${detail.id}-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${ext}`;

    const filePath = `audit/${fileName}`;

    const { error: uploadError } =
      await supabase.storage
        .from("audit-photo")
        .upload(filePath, file);

    if (uploadError) {
  console.log("UPLOAD ERROR:", uploadError);
  alert("Foto gagal upload: " + uploadError.message);
  continue;
}

    const { data: publicUrlData } =
      supabase.storage
        .from("audit-photo")
        .getPublicUrl(filePath);

   const { data: photoInsert, error: photoError } =
  await supabase
    .from("audit_photos")
    .insert({
      audit_detail_id: detail.id,
      photo_url: publicUrlData.publicUrl,
    })
    .select();

console.log(
  "PHOTO INSERT",
  photoInsert
);

console.log(
  "PHOTO ERROR",
  photoError
);

if (photoError) {
  console.log("PHOTO ERROR:", photoError);
  alert(
    "URL foto gagal disimpan : " +
      photoError.message
  );
}
  }
}

      alert(
        "Audit berhasil disimpan"
      );

      setSelectedAsset(
        null
      );

      setAuditItems(
        []
      );

      setNotes("");
    };
      return (
    <div
      style={{
        background: "#fff",
        padding: "25px",
        borderRadius: "12px",
        boxShadow:
          "0 2px 10px rgba(0,0,0,.08)",
      }}
    >
      <h1>Audit Asset</h1>

      <p
        style={{
          color: "#64748b",
        }}
      >
        Pilih asset yang akan diaudit
      </p>

      <div
  style={{
    marginTop: "20px",
    marginBottom: "25px",
    width: "500px",
  }}
>
  <input
    type="text"
    placeholder="Cari kode atau nama asset..."
    value={searchAsset}
    onChange={(e) =>
      setSearchAsset(
        e.target.value
      )
    }
    style={{
      width: "100%",
      padding: "12px",
      borderRadius: "8px",
      border:
        "1px solid #d1d5db",
      marginBottom: "10px",
    }}
  />

  <div
    style={{
      maxHeight: "250px",
      overflowY: "auto",
      border:
        "1px solid #d1d5db",
      borderRadius: "8px",
      background: "#fff",
    }}
  >
    {assets
      .filter(
        (asset) =>
          asset.asset_code
            ?.toLowerCase()
            .includes(
              searchAsset.toLowerCase()
            ) ||
          asset.asset_name
            ?.toLowerCase()
            .includes(
              searchAsset.toLowerCase()
            )
      )
      .slice(0, 20)
      .map((asset) => (
        <div
          key={asset.id}
          onClick={() =>
            pilihAsset(
              asset.id
            )
          }
          style={{
            padding: "10px",
            cursor: "pointer",
            borderBottom:
              "1px solid #eee",
          }}
        >
          <b>
            {
              asset.asset_code
            }
          </b>
          {" - "}
          {
            asset.asset_name
          }
        </div>
      ))}
  </div>
</div>

      {selectedAsset && (
        <>
          <div
            style={{
              background:
                "#f8fafc",
              padding:
                "20px",
              borderRadius:
                "10px",
              marginBottom:
                "20px",
            }}
          >
            <h3>
              Informasi Asset
            </h3>

            <p>
              <b>Kode :</b>{" "}
              {
                selectedAsset.asset_code
              }
            </p>

            <p>
              <b>Nama :</b>{" "}
              {
                selectedAsset.asset_name
              }
            </p>

            <p>
              <b>Asset Type ID :</b>{" "}
              {
                selectedAsset.asset_type_id
              }
            </p>
          </div>
                    {auditItems.length >
          0 ? (
            <div
              style={{
                background:
                  "#f8fafc",
                padding:
                  "20px",
                borderRadius:
                  "10px",
              }}
            >
              <h3>
                Checklist Audit
              </h3>

              <table
                style={{
                  width:
                    "100%",
                  borderCollapse:
                    "collapse",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={
                        thStyle
                      }
                    >
                      No
                    </th>

                    <th
                      style={
                        thStyle
                      }
                    >
                      Item Audit
                    </th>

                    <th
  style={
    thStyle
  }
>
  Hasil
</th>

<th
  style={
    thStyle
  }
>
  Foto
</th>

<th
  style={
    thStyle
  }
>
  Remark
</th>
                  </tr>
                </thead>

                <tbody>
                  {auditItems.map(
                    (
                      item,
                      index
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
                          {index +
                            1}
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {
                            item.item_name
                          }
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          <label>
                            <input
                              type="radio"
                              name={`hasil-${item.id}`}
                              value="Baik"
                              checked={
                                item.condition ===
                                "Baik"
                              }
                              onChange={(
                                e
                              ) =>
                                updateItem(
                                  item.id,
                                  "condition",
                                  e
                                    .target
                                    .value
                                )
                              }
                            />{" "}
                            Baik
                          </label>

                          <br />

                          <label>
                            <input
                              type="radio"
                              name={`hasil-${item.id}`}
                              value="Tidak Baik"
                              checked={
                                item.condition ===
                                "Tidak Baik"
                              }
                              onChange={(
                                e
                              ) =>
                                updateItem(
                                  item.id,
                                  "condition",
                                  e
                                    .target
                                    .value
                                )
                              }
                            />{" "}
                            Tidak
                            Baik
                          </label>
                        </td>

                        <td style={tdStyle}>
  <label
    style={{
      cursor: "pointer",
      fontSize: "24px",
    }}
  >
    📷

    <input
      type="file"
      multiple
      accept="image/*"
      style={{
        display: "none",
      }}
      onChange={(e) =>
        setAuditPhotos({
          ...auditPhotos,
          [item.id]:
            e.target.files,
        })
      }
    />
  </label>
</td>

<td style={tdStyle}>
  <input
    value={
      item.remarks
    }
    onChange={(e) =>
      updateItem(
        item.id,
        "remarks",
        e.target.value
      )
    }
    placeholder="Remark..."
    style={{
      width: "100%",
      padding: "8px",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
    }}
  />
</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
                            <div
                style={{
                  marginTop:
                    "20px",
                }}
              >
                <label>
                  Catatan Audit
                </label>

                <textarea
                  value={
                    notes
                  }
                  onChange={(
                    e
                  ) =>
                    setNotes(
                      e.target
                        .value
                    )
                  }
                  rows={4}
                  style={{
                    width:
                      "100%",
                    marginTop:
                      "8px",
                    padding:
                      "10px",
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
                    "20px",
                  textAlign:
                    "right",
                }}
              >
                <button
                  onClick={
                    simpanAudit
                  }
                  style={{
                    background:
                      "#16a34a",
                    color:
                      "#fff",
                    border:
                      "none",
                    padding:
                      "12px 20px",
                    borderRadius:
                      "8px",
                    cursor:
                      "pointer",
                    fontWeight:
                      "bold",
                  }}
                >
                  💾 Simpan Audit
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                background:
                  "#fef2f2",
                padding:
                  "15px",
                borderRadius:
                  "8px",
                color:
                  "#dc2626",
              }}
            >
              Template audit
              tidak ditemukan
              untuk asset
              ini.
            </div>
          )}
        </>
      )}
    </div>
  );
}

const thStyle = {
  background:
    "#0f172a",
  color: "#fff",
  padding: "12px",
  textAlign:
    "left" as const,
};

const tdStyle = {
  padding: "12px",
  borderBottom:
    "1px solid #e5e7eb",
};