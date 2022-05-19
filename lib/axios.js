import axios from "axios";

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_DEVELOPMENT_API_URL
      : process.env.NEXT_PUBLIC_PRODUCTION_API_URL,
});

export default instance;