import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return new Response("Missing URL", { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Referer: "https://yandex.ru/",
        Authorization: `OAuth ${process.env.YANDEX_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Yandex Disk responded with status: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const content_type = response.headers.get("content-type") || "image/jpeg";

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": content_type,
        "Cache-Control": "public, max-age=86400",
        "CDN-Cache-Control": "public, max-age=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: (error as Error)?.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
