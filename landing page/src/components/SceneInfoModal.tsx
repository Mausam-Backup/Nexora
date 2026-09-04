'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { LocationMeta, SceneData } from '@/types';
import { X, MapPin, Compass, Info, Quote, ArrowRight } from 'lucide-react';

interface SceneInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  sceneData?: SceneData;
  locationMeta?: LocationMeta;
  onSwitchScene: (targetId: string) => void;
  allLocations: LocationMeta[];
}

export default function SceneInfoModal({
  isOpen,
  onClose,
  sceneData,
  locationMeta,
  onSwitchScene,
  allLocations,
}: SceneInfoModalProps) {
  if (!isOpen || !sceneData || !locationMeta) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-stone-900/95 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl shadow-black/80 flex flex-col max-h-[85vh]"
        >
          {/* Header Image */}
          <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-stone-950">
            <Image
              src={locationMeta.thumbnail}
              alt={locationMeta.displayName}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/30 to-transparent" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-950/70 border border-stone-700/60 text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="absolute bottom-4 left-6 right-6">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-[10px] font-bold uppercase tracking-wider">
                {locationMeta.category}
              </span>
              <h3 className="text-2xl font-bold text-stone-100 mt-2">
                {locationMeta.displayName}
              </h3>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 overflow-y-auto space-y-5">
            <p className="text-sm text-stone-300 leading-relaxed">
              {locationMeta.shortDescription}
            </p>

            {locationMeta.captureNote && (
              <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800/80 flex items-start gap-3">
                <Quote className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-stone-400 italic leading-relaxed">
                  &quot;{locationMeta.captureNote}&quot;
                </p>
              </div>
            )}

            {/* Connected Hotspot Destinations */}
            {sceneData.linkHotspots && sceneData.linkHotspots.length > 0 && (
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>Connected Destinations ({sceneData.linkHotspots.length})</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {sceneData.linkHotspots.map((h, i) => {
                    const targetMeta = allLocations.find((l) => l.sceneId === h.target);
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          onSwitchScene(h.target);
                          onClose();
                        }}
                        className="flex items-center justify-between p-3 rounded-2xl bg-stone-950/40 border border-stone-800/60 hover:border-amber-400/40 hover:bg-stone-800/40 text-left transition-colors group"
                      >
                        <span className="text-xs font-semibold text-stone-300 group-hover:text-amber-300 truncate">
                          {targetMeta?.displayName || h.target}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Info Hotspots info if available */}
            {sceneData.infoHotspots && sceneData.infoHotspots.length > 0 && (
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-400" />
                  <span>Points of Interest ({sceneData.infoHotspots.length})</span>
                </h4>
                <div className="space-y-2">
                  {sceneData.infoHotspots.map((info, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-2xl bg-stone-950/40 border border-stone-800/60"
                    >
                      <div className="text-xs font-bold text-amber-300">{info.title}</div>
                      <div className="text-[11px] text-stone-400 mt-0.5">{info.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
