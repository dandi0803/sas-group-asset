"use client";

import {
  useState,
  useEffect,
} from "react";

import { supabase } from "@/lib/supabase";

type Props = {
  open: boolean;
  onClose: () => void;

  asset?: any;

  categories: any[];
  assetTypes: any[];
  locations: any[];
  statuses: any[];
};

export default function AddAssetSasg({
  open,
  onClose,
  asset,
  categories,
  assetTypes,
  locations,
  statuses,
}: Props) {
  const [loading, setLoading] =
    useState(false);
    

  const [form, setForm] =
    useState({
      asset_code: "",
      asset_name: "",

      category_id: "",

      asset_type_id: "",

      brand: "",

      serial_number: "",

      condition: "",

      status_id: "",

      location: "",

      user_assigned: "",

      purchase_date: "",

      purchase_price: "",

      notes: "",
    });

  useEffect(() => {
    if (!asset) {
      setForm({
        asset_code: "",
        asset_name: "",

        category_id: "",

        asset_type_id: "",

        brand: "",

        serial_number: "",

        condition: "",

        status_id: "",

        location: "",

        user_assigned: "",

        purchase_date: "",

        purchase_price: "",

        notes: "",
      });

      return;
    }

    setForm({
      asset_code:
        asset.asset_code || "",

      asset_name:
        asset.asset_name || "",

      category_id:
        String(
          asset.category_id || ""
        ),

      asset_type_id:
        String(
          asset.asset_type_id || ""
        ),

      brand:
        asset.brand || "",

      serial_number:
        asset.serial_number ||
        "",

      condition:
        asset.condition || "",

      status_id:
        String(
          asset.status_id || ""
        ),

      location:
        asset.location || "",

      user_assigned:
        asset.user_assigned ||
        "",

      purchase_date:
        asset.purchase_date ||
        "",

      purchase_price:
        String(
          asset.purchase_price ||
            ""
        ),

      notes:
        asset.notes || "",
    });
  }, [asset]);

  if (!open) return null;

  const simpanAsset =
    async () => {
      try {
        setLoading(true);

        const selectedStatus =
          statuses.find(
            (x: any) =>
              Number(x.id) ===
              Number(
                form.status_id
              )
          );
          
if (!form.asset_type_id) {
  alert(
    "Jenis Asset wajib dipilih"
  );
  return;
}

if (!form.category_id) {
  alert(
    "Kategori wajib dipilih"
  );
  return;
}

if (!form.status_id) {
  alert(
    "Status Asset wajib dipilih"
  );
  return;
}

        const payload = {
          asset_code:
            form.asset_code,

          asset_name:
            form.asset_name,

          category_id:
            Number(
              form.category_id
            ),

          asset_type_id:
            Number(
              form.asset_type_id
            ),

          brand:
            form.brand,

          serial_number:
            form.serial_number,

          condition:
            form.condition,

          status:
            selectedStatus?.name ||
            "",

          status_id:
            Number(
              form.status_id
            ),

          location:
            form.location,

          user_assigned:
            form.user_assigned,

          purchase_date:
            form.purchase_date ||
            null,

          purchase_price:
            form.purchase_price
              ? Number(
                  form.purchase_price
                )
              : null,

          notes:
            form.notes,
        };

        let error = null;

        if (asset?.id) {
          const result =
            await supabase
              .from(
                "assets"
              )
              .update(
                payload
              )
              .eq(
                "id",
                asset.id
              );

          error =
            result.error;
        } else {
          const result =
            await supabase
              .from(
                "assets"
              )
              .insert([
                payload,
              ]);

          error =
            result.error;
        }

        if (error) {

  if (
    error.message?.includes(
      "assets_asset_code_key"
    )
  ) {

    alert(
      "Tidak dapat menambahkan asset. Kode asset sudah terdaftar."
    );

  } else {

    alert(
      error.message
    );

  }

  return;
}

        alert(
          asset
            ? "Asset berhasil diupdate"
            : "Asset berhasil disimpan"
        );

        window.location.reload();
      } catch (
  err: any
) {

  if (
    err.message?.includes(
      "assets_asset_code_key"
    )
  ) {

    alert(
      "Tidak dapat menambahkan asset. Kode asset sudah terdaftar."
    );

  } else {

    alert(
      err.message
    );

  }

} finally {
        setLoading(
          false
        );
      }
    };
      return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(0,0,0,.5)",
        zIndex: 9999,
        overflowY: "auto",
        padding: "40px",
      }}
    >
      <div
        style={{
          background: "#fff",
          maxWidth: "1100px",
          margin: "0 auto",
          borderRadius: "12px",
          padding: "30px",
          boxShadow:
            "0 10px 30px rgba(0,0,0,.15)",
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
            <h2>
              {asset
                ? "Edit Asset"
                : "Tambah Asset"}
            </h2>

            <p>
              {asset
                ? "Update data asset"
                : "Input data asset baru"}
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              border: "none",
              background:
                "transparent",
              fontSize:
                "20px",
              cursor:
                "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: "20px",
          }}
        >
          <Field
            label="Kode Asset"
            value={
              form.asset_code
            }
            onChange={(v) =>
              setForm({
                ...form,
                asset_code: v,
              })
            }
          />

          <Field
            label="Nama Asset"
            value={
              form.asset_name
            }
            onChange={(v) =>
              setForm({
                ...form,
                asset_name: v,
              })
            }
          />

          <div>
            <label>
              Kategori
            </label>

            <select
              style={
                inputStyle
              }
              value={
                form.category_id
              }
              onChange={(
                e
              ) =>
                setForm({
                  ...form,
                  category_id:
                    e.target
                      .value,
                  asset_type_id:
                    "",
                })
              }
            >
              <option value="">
                Pilih
                Kategori
              </option>

              {categories.map(
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

          <div>
            <label>
              Jenis Asset
            </label>

            <select
              style={
                inputStyle
              }
              value={
                form.asset_type_id
              }
              onChange={(
                e
              ) =>
                setForm({
                  ...form,
                  asset_type_id:
                    e.target
                      .value,
                })
              }
            >
              <option value="">
                Pilih
                Jenis Asset
              </option>

              {assetTypes
                .filter(
                  (
                    x: any
                  ) =>
                    Number(
                      x.category_id
                    ) ===
                    Number(
                      form.category_id
                    )
                )
                .map(
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

          <Field
            label="Brand"
            value={
              form.brand
            }
            onChange={(v) =>
              setForm({
                ...form,
                brand: v,
              })
            }
          />

          <Field
            label="Serial Number"
            value={
              form.serial_number
            }
            onChange={(v) =>
              setForm({
                ...form,
                serial_number:
                  v,
              })
            }
          />

          <Field
            label="Kondisi"
            value={
              form.condition
            }
            onChange={(v) =>
              setForm({
                ...form,
                condition:
                  v,
              })
            }
          />
                    <div>
            <label>
              Status Asset
            </label>

            <select
              style={
                inputStyle
              }
              value={
                form.status_id
              }
              onChange={(
                e
              ) =>
                setForm({
                  ...form,
                  status_id:
                    e.target
                      .value,
                })
              }
            >
              <option value="">
                Pilih Status
              </option>

              {statuses.map(
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

          <div>
            <label>
              Lokasi Asset
            </label>

            <select
              style={
                inputStyle
              }
              value={
                form.location
              }
              onChange={(
                e
              ) =>
                setForm({
                  ...form,
                  location:
                    e.target
                      .value,
                })
              }
            >
              <option value="">
                Pilih Lokasi
              </option>

              {locations.map(
                (
                  item: any
                ) => (
                  <option
                    key={
                      item.id
                    }
                    value={
                      item.name
                    }
                  >
                    {
                      item.site
                    }{" "}
                    -{" "}
                    {
                      item.name
                    }
                  </option>
                )
              )}
            </select>
          </div>

          <Field
            label="User Assigned"
            value={
              form.user_assigned
            }
            onChange={(v) =>
              setForm({
                ...form,
                user_assigned:
                  v,
              })
            }
          />

          <div>
            <label>
              Tanggal Pembelian
            </label>

            <input
              type="date"
              style={
                inputStyle
              }
              value={
                form.purchase_date
              }
              onChange={(
                e
              ) =>
                setForm({
                  ...form,
                  purchase_date:
                    e.target
                      .value,
                })
              }
            />
          </div>

          <Field
            label="Harga Pembelian"
            value={
              form.purchase_price
            }
            onChange={(v) =>
              setForm({
                ...form,
                purchase_price:
                  v,
              })
            }
          />
        </div>

        <div
          style={{
            marginTop:
              "20px",
          }}
        >
          <label>
            Catatan
          </label>

          <textarea
            rows={5}
            style={{
              width:
                "100%",
              padding:
                "10px",
              border:
                "1px solid #ccc",
              borderRadius:
                "6px",
            }}
            value={
              form.notes
            }
            onChange={(
              e
            ) =>
              setForm({
                ...form,
                notes:
                  e.target
                    .value,
              })
            }
          />
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
          >
            Batal
          </button>

          <button
            onClick={
              simpanAsset
            }
            disabled={
              loading
            }
          >
            {loading
              ? "Menyimpan..."
              : asset
              ? "Update Asset"
              : "Simpan Asset"}
          </button>
        </div>
      </div>
    </div>
  );
  }

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
}) {
  return (
    <div>
      <label
        style={{
          display:
            "block",
          marginBottom:
            "6px",
          fontWeight:
            500,
        }}
      >
        {label}
      </label>

      <input
        style={
          inputStyle
        }
        value={value}
        onChange={(
          e
        ) =>
          onChange(
            e.target
              .value
          )
        }
      />
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "6px",
  border:
    "1px solid #d1d5db",
  borderRadius:
    "6px",
  outline: "none",
};