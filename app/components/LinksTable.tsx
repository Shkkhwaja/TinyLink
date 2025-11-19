"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Trash2, BarChart3 } from "lucide-react";

type LinkRow = {
  code: string;
  url: string;
  clicks: number;
  last_clicked: string | null;
  created_at: string;
};

export default function LinksTable({ initialLinks }: { initialLinks: LinkRow[] }) {
  const [links, setLinks] = useState<LinkRow[]>(initialLinks || []);
  const [filter, setFilter] = useState("");

  async function handleDelete(code: string) {
    if (!confirm("Delete this link?")) return;

    const res = await fetch(`/api/links/${code}`, { method: "DELETE" });

    if (res.ok) {
      setLinks((prev) => prev.filter((x) => x.code !== code));
    } else {
      alert("❌ Failed to delete link");
    }
  }

  const shown = links.filter(
    (l) => l.code.toLowerCase().includes(filter.toLowerCase()) || l.url.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white shadow-md rounded-xl p-6 border"
    >
      {/* SEARCH BAR */}
      <div className="mb-4">
        <input
          placeholder="Search by code or URL..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700 text-sm">
              <th className="p-3">Code</th>
              <th className="p-3">Target URL</th>
              <th className="p-3">Clicks</th>
              <th className="p-3">Last Clicked</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {shown.map((row) => (
              <motion.tr
                key={row.code}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-3 font-semibold text-blue-600">
                  <a href={`/${row.code}`} className="hover:underline">
                    {row.code}
                  </a>

                  <div>
                    <a
                      href={`/code/${row.code}`}
                      className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 mt-1"
                    >
                      <BarChart3 size={14} /> Stats
                    </a>
                  </div>
                </td>

                <td className="p-3 max-w-[350px] truncate">
                  <a href={row.url} target="_blank" rel="noreferrer" className="text-gray-700 hover:underline">
                    {row.url}
                  </a>
                </td>

                <td className="p-3">{row.clicks}</td>

                <td className="p-3">{row.last_clicked ?? "—"}</td>

                <td className="p-3 flex gap-3">
                  {/* COPY BUTTON */}
                  <button
                    onClick={() => navigator.clipboard.writeText(`${location.origin}/${row.code}`)}
                    className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition"
                    title="Copy link"
                  >
                    <Copy size={16} />
                  </button>

                  {/* DELETE BUTTON */}
                  <button
                    onClick={() => handleDelete(row.code)}
                    className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </motion.tr>
            ))}

            {shown.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  No links found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
