import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_SESSION_TTL_SECONDS = 60 * 60; // 1 saat

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedWorkspace =
    pathname.startsWith('/admin') || pathname.startsWith('/crm');

  if (!isProtectedWorkspace) {
    return NextResponse.next();
  }

  if (!ADMIN_PASSWORD) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  const session = request.cookies.get('admin_logged_in')?.value;

  if (session === '1') {
    const res = NextResponse.next();
    res.cookies.set('admin_logged_in', '1', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: ADMIN_SESSION_TTL_SECONDS,
    });
    return res;
  }

  const url = request.nextUrl.clone();
  url.pathname = '/admin/login';
  url.searchParams.set('from', pathname);

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/admin/:path*', '/crm/:path*'],
};
