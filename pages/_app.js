import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from '@/layout';
import { useRouter } from 'next/router';
import '@/styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

// Map Next.js routes to page names for Layout component
function getPageName(pathname) {
  if (!pathname) return null;
  if (pathname === '/') return 'Home';
  if (pathname === '/medication') return 'Medications';
  if (pathname === '/calendar') return 'Calendar';
  if (pathname === '/contact') return 'Contacts';
  return null;
}

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [currentPageName, setCurrentPageName] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      setCurrentPageName(getPageName(router.pathname));
    }
  }, [router.isReady, router.pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <Layout currentPageName={currentPageName}>
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  );
}

