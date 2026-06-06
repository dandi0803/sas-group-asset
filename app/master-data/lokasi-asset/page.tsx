export const dynamic = "force-dynamic";
export const revalidate = 0;

import { supabase } from "@/lib/supabase";
import LokasiAssetSasg from "./LokasiAssetSasg";

export default async function LokasiAssetPage() {
  const {
    data,
    error,
  } = await supabase
    .from("locations")
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
    <LokasiAssetSasg
      data={data || []}
    />
  );
}