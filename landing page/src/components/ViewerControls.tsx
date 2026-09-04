'use client';

import React from 'react';
import {
  Compass,
  Play,
  Pause,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  Info,
  RotateCcw,
} from 'lucide-react';

interface ViewerControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onToggleAutorotate: () => void;
  isAutorotating: boolean;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  onOpenInfo: () => void;
  currentYaw: number;
}

export default function ViewerControls({
  onZoomIn,
  onZoomOut,
  onResetView,
  onToggleAutorotate,
  isAutorotating,
  onToggleFullscreen,
  isFullscreen,
  onOpenInfo,
  currentYaw,
}: ViewerControlsProps) {
  // Convert yaw in radians to rotation degrees
  const compassDegrees = -(currentYaw * 180) / Math.PI;

  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2.5">
      {/* Compass / Reset View */}
      <div className="relative group">
        <button
          onClick={onResetView}
          className="w-11 h-11 rounded-2xl bg-stone-900/80 hover:bg-stone-800 backdrop-blur-xl border border-stone-800/80 text-amber-400 hover:text-amber-300 flex items-center justify-center transition-all duration-300 shadow-xl shadow-black/40 hover:scale-105 active:scale-95"
          title="Reset Orientation / Compass"
        >
          <div
            style={{ transform: `rotate(${compassDegrees}deg)` }}
            className="transition-transform duration-100"
          >
            <Compass className="w-5 h-5" />
          </div>
        </button>
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-stone-900/90 border border-stone-700 text-[10px] font-mono text-stone-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Compass / Reset View
        </div>
      </div>

      {/* Auto-Rotate */}
      <div className="relative group">
        <button
          onClick={onToggleAutorotate}
          className={`w-11 h-11 rounded-2xl backdrop-blur-xl border transition-all duration-300 flex items-center justify-center shadow-xl shadow-black/40 hover:scale-105 active:scale-95 ${
            isAutorotating
              ? 'bg-amber-400 border-amber-300 text-stone-950 font-bold'
              : 'bg-stone-900/80 hover:bg-stone-800 border-stone-800/80 text-stone-300 hover:text-white'
          }`}
          title={isAutorotating ? 'Pause Auto-Rotation' : 'Start Auto-Rotation'}
        >
          {isAutorotating ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-stone-900/90 border border-stone-700 text-[10px] font-mono text-stone-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {isAutorotating ? 'Pause Tour' : 'Auto Rotate'}
        </div>
      </div>

      {/* Scene Info */}
      <div className="relative group">
        <button
          onClick={onOpenInfo}
          className="w-11 h-11 rounded-2xl bg-stone-900/80 hover:bg-stone-800 backdrop-blur-xl border border-stone-800/80 text-stone-300 hover:text-white flex items-center justify-center transition-all duration-300 shadow-xl shadow-black/40 hover:scale-105 active:scale-95"
          title="Scene Details"
        >
          <Info className="w-5 h-5" />
        </button>
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-stone-900/90 border border-stone-700 text-[10px] font-mono text-stone-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Location Info
        </div>
      </div>

      {/* Zoom In */}
      <div className="relative group">
        <button
          onClick={onZoomIn}
          className="w-11 h-11 rounded-2xl bg-stone-900/80 hover:bg-stone-800 backdrop-blur-xl border border-stone-800/80 text-stone-300 hover:text-white flex items-center justify-center transition-all duration-300 shadow-xl shadow-black/40 hover:scale-105 active:scale-95"
          title="Zoom In"
        >
          <Plus className="w-5 h-5" />
        </button>
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-stone-900/90 border border-stone-700 text-[10px] font-mono text-stone-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Zoom In
        </div>
      </div>

      {/* Zoom Out */}
      <div className="relative group">
        <button
          onClick={onZoomOut}
          className="w-11 h-11 rounded-2xl bg-stone-900/80 hover:bg-stone-800 backdrop-blur-xl border border-stone-800/80 text-stone-300 hover:text-white flex items-center justify-center transition-all duration-300 shadow-xl shadow-black/40 hover:scale-105 active:scale-95"
          title="Zoom Out"
        >
          <Minus className="w-5 h-5" />
        </button>
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-stone-900/90 border border-stone-700 text-[10px] font-mono text-stone-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Zoom Out
        </div>
      </div>

      {/* Fullscreen */}
      <div className="relative group">
        <button
          onClick={onToggleFullscreen}
          className="w-11 h-11 rounded-2xl bg-stone-900/80 hover:bg-stone-800 backdrop-blur-xl border border-stone-800/80 text-stone-300 hover:text-white flex items-center justify-center transition-all duration-300 shadow-xl shadow-black/40 hover:scale-105 active:scale-95"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-stone-900/90 border border-stone-700 text-[10px] font-mono text-stone-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </div>
      </div>
    </div>
  );
}
