import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Sadece /admin altını kontrol et
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Eğer ADMIN_PASSWORD tanımlı değilse, geliştirme kolaylığı için
  // admin panelini korumaya alma.
  if (!ADMIN_PASSWORD) {
    return NextResponse.next();
  }

  // Login sayfasını serbest bırak
  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  const session = request.cookies.get('admin_logged_in')?.value;

  if (session === '1') {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = '/admin/login';
  url.searchParams.set('from', pathname);

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/admin/:path*'],
};

