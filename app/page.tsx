export const dynamic = "force-dynamic";

import React from "react";
import AddLinkForm from "@/app/components/AddLinkForm";
import LinksTable from "@/app/components/LinksTable";

async function getLinks() {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  const res = await fetch(`${base}/api/links`, {
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}

export default async function Page() {
  const links = await getLinks();

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-6">
      {/* HEADER */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 tracking-wide">
          🚀 TinyLink — Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Manage short links, track clicks & create new ones instantly.
        </p>
      </header>

      {/* FORM CARD */}
      <section className="max-w-3xl mx-auto mb-10">
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            ➕ Create a Short Link
          </h2>

          <AddLinkForm />
        </div>
      </section>

      {/* TABLE CARD */}
      <section className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            🔗 Your Links
          </h2>

          <LinksTable initialLinks={links} />
        </div>
      </section>
    </main>
  );
}
