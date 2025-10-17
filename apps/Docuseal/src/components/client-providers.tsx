'use client';

import React from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { CountsProvider } from '@/contexts/counts-context';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <CountsProvider>
        <Navbar />
        {children}
      </CountsProvider>
    </ThemeProvider>
  );
}
