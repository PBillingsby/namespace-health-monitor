import { NextResponse, NextRequest } from 'next/server';

const API_BASE_URL = "https://api-mainnet.celenium.io/v1";

export async function GET(request: NextRequest) {
  const { searchParams, pathname } = request.nextUrl;
  const version = searchParams.get('version') || '0';
  const limit = searchParams.get('limit') || '100';
  const offset = searchParams.get('offset') || '0';

  // Extract `id` from the dynamic segment in the URL
  const parts = pathname.split('/');
  const idIndex = parts.indexOf('namespace') + 1;
  const id = parts[idIndex];

  try {
    const response = await fetch(
      `${API_BASE_URL}/namespace/${id}/${version}/rollups?limit=${limit}&offset=${offset}`
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch namespace rollups: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Error fetching namespace rollups:", error);
    return NextResponse.json([]);
  }
}
