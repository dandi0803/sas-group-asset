"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [categories, setCategories] =
    useState<any[]>([]);

  const [assetTypes, setAssetTypes] =
    useState<any[]>([]);

  const [assets, setAssets] =
    useState<any[]>([]);

  const [selectedCategory, setSelectedCategory] =
    useState<any>(null);

  const [selectedAssetType, setSelectedAssetType] =
    useState<any>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories =
    async () => {
      const {
        data,
        error,
      } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) {
        console.log(error);
        return;
      }

      setCategories(
        data || []
      );
    };
      const loadAssetTypes =
    async (
      categoryId: number
    ) => {
      setSelectedCategory(
        categoryId
      );

      const {
        data,
        error,
      } = await supabase
        .from("asset_types")
        .select("*")
        .eq(
          "category_id",
          categoryId
        )
        .order("name");

      if (error) {
        console.log(error);
        return;
      }

      setAssetTypes(
        data || []
      );

      setAssets([]);

      setSelectedAssetType(
        null
      );
    };

  const loadAssets =
    async (
      assetTypeId: number
    ) => {
      setSelectedAssetType(
        assetTypeId
      );

      const {
        data,
        error,
      } = await supabase
        .from("assets")
        .select("*")
        .eq(
          "asset_type_id",
          assetTypeId
        );

      if (error) {
        console.log(error);
        return;
      }

      setAssets(
        data || []
      );
    };

  return (
    <div>
      <h1
        style={{
          fontSize:
            "32px",
          fontWeight:
            "bold",
          marginBottom:
            "25px",
        }}
      >
        Dashboard Asset
      </h1>
            <h2
        style={{
          marginBottom:
            "15px",
        }}
      >
        Kategori Asset
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill,minmax(220px,1fr))",
          gap: "15px",
        }}
      >
        {categories.map(
          (
            category
          ) => (
            <div
              key={
                category.id
              }
              onClick={() =>
                loadAssetTypes(
                  category.id
                )
              }
              style={{
                background:
                  selectedCategory ===
                  category.id
                    ? "#2563eb"
                    : "#fff",
                color:
                  selectedCategory ===
                  category.id
                    ? "#fff"
                    : "#111827",
                padding:
                  "20px",
                borderRadius:
                  "16px",
                cursor:
                  "pointer",
                boxShadow:
                  "0 2px 10px rgba(0,0,0,.08)",
                fontWeight:
                  "bold",
                transition:
                  ".2s",
              }}
            >
              {category.name}
            </div>
          )
        )}
      </div>
            {selectedCategory && (
        <>
          <h2
            style={{
              marginTop:
                "35px",
              marginBottom:
                "15px",
            }}
          >
            Jenis Asset
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill,minmax(220px,1fr))",
              gap: "15px",
            }}
          >
            {assetTypes.map(
              (
                assetType
              ) => (
                <div
                  key={
                    assetType.id
                  }
                  onClick={() =>
                    loadAssets(
                      assetType.id
                    )
                  }
                  style={{
                    background:
                      selectedAssetType ===
                      assetType.id
                        ? "#16a34a"
                        : "#fff",
                    color:
                      selectedAssetType ===
                      assetType.id
                        ? "#fff"
                        : "#111827",
                    padding:
                      "20px",
                    borderRadius:
                      "16px",
                    cursor:
                      "pointer",
                    boxShadow:
                      "0 2px 10px rgba(0,0,0,.08)",
                    fontWeight:
                      "bold",
                  }}
                >
                  {
                    assetType.name
                  }
                </div>
              )
            )}
          </div>
        </>
      )}
            {selectedAssetType && (
        <>
          <h2
            style={{
              marginTop:
                "35px",
              marginBottom:
                "15px",
            }}
          >
            Summary Status Asset
          </h2>

          <div
            style={{
              background:
                "#fff",
              padding:
                "20px",
              borderRadius:
                "16px",
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
                <tr>
                  <th style={thStyle}>
                    Nama Asset
                  </th>

                  <th style={thStyle}>
                    Tersedia
                  </th>

                  <th style={thStyle}>
                    Dipakai
                  </th>

                  <th style={thStyle}>
                    Maintenance
                  </th>

                  <th style={thStyle}>
                    Rusak
                  </th>

                  <th style={thStyle}>
                    Hilang
                  </th>

                  <th style={thStyle}>
                    Dimusnahkan
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td
                    style={tdStyle}
                  >
                    {
                      assetTypes.find(
                        (
                          x
                        ) =>
                          x.id ===
                          selectedAssetType
                      )?.name
                    }
                  </td>

                  <td
                    style={tdStyle}
                  >
                    {
                      assets.filter(
                        (
                          x
                        ) =>
                          x.status_id ===
                          1
                      ).length
                    }
                  </td>

                  <td
                    style={tdStyle}
                  >
                    {
                      assets.filter(
                        (
                          x
                        ) =>
                          x.status_id ===
                          2
                      ).length
                    }
                  </td>

                  <td
                    style={tdStyle}
                  >
                    {
                      assets.filter(
                        (
                          x
                        ) =>
                          x.status_id ===
                          4
                      ).length
                    }
                  </td>

                  <td
                    style={tdStyle}
                  >
                    {
                      assets.filter(
                        (
                          x
                        ) =>
                          x.status_id ===
                          5
                      ).length
                    }
                  </td>

                  <td
                    style={tdStyle}
                  >
                    {
                      assets.filter(
                        (
                          x
                        ) =>
                          x.status_id ===
                          6
                      ).length
                    }
                  </td>

                  <td
                    style={tdStyle}
                  >
                    {
                      assets.filter(
                        (
                          x
                        ) =>
                          x.status_id ===
                          8
                      ).length
                    }
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