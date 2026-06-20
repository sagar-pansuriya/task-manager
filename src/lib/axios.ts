import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://jsonplaceholder.typicode.com",
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
  },
});
