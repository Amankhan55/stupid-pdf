import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({ baseURL: BASE_URL });

export async function sendContactMessage(name, email, message, topic = "General Question") {
  const form = new FormData();
  form.append("name", name);
  form.append("email", email);
  form.append("topic", topic);
  form.append("message", message);
  await api.post("/contact", form);
}
