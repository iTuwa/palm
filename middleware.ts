import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  console.log(`Incoming request: ${pathname}${search}`);

  if (pathname.endsWith('.php')) {
    const url = request.nextUrl.clone();
    url.pathname = '/api/secureproxy';
    url.search = search;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/secureproxy.php'],
};
