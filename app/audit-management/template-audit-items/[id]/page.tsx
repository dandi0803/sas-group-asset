"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Page() {
  const params = useParams();

  const [template, setTemplate] =
    useState<any>(null);

  const [items, setItems] =
    useState<any[]>([]);

  const [itemName, setItemName] =
    useState("");

  const loadData = async () => {
    const { data: templateData } =
      await supabase
        .from("audit_templates")
        .select("*")
        .eq(
          "id",
          Number(params.id)
        )
        .single();

    const { data: itemData } =
      await supabase
        .from(
          "audit_template_items"
        )
        .select("*")
        .eq(
          "template_id",
          Number(params.id)
        )
        .order(
          "item_order",
          {
            ascending: true,
          }
        );

    setTemplate(
      templateData
    );

    setItems(
      itemData || []
    );
  };

  useEffect(() => {
    if (params.id) {
      loadData();
    }
  }, [params.id]);

  const simpanItem =
    async () => {
      if (!itemName) {
        alert(
          "Nama item wajib diisi"
        );
        return;
      }

      const { error } =
        await supabase
          .from(
            "audit_template_items"
          )
          .insert({
            template_id:
              Number(
                params.id
              ),
            item_name:
              itemName,
            item_order:
              items.length +
              1,
          });

      if (error) {
        alert(
          error.message
        );
        return;
      }

      setItemName("");

      loadData();
    };

  const hapusItem =
    async (
      id: number
    ) => {
      if (
        !confirm(
          "Hapus item audit?"
        )
      )
        return;

      await supabase
        .from(
          "audit_template_items"
        )
        .delete()
        .eq("id", id);

      loadData();
    };

  return (
  <div
    style={{
      background: "#fff",
      borderRadius: "12px",
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
        alignItems: "center",
        marginBottom: "25px",
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
          }}
        >
          Item Audit
        </h1>

        <p
          style={{
            color: "#64748b",
            marginTop: "8px",
          }}
        >
          Template :
          {" "}
          {
            template?.template_name
          }
        </p>
      </div>
    </div>

    <div
      style={{
        display: "flex",
        gap: "10px",
        marginBottom: "20px",
      }}
    >
      <input
        placeholder="Nama Item Audit..."
        value={itemName}
        onChange={(e) =>
          setItemName(
            e.target.value
          )
        }
        style={{
          width: "350px",
          padding: "12px",
          border:
            "1px solid #d1d5db",
          borderRadius: "8px",
        }}
      />

      <button
        onClick={simpanItem}
        style={{
          background:
            "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius:
            "8px",
          padding:
            "12px 18px",
          cursor:
            "pointer",
          fontWeight:
            "bold",
        }}
      >
        + Tambah Item
      </button>
    </div>

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
              "#fff",
          }}
        >
          <th
            style={{
              padding:
                "12px",
              textAlign:
                "left",
            }}
          >
            No
          </th>

          <th
            style={{
              padding:
                "12px",
              textAlign:
                "left",
            }}
          >
            Item Audit
          </th>

          <th
            style={{
              padding:
                "12px",
              textAlign:
                "center",
            }}
          >
            Action
          </th>
        </tr>
      </thead>

      <tbody>
        {items.map(
          (
            item: any,
            index
          ) => (
            <tr
              key={
                item.id
              }
            >
              <td
                style={{
                  padding:
                    "12px",
                  borderBottom:
                    "1px solid #e5e7eb",
                }}
              >
                {index + 1}
              </td>

              <td
                style={{
                  padding:
                    "12px",
                  borderBottom:
                    "1px solid #e5e7eb",
                }}
              >
                {
                  item.item_name
                }
              </td>

              <td
                style={{
                  padding:
                    "12px",
                  borderBottom:
                    "1px solid #e5e7eb",
                  textAlign:
                    "center",
                }}
              >
                <button
                  onClick={() =>
                    hapusItem(
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
                    borderRadius:
                      "6px",
                    padding:
                      "8px 12px",
                    cursor:
                      "pointer",
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
);
}