import { NextResponse } from 'next/server';

export function middleware(request) {
  // Browser theke 'isLoggedIn' cookie-ta check korchi
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value;
  const { pathname } = request.nextUrl;

  // ১. User jodi login na kora thake ebong dashboard-e dhukar cheshta kore
  if (!isLoggedIn && pathname.startsWith('/dashboard')) {
    // Take direct login page-e pathiye dao
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ২. User jodi already login thake ebong abar login page-e jete chay
  if (isLoggedIn && pathname === '/login') {
    // Take direct dashboard-e pathiye dao
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Kon kon route gulo middleware check korbe sheta ekhane bole dite hoy
export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};