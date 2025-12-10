"use client";

import { useState } from "react";
import { registerApi } from "@/lib/apiService";
import { saveToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleRegister(e: any) {
    e.preventDefault();

    try {
      console.log("Registering user:", { name, email, password });
      const res = await registerApi(name, email, password);
      console.log(res,"response");
      saveToken(res.token);
      router.push("/dashboard");
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <form
      onSubmit={handleRegister}
      className="flex flex-col gap-3 p-4 border rounded-md max-w-sm"
    >
      <h2 className="text-xl font-semibold">Register</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded"
      />

      <button
        type="submit"
        className="bg-green-600 text-white p-2 rounded"
      >
        Register
      </button>
    </form>
  );
}
