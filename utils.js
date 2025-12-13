export function createPageUrl(name) {
  if (!name) return '/';
  // Map page names to Next.js routes
  const routeMap = {
    'Home': '/',
    'Medications': '/medication',
    'Calendar': '/calendar',
    'Contacts': '/contact'
  };
  return routeMap[name] || `/${String(name).toLowerCase().replace(/\s+/g, '-')}`;
}
