import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://notehub-api.goit.study/api";

export async function POST(request: NextRequest) {
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Cookie: request.headers.get("cookie") ?? "",
      },
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

    for (const cookie of response.headers.getSetCookie()) {
      result.headers.append("Set-Cookie", cookie);
    }

    return result;
  } catch {
    return NextResponse.json(
      { error: "Не вдалося виконати вихід." },
      { status: 500 },
    );
  }
}