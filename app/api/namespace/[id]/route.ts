import { NextResponse } from 'next/server';

const API_BASE_URL = "https://api-mainnet.celenium.io/v1";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await Promise.resolve(params);
    
  try {
    const response = await fetch(`${API_BASE_URL}/namespace/${id}`);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch namespace info: ${response.status}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data[0] || null);
  } catch (error) {
    console.error("Error fetching namespace info:", error);
    return NextResponse.json(
      { error: "Failed to fetch namespace information" },
      { status: 500 }
    );
  }
}