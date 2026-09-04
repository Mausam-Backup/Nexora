"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

interface LionFullscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalFrames?: number;
  framePathPrefix?: string;
  frameExtension?: string;
}

export default function LionFullscreenModal({
  isOpen,
  onClose,
  totalFrames = 302,
  framePathPrefix = "/lion_frames/frame_",
  frameExtension = ".jpg",
}: LionFullscreenModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const [currentFrame, setCurrentFrame] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const fps = 30;
  const frameDuration = 1000 / fps;

  // Preload frames progressively when modal is opened
  useEffect(() => {
    if (!isOpen) return;

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    imagesRef.current = new Array(totalFrames + 1).fill(null);

    // 1. Instant first frame
    const firstImg = new Image();
    firstImg.src = `${framePathPrefix}0001${frameExtension}`;
    firstImg.onload = () => {
      imagesRef.current[1] = firstImg;
      setLoadedCount((prev) => prev + 1);
      drawFrame(1);
    };

    // 2. Preload remaining frames
    let loaded = 1;
    for (let i = 2; i <= totalFrames; i++) {
      const img = new Image();
      const padded = i.toString().padStart(4, "0");
      img.src = `${framePathPrefix}${padded}${frameExtension}`;
      img.onload = () => {
        imagesRef.current[i] = img;
        loaded++;
        if (loaded % 25 === 0 || loaded === totalFrames) {
          setLoadedCount(loaded);
        }
      };
      img.onerror = () => {
        loaded++;
      };
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, totalFrames, framePathPrefix, frameExtension]);

  // Draw frame on canvas with high quality cover
  const drawFrame = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let img = imagesRef.current[frameIndex];
      // Fallback to nearest loaded frame if current not loaded yet
      if (!img || !img.complete || img.naturalWidth === 0) {
        for (let offset = 1; offset < totalFrames; offset++) {
          const lower = frameIndex - offset;
          const higher = frameIndex + offset;
          if (lower >= 1 && imagesRef.current[lower]?.complete) {
            img = imagesRef.current[lower];
            break;
          }
          if (higher <= totalFrames && imagesRef.current[higher]?.complete) {
            img = imagesRef.current[higher];
            break;
          }
        }
      }

      if (!img || !img.complete || img.naturalWidth === 0) return;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      const imgAspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = width / height;

      let drawW: number;
      let drawH: number;
      let drawX: number;
      let drawY: number;

      if (canvasAspect > imgAspect) {
        drawW = width;
        drawH = width / imgAspect;
        drawX = 0;
        drawY = (height - drawH) / 2;
      } else {
        drawH = height;
        drawW = height * imgAspect;
        drawY = 0;
        drawX = (width - drawW) / 2;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();
    },
    [totalFrames]
  );

  // Playback animation loop
  useEffect(() => {
    if (!isOpen || !isPlaying) {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      return;
    }

    const loop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const elapsed = timestamp - lastTimeRef.current;

      if (elapsed >= frameDuration) {
        lastTimeRef.current = timestamp - (elapsed % frameDuration);
        setCurrentFrame((prev) => {
          const next = prev >= totalFrames ? 1 : prev + 1;
          drawFrame(next);
          return next;
        });
      }

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isOpen, isPlaying, frameDuration, totalFrames, drawFrame]);

  // Window resize re-draw
  useEffect(() => {
    if (!isOpen) return;
    const handleResize = () => drawFrame(currentFrame);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, currentFrame, drawFrame]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.key === "ArrowRight") {
        setIsPlaying(false);
        setCurrentFrame((prev) => {
          const next = Math.min(totalFrames, prev + 1);
          drawFrame(next);
          return next;
        });
      } else if (e.key === "ArrowLeft") {
        setIsPlaying(false);
        setCurrentFrame((prev) => {
          const next = Math.max(1, prev - 1);
          drawFrame(next);
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, totalFrames, drawFrame]);

  // Wheel scrubbing inside modal
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    setIsPlaying(false);
    const delta = e.deltaY > 0 ? 1 : -1;
    setCurrentFrame((prev) => {
      const next = Math.min(totalFrames, Math.max(1, prev + delta));
      drawFrame(next);
      return next;
    });
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPlaying(false);
    const newFrame = parseInt(e.target.value, 10);
    setCurrentFrame(newFrame);
    drawFrame(newFrame);
  };

  if (!isOpen) return null;

  const currentSeconds = ((currentFrame / fps) % 60).toFixed(1);
  const totalSeconds = (totalFrames / fps).toFixed(1);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Full Screen Lion Video Frames"
      onWheel={handleWheel}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        backgroundColor: "rgba(10, 12, 18, 0.96)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "24px 32px",
        boxSizing: "border-box",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        color: "#ffffff",
        animation: "fadeInModal 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <style>{`
        @keyframes fadeInModal {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .scrubber-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.2);
          outline: none;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .scrubber-slider:hover {
          background: rgba(255, 255, 255, 0.35);
        }
        .scrubber-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #5162ff;
          border: 2px solid #ffffff;
          box-shadow: 0 0 10px rgba(81, 98, 255, 0.6);
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        .scrubber-slider::-webkit-slider-thumb:hover {
          transform: scale(1.25);
        }
        .btn-hover-effect {
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .btn-hover-effect:hover {
          transform: translateY(-2px);
          background-color: rgba(255, 255, 255, 0.2) !important;
        }
      `}</style>

      {/* Top Header Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          paddingBottom: "16px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Left: Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: isPlaying ? "#00F298" : "#FFB800",
              boxShadow: isPlaying ? "0 0 10px #00F298" : "none",
            }}
          />
          <span
            style={{
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            Lion Video Sequence
          </span>
          <span
            style={{
              fontSize: "12px",
              color: "rgba(255, 255, 255, 0.5)",
              background: "rgba(255, 255, 255, 0.08)",
              padding: "4px 8px",
              borderRadius: "6px",
            }}
          >
            {totalFrames} Frames @ 30 FPS
          </span>
        </div>

        {/* Center: Frame Counter */}
        <div
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "rgba(255, 255, 255, 0.8)",
            letterSpacing: "0.5px",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          FRAME {currentFrame} / {totalFrames} • {currentSeconds}s / {totalSeconds}s
        </div>

        {/* Right: Close Button */}
        <button
          onClick={onClose}
          className="btn-hover-effect"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#ffffff",
            padding: "8px 18px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <span>✕ Close</span>
          <span
            style={{
              fontSize: "10px",
              opacity: 0.6,
              background: "rgba(255, 255, 255, 0.15)",
              padding: "2px 6px",
              borderRadius: "4px",
            }}
          >
            ESC
          </span>
        </button>
      </div>

      {/* Main Canvas Player Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px 0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "min(1280px, 92vw)",
            height: "min(720px, 68vh)",
            aspectRatio: "16 / 9",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow:
              "0 25px 60px rgba(0, 0, 0, 0.8), 0 0 50px rgba(81, 98, 255, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            backgroundColor: "#000000",
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              objectFit: "cover",
            }}
          />

          {/* Scrub via scroll hint */}
          <div
            style={{
              position: "absolute",
              bottom: "16px",
              right: "16px",
              background: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(8px)",
              padding: "6px 12px",
              borderRadius: "8px",
              fontSize: "11px",
              color: "rgba(255, 255, 255, 0.7)",
              pointerEvents: "none",
            }}
          >
            Scroll or Drag to Scrub • Space to Toggle
          </div>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          width: "min(1280px, 92vw)",
          margin: "0 auto",
          paddingTop: "12px",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Scrubber Timeline */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span
            style={{
              fontSize: "12px",
              color: "rgba(255, 255, 255, 0.6)",
              fontVariantNumeric: "tabular-nums",
              minWidth: "40px",
            }}
          >
            {currentSeconds}s
          </span>
          <input
            type="range"
            min={1}
            max={totalFrames}
            value={currentFrame}
            onChange={handleSeek}
            className="scrubber-slider"
            style={{ flex: 1 }}
          />
          <span
            style={{
              fontSize: "12px",
              color: "rgba(255, 255, 255, 0.6)",
              fontVariantNumeric: "tabular-nums",
              minWidth: "40px",
              textAlign: "right",
            }}
          >
            {totalSeconds}s
          </span>
        </div>

        {/* Buttons Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Step Back */}
            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentFrame((prev) => {
                  const next = Math.max(1, prev - 1);
                  drawFrame(next);
                  return next;
                });
              }}
              className="btn-hover-effect"
              title="Previous Frame (Left Arrow)"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#ffffff",
                padding: "8px 14px",
                borderRadius: "8px",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              ⏮ -1
            </button>

            {/* Play / Pause Toggle */}
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="btn-hover-effect"
              style={{
                background: "#5162ff",
                border: "none",
                color: "#ffffff",
                padding: "8px 20px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                boxShadow: "0 0 15px rgba(81, 98, 255, 0.5)",
              }}
            >
              {isPlaying ? "⏸ Pause" : "▶ Play"}
            </button>

            {/* Step Forward */}
            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentFrame((prev) => {
                  const next = Math.min(totalFrames, prev + 1);
                  drawFrame(next);
                  return next;
                });
              }}
              className="btn-hover-effect"
              title="Next Frame (Right Arrow)"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#ffffff",
                padding: "8px 14px",
                borderRadius: "8px",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              +1 ⏭
            </button>
          </div>

          <div
            style={{
              fontSize: "12px",
              color: "rgba(255, 255, 255, 0.4)",
            }}
          >
            Loaded {loadedCount} / {totalFrames} frames
          </div>
        </div>
      </div>
    </div>
  );
}
