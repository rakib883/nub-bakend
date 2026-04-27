// import { NextResponse } from 'next/server';

// export function middleware(request) {
//   // Browser theke 'isLoggedIn' cookie-ta check korchi
//   const isLoggedIn = request.cookies.get('isLoggedIn')?.value;
//   const { pathname } = request.nextUrl;

//   // ১. User jodi login na kora thake ebong dashboard-e dhukar cheshta kore
//   if (!isLoggedIn && pathname.startsWith('/dashboard')) {
//     // Take direct login page-e pathiye dao
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   // ২. User jodi already login thake ebong abar login page-e jete chay
//   if (isLoggedIn && pathname === '/login') {
//     // Take direct dashboard-e pathiye dao
//     return NextResponse.redirect(new URL('/dashboard', request.url));
//   }

//   return NextResponse.next();
// }

// // Kon kon route gulo middleware check korbe sheta ekhane bole dite hoy
// export const config = {
//   matcher: ['/dashboard/:path*', '/login'],
// };


import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // ১. CORS হেডার সেট করার জন্য রেসপন্স অবজেক্ট তৈরি
  const response = NextResponse.next();

  // সব এপিআই রুটের জন্য CORS হেডার যোগ করা
  if (pathname.startsWith('/api')) {
    response.headers.set('Access-Control-Allow-Origin', '*'); // সব ডোমেইনকে পারমিশন দিচ্ছে
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  // ২. আপনার আগের লগইন চেকিং লজিক
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value;

  if (!isLoggedIn && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isLoggedIn && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

// ৩. ম্যাচিং রুটগুলো আপডেট করুন যাতে API রুটও এর ভেতরে থাকে
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/login', 
    '/api/:path*' // এই লাইনটি অবশ্যই যোগ করতে হবে
  ],
};

