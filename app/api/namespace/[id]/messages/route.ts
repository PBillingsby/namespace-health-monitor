import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_BASE_URL = "https://api-mainnet.celenium.io/v1";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const version = searchParams.get('version') || '0';
  const limit = searchParams.get('limit') || '100';
  const offset = searchParams.get('offset') || '0';

  // Extract `id` from the pathname
  const pathnameParts = request.nextUrl.pathname.split('/');
  const id = pathnameParts[pathnameParts.indexOf('namespace') + 1];

  try {
    const response = await fetch(
      `${API_BASE_URL}/namespace/${id}/${version}/messages?limit=${limit}&offset=${offset}`
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch namespace messages: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Error fetching namespace messages:", error);
    return NextResponse.json([]);
  }
}
