import { supabase } from "@/lib/supabase";
import JenisAssetSasg from "./JenisAssetSasg";

export default async function JenisAssetPage() {
  const { data: jenisAsset, error } = await supabase
    .from("asset_types")
    .select("*")
    .order("id");

  const { data: kategori } = await supabase
    .from("categories")
    .select("*")
    .order("id");

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <JenisAssetSasg
      data={jenisAsset || []}
      kategori={kategori || []}
    />
  );
}