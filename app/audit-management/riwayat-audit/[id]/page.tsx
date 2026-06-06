"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DetailAuditPage() {
  const params = useParams();

  const [header, setHeader] =
    useState<any>(null);

  const [details, setDetails] =
    useState<any[]>([]);

  useEffect(() => {
    if (params?.id) {
      loadData();
    }
  }, [params]);

  const loadData =
    async () => {
      const { data: audit } =
        await supabase
          .from("audit_header")
          .select("*")
          .eq(
            "id",
            params.id
          )
          .single();

      setHeader(audit);

     const {
  data: detailData,
} = await supabase
  .from("audit_detail")
  .select("*")
  .eq(
    "audit_id",
    params.id
  );

const {
  data: items,
} = await supabase
  .from(
    "audit_template_items"
  )
  .select(
    "id,item_name"
  );

const result =
  detailData?.map(
    (detail) => ({
      ...detail,
      item_name:
        items?.find(
          (x) =>
            x.id ===
            detail.audit_item_id
        )?.item_name,
    })
  ) || [];

setDetails(result);

    };

  if (!header) {
    return (
      <div>
        Loading...
      </div>
    );
  }
  return (
  <div
    style={{
      background: "#fff",
      padding: "24px",
      borderRadius: "16px",
      boxShadow:
        "0 1px 3px rgba(0,0,0,.08)",
    }}
  >
    <h2
      style={{
        marginBottom: "20px",
      }}
    >
      Detail Audit
    </h2>

    <div
      style={{
        background: "#f8fafc",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "25px",
      }}
    >
      <p>
        <b>No Audit :</b>{" "}
        {header.audit_number}
      </p>

      <p>
        <b>Auditor :</b>{" "}
        {header.auditor}
      </p>

      <p>
        <b>Tanggal :</b>{" "}
        {header.audit_date}
      </p>

      <p>
        <b>Catatan :</b>{" "}
        {header.notes || "-"}
      </p>
    </div>

    <h3
      style={{
        marginBottom: "15px",
      }}
    >
      Checklist Audit
    </h3>

    <table
      style={{
        width: "100%",
        borderCollapse:
          "collapse",
      }}
    >
      <thead>
        <tr>
          <th style={thStyle}>
            No
          </th>

          <th style={thStyle}>
            Item Audit
          </th>

          <th style={thStyle}>
            Hasil
          </th>

          <th style={thStyle}>
            Remark
          </th>
        </tr>
      </thead>

      <tbody>{details.map(
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
        {index + 1}
      </td>

      <td
  style={
    tdStyle
  }
>
  {item.item_name}
</td>
      <td
        style={
          tdStyle
        }
      >
        {item.condition ===
        "Baik" ? (
          <span
            style={{
              background:
                "#dcfce7",
              color:
                "#166534",
              padding:
                "6px 12px",
              borderRadius:
                "999px",
              fontWeight:
                "bold",
            }}
          >
            ✓ Baik
          </span>
        ) : (
          <span
            style={{
              background:
                "#fee2e2",
              color:
                "#991b1b",
              padding:
                "6px 12px",
              borderRadius:
                "999px",
              fontWeight:
                "bold",
            }}
          >
            ✕ Tidak Baik
          </span>
        )}
      </td>

      <td
        style={
          tdStyle
        }
      >
        {item.remarks ||
          "-"}
      </td>
    </tr>
  )
)}</tbody>
</table>
  </div>
);
}

const thStyle = {
  background: "#081028",
  color: "#fff",
  padding: "14px",
  textAlign: "left" as const,
  fontSize: "14px",
};

const tdStyle = {
  padding: "14px",
  borderBottom:
    "1px solid #e5e7eb",
};