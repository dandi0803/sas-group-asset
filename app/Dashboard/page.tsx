"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [assetTypes, setAssetTypes] = useState<any[]>([]);
  const [allAssetTypes, setAllAssetTypes] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [allAssets, setAllAssets] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedAssetType, setSelectedAssetType] = useState<any>(null);

  const [filterAssetTypes, setFilterAssetTypes] = useState<string[]>([]);
  const [filterStatuses, setFilterStatuses] = useState<string[]>([]);
  const [filterSites, setFilterSites] = useState<string[]>([]);

  const [openFilter, setOpenFilter] = useState("");

  useEffect(() => {
    loadCategories();
    loadDashboardData();
  }, []);

  const loadCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    setCategories(data || []);
  };

  const loadDashboardData = async () => {
    const { data: assetTypeData } = await supabase
      .from("asset_types")
      .select("*")
      .order("name");

    const { data: assetData } = await supabase
      .from("assets")
      .select("*");

    const { data: statusData } = await supabase
      .from("asset_statuses")
      .select("*")
      .order("name");

    const { data: locationData } = await supabase
      .from("locations")
      .select("*")
      .order("site");

    setAllAssetTypes(assetTypeData || []);
    setAllAssets(assetData || []);
    setStatuses(statusData || []);
    setLocations(locationData || []);
  };

  const loadAssetTypes = async (categoryId: number) => {
    setSelectedCategory(categoryId);

    const { data } = await supabase
      .from("asset_types")
      .select("*")
      .eq("category_id", categoryId)
      .order("name");

    setAssetTypes(data || []);
    setAssets([]);
    setSelectedAssetType(null);
  };

  const loadAssets = async (assetTypeId: number) => {
    setSelectedAssetType(assetTypeId);

    const { data } = await supabase
      .from("assets")
      .select("*")
      .eq("asset_type_id", assetTypeId);

    setAssets(data || []);
  };

  const getAssetSite = (asset: any) => {
    const loc = locations.find(
      (x) => x.name === asset.location
    );

    return loc?.site || asset.location || "-";
  };

  const filteredAssets = allAssets.filter((asset) => {
    const matchType =
      filterAssetTypes.length === 0 ||
      filterAssetTypes.includes(String(asset.asset_type_id));

    const matchStatus =
      filterStatuses.length === 0 ||
      filterStatuses.includes(String(asset.status_id));

    const matchSite =
      filterSites.length === 0 ||
      filterSites.includes(getAssetSite(asset));

    return matchType && matchStatus && matchSite;
  });

  const chartData = allAssetTypes
    .map((type) => ({
      id: type.id,
      name: type.name,
      total: filteredAssets.filter(
        (asset) => Number(asset.asset_type_id) === Number(type.id)
      ).length,
    }))
    .filter((item) => item.total > 0);

  const maxTotal = Math.max(
    ...chartData.map((item) => item.total),
    1
  );

  const siteOptions = Array.from(
    new Set(
      locations
        .map((item) => item.site)
        .filter(Boolean)
    )
  );

  return (
    <div>
      <h1 style={titleStyle}>
        Dashboard Asset
      </h1>

      <div style={filterWrapperStyle}>
        <MultiFilter
          title="Jenis Asset"
          openKey="assetType"
          openFilter={openFilter}
          setOpenFilter={setOpenFilter}
          options={allAssetTypes.map((x) => ({
            value: String(x.id),
            label: x.name,
          }))}
          selected={filterAssetTypes}
          setSelected={setFilterAssetTypes}
        />

        <MultiFilter
          title="Status"
          openKey="status"
          openFilter={openFilter}
          setOpenFilter={setOpenFilter}
          options={statuses.map((x) => ({
            value: String(x.id),
            label: x.name,
          }))}
          selected={filterStatuses}
          setSelected={setFilterStatuses}
        />

        <MultiFilter
          title="Site"
          openKey="site"
          openFilter={openFilter}
          setOpenFilter={setOpenFilter}
          options={siteOptions.map((site) => ({
            value: site,
            label: site,
          }))}
          selected={filterSites}
          setSelected={setFilterSites}
        />
      </div>

      <div style={chartCardStyle}>
        <h3 style={{ marginBottom: "20px" }}>
          Grafik Asset Berdasarkan Jenis Asset
        </h3>

        <div style={chartAreaStyle}>
          {chartData.length === 0 ? (
            <div>Tidak ada data asset</div>
          ) : (
            chartData.map((item) => (
              <div key={item.id} style={barItemStyle}>
                <div style={barNumberStyle}>
                  {item.total}
                </div>

                <div
                  style={{
                    height: `${(item.total / maxTotal) * 180}px`,
                    background: "#2563eb",
                    borderRadius: "8px 8px 0 0",
                    margin: "0 auto",
                    width: "45px",
                  }}
                />

                <div style={barLabelStyle}>
                  {item.name}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <h2 style={{ marginBottom: "15px" }}>
        Kategori Asset
      </h2>

      <div style={gridStyle}>
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => loadAssetTypes(category.id)}
            style={{
              ...categoryCardStyle,
              background:
                selectedCategory === category.id ? "#2563eb" : "#fff",
              color:
                selectedCategory === category.id ? "#fff" : "#111827",
            }}
          >
            {category.name}
          </div>
        ))}
      </div>

      {selectedCategory && (
        <>
          <h2 style={{ marginTop: "35px", marginBottom: "15px" }}>
            Jenis Asset
          </h2>

          <div style={gridStyle}>
            {assetTypes.map((assetType) => (
              <div
                key={assetType.id}
                onClick={() => loadAssets(assetType.id)}
                style={{
                  ...categoryCardStyle,
                  background:
                    selectedAssetType === assetType.id ? "#16a34a" : "#fff",
                  color:
                    selectedAssetType === assetType.id ? "#fff" : "#111827",
                }}
              >
                {assetType.name}
              </div>
            ))}
          </div>
        </>
      )}

      {selectedAssetType && (
        <>
          <h2 style={{ marginTop: "35px", marginBottom: "15px" }}>
            Summary Status Asset
          </h2>

          <div style={tableCardStyle}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Nama Asset</th>
                  <th style={thStyle}>Tersedia</th>
                  <th style={thStyle}>Dipakai</th>
                  <th style={thStyle}>Maintenance</th>
                  <th style={thStyle}>Rusak</th>
                  <th style={thStyle}>Hilang</th>
                  <th style={thStyle}>Dimusnahkan</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td style={tdStyle}>
                    {
                      assetTypes.find(
                        (x) => x.id === selectedAssetType
                      )?.name
                    }
                  </td>

                  <td style={tdStyle}>
                    {assets.filter((x) => x.status_id === 1).length}
                  </td>

                  <td style={tdStyle}>
                    {assets.filter((x) => x.status_id === 2).length}
                  </td>

                  <td style={tdStyle}>
                    {assets.filter((x) => x.status_id === 4).length}
                  </td>

                  <td style={tdStyle}>
                    {assets.filter((x) => x.status_id === 5).length}
                  </td>

                  <td style={tdStyle}>
                    {assets.filter((x) => x.status_id === 6).length}
                  </td>

                  <td style={tdStyle}>
                    {assets.filter((x) => x.status_id === 8).length}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function MultiFilter({
  title,
  openKey,
  openFilter,
  setOpenFilter,
  options,
  selected,
  setSelected,
}: any) {
  const isOpen = openFilter === openKey;

  const toggleValue = (value: string) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((x: string) => x !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  const label =
    selected.length === 0
      ? `Semua ${title}`
      : `${title}: ${selected.length} dipilih`;

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() =>
          setOpenFilter(isOpen ? "" : openKey)
        }
        style={filterButtonStyle}
      >
        {label} ▼
      </button>

      {isOpen && (
        <div style={dropdownStyle}>
          <div
            onClick={() => setSelected([])}
            style={dropdownItemStyle}
          >
            Semua {title}
          </div>

          {options.map((item: any) => (
            <label
              key={item.value}
              style={dropdownItemStyle}
            >
              <input
                type="checkbox"
                checked={selected.includes(item.value)}
                onChange={() => toggleValue(item.value)}
                style={{ marginRight: "8px" }}
              />
              {item.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

const titleStyle = {
  fontSize: "32px",
  fontWeight: "bold",
  marginBottom: "25px",
};

const filterWrapperStyle = {
  display: "flex",
  gap: "15px",
  marginBottom: "25px",
  flexWrap: "wrap" as const,
};

const filterButtonStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  minWidth: "220px",
  background: "#fff",
  cursor: "pointer",
  textAlign: "left" as const,
};

const dropdownStyle = {
  position: "absolute" as const,
  top: "45px",
  left: 0,
  width: "260px",
  maxHeight: "260px",
  overflowY: "auto" as const,
  background: "#fff",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,.12)",
  zIndex: 999,
};

const dropdownItemStyle = {
  display: "block",
  padding: "10px",
  cursor: "pointer",
  borderBottom: "1px solid #f1f5f9",
};

const chartCardStyle = {
  background: "#fff",
  minHeight: "350px",
  borderRadius: "16px",
  padding: "20px",
  marginBottom: "30px",
  boxShadow: "0 2px 10px rgba(0,0,0,.08)",
};

const chartAreaStyle = {
  display: "flex",
  alignItems: "end",
  gap: "18px",
  height: "250px",
  borderBottom: "1px solid #e5e7eb",
  paddingBottom: "10px",
  overflowX: "auto" as const,
};

const barItemStyle = {
  width: "80px",
  textAlign: "center" as const,
  flexShrink: 0,
};

const barNumberStyle = {
  fontWeight: "bold",
  marginBottom: "6px",
};

const barLabelStyle = {
  fontSize: "12px",
  marginTop: "8px",
  wordBreak: "break-word" as const,
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
  gap: "15px",
};

const categoryCardStyle = {
  padding: "20px",
  borderRadius: "16px",
  cursor: "pointer",
  boxShadow: "0 2px 10px rgba(0,0,0,.08)",
  fontWeight: "bold",
  transition: ".2s",
};

const tableCardStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "16px",
  boxShadow: "0 2px 10px rgba(0,0,0,.08)",
};

const thStyle = {
  background: "#0f172a",
  color: "#fff",
  padding: "12px",
  textAlign: "left" as const,
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #e5e7eb",
};