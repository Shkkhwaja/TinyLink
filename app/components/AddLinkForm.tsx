"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function AddLinkForm() {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url, code: code || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.error || "Error");
      } else {
        setMsg(`✅ Short link created: ${data.code}`);
        setUrl("");
        setCode("");
      }
    } catch (err) {
      setMsg("❌ Network error");
    } finally {
      setLoading(false);

    
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="grid gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* URL FIELD */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Long URL</label>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/..."
          required
          className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      {/* CODE FIELD */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Custom Code (optional)
        </label>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="abc123"
          className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <span className="text-xs text-gray-500">Must be 6–8 characters, alphanumeric</span>
      </div>

      {/* BUTTON */}
      <button
        disabled={loading}
        type="submit"
        className={`mt-2 w-full py-3 rounded-lg text-white font-semibold transition-all ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 shadow-md"
        }`}
      >
        {loading ? "Saving..." : "Create Short Link"}
      </button>

      {/* MESSAGE */}
      {msg && (
        <motion.div
          className="text-center mt-2 text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {msg}
        </motion.div>
      )}
    </motion.form>
  );
}
