import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'fr', 'mi'],
  defaultLocale: 'en'
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};

