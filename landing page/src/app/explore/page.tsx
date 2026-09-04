'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ArrowLeft } from 'lucide-react';

const MarzipanoViewer = dynamic(() => import('@/components/MarzipanoViewer'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-full flex flex-col items-center justify-center bg-stone-50 text-stone-700 gap-4"
      style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
    >
      <div className="w-10 h-10 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin" />
      <p className="text-sm font-semibold tracking-wide text-stone-700">
        Initializing 360° Panorama…
      </p>
    </div>
  ),
});

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialScene = searchParams.get('scene') || '0-main';
  const isEmbed = searchParams.get('embed') === 'true';

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-stone-100"
      style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
    >
      {/* Top Header Bar */}
      {!isEmbed && (
        <header className="absolute top-4 left-4 z-40 flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-full transition-all text-xs font-semibold group hover:scale-105 active:scale-95"
            style={{
              textDecoration: 'none',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              color: '#0f172a',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
            }}
          >
            <ArrowLeft className="w-3.5 h-3.5 text-stone-700 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Home</span>
          </Link>

          <div
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              color: '#0f172a',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
            }}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-stone-900" />
            <span>Interactive 360° University Tour</span>
          </div>
        </header>
      )}

      {/* 360 Viewer */}
      <MarzipanoViewer initialSceneId={initialScene} isEmbed={isEmbed} />
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div
          className="w-screen h-screen flex flex-col items-center justify-center bg-stone-50 text-stone-700 gap-4"
          style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
        >
          <div className="w-10 h-10 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin" />
          <p className="text-sm font-semibold tracking-wide text-stone-700">
            Loading Tour…
          </p>
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
