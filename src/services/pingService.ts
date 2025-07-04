import api from "./api";

export async function pingServer() {
  try {
    const response = await api.get("/ping");
    console.log("Ping response:", response.data);
  } catch (error) {
    console.error("Ping failed:", error);
  }
}
