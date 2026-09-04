'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { LOCATION_CATEGORIES, getAllLocations } from '@/data/locations';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
    <div
      className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 z-40 flex flex-col items-center"
      style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
    >
      {/* Drawer Container */}
      <div
        className="w-full max-w-5xl rounded-3xl overflow-hidden transition-all duration-300"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 0, 0, 0.12)',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Header Bar */}
        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{ borderBottom: '1px solid #e2e8f0' }}
        >
          <div className="flex items-center gap-3">
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#0f172a',
              }}
            />
            <div className="flex items-baseline gap-2">
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }} className="truncate">
                {currentLoc?.displayName || 'Campus Panorama'}
              </span>
              <span style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }} className="hidden sm:inline">
                ({currentLoc?.category})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Category Filter Pills (Desktop) */}
            <div className="hidden md:flex items-center gap-1.5">
              <button
                onClick={() => setSelectedCategory('all')}
                style={{
                  padding: '4px 14px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: 'none',
                  backgroundColor: selectedCategory === 'all' ? '#0f172a' : '#f1f5f9',
                  color: selectedCategory === 'all' ? '#ffffff' : '#334155',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedCategory === 'all' ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
                }}
              >
                All
              </button>
              {LOCATION_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '4px 14px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none',
                    backgroundColor: selectedCategory === cat.id ? '#0f172a' : '#f1f5f9',
                    color: selectedCategory === cat.id ? '#ffffff' : '#334155',
                    transition: 'all 0.2s ease',
                    boxShadow: selectedCategory === cat.id ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Toggle Drawer */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              style={{
                padding: '6px',
                borderRadius: '50%',
                backgroundColor: '#f1f5f9',
                border: '1px solid #e2e8f0',
                color: '#334155',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
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
              style={{ backgroundColor: '#ffffff' }}
            >
              <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-hide">
                {filteredLocations.map((loc) => {
                  const isActive = loc.sceneId === currentSceneId;
                  return (
                    <button
                      key={loc.sceneId}
                      onClick={() => onSelectScene(loc.sceneId)}
                      className="relative flex-shrink-0 w-32 sm:w-36 rounded-2xl overflow-hidden text-left transition-all duration-300 group"
                      style={{
                        backgroundColor: '#ffffff',
                        border: isActive ? '2px solid #0f172a' : '1px solid #e2e8f0',
                        boxShadow: isActive ? '0 8px 20px rgba(0,0,0,0.15)' : '0 2px 6px rgba(0,0,0,0.04)',
                        transform: isActive ? 'scale(1.04)' : 'scale(1)',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      <div className="relative aspect-[16/10]" style={{ backgroundColor: '#f1f5f9' }}>
                        <Image
                          src={loc.thumbnail}
                          alt={loc.displayName}
                          fill
                          sizes="140px"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-2.5" style={{ backgroundColor: '#ffffff' }}>
                        <div
                          style={{
                            fontSize: '12px',
                            fontWeight: 700,
                            color: '#0f172a',
                          }}
                          className="truncate"
                        >
                          {loc.displayName}
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: '#64748b',
                            marginTop: '2px',
                          }}
                          className="truncate"
                        >
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
