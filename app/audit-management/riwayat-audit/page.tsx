"use client";

import {
  useEffect,
  useState,
} from "react";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { supabase } from "@/lib/supabase";

export default function RiwayatAuditPage() {
  const [data, setData] =
  useState<any[]>([]);

const [startDate,
  setStartDate] =
  useState("");

const [endDate,
  setEndDate] =
  useState("");

  const [
  selectedSite,
  setSelectedSite,
] = useState("");

const [
  showExportMenu,
  setShowExportMenu,
] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
  const {
    data: audits,
    error,
  } = await supabase
    .from("audit_header")
    .select("*")
    .order(
      "created_at",
      {
        ascending: false,
      }
    );

  if (error) {
    console.log(error);
    return;
  }

  const {
    data: assets,
  } = await supabase
    .from("assets")
    .select(
  "id, asset_code, asset_name, location"
);

const {
  data: locations,
} = await supabase
  .from("locations")
  .select("*");


const result = await Promise.all(
  (audits || []).map(
    async (audit) => {

      const {
        data: details,
      } = await supabase
        .from("audit_detail")
        .select(
          "condition"
        )
        .eq(
          "audit_id",
          audit.id
        );

      const hasFail =
        details?.some(
          (x) =>
            x.condition ===
            "Tidak Baik"
        );

      const assetData =
  assets?.find(
    (a) =>
      a.id ===
      audit.asset_id
  );

const locationData =
  locations?.find(
    (l) =>
      l.location_name === assetData?.location ||
l.nama_lokasi === assetData?.location ||
l.nama_lokasi_asset === assetData?.location ||
l.name === assetData?.location ||
l.location === assetData?.location
  );

return {
  ...audit,

  asset: assetData,
  location: locationData,

  audit_status:
    hasFail
      ? "FAIL"
      : "PASS",
};
    }
  )
);

setData(result);
};
const filteredData = data.filter((item) => {
  if (!startDate && !endDate) return true;

  const auditDate = new Date(item.audit_date);

  const start = startDate
    ? new Date(startDate + "T00:00:00")
    : null;

  const end = endDate
    ? new Date(endDate + "T23:59:59")
    : null;

  if (start && auditDate < start)
    return false;

  if (end && auditDate > end)
  return false;

if (
  selectedSite &&
  item.location?.site !== selectedSite
)
  return false;

return true;

});
const exportExcel = () => {
  const today = new Date();

  const fileDate =
    String(today.getDate()).padStart(2, "0") +
    String(today.getMonth() + 1).padStart(2, "0") +
    today.getFullYear();

  const exportData =
  filteredData.map((item) => ({
      "No Audit":
        item.audit_number,
      "Asset Code":
        item.asset?.asset_code,
      "Nama Asset":
        item.asset?.asset_name,
      Auditor:
        item.auditor,
      Tanggal:
        item.audit_date,
      Status:
  item.audit_status,
    }));

  const worksheet =
    XLSX.utils.json_to_sheet(
      exportData
    );

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Riwayat Audit"
  );

  XLSX.writeFile(
    workbook,
    `Riwayat_Audit_${fileDate}.xlsx`
  );

  setShowExportMenu(false);
};

const exportPDF = () => {
  const today = new Date();

  const fileDate =
    String(today.getDate()).padStart(2, "0") +
    String(today.getMonth() + 1).padStart(2, "0") +
    today.getFullYear();

  const doc = new jsPDF();

  doc.setFontSize(18);

  doc.text(
    "Audit Asset Warehouse",
    14,
    20
  );

  doc.setFontSize(10);

  doc.text(
    `Tanggal Export : ${fileDate}`,
    14,
    28
  );

  autoTable(doc, {
  startY: 35,
  head: [[
    "No Audit",
    "Asset",
    "Auditor",
    "Tanggal",
    "Status",
  ]],
  body: filteredData.map(
    (item) => [
      item.audit_number,
      item.asset?.asset_code,
      item.auditor,
      item.audit_date,
      item.audit_status,
    ]
  ),
});

const pageHeight =
  doc.internal.pageSize.height;

const pageWidth =
  doc.internal.pageSize.width;

const signatureY =
  pageHeight - 45;

doc.setFontSize(10);

doc.text(
  "Mengetahui,",
  14,
  signatureY - 10
);

const signatures = [
  "Auditor",
  "SPV General Affair",
  "SPV Ops SCM",
  "Supply Chain Manager",
];

const startX = 20;
const gapX = 45;

signatures.forEach((name, index) => {
  const x = startX + index * gapX;

  doc.text(
    name,
    x,
    signatureY
  );

  doc.line(
    x,
    signatureY + 25,
    x + 35,
    signatureY + 25
  );
});

doc.save(
    `Riwayat_Audit_${fileDate}.pdf`
  );

  setShowExportMenu(false);
};
  return (
  <div
  style={{
    background: "#fff",
    padding: "24px",
    borderRadius: "16px",
    boxShadow:
      "0 1px 3px rgba(0,0,0,.06)",
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
      "20px",
  }}
>
  <div>
    <h1
      style={{
        marginBottom:
          "5px",
      }}
    >
      Riwayat Audit
    </h1>

    <p
      style={{
        color:
          "#64748b",
      }}
    >
      Total Audit :
{filteredData.length}
    </p>
  </div>

  

  <div
  style={{
    display:
      "flex",
    gap: "10px",
    alignItems:
      "center",
  }}
>

  <input
    type="date"
    value={startDate}
    onChange={(e) =>
      setStartDate(
        e.target.value
      )
    }
    style={{
      padding:
        "10px",
      border:
        "1px solid #ddd",
      borderRadius:
        "8px",
    }}
  />


  <input
    type="date"
    value={endDate}
    onChange={(e) =>
      setEndDate(
        e.target.value
      )
    }
    style={{
      padding:
        "10px",
      border:
        "1px solid #ddd",
      borderRadius:
        "8px",
    }}
  />

  <select
  value={selectedSite}
  onChange={(e) =>
    setSelectedSite(
      e.target.value
    )
  }
  style={{
    padding: "10px",
    border:
      "1px solid #ddd",
    borderRadius:
      "8px",
  }}
>
  <option value="">
    Semua Site
  </option>

  {[...new Set(
    data.map(
      (item) =>
        item.location?.site
    )
  )]
    .filter(Boolean)
    .map((site) => (
      <option
        key={site}
        value={site}
      >
        {site}
      </option>
    ))}
</select>

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
          right: 0,
          top: "50px",
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
          onClick={
            exportExcel
          }
          style={{
            width:
              "100%",
            padding:
              "12px",
            border:
              "none",
            background:
              "#fff",
            cursor:
              "pointer",
            textAlign:
              "left",
          }}
        >
          📊 Excel
        </button>

        <button
          onClick={
            exportPDF
          }
          style={{
            width:
              "100%",
            padding:
              "12px",
            border:
              "none",
            background:
              "#fff",
            cursor:
              "pointer",
            textAlign:
              "left",
          }}
        >
          📄 PDF
        </button>
      </div>
    )}
    </div>
  </div>
</div>

   
  
  <table
  style={{
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    overflow: "hidden",
    borderRadius: "12px",
  }}
>
    
        <thead>
          <tr>
            <th
              style={thStyle}
            >
              No Audit
            </th>

            <th
              style={thStyle}
            >
              Asset ID
            </th>

            <th
              style={thStyle}
            >
              Auditor
            </th>

            <th
              style={thStyle}
            >
              Tanggal
            </th>
            <th style={thStyle}>
  Status
</th>
            <th
  style={thStyle}
>
  Action
</th>

          </tr>
        </thead>

        <tbody>
          {filteredData.map(
            (
              item
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
                  {
                    item.audit_number
                  }
                </td>

                <td style={tdStyle}>
  <div>
    <div
      style={{
        fontWeight: "bold",
        color: "#0f172a",
      }}
    >
      {item.asset?.asset_code}
    </div>

    <div
      style={{
        fontSize: "13px",
        color: "#64748b",
        marginTop: "3px",
      }}
    >
      {item.asset?.asset_name}
    </div>
  </div>
</td>

                <td
                  style={
                    tdStyle
                  }
                >
                  {
                    item.auditor
                  }
                </td>

                <td
                  style={
                    tdStyle
                  }
                >
                  {
                    item.audit_date
                  }
                </td>
<td style={tdStyle}>
  <span
    style={{
      background:
        item.audit_status === "PASS"
          ? "#16a34a"
          : "#dc2626",

      color: "#fff",
      padding: "10px 18px",
      borderRadius: "8px",
      fontWeight: "600",
    }}
  >
    {item.audit_status}
  </span>
</td>
                <td
  style={tdStyle}
>
  <button
    onClick={() =>
      window.location.href =
        `/audit-management/riwayat-audit/${item.id}`
    }
    style={{
      background:
        "#2563eb",
      color: "#fff",
      border: "none",
      padding:
        "8px 12px",
      borderRadius:
        "6px",
      cursor:
        "pointer",
    }}
  >
    Detail
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

const thStyle = {
  background:"#081028",
  color:"#fff",
  padding:"18px",
  fontWeight:"600",
  fontSize:"14px",
  textAlign:"left" as const,
};

const tdStyle = {
  padding: "18px 16px",
  borderBottom: "1px solid #e5e7eb",
  verticalAlign: "middle" as const,
};