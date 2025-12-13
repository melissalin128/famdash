import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from '@/layout';
import { useRouter } from 'next/router';
import '@/styles/globals.css';

const queryClient = new QueryClient();

// Map Next.js routes to page names for Layout component
function getPageName(pathname) {
  if (pathname === '/') return 'Home';
  if (pathname === '/medication') return 'Medications';
  if (pathname === '/calendar') return 'Calendar';
  if (pathname === '/contact') return 'Contacts';
  return null;
}

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const currentPageName = getPageName(router.pathname);

  return (
    <QueryClientProvider client={queryClient}>
      <Layout currentPageName={currentPageName}>
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  );
}

