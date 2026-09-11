import { NextResponse, type NextRequest } from "next/server";
import { isMaintenanceMode, resolveMaintenanceRoute } from "@/lib/maintenance";

/**
 * Next 16 renamed the `middleware` file convention to `proxy`
 * (node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md).
 *
 * Routing decisions live in @/lib/maintenance so they can be unit-tested
 * without booting an edge runtime; that module is pure, which keeps this file
 * within the "no shared state" guidance for proxy.
 */
export function proxy(request: NextRequest) {
  if (!isMaintenanceMode()) return NextResponse.next();

  const route = resolveMaintenanceRoute(request.nextUrl.pathname);

  switch (route.action) {
    case "rewrite":
      return NextResponse.rewrite(new URL(route.target, request.url));
    case "redirect":
      return NextResponse.redirect(
        new URL(route.target, request.url),
        route.status,
      );
    case "notFound":
      return new NextResponse(null, { status: 404 });
    case "passthrough":
      return NextResponse.next();
  }
}

export const config = {
  // The image optimizer and immutable build assets never need inspecting;
  // skipping them keeps the proxy off the hot path for every chunk request.
  matcher: ["/((?!_next/static|_next/image).*)"],
};
