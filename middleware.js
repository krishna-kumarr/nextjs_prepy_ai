import { NextResponse } from "next/server";
import { decryptData } from "./utils/crypto";

function extractEncAndTrailing(pathname, seperator = "enc") {
  const regex = new RegExp(`${seperator}__(.+?)__${seperator}(.*)`);
  const match = pathname.match(regex);
  return match ? { encrypted: match[1], trailing: match[2] } : null;
}

export async function middleware(req) {
  if (process.env.NEXT_PUBLIC_APP_ENV !== 'production') {
    return NextResponse.next();
  }

  const url = req.nextUrl;
  if (!url.pathname.startsWith("/secure") && !url.pathname.startsWith("/api") || url.pathname.startsWith("/api/auth/google/callback")) {
    return NextResponse.next();
  }

  // Capture prefix (secure or api)
  const prefixMatch = url.pathname.match(/^\/(secure|api)\//);
  const prefix = prefixMatch ? `/${prefixMatch[1]}` : "";

  // Remove prefix from path
  const pathWithoutPrefix = url.pathname.replace(/^\/(secure|api)\//, "");

  // Extract encrypted + trailing
  const parsed = extractEncAndTrailing(pathWithoutPrefix, "enc");
  if (!parsed) return NextResponse.json({ error: "Invalid request" }, { status: 200 });

  // Decrypt
  const decrypted = await decryptData(parsed.encrypted);
  if (decrypted?.url) {
    if (new Date(decrypted.expires_in) < new Date()) {
      return NextResponse.json({ error: "Endpoint expired" }, { status: 200 });
    }

    const newUrl = req.nextUrl.clone();
    // Re-add prefix + decrypted.url + trailing
    newUrl.pathname = `${prefix}/${decrypted.url}${parsed.trailing}`;
    return NextResponse.rewrite(newUrl);
  }

  return NextResponse.next();
}

// middleware config
export const config = {
  matcher: ["/secure/:path*", "/api/:path*"],
};
