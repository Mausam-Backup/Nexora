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
  const [currentFrameNum, setCurrentFrameNum] = useState<number>(1);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [cursorHovered, setCursorHovered] = useState<boolean>(false);

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

    // 2. Progressive background preload
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
        // Fallback to closest loaded frame
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

  // Handle modal scroll & calculate frame and animation progress
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Trackable scroll height for the 302 frames sequence (first 400vh)
    const trackHeight = window.innerHeight * 4.2;
    const scrollTop = container.scrollTop;

    const rawProgress = Math.max(0, Math.min(1, scrollTop / trackHeight));
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
        const next = current + (target - current) * 0.28;
        currentFrameRef.current = next;
        const rounded = Math.round(next);
        drawFrame(rounded);
        setCurrentFrameNum(rounded);
      }

      rafRef.current = requestAnimationFrame(renderLoop);
    };

    rafRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isOpen, drawFrame]);

  // Mouse move for magnetic cursor
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // Keyboard navigation & ESC handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        const container = scrollContainerRef.current;
        if (container) container.scrollBy({ top: 120, behavior: "smooth" });
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        const container = scrollContainerRef.current;
        if (container) container.scrollBy({ top: -120, behavior: "smooth" });
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

  // Calculate opacity & transforms for each GSAP text overlay phase
  // Phase 1: 0.0 - 0.22 (Animate 1: Shaping Brands)
  const p1 = Math.max(0, Math.min(1, scrollProgress / 0.2));
  const op1 = scrollProgress < 0.2 ? 1 - scrollProgress / 0.2 : 0;
  const y1 = scrollProgress * 100;

  // Phase 2: 0.18 - 0.42 (Animate 2: Transforming Visions)
  const op2 =
    scrollProgress >= 0.18 && scrollProgress <= 0.42
      ? scrollProgress < 0.3
        ? (scrollProgress - 0.18) / 0.12
        : 1 - (scrollProgress - 0.3) / 0.12
      : 0;

  // Phase 3: 0.38 - 0.64 (Animate 3: Elevating Aesthetics)
  const op3 =
    scrollProgress >= 0.38 && scrollProgress <= 0.64
      ? scrollProgress < 0.5
        ? (scrollProgress - 0.38) / 0.12
        : 1 - (scrollProgress - 0.5) / 0.14
      : 0;

  // Phase 4: 0.60 - 0.84 (Panel: Slide-in Drawer)
  const panelProgress =
    scrollProgress >= 0.6 && scrollProgress <= 0.84
      ? (scrollProgress - 0.6) / 0.24
      : scrollProgress > 0.84
      ? 1
      : 0;
  const panelX =
    scrollProgress < 0.6
      ? 100
      : scrollProgress <= 0.74
      ? Math.max(0, 100 - (scrollProgress - 0.6) * 700)
      : scrollProgress <= 0.84
      ? (scrollProgress - 0.74) * 1000
      : 100;
  const panelOp = scrollProgress >= 0.6 && scrollProgress <= 0.84 ? 1 : 0;

  // Phase 5: 0.80 - 1.0 (Panelism: Nexora Finale Badge)
  const op5 = scrollProgress >= 0.8 ? Math.min(1, (scrollProgress - 0.8) / 0.15) : 0;
  const lineWidth = scrollProgress >= 0.8 ? Math.min(140, (scrollProgress - 0.8) * 700) : 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="GSAP Video Graphics Interactive Fullscreen Experience"
      onMouseMove={handleMouseMove}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        backgroundColor: "#08090d",
        color: "#ffffff",
        overflow: "hidden",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        animation: "modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.99); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        .gsap-custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .gsap-custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .gsap-custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(81, 98, 255, 0.5);
          border-radius: 4px;
        }
        .work-item-row {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }
        .work-item-row:hover {
          padding-left: 24px;
          color: #5162ff;
          border-color: #5162ff !important;
        }
        .close-btn-glow {
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .close-btn-glow:hover {
          transform: scale(1.06);
          background: rgba(255, 255, 255, 0.2) !important;
          box-shadow: 0 0 25px rgba(81, 98, 255, 0.6);
        }
      `}</style>

      {/* Floating Header HUD */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "24px 36px",
          background:
            "linear-gradient(180deg, rgba(8, 9, 13, 0.85) 0%, rgba(8, 9, 13, 0) 100%)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          pointerEvents: "none",
        }}
      >
        {/* Left: Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            pointerEvents: "auto",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#00F298",
              boxShadow: "0 0 12px #00F298",
              animation: "pulseGlow 2s infinite ease-in-out",
            }}
          />
          <span
            style={{
              fontSize: "13px",
              fontWeight: 800,
              letterSpacing: "1.2px",
              textTransform: "uppercase",
            }}
          >
            GSAP Video Graphics
          </span>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "rgba(255, 255, 255, 0.6)",
              background: "rgba(255, 255, 255, 0.1)",
              padding: "4px 10px",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            302 Frames • Scroll Interactive
          </span>
        </div>

        {/* Center: Live Frame Counter */}
        <div
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "rgba(255, 255, 255, 0.9)",
            letterSpacing: "1px",
            fontVariantNumeric: "tabular-nums",
            background: "rgba(8, 9, 13, 0.6)",
            padding: "6px 16px",
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          FRAME {currentFrameNum} / {totalFrames} • {Math.round(scrollProgress * 100)}%
        </div>

        {/* Right: Close Button */}
        <button
          onClick={onClose}
          className="close-btn-glow"
          onMouseEnter={() => setCursorHovered(true)}
          onMouseLeave={() => setCursorHovered(false)}
          style={{
            pointerEvents: "auto",
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(255, 255, 255, 0.12)",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            color: "#ffffff",
            padding: "10px 22px",
            borderRadius: "24px",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <span>✕ Close</span>
          <span
            style={{
              fontSize: "10px",
              opacity: 0.7,
              background: "rgba(255, 255, 255, 0.2)",
              padding: "2px 7px",
              borderRadius: "5px",
            }}
          >
            ESC
          </span>
        </button>
      </div>

      {/* Vertical Glowing Progress Bar on Left */}
      <div
        style={{
          position: "fixed",
          left: "24px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "3px",
          height: "200px",
          background: "rgba(255, 255, 255, 0.15)",
          borderRadius: "3px",
          zIndex: 90,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: "100%",
            height: `${scrollProgress * 100}%`,
            background: "linear-gradient(180deg, #5162FF, #00F298)",
            boxShadow: "0 0 10px #5162FF",
            transition: "height 0.05s linear",
          }}
        />
      </div>

      {/* Main Scrollable Canvas & Content Track */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="gsap-custom-scrollbar"
        style={{
          position: "absolute",
          inset: 0,
          overflowY: "auto",
          overflowX: "hidden",
          scrollBehavior: "auto",
        }}
      >
        {/* Sticky 500vh Section driving the Canvas Video & Overlays */}
        <div style={{ position: "relative", height: "480vh" }}>
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

            {/* Subtle Vignette Overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at center, rgba(0,0,0,0) 40%, rgba(8,9,13,0.7) 100%)",
                pointerEvents: "none",
              }}
            />

            {/* Overlay 1: Shaping Brands (Frames 1-84 / Progress 0.0 - 0.2) */}
            <div
              style={{
                position: "absolute",
                bottom: "70px",
                left: "70px",
                width: "min(650px, 85%)",
                opacity: op1,
                transform: `translateY(-${y1}px)`,
                transition: "opacity 0.15s ease-out, transform 0.15s ease-out",
                pointerEvents: op1 > 0.1 ? "auto" : "none",
                zIndex: 10,
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  letterSpacing: "2px",
                  color: "#00F298",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                }}
              >
                © 2026 @MausamKar
              </div>
              <h1
                style={{
                  fontSize: "clamp(36px, 5.5vw, 76px)",
                  fontWeight: 800,
                  lineHeight: 1.05,
                  letterSpacing: "-2px",
                  margin: 0,
                  textTransform: "uppercase",
                  color: "#ffffff",
                  textShadow: "0 10px 40px rgba(0,0,0,0.8)",
                }}
              >
                SHAPING BRANDS →<br />CRAFTING MOTION
              </h1>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginTop: "24px",
                  fontSize: "13px",
                  color: "rgba(255, 255, 255, 0.7)",
                  letterSpacing: "1px",
                }}
              >
                <span style={{ fontSize: "16px" }}>↓</span> Scroll to play animation & explore
              </div>
            </div>

            {/* Overlay 2: Transforming Visions (Progress 0.18 - 0.42) */}
            <div
              style={{
                position: "absolute",
                bottom: "80px",
                right: "70px",
                width: "min(700px, 85%)",
                textAlign: "right",
                opacity: op2,
                transform: `translateY(${op2 > 0 ? (1 - op2) * 40 : 40}px)`,
                transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
                pointerEvents: op2 > 0.1 ? "auto" : "none",
                zIndex: 10,
              }}
            >
              <h2
                style={{
                  fontSize: "clamp(34px, 5.5vw, 72px)",
                  fontWeight: 800,
                  lineHeight: 1.05,
                  letterSpacing: "-2px",
                  margin: "0 0 16px",
                  textTransform: "uppercase",
                  color: "#ffffff",
                  textShadow: "0 10px 40px rgba(0,0,0,0.8)",
                }}
              >
                Transforming Visions
              </h2>
              <p
                style={{
                  fontSize: "clamp(15px, 1.6vw, 22px)",
                  lineHeight: 1.5,
                  color: "rgba(255, 255, 255, 0.85)",
                  margin: 0,
                  maxWidth: "520px",
                  marginLeft: "auto",
                }}
              >
                Building identity and inspiring action. Sculpting digital experiences that resonate
                across platforms and borders.
              </p>
            </div>

            {/* Overlay 3: Elevating Aesthetics (Progress 0.38 - 0.64) */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${0.92 + op3 * 0.08})`,
                width: "min(850px, 90%)",
                textAlign: "center",
                opacity: op3,
                transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
                pointerEvents: op3 > 0.1 ? "auto" : "none",
                zIndex: 10,
              }}
            >
              <h2
                style={{
                  fontSize: "clamp(36px, 6vw, 84px)",
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: "-3px",
                  margin: "0 0 18px",
                  textTransform: "uppercase",
                  color: "#ffffff",
                  textShadow: "0 15px 50px rgba(0,0,0,0.9)",
                }}
              >
                Elevating Aesthetics
              </h2>
              <p
                style={{
                  fontSize: "clamp(16px, 1.8vw, 22px)",
                  lineHeight: 1.6,
                  color: "rgba(255, 255, 255, 0.85)",
                  margin: "0 auto",
                  maxWidth: "650px",
                }}
              >
                Crafting solutions and exploring new horizons. Evolving narratives and elevating
                visual aesthetics in every motion sequence.
              </p>
            </div>

            {/* Overlay 4: Slide-in Side Drawer Panel (Progress 0.60 - 0.84) */}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "min(480px, 92vw)",
                height: "100vh",
                backgroundColor: "rgba(255, 255, 255, 0.98)",
                color: "#08090d",
                padding: "60px 48px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transform: `translateX(${panelX}%)`,
                opacity: panelOp,
                transition: "transform 0.1s linear",
                zIndex: 20,
                boxShadow: "-15px 0 60px rgba(0,0,0,0.6)",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    opacity: 0.6,
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                  }}
                >
                  © 2026 MausamKar
                </div>
                <h3
                  style={{
                    fontSize: "40px",
                    fontWeight: 800,
                    lineHeight: 1.15,
                    letterSpacing: "-1px",
                    marginTop: "32px",
                    marginBottom: "20px",
                  }}
                >
                  Sculpting Digital Realities
                </h3>
                <p
                  style={{
                    fontSize: "16px",
                    lineHeight: 1.65,
                    color: "#374151",
                  }}
                >
                  Transforming visions into digital realities. Weaving stories that captivate and
                  innovate with modern GPU-accelerated motion sequences.
                </p>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "28px",
                    padding: "14px 26px",
                    borderRadius: "8px",
                    border: "2px solid #08090d",
                    color: "#08090d",
                    fontSize: "14px",
                    fontWeight: 700,
                    background: "transparent",
                  }}
                >
                  Explore Showcase →
                </div>
              </div>

              <div>
                <div style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px" }}>
                  Innovating Design
                </div>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    marginTop: "8px",
                    lineHeight: 1.5,
                  }}
                >
                  Connecting ideas to foster creativity. Designing impactful experiences that resonate.
                </p>
              </div>
            </div>

            {/* Overlay 5: Nexora Finale Badge (Progress 0.80 - 1.0) */}
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
                  fontSize: "clamp(36px, 6.5vw, 84px)",
                  fontWeight: 900,
                  letterSpacing: "-2px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "20px",
                  color: "#ffffff",
                }}
              >
                <span>© NEXORA</span>
                <span
                  style={{
                    display: "inline-block",
                    width: `${lineWidth}px`,
                    height: "4px",
                    backgroundColor: "#5162FF",
                    boxShadow: "0 0 15px #5162FF",
                    transition: "width 0.1s linear",
                  }}
                />
                <span style={{ color: "#5162FF" }}>2026</span>
              </div>
              <div
                style={{
                  marginTop: "24px",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "rgba(255, 255, 255, 0.7)",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                }}
              >
                Continue scrolling for Recent Works & Showcase ↓
              </div>
            </div>

            {/* Bottom Floating Scrubber Pill for Quick Seek */}
            <div
              style={{
                position: "absolute",
                bottom: "28px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 30,
                display: "flex",
                alignItems: "center",
                gap: "14px",
                background: "rgba(8, 9, 13, 0.75)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                padding: "8px 20px",
                borderRadius: "30px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              }}
            >
              <span style={{ fontSize: "11px", opacity: 0.6, letterSpacing: "0.5px" }}>FRAME</span>
              <input
                type="range"
                min={1}
                max={totalFrames}
                value={currentFrameNum}
                onChange={(e) => {
                  const targetF = parseInt(e.target.value, 10);
                  const progressRatio = (targetF - 1) / (totalFrames - 1);
                  const container = scrollContainerRef.current;
                  if (container) {
                    container.scrollTop = progressRatio * (window.innerHeight * 4.2);
                  }
                }}
                style={{
                  width: "160px",
                  accentColor: "#5162FF",
                  cursor: "pointer",
                }}
              />
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#00F298",
                  minWidth: "60px",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {currentFrameNum} / {totalFrames}
              </span>
            </div>
          </div>
        </div>

        {/* Subsequent Section: Works Showcase from GSAP Video Graphics */}
        <div
          style={{
            position: "relative",
            zIndex: 40,
            background: "#ffffff",
            color: "#08090d",
            padding: "120px 80px 100px",
            boxSizing: "border-box",
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "2px",
                color: "#5162FF",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              PORTFOLIO & MOTION ARCHIVE
            </div>
            <h2
              style={{
                fontSize: "clamp(48px, 7vw, 96px)",
                fontWeight: 900,
                lineHeight: 0.95,
                letterSpacing: "-3px",
                margin: "0 0 60px",
                textTransform: "uppercase",
              }}
            >
              ® Recent Motion Works
            </h2>

            {/* Works List Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "32px 64px",
              }}
            >
              {[
                { name: "Mustela", category: "Brand Experience • 3D Motion" },
                { name: "A24 - WYFSTW", category: "Cinematic Web Experience" },
                { name: "CM | Equity", category: "Institutional DeFi Identity" },
                { name: "Citroën ë-C3", category: "Automotive Interactive 3D" },
                { name: "Perspective Fund", category: "Financial Motion System" },
                { name: "Martin Solveig", category: "Audio-Visual Spatial Web" },
                { name: "Heiwa", category: "Editorial Typography & Motion" },
                { name: "Nothing Ear", category: "Hardware Product Launch" },
              ].map((item, idx) => (
                <div
                  key={item.name}
                  className="work-item-row"
                  style={{
                    padding: "20px 0",
                    borderBottom: "1px solid #e5e7eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.5px" }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>
                      {item.category}
                    </div>
                  </div>
                  <div style={{ fontSize: "20px", opacity: 0.4 }}>→</div>
                </div>
              ))}
            </div>

            {/* Bottom Contact Banner */}
            <div
              style={{
                marginTop: "100px",
                padding: "60px 48px",
                borderRadius: "20px",
                background: "#08090d",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "24px",
              }}
            >
              <div>
                <h3 style={{ fontSize: "36px", fontWeight: 800, margin: "0 0 8px", letterSpacing: "-1px" }}>
                  Let's Talk Motion 🎙️
                </h3>
                <p style={{ margin: 0, opacity: 0.7, fontSize: "16px" }}>
                  Ready to craft an award-winning web experience together?
                </p>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "#5162FF",
                  color: "#ffffff",
                  border: "none",
                  padding: "16px 36px",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 10px 30px rgba(81, 98, 255, 0.4)",
                }}
              >
                Back to Landing Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
