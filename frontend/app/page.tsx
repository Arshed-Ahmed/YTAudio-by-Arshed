"use client";
import dynamic from 'next/dynamic';

// Dynamically import YTAudio component only on the client-side
const YTAudio = dynamic(() => import('./components/YTAudio'), { ssr: false });

export default function Home() {
  return <YTAudio />;
}