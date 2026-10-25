import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://notehub-api.goit.study/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
      cache: "no-store",
    });

    const data = await response.text();

    const result = new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") ?? "application/json",
      },
    });

    const cookies = response.headers.getSetCookie();

    for (const cookie of cookies) {
      result.headers.append("Set-Cookie", cookie);
    }

    return result;
  } catch {
    return NextResponse.json(
      { error: "Не вдалося виконати вхід." },
      { status: 500 }
    );
  }
}
