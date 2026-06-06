import { supabase } from "@/lib/supabase";
import StatusAssetSasg from "./StatusAssetSasg";

export default async function StatusAssetPage() {
  const { data, error } = await supabase
    .from("asset_statuses")
    .select("*")
    .order("id");

  if (error) {
    return (
      <div
        style={{
          color: "red",
          padding: "20px",
        }}
      >
        Error: {error.message}
      </div>
    );
  }

  return (
    <StatusAssetSasg
      data={data || []}
    />
  );
}