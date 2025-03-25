import { NextResponse } from "next/server";

const CELENIUM_BASE = "https://api-mainnet.celenium.io/v1";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const namespace = searchParams.get("namespace");

  if (!namespace) {
    return NextResponse.json({ error: "Missing namespace" }, { status: 400 });
  }

  try {
    const res = await fetch(`${CELENIUM_BASE}/namespace/${namespace}`);
    const data = await res.json();

    return NextResponse.json(data);
  } catch (e) {
    console.error("API error:", e);
    return NextResponse.json({ error: "Unexpected response" }, { status: 500 });
  }
}
