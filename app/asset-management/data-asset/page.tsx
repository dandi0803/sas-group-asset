import { supabase } from "@/lib/supabase";
import DataAssetSasg from "./DataAssetSasg";

export default async function DataAssetPage() {
  const { data: assets } =
  await supabase
    .from("assets")
    .select(`
      *,
      categories(name),
      asset_types(name),
      asset_statuses(name)
    `)
    .order("id");

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("id");

  const { data: assetTypes } = await supabase
    .from("asset_types")
    .select("*")
    .order("id");

  const { data: locations } = await supabase
    .from("locations")
    .select("*")
    .order("id");

  const { data: statuses } = await supabase
    .from("asset_statuses")
    .select("*")
    .order("id");

  return (
    <DataAssetSasg
      assets={assets || []}
      categories={categories || []}
      assetTypes={assetTypes || []}
      locations={locations || []}
      statuses={statuses || []}
    />
  );
}