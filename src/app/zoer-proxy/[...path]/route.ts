import { NextRequest } from 'next/server';

const POSTGREST_API_KEY = process.env.POSTGREST_API_KEY || "";
const NEXT_PUBLIC_ZOER_HOST = process.env.NEXT_PUBLIC_ZOER_HOST || "https://zoer.ai";

export async function GET(request: NextRequest) {
  try {
    // For development, return mock data
    const mockData = {
      success: true,
      data: {
        app_name: "Admin Market",
        version: "1.0.0",
        environment: "development"
      }
    };

    return new Response(JSON.stringify(mockData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in zoer-proxy:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
