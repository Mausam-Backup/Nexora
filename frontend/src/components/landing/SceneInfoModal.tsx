'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LocationMeta, SceneData } from '@/types/tour';
import { X, Compass, Info, Quote, ArrowRight } from 'lucide-react';

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
      <div
        className="fixed inset-0 flex items-center justify-center p-4 sm:p-6"
        style={{
          zIndex: 1000,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          fontFamily: '"Times New Roman", Times, Georgia, serif',
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-lg rounded-3xl overflow-hidden flex flex-col max-h-[85vh]"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Header Image */}
          <div className="relative h-44 sm:h-52 w-full overflow-hidden" style={{ backgroundColor: '#0f172a' }}>
            <img
              src={locationMeta.thumbnail}
              alt={locationMeta.displayName}
              className="w-full h-full object-cover"
            />
            {/* Dark gradient ensures title & badge are always crystal clear */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.35) 100%)',
              }}
            />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full transition-all"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                color: '#0f172a',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.92)')}
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="absolute bottom-4 left-6 right-6">
              <span
                style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                }}
              >
                {locationMeta.category}
              </span>
              <h3
                style={{
                  color: '#ffffff',
                  fontSize: '26px',
                  fontWeight: 700,
                  marginTop: '8px',
                  marginBottom: 0,
                  textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                }}
              >
                {locationMeta.displayName}
              </h3>
            </div>
          </div>

          {/* Content Body - 100% Solid White Background */}
          <div
            className="overflow-y-auto space-y-5"
            style={{
              backgroundColor: '#ffffff',
              padding: '24px 24px 36px 24px',
            }}
          >
            <p
              style={{
                color: '#1e293b',
                fontSize: '15px',
                lineHeight: '1.65',
                margin: 0,
              }}
            >
              {locationMeta.shortDescription}
            </p>

            {locationMeta.captureNote && (
              <div
                className="p-4 rounded-2xl flex items-start gap-3"
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}
              >
                <Quote className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                <p
                  style={{
                    color: '#475569',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    fontStyle: 'italic',
                    margin: 0,
                  }}
                >
                  &quot;{locationMeta.captureNote}&quot;
                </p>
              </div>
            )}

            {/* Connected Hotspot Destinations */}
            {sceneData.linkHotspots && sceneData.linkHotspots.length > 0 && (
              <div>
                <h4
                  style={{
                    color: '#0f172a',
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Compass className="w-4 h-4 text-stone-700" />
                  <span>Connected Destinations ({sceneData.linkHotspots.length})</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {sceneData.linkHotspots.map((h, i) => {
                    const targetMeta = allLocations.find((l) => l.sceneId === h.target);
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          onSwitchScene(h.target);
                          onClose();
                        }}
                        className="flex items-center justify-between p-3.5 rounded-2xl text-left transition-all duration-200 group"
                        style={{
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f1f5f9';
                          e.currentTarget.style.borderColor = '#cbd5e1';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8fafc';
                          e.currentTarget.style.borderColor = '#e2e8f0';
                        }}
                      >
                        <span
                          style={{
                            color: '#0f172a',
                            fontSize: '13px',
                            fontWeight: 600,
                          }}
                          className="truncate"
                        >
                          {targetMeta?.displayName || h.target}
                        </span>
                        <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-black group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Points of Interest */}
            {sceneData.infoHotspots && sceneData.infoHotspots.length > 0 && (
              <div>
                <h4
                  style={{
                    color: '#0f172a',
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Info className="w-4 h-4 text-stone-700" />
                  <span>Points of Interest ({sceneData.infoHotspots.length})</span>
                </h4>
                <div className="space-y-2.5">
                  {sceneData.infoHotspots.map((info, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl"
                      style={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <div style={{ color: '#0f172a', fontSize: '13px', fontWeight: 700 }}>
                        {info.title}
                      </div>
                      <div style={{ color: '#475569', fontSize: '12px', lineHeight: '1.5', marginTop: '3px' }}>
                        {info.text}
                      </div>
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
