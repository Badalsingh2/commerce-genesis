import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'

const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isVendorRoute = createRouteMatcher(['/vendor(.*)'])
const isCustomerRoute = createRouteMatcher(['/customer(.*)'])

export default clerkMiddleware(async (auth, req) => {

  const sessionClaims = await auth(); // Get session claims
  console.log(sessionClaims);
  const { userId } = sessionClaims; // Extract userId
  console.log(userId);
  const client = await clerkClient(); // Get Clerk client

  const cookieStore = req.cookies;
  const roleFromCookie = cookieStore.get('role')?.value;

  console.log('Cookies:', cookieStore);
  console.log('Role from cookie:', roleFromCookie);

  // let role = '';
  // if (isAdminRoute(req)) {
  //   role = 'admin';
  // } else if (isVendorRoute(req)) {
  //   role = 'vendor';
  // } else if (isCustomerRoute(req)) {
  //   role = 'customer';
  // }

  if (roleFromCookie) {
    // Update user's metadata with the role
    try {
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          role: roleFromCookie,
        },
      });
    } catch (error) {
      console.error('Error updating role in metadata:', error);
    }
  }

  // Protect all routes starting with `/admin`
  if (isAdminRoute(req) && sessionClaims?.sessionClaims?.metadata?.role !== 'admin') {
    const url = new URL('/', req.url);
    return NextResponse.redirect(url);
  }

  if (isVendorRoute(req) && sessionClaims?.sessionClaims?.metadata?.role !== 'vendor') {
    const url = new URL('/', req.url);
    return NextResponse.redirect(url);
  }

  if (isCustomerRoute(req) && sessionClaims?.sessionClaims?.metadata?.role !== 'customer') {
    const url = new URL('/', req.url);
    return NextResponse.redirect(url);
  }

})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
