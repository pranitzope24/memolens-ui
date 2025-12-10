// lib/apiService.ts
import { AxiosRequestConfig } from "axios";
import apiClient from "./axiosClient";

/**
 * 🔹 Generic API request wrapper
 */
export async function apiRequest<T = any>(
  url: string,
  options: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await apiClient({ url, ...options });
    console.log(response);
    return response.data as T;
  } catch (err: any) {
    const message =
      err.response?.data?.error ||
      err.message ||
      "An unexpected error occurred.";
    throw new Error(message);
  }
}

/* ============================================================
   🔐 AUTH APIs
   ============================================================ */

export async function loginApi(email: string, password: string) {
  return apiRequest("/auth/login", {
    method: "POST",
    data: { email, password },
  });
}

export async function registerApi(
  name: string,
  email: string,
  password: string
) {

  const paylaod = {
    username: name,
    email: email,
    password: password
  }

  console.log(paylaod);
  return apiRequest("/auth/register", {
    method: "POST",
    data: paylaod,
  });
}

/* ============================================================
   📤 FILE UPLOAD
   ============================================================ */

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

/* ============================================================
   🔍 IMAGE SEARCH
   ============================================================ */

export async function searchPhotos(prompt: string) {

  console.log(prompt);
  return apiRequest("/search-image", {
    method: "POST",
    data: { user_prompt: prompt },
    headers: { "Content-Type": "application/json" },
  });
}

/* ============================================================
   🙂 KNOWN FACES API
   ============================================================ */

export async function addKnownFace(personName: string, file: File) {
  const formData = new FormData();
  formData.append("person_name", personName);
  formData.append("file", file);

  return apiRequest("/known-face/add", {
    method: "POST",
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function listKnownFaces() {
  return apiRequest("/known-face/list", {
    method: "GET",
  });
}
