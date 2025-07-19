// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';
// Assurez-vous que ce chemin est correct par rapport à la racine du projet
import { fallbackLng, languages } from './src/i18n/settings'; // <-- Chemin crucial

acceptLanguage.languages([...languages]);

export const config = {
  // matcher: '/:lng*' // Ancien Next.js, moins précis
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)'] // Matcher plus robuste pour App Router
};

const cookieName = 'i18next';

export function middleware(req: NextRequest) {
  let lng: string | undefined | null = req.cookies.get(cookieName)?.value;

  if (!lng) {
    lng = acceptLanguage.get(req.headers.get('Accept-Language'));
  }
  if (!lng) {
    lng = fallbackLng;
  }

  // Rediriger si lng n'est pas dans le path (ex: si l'utilisateur va sur /connections, le rediriger vers /fr/connections)
  if (
    !languages.some(loc => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith('/_next') // Ignorer les fichiers internes de Next.js
  ) {
    return NextResponse.redirect(new URL(`/${lng}${req.nextUrl.pathname}`, req.url));
  }

  // Mettre à jour le cookie de langue si le référent a une langue
  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer')!);
    const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`));
    const response = NextResponse.next();
    if (lngInReferer) {
      response.cookies.set(cookieName, lngInReferer);
    }
    return response;
  }

  return NextResponse.next();
}