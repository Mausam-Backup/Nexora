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

  const btnStyle = {
    width: '44px',
    height: '44px',
    borderRadius: '16px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    color: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
    transition: 'all 0.2s ease',
  };

  const tooltipStyle = {
    fontFamily: '"Times New Roman", Times, Georgia, serif',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    color: '#0f172a',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
  };

  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2.5">
      {/* Compass / Reset View */}
      <div className="relative group">
        <button
          onClick={onResetView}
          style={btnStyle}
          className="hover:scale-105 active:scale-95"
          title="Reset Orientation / Compass"
        >
          <div
            style={{ transform: `rotate(${compassDegrees}deg)` }}
            className="transition-transform duration-100"
          >
            <Compass className="w-5 h-5 text-stone-900" />
          </div>
        </button>
        <div
          style={tooltipStyle}
          className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        >
          Reset View / Compass
        </div>
      </div>

      {/* Auto-Rotate */}
      <div className="relative group">
        <button
          onClick={onToggleAutorotate}
          style={{
            ...btnStyle,
            backgroundColor: isAutorotating ? '#0f172a' : '#ffffff',
            borderColor: isAutorotating ? '#0f172a' : '#e2e8f0',
            color: isAutorotating ? '#ffffff' : '#0f172a',
          }}
          className="hover:scale-105 active:scale-95"
          title={isAutorotating ? 'Pause Auto-Rotation' : 'Start Auto-Rotation'}
        >
          {isAutorotating ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-stone-900 ml-0.5" />
          )}
        </button>
        <div
          style={tooltipStyle}
          className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        >
          {isAutorotating ? 'Pause Rotation' : 'Auto Rotate'}
        </div>
      </div>

      {/* Scene Info */}
      <div className="relative group">
        <button
          onClick={onOpenInfo}
          style={btnStyle}
          className="hover:scale-105 active:scale-95"
          title="Location Details"
        >
          <Info className="w-5 h-5 text-stone-900" />
        </button>
        <div
          style={tooltipStyle}
          className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        >
          Location Info
        </div>
      </div>

      {/* Zoom In */}
      <div className="relative group">
        <button
          onClick={onZoomIn}
          style={btnStyle}
          className="hover:scale-105 active:scale-95"
          title="Zoom In"
        >
          <Plus className="w-5 h-5 text-stone-900" />
        </button>
        <div
          style={tooltipStyle}
          className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        >
          Zoom In
        </div>
      </div>

      {/* Zoom Out */}
      <div className="relative group">
        <button
          onClick={onZoomOut}
          style={btnStyle}
          className="hover:scale-105 active:scale-95"
          title="Zoom Out"
        >
          <Minus className="w-5 h-5 text-stone-900" />
        </button>
        <div
          style={tooltipStyle}
          className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        >
          Zoom Out
        </div>
      </div>

      {/* Fullscreen */}
      <div className="relative group">
        <button
          onClick={onToggleFullscreen}
          style={btnStyle}
          className="hover:scale-105 active:scale-95"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? (
            <Minimize2 className="w-5 h-5 text-stone-900" />
          ) : (
            <Maximize2 className="w-5 h-5 text-stone-900" />
          )}
        </button>
        <div
          style={tooltipStyle}
          className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        >
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </div>
      </div>
    </div>
  );
}
