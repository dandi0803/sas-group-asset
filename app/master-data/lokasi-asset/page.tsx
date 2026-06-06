import { supabase } from "@/lib/supabase";
import LokasiAssetSasg from "./LokasiAssetSasg";

export default async function LokasiAssetPage() {
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .order("id");

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <LokasiAssetSasg
      data={data || []}
    />
  );
}