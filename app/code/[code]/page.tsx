
import React from "react";

type Props = { params: { code: string } };

async function fetchStats(code: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/links/${code}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Not found");
  return res.json();
}

export default async function Page({ params }: Props) {
  let data: any = null;
  try {
    data = await fetchStats(params.code);
  } catch {
    return (
      <main style={{ padding: 20 }}>
        <h1>Stats — {params.code}</h1>
        <p>Link not found.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Stats — {data.code}</h1>
      <p>
        <strong>Target URL:</strong> <a href={data.url}>{data.url}</a>
      </p>
      <p>
        <strong>Clicks:</strong> {data.clicks}
      </p>
      <p>
        <strong>Last clicked:</strong> {data.last_clicked ?? "—"}
      </p>
      <p>
        <strong>Created at:</strong> {data.created_at}
      </p>
    </main>
  );
}
