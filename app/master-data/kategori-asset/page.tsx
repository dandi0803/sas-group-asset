export const dynamic = "force-dynamic";
export const revalidate = 0;

import { supabase } from "@/lib/supabase";
import KategoriAssetSasg from "./KategoriAssetSasg";

export default async function KategoriAssetPage() {
  const {
    data,
    error,
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
    <KategoriAssetSasg
      data={data || []}
    />
  );
}