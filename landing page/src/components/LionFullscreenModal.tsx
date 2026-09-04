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
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentFrameRef = useRef<number>(1);
  const targetFrameRef = useRef<number>(1);
  const rafRef = useRef<number | null>(null);

  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Preload frames progressively when modal opens
  useEffect(() => {
    if (!isOpen) return;

    // Lock main page scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    imagesRef.current = new Array(totalFrames + 1).fill(null);

    // 1. Instant priority load for Frame 1
    const firstImg = new Image();
    firstImg.src = `${framePathPrefix}0001${frameExtension}`;
    firstImg.onload = () => {
      imagesRef.current[1] = firstImg;
      drawFrame(1);
    };

    // 2. Background preload of remaining frames
    for (let i = 2; i <= totalFrames; i++) {
      const img = new Image();
      const padded = i.toString().padStart(4, "0");
      img.src = `${framePathPrefix}${padded}${frameExtension}`;
      img.onload = () => {
        imagesRef.current[i] = img;
      };
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, totalFrames, framePathPrefix, frameExtension]);

  // Draw frame on canvas with aspect-ratio cover & DPR scaling
  const drawFrame = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let img = imagesRef.current[frameIndex];
      if (!img || !img.complete || img.naturalWidth === 0) {
        // Fallback to nearest loaded frame
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

  // Handle scroll to calculate progress and target frame
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const maxScroll = container.scrollHeight - container.clientHeight;
    if (maxScroll <= 0) return;

    const rawProgress = Math.max(0, Math.min(1, container.scrollTop / maxScroll));
    setScrollProgress(rawProgress);

    const targetFrame = Math.round(1 + rawProgress * (totalFrames - 1));
    targetFrameRef.current = targetFrame;
  }, [totalFrames]);

  // Smooth lerp rendering loop
  useEffect(() => {
    if (!isOpen) return;

    const renderLoop = () => {
      const current = currentFrameRef.current;
      const target = targetFrameRef.current;

      if (Math.abs(target - current) > 0.05) {
        const next = current + (target - current) * 0.3;
        currentFrameRef.current = next;
        drawFrame(Math.round(next));
      }

      rafRef.current = requestAnimationFrame(renderLoop);
    };

    rafRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isOpen, drawFrame]);

  // Keyboard navigation & ESC handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        const container = scrollContainerRef.current;
        if (container) container.scrollBy({ top: 150, behavior: "smooth" });
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        const container = scrollContainerRef.current;
        if (container) container.scrollBy({ top: -150, behavior: "smooth" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Handle resize
  useEffect(() => {
    if (!isOpen) return;
    const handleResize = () => drawFrame(Math.round(currentFrameRef.current));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, drawFrame]);

  if (!isOpen) return null;

  // Phase Calculations (Matching original GSAP Video Graphics)
  // Phase 1 (0.0 - 0.20): Shaping Brands
  const op1 = scrollProgress <= 0.18 ? 1 - scrollProgress / 0.18 : 0;
  const y1 = scrollProgress * 120;

  // Phase 2 (0.18 - 0.42): Transforming Visions
  const op2 =
    scrollProgress >= 0.18 && scrollProgress <= 0.42
      ? scrollProgress < 0.3
        ? (scrollProgress - 0.18) / 0.12
        : 1 - (scrollProgress - 0.3) / 0.12
      : 0;

  // Phase 3 (0.38 - 0.64): Elevating Aesthetics
  const op3 =
    scrollProgress >= 0.38 && scrollProgress <= 0.64
      ? scrollProgress < 0.5
        ? (scrollProgress - 0.38) / 0.12
        : 1 - (scrollProgress - 0.5) / 0.14
      : 0;

  // Phase 4 (0.60 - 0.84): Clean Slide-in Side Panel
  const panelX =
    scrollProgress < 0.6
      ? 100
      : scrollProgress <= 0.74
      ? Math.max(0, 100 - (scrollProgress - 0.6) * 700)
      : scrollProgress <= 0.84
      ? (scrollProgress - 0.74) * 1000
      : 100;
  const panelOp = scrollProgress >= 0.6 && scrollProgress <= 0.84 ? 1 : 0;

  // Phase 5 (0.80 - 1.0): Nexora / Mausam Finale Badge
  const op5 = scrollProgress >= 0.8 ? Math.min(1, (scrollProgress - 0.8) / 0.15) : 0;
  const lineWidth = scrollProgress >= 0.8 ? Math.min(120, (scrollProgress - 0.8) * 600) : 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="GSAP Video Graphics Experience"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        backgroundColor: "#000000",
        color: "#ffffff",
        overflow: "hidden",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        animation: "modalFadeIn 0.25s ease-out",
      }}
    >
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .clean-modal-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .clean-modal-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .close-btn-minimal {
          transition: transform 0.2s ease, background 0.2s ease, opacity 0.2s ease;
        }
        .close-btn-minimal:hover {
          transform: scale(1.1);
          background: rgba(255, 255, 255, 0.25) !important;
        }
      `}</style>

      {/* Ultra-Clean Floating Close Button Only */}
      <button
        onClick={onClose}
        className="close-btn-minimal"
        aria-label="Close"
        style={{
          position: "fixed",
          top: "28px",
          right: "32px",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          color: "#ffffff",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        ✕
      </button>

      {/* Main Scrollable Viewport Track */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="clean-modal-scrollbar"
        style={{
          position: "absolute",
          inset: 0,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <div style={{ position: "relative", height: "450vh" }}>
          {/* Sticky Canvas & Text Viewport */}
          <div
            style={{
              position: "sticky",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              overflow: "hidden",
            }}
          >
            {/* Fullscreen Video Canvas */}
            <canvas
              ref={canvasRef}
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                objectFit: "cover",
              }}
            />

            {/* 1. Animate 1: Shaping Brands (Bottom-Left) */}
            <div
              style={{
                position: "absolute",
                bottom: "50px",
                left: "50px",
                width: "min(650px, 85%)",
                opacity: op1,
                transform: `translateY(-${y1}px)`,
                transition: "opacity 0.15s ease-out, transform 0.15s ease-out",
                pointerEvents: op1 > 0.1 ? "auto" : "none",
                zIndex: 10,
              }}
            >
              <h2
                style={{
                  fontSize: "clamp(20px, 2.2vw, 30px)",
                  fontWeight: 200,
                  margin: "0 0 10px",
                  opacity: 0.9,
                  letterSpacing: "0.5px",
                }}
              >
                © 2026 @MausamKar
              </h2>
              <h1
                style={{
                  fontSize: "clamp(32px, 4.2vw, 64px)",
                  fontWeight: 800,
                  lineHeight: 1.05,
                  letterSpacing: "-1.5px",
                  margin: 0,
                  textTransform: "uppercase",
                  color: "#ffffff",
                }}
              >
                SHAPING BRANDS →<br />CRAFTING MOTION
              </h1>
            </div>

            {/* 2. Animate 2: Transforming Visions (Bottom-Right) */}
            <div
              style={{
                position: "absolute",
                bottom: "60px",
                right: "50px",
                width: "min(650px, 85%)",
                textAlign: "right",
                opacity: op2,
                transform: `translateY(${op2 > 0 ? (1 - op2) * 30 : 30}px)`,
                transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
                pointerEvents: op2 > 0.1 ? "auto" : "none",
                zIndex: 10,
              }}
            >
              <h2
                style={{
                  fontSize: "clamp(32px, 4.5vw, 68px)",
                  fontWeight: 800,
                  lineHeight: 1.05,
                  letterSpacing: "-1.5px",
                  margin: "0 0 14px",
                  textTransform: "uppercase",
                  color: "#ffffff",
                }}
              >
                Transforming Visions
              </h2>
              <p
                style={{
                  fontSize: "clamp(14px, 1.4vw, 18px)",
                  lineHeight: 1.5,
                  color: "rgba(255, 255, 255, 0.85)",
                  margin: 0,
                  maxWidth: "480px",
                  marginLeft: "auto",
                }}
              >
                Building Identity and Inspiring action. Sculpting digital experiences that resonate.
              </p>
            </div>

            {/* 3. Animate 3: Elevating Aesthetics (Center) */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${0.94 + op3 * 0.06})`,
                width: "min(750px, 90%)",
                textAlign: "center",
                opacity: op3,
                transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
                pointerEvents: op3 > 0.1 ? "auto" : "none",
                zIndex: 10,
              }}
            >
              <h2
                style={{
                  fontSize: "clamp(34px, 5vw, 76px)",
                  fontWeight: 800,
                  lineHeight: 1.05,
                  letterSpacing: "-2px",
                  margin: "0 0 16px",
                  textTransform: "uppercase",
                  color: "#ffffff",
                }}
              >
                Elevating Aesthetics
              </h2>
              <p
                style={{
                  fontSize: "clamp(15px, 1.6vw, 20px)",
                  lineHeight: 1.6,
                  color: "rgba(255, 255, 255, 0.85)",
                  margin: "0 auto",
                  maxWidth: "580px",
                }}
              >
                Crafting solutions and exploring new horizons. Evolving narratives and elevating aesthetics in every project.
              </p>
            </div>

            {/* 4. Animate 4: Slide-in Side Panel */}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "min(440px, 90vw)",
                height: "100vh",
                backgroundColor: "#ffffff",
                color: "#08090d",
                padding: "60px 45px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transform: `translateX(${panelX}%)`,
                opacity: panelOp,
                transition: "transform 0.1s linear",
                zIndex: 20,
                boxShadow: "-15px 0 50px rgba(0,0,0,0.5)",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    opacity: 0.6,
                    letterSpacing: "1px",
                  }}
                >
                  © 2026 MausamKar
                </div>
                <h3
                  style={{
                    fontSize: "36px",
                    fontWeight: 700,
                    lineHeight: 1.15,
                    letterSpacing: "-0.5px",
                    marginTop: "30px",
                    marginBottom: "18px",
                  }}
                >
                  Sculpting Digital
                </h3>
                <p
                  style={{
                    fontSize: "15px",
                    lineHeight: 1.6,
                    color: "#444a56",
                  }}
                >
                  Transforming visions into digital realities. Weaving stories that captivate and innovate. Exploring new possibilities with a focus on narrative evolution. Crafting solutions that engage and elevate.
                </p>
                <button
                  type="button"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "24px",
                    padding: "12px 22px",
                    border: "1px solid #555555",
                    background: "transparent",
                    color: "#08090d",
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Get Reviews →
                </button>
              </div>

              <div>
                <div style={{ fontSize: "18px", fontWeight: 700 }}>
                  Innovating Design
                </div>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#6b7280",
                    marginTop: "8px",
                    lineHeight: 1.5,
                  }}
                >
                  Connecting ideas to foster creativity. Designing Impactful experiences that resonate. Feel free to mix and match these sections to suit your website design needs!
                </p>
                <button
                  type="button"
                  style={{
                    background: "#08090d",
                    color: "#ffffff",
                    padding: "12px 24px",
                    fontSize: "13px",
                    fontWeight: 500,
                    border: "none",
                    marginTop: "16px",
                    cursor: "pointer",
                    textTransform: "capitalize",
                  }}
                >
                  Experience
                </button>
              </div>
            </div>

            {/* 5. Animate 5: Finale Badge (Center) */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                opacity: op5,
                transition: "opacity 0.2s ease-out",
                pointerEvents: op5 > 0.5 ? "auto" : "none",
                zIndex: 10,
              }}
            >
              <div
                style={{
                  fontSize: "clamp(34px, 5.5vw, 72px)",
                  fontWeight: 800,
                  letterSpacing: "-2px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "18px",
                  color: "#ffffff",
                }}
              >
                <span>© Mausam</span>
                <span
                  style={{
                    display: "inline-block",
                    width: `${lineWidth}px`,
                    height: "3px",
                    backgroundColor: "#ffffff",
                    transition: "width 0.1s linear",
                  }}
                />
                <span>2048</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
