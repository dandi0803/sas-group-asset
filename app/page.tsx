import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data, error } = await supabase
    .from("asset_types")
    .select("*");

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        Data Jenis Asset
      </h1>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "white",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <thead>
          <tr
            style={{
              background: "#1e293b",
              color: "white",
            }}
          >
            <th style={{ padding: "12px", textAlign: "left" }}>
              ID
            </th>

            <th style={{ padding: "12px", textAlign: "left" }}>
              Category
            </th>

            <th style={{ padding: "12px", textAlign: "left" }}>
              Nama Asset
            </th>

            <th style={{ padding: "12px", textAlign: "center" }}>
             Action
            </th>
          </tr>
        </thead>

        <tbody>
          {data?.map((item) => (
            <tr
              key={item.id}
              style={{
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <td style={{ padding: "12px" }}>
                {item.id}
              </td>

              <td style={{ padding: "12px" }}>
                {item.category_id}
              </td>

              <td style={{ padding: "12px" }}>
                {item.name}
              </td>
              <td
  style={{
    padding: "12px",
    textAlign: "center",
  }}
>
  <button
    style={{
      background: "#2563eb",
      color: "white",
      border: "none",
      padding: "6px 12px",
      borderRadius: "4px",
      cursor: "pointer",
    }}
  >
    Edit
  </button>

  <button
    style={{
      background: "#dc2626",
      color: "white",
      border: "none",
      padding: "6px 12px",
      borderRadius: "4px",
      marginLeft: "8px",
      cursor: "pointer",
    }}
  >
    Hapus
  </button>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}