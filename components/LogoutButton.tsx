"use client";

export default function LogoutButton() {
  const logout = () => {
    localStorage.removeItem("user");

    window.location.href =
      "/login";
  };

  return (
    <button
      onClick={logout}
      style={{
        width: "100%",
        marginTop: "20px",
        padding: "10px",
        border: "none",
        background: "#dc2626",
        color: "#fff",
        borderRadius: "8px",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  );
}