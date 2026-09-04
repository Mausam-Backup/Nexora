'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SCENES, getSceneById } from '@/data/scenes';
import { LOCATION_META, getAllLocations } from '@/data/locations';
import { SceneData, LocationMeta, LinkHotspot, InfoHotspot } from '@/types';
import ViewerControls from './ViewerControls';
import SceneDrawer from './SceneDrawer';
import SceneInfoModal from './SceneInfoModal';

// Declare Marzipano global for TS
declare global {
  interface Window {
    Marzipano: any;
  }
}

interface MarzipanoViewerProps {
  initialSceneId?: string;
  isEmbed?: boolean;
}

export default function MarzipanoViewer({
  initialSceneId = '0-main',
  isEmbed = false,
}: MarzipanoViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const scenesMapRef = useRef<Map<string, { data: SceneData; scene: any; view: any }>>(new Map());
  const autorotateRef = useRef<any>(null);

  const [currentSceneId, setCurrentSceneId] = useState<string>(initialSceneId);
  const [currentYaw, setCurrentYaw] = useState<number>(0);
  const [isAutorotating, setIsAutorotating] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Switch Scene Function
  const switchScene = useCallback((targetId: string) => {
    const entry = scenesMapRef.current.get(targetId);
    if (!entry) return;

    entry.scene.switchTo({
      transitionDuration: 1000,
    });
    setCurrentSceneId(targetId);
  }, []);

  // Initialize Marzipano Viewer
  useEffect(() => {
    let isMounted = true;

    async function loadMarzipanoScript(): Promise<void> {
      if (window.Marzipano) return;
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = '/marzipano.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Marzipano script'));
        document.body.appendChild(script);
      });
    }

    async function init() {
      try {
        await loadMarzipanoScript();
        if (!isMounted || !containerRef.current) return;

        const Marzipano = window.Marzipano;
        const viewerOpts = {
          controls: {
            mouseViewMode: 'drag',
          },
        };

        const viewer = new Marzipano.Viewer(containerRef.current, viewerOpts);
        viewerRef.current = viewer;

        // Autorotate instance
        const autorotate = Marzipano.autorotate({
          yawSpeed: 0.05,
          targetPitch: 0,
          targetFov: Math.PI / 2,
        });
        autorotateRef.current = autorotate;

        // Build scenes
        const scenesMap = new Map();

        SCENES.forEach((sceneData) => {
          const urlPrefix = '/tiles/' + sceneData.id;
          const source = Marzipano.ImageUrlSource.fromString(
            `${urlPrefix}/{z}/{f}/{y}/{x}.jpg`,
            { cubeMapPreviewUrl: `${urlPrefix}/preview.jpg` }
          );

          const geometry = new Marzipano.CubeGeometry(sceneData.levels);
          const limiter = Marzipano.RectilinearView.limit.traditional(
            sceneData.faceSize,
            (100 * Math.PI) / 180,
            (120 * Math.PI) / 180
          );
          const view = new Marzipano.RectilinearView(sceneData.initialViewParameters, limiter);

          const scene = viewer.createScene({
            source,
            geometry,
            view,
            pinFirstLevel: true,
          });

          // Create Link Hotspots
          sceneData.linkHotspots?.forEach((h: LinkHotspot) => {
            const targetLoc = LOCATION_META[h.target];
            const targetName = targetLoc ? targetLoc.displayName : h.target;

            const el = document.createElement('div');
            el.className = 'link-hotspot';
            el.innerHTML = `
              <div class="link-hotspot-inner">
                <svg class="link-hotspot-icon w-4 h-4 text-amber-300" style="transform: rotate(${h.rotation}rad);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 19V5M5 12l7-7 7 7"/>
                </svg>
              </div>
              <div class="link-hotspot-tooltip">${targetName}</div>
            `;

            el.addEventListener('click', (e) => {
              e.stopPropagation();
              switchScene(h.target);
            });

            scene.hotspotContainer().createHotspot(el, { yaw: h.yaw, pitch: h.pitch });
          });

          // Create Info Hotspots
          sceneData.infoHotspots?.forEach((info: InfoHotspot) => {
            const el = document.createElement('div');
            el.className = 'info-hotspot';
            el.innerHTML = `
              <div class="info-hotspot-inner">
                <svg class="w-3.5 h-3.5 text-stone-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </div>
            `;

            el.addEventListener('click', (e) => {
              e.stopPropagation();
              setIsInfoModalOpen(true);
            });

            scene.hotspotContainer().createHotspot(el, { yaw: info.yaw, pitch: info.pitch });
          });

          // View change event for compass update
          view.addEventListener('change', () => {
            setCurrentYaw(view.yaw());
          });

          scenesMap.set(sceneData.id, { data: sceneData, scene, view });
        });

        scenesMapRef.current = scenesMap;

        // Switch to initial scene
        const startScene = scenesMap.get(initialSceneId) || scenesMap.get('0-main');
        if (startScene) {
          startScene.scene.switchTo();
          setCurrentSceneId(startScene.data.id);
        }

        setIsLoaded(true);
      } catch (err) {
        console.error('Error initializing Marzipano viewer:', err);
      }
    }

    init();

    return () => {
      isMounted = false;
      if (viewerRef.current) {
        viewerRef.current.destroy();
      }
    };
  }, [initialSceneId, switchScene]);

  // Controls Handlers
  const handleZoomIn = () => {
    const entry = scenesMapRef.current.get(currentSceneId);
    if (!entry) return;
    const view = entry.view;
    view.setFov(view.fov() - 0.15);
  };

  const handleZoomOut = () => {
    const entry = scenesMapRef.current.get(currentSceneId);
    if (!entry) return;
    const view = entry.view;
    view.setFov(view.fov() + 0.15);
  };

  const handleResetView = () => {
    const entry = scenesMapRef.current.get(currentSceneId);
    if (!entry) return;
    entry.view.setParameters(entry.data.initialViewParameters);
  };

  const handleToggleAutorotate = () => {
    const viewer = viewerRef.current;
    const autorotate = autorotateRef.current;
    if (!viewer || !autorotate) return;

    if (isAutorotating) {
      viewer.stopMovement();
      setIsAutorotating(false);
    } else {
      viewer.startMovement(autorotate);
      setIsAutorotating(true);
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  const currentSceneData = getSceneById(currentSceneId);
  const currentLocationMeta = LOCATION_META[currentSceneId];
  const allLocations = getAllLocations();

  return (
    <div className="relative w-full h-full bg-stone-950 overflow-hidden select-none">
      {/* 360 Viewport Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Loading Screen */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-950 text-stone-400 gap-4 z-50">
          <div className="w-10 h-10 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest font-mono text-stone-300">
            Initializing 360° Panorama…
          </p>
        </div>
      )}

      {/* Floating Controls */}
      {isLoaded && (
        <>
          <ViewerControls
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetView={handleResetView}
            onToggleAutorotate={handleToggleAutorotate}
            isAutorotating={isAutorotating}
            onToggleFullscreen={handleToggleFullscreen}
            isFullscreen={isFullscreen}
            onOpenInfo={() => setIsInfoModalOpen(true)}
            currentYaw={currentYaw}
          />

          {/* Bottom Scene Switcher Drawer */}
          <SceneDrawer
            currentSceneId={currentSceneId}
            onSelectScene={switchScene}
          />

          {/* Scene Details Modal */}
          <SceneInfoModal
            isOpen={isInfoModalOpen}
            onClose={() => setIsInfoModalOpen(false)}
            sceneData={currentSceneData}
            locationMeta={currentLocationMeta}
            onSwitchScene={switchScene}
            allLocations={allLocations}
          />
        </>
      )}
    </div>
  );
}
