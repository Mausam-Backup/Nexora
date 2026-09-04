'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { LOCATION_CATEGORIES, getAllLocations } from '@/data/locations';
import { LocationMeta } from '@/types';
import { ChevronDown, ChevronUp, MapPin, Compass } from 'lucide-react';

interface SceneDrawerProps {
  currentSceneId: string;
  onSelectScene: (sceneId: string) => void;
}

export default function SceneDrawer({
  currentSceneId,
  onSelectScene,
}: SceneDrawerProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const allLocations = getAllLocations();

  const currentLoc = allLocations.find((l) => l.sceneId === currentSceneId);

  const filteredLocations =
    selectedCategory === 'all'
      ? allLocations
      : allLocations.filter((l) => l.category === selectedCategory);

  return (
    <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 z-40 flex flex-col items-center">
      {/* Drawer Container */}
      <div className="w-full max-w-5xl bg-stone-950/85 backdrop-blur-2xl border border-stone-800/80 rounded-3xl overflow-hidden shadow-2xl shadow-black/80 transition-all duration-300">
        {/* Header Bar */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-stone-800/40">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-stone-100 truncate">
                {currentLoc?.displayName || 'Campus Panorama'}
              </span>
              <span className="text-[11px] text-stone-400 font-mono hidden sm:inline">
                ({currentLoc?.category})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Category Filter Pills (Desktop) */}
            <div className="hidden md:flex items-center gap-1.5">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-xl text-[11px] font-semibold transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-amber-400 text-stone-950'
                    : 'bg-stone-900/60 hover:bg-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                All
              </button>
              {LOCATION_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-semibold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-amber-400 text-stone-950'
                      : 'bg-stone-900/60 hover:bg-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Toggle Drawer */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700/60 text-stone-400 hover:text-stone-100 transition-colors"
              aria-label={isOpen ? 'Collapse scenes drawer' : 'Expand scenes drawer'}
            >
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Carousel Area */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-4 overflow-hidden"
            >
              <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-hide">
                {filteredLocations.map((loc) => {
                  const isActive = loc.sceneId === currentSceneId;
                  return (
                    <button
                      key={loc.sceneId}
                      onClick={() => onSelectScene(loc.sceneId)}
                      className={`relative flex-shrink-0 w-32 sm:w-36 rounded-2xl overflow-hidden text-left transition-all duration-300 group ${
                        isActive
                          ? 'ring-2 ring-amber-400 scale-105 shadow-lg shadow-amber-400/20'
                          : 'opacity-70 hover:opacity-100 hover:scale-100'
                      }`}
                    >
                      <div className="relative aspect-[16/10] bg-stone-900">
                        <Image
                          src={loc.thumbnail}
                          alt={loc.displayName}
                          fill
                          sizes="140px"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
                      </div>
                      <div className="p-2 bg-stone-900/90 backdrop-blur-md">
                        <div className="text-[11px] font-bold text-stone-200 truncate group-hover:text-amber-300 transition-colors">
                          {loc.displayName}
                        </div>
                        <div className="text-[9px] text-stone-400 truncate mt-0.5">
                          {loc.shortDescription}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
