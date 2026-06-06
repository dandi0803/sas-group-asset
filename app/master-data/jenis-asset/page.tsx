export const dynamic = "force-dynamic";
export const revalidate = 0;

import { supabase } from "@/lib/supabase";
import JenisAssetSasg from "./JenisAssetSasg";

export default async function JenisAssetPage() {
  const {
    data: jenisAsset,
    error,
  } = await supabase
    .from("asset_types")
    .select("*")
    .order("id", {
      ascending: false,
    });

  const {
    data: kategori,
  } = await supabase
    .from("categories")
    .select("*")
    .order("id", {
      ascending: false,
    });

  if (error) {
    return (
      <div
        style={{
          padding: "20px",
          color: "red",
        }}
      >
        Error: {error.message}
      </div>
    );
  }

  return (
    <JenisAssetSasg
      data={jenisAsset || []}
      kategori={kategori || []}
    />
  );
}