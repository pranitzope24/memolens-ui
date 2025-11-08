// lib/apiService.ts
import axios, { AxiosRequestConfig } from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
  timeout: 120000, // ⏱️ 1 minute timeout
  headers: {
    Accept: "application/json",
  },
});

// ✅ Optional interceptors for logging / error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Generic API request wrapper
 */
export async function apiRequest<T = any>(
  url: string,
  options: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await apiClient({ url, ...options });
    return response.data as T;
  } catch (err: any) {
    const message =
      err.response?.data?.error ||
      err.message ||
      "An unexpected error occurred.";
    throw new Error(message);
  }
}

/**
 * Uploads a single file using multipart/form-data.
 */
export async function uploadFile(
  file: File,
  onProgress?: (percent: number) => void
): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);

  const config: AxiosRequestConfig = {
    method: "POST",
    url: "/upload",
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percent);
      }
    },
  };

  return apiRequest(config.url!, config);
}

/**
 * Sends a text query to /search endpoint.
 */
export async function searchPhotos(prompt: string) {
  return apiRequest("/search-image", {
    method: "POST",
    data: { user_prompt: prompt },
    headers: { "Content-Type": "application/json" },
  });
}
