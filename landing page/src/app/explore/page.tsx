'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ArrowLeft, Compass } from 'lucide-react';

const MarzipanoViewer = dynamic(() => import('@/components/MarzipanoViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-stone-950 text-stone-400 gap-4">
      <div className="w-10 h-10 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
      <p className="text-xs uppercase tracking-widest font-mono text-stone-300">
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
    <div className="relative w-screen h-screen overflow-hidden bg-stone-950">
      {/* Top Header Bar */}
      {!isEmbed && (
        <header className="absolute top-4 left-4 z-40 flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-stone-900/80 backdrop-blur-xl border border-stone-800/80 text-stone-300 hover:text-white hover:bg-stone-800 transition-all text-xs font-medium group shadow-lg shadow-black/40 hover:scale-105 active:scale-95"
            style={{ textDecoration: 'none' }}
          >
            <ArrowLeft className="w-3.5 h-3.5 text-stone-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Home</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-2xl bg-stone-900/60 backdrop-blur-xl border border-stone-800/40 text-stone-300 text-xs font-mono shadow-md">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
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
        <div className="w-screen h-screen flex items-center justify-center bg-stone-950 text-stone-400">
          <div className="w-10 h-10 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
