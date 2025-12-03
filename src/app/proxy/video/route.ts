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
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "video/*,*/*;q=0.8",
        Range: "bytes=0-",
        Referer: "https://downloader.disk.yandex.ru/",
        Origin: "https://downloader.disk.yandex.ru/",
        Authorization: `OAuth ${process.env.YANDEX_TOKEN}`,
      },
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`Yandex Disk responded with status: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "video/mp4";

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
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
