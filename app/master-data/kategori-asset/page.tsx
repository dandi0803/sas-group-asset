import { supabase } from "@/lib/supabase";
import KategoriAssetSasg from "./KategoriAssetSasg";

export default async function KategoriAssetPage() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("id");

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <KategoriAssetSasg data={data ?? []} />;
}