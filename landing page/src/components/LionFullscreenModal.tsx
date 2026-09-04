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
  const modalRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);

  // Virtual scroll & frame physics
  const MAX_SCROLL = 3500;
  const virtualScrollRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(1);
  const targetFrameRef = useRef<number>(1);
  const rafRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number>(0);

  // UI state for reactive overlay opacities & interactive buttons
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeFrame, setActiveFrame] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);

  const CONTACT_EMAIL = "contact@tryresponse.com";

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(CONTACT_EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // Preload frames progressively when modal opens
  useEffect(() => {
    if (!isOpen) return;

    virtualScrollRef.current = 0;
    currentFrameRef.current = 1;
    targetFrameRef.current = 1;
    setScrollProgress(0);
    setActiveFrame(1);
    setCopied(false);

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

    // 2. Progressive background preload of remaining frames
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
        drawX = 0;
        drawY = (width - drawW) / 2;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();
    },
    [totalFrames]
  );

  // Update scroll target frame
  const updateScrollProgress = useCallback(
    (delta: number) => {
      const currentScroll = virtualScrollRef.current;
      const nextScroll = Math.max(0, Math.min(MAX_SCROLL, currentScroll + delta));
      virtualScrollRef.current = nextScroll;

      const p = nextScroll / MAX_SCROLL;
      setScrollProgress(p);

      const targetFrame = Math.max(1, Math.min(totalFrames, Math.round(1 + p * (totalFrames - 1))));
      targetFrameRef.current = targetFrame;
    },
    [MAX_SCROLL, totalFrames]
  );

  // Direct Wheel & Touch Listener with non-passive capture
  useEffect(() => {
    if (!isOpen) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY * 1.5;
      updateScrollProgress(delta);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const currentY = e.touches[0].clientY;
      const deltaY = (touchStartYRef.current - currentY) * 2.5;
      touchStartYRef.current = currentY;
      updateScrollProgress(deltaY);
    };

    const modalEl = modalRef.current;
    if (modalEl) {
      modalEl.addEventListener("wheel", onWheel, { passive: false });
      modalEl.addEventListener("touchstart", onTouchStart, { passive: true });
      modalEl.addEventListener("touchmove", onTouchMove, { passive: false });
    }

    return () => {
      if (modalEl) {
        modalEl.removeEventListener("wheel", onWheel);
        modalEl.removeEventListener("touchstart", onTouchStart);
        modalEl.removeEventListener("touchmove", onTouchMove);
      }
    };
  }, [isOpen, updateScrollProgress]);

  // Keyboard navigation & ESC handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        updateScrollProgress(150);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        updateScrollProgress(-150);
      } else if (e.key === "PageDown") {
        e.preventDefault();
        updateScrollProgress(400);
      } else if (e.key === "PageUp") {
        e.preventDefault();
        updateScrollProgress(-400);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, updateScrollProgress]);

  // High-performance RAF render loop with lerp
  useEffect(() => {
    if (!isOpen) return;

    const renderLoop = () => {
      const current = currentFrameRef.current;
      const target = targetFrameRef.current;

      if (Math.abs(target - current) > 0.05) {
        const next = current + (target - current) * 0.35;
        currentFrameRef.current = next;
        const rounded = Math.round(next);
        setActiveFrame(rounded);
        drawFrame(rounded);
      }

      rafRef.current = requestAnimationFrame(renderLoop);
    };

    rafRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isOpen, drawFrame]);

  // Handle window resize
  useEffect(() => {
    if (!isOpen) return;
    const handleResize = () => drawFrame(Math.round(currentFrameRef.current));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, drawFrame]);

  if (!isOpen) return null;

  // Opacity calculations for smooth text overlay transitions across scroll progress
  // Slide 1: Intro (0.00 -> 0.22)
  const op1 = Math.max(0, Math.min(1, 1 - scrollProgress / 0.18));

  // Slide 2: Vision & Expertise (0.20 -> 0.48, peak at 0.34)
  const op2 =
    scrollProgress >= 0.18 && scrollProgress <= 0.48
      ? scrollProgress < 0.33
        ? (scrollProgress - 0.18) / 0.15
        : (0.48 - scrollProgress) / 0.15
      : 0;

  // Slide 3: Main Contact Focus (0.46 -> 0.78, peak at 0.62)
  const op3 =
    scrollProgress >= 0.46 && scrollProgress <= 0.78
      ? scrollProgress < 0.62
        ? (scrollProgress - 0.46) / 0.16
        : (0.78 - scrollProgress) / 0.16
      : 0;

  // Slide 4: Slide-in Contact Sheet / Drawer (0.76 -> 1.0)
  const op4 = scrollProgress >= 0.76 ? Math.min(1, (scrollProgress - 0.76) / 0.14) : 0;
  const panelTranslateX = scrollProgress >= 0.76 ? (1 - op4) * 100 : 100;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-label="Fullscreen Contact & Motion Experience"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        backgroundColor: "#000000",
        overflow: "hidden",
        userSelect: "none",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <style>{`
        .modal-glass-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }
        .modal-cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          border-radius: 9999px;
          background: #ffffff;
          color: #000000;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        }
        .modal-cta-primary:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 14px 35px rgba(255, 255, 255, 0.25);
          background: #f0f0f5;
        }
        .modal-cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 24px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #ffffff;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
        }
        .modal-cta-secondary:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
        }
        .close-btn-minimal {
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .close-btn-minimal:hover {
          transform: scale(1.1);
          background: rgba(255, 255, 255, 0.25) !important;
        }
        .contact-channel-row-light {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #0f172a;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .contact-channel-row-light:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
          transform: translateX(3px);
        }
        .panel-cta-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 15px 24px;
          border-radius: 9999px;
          background: #08090d;
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          box-sizing: border-box;
          transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
        }
        .panel-cta-btn:hover {
          background: #1916b0;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(25, 22, 176, 0.25);
        }
      `}</style>

      {/* Top Floating Close Button */}
      <div
        style={{
          position: "absolute",
          top: "24px",
          right: "32px",
          zIndex: 100,
        }}
      >
        <button
          onClick={onClose}
          className="close-btn-minimal"
          aria-label="Close modal"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#ffffff",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>

      {/* Fullscreen Video Canvas */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
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
        {/* Subtle cinematic vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.7) 100%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* SLIDE 1: Hero & Studio Tagline (Frames 1-70) */}
      <div
        style={{
          position: "absolute",
          bottom: "100px",
          left: "clamp(24px, 5vw, 60px)",
          maxWidth: "600px",
          color: "#ffffff",
          opacity: op1,
          transform: `translateY(${(1 - op1) * 25}px)`,
          transition: "opacity 0.15s ease-out, transform 0.15s ease-out",
          pointerEvents: op1 > 0.1 ? "auto" : "none",
          zIndex: 10,
        }}
      >
        <div className="modal-glass-pill" style={{ marginBottom: "14px" }}>
          &copy; 2025 NEXORA STUDIO
        </div>
        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-1.5px",
            margin: "0 0 14px",
            textTransform: "uppercase",
            textShadow: "0 4px 20px rgba(0,0,0,0.8)",
          }}
        >
          Shaping Brands → Crafting Motion
        </h1>
        <p
          style={{
            fontSize: "clamp(15px, 1.4vw, 18px)",
            lineHeight: 1.5,
            color: "rgba(255, 255, 255, 0.85)",
            margin: "0 0 20px",
            textShadow: "0 2px 10px rgba(0,0,0,0.8)",
          }}
        >
          Pushing the boundaries of digital architecture, high-performance web systems, and immersive visual storytelling.
        </p>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "13px",
            letterSpacing: "0.5px",
          }}
        >
          <span>↓ Scroll to explore contact details</span>
        </div>
      </div>

      {/* SLIDE 2: Vision & Capabilities (Frames 70-150) */}
      <div
        style={{
          position: "absolute",
          bottom: "100px",
          right: "clamp(24px, 5vw, 60px)",
          maxWidth: "580px",
          textAlign: "right",
          color: "#ffffff",
          opacity: op2,
          transform: `translateY(${(1 - op2) * 25}px)`,
          transition: "opacity 0.15s ease-out, transform 0.15s ease-out",
          pointerEvents: op2 > 0.1 ? "auto" : "none",
          zIndex: 10,
        }}
      >
        <div className="modal-glass-pill" style={{ marginBottom: "14px" }}>
          Capabilities & Creative Focus
        </div>
        <h2
          style={{
            fontSize: "clamp(30px, 4.5vw, 52px)",
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: "-1.2px",
            margin: "0 0 14px",
            textTransform: "uppercase",
            textShadow: "0 4px 20px rgba(0,0,0,0.8)",
          }}
        >
          Transforming Visions Into Reality
        </h2>
        <p
          style={{
            fontSize: "clamp(15px, 1.4vw, 18px)",
            lineHeight: 1.5,
            color: "rgba(255, 255, 255, 0.85)",
            margin: 0,
            textShadow: "0 2px 10px rgba(0,0,0,0.8)",
          }}
        >
          Building identity and inspiring action. Sculpting high-end digital experiences that captivate audiences and elevate brand presence.
        </p>
      </div>



      {/* SLIDE 4: Slide-in Contact & Inquiry Panel (Frames 240-302) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "min(460px, 92vw)",
          height: "100vh",
          backgroundColor: "#ffffff",
          borderLeft: "1px solid #e5e7eb",
          color: "#08090d",
          padding: "clamp(30px, 6vh, 50px) clamp(24px, 4vw, 40px)",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transform: `translateX(${panelTranslateX}%)`,
          transition: "transform 0.15s ease-out",
          pointerEvents: op4 > 0.1 ? "auto" : "none",
          zIndex: 50,
          boxShadow: "-16px 0 50px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Panel Header & Body */}
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "5px 13px",
              borderRadius: "999px",
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              color: "#065f46",
              fontSize: "12px",
              fontWeight: 600,
              marginBottom: "18px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#10b981",
                boxShadow: "0 0 6px #10b981",
              }}
            />
            Available for Select Projects
          </div>

          <h3
            style={{
              fontSize: "clamp(26px, 3.2vw, 36px)",
              fontWeight: 800,
              letterSpacing: "-1px",
              margin: "0 0 10px",
              lineHeight: 1.1,
              color: "#08090d",
            }}
          >
            Nexora Studio
          </h3>

          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.6,
              color: "#4b5563",
              margin: "0 0 24px",
            }}
          >
            We partner with visionary founders, forward-thinking brands, and ambitious engineering teams to build category-defining digital products.
          </p>

          {/* Quick Contact Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Project%20Inquiry%20-%20Nexora`}
              className="contact-channel-row-light"
            >
              <div>
                <div style={{ fontSize: "10px", color: "#6b7280", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>Email</div>
                <div style={{ fontSize: "14px", fontWeight: 600, marginTop: "2px", color: "#0f172a" }}>{CONTACT_EMAIL}</div>
              </div>
              <span style={{ fontSize: "16px", color: "#2563eb", fontWeight: 700 }}>↗</span>
            </a>

            <div
              onClick={handleCopyEmail}
              className="contact-channel-row-light"
              style={{ cursor: "pointer" }}
            >
              <div>
                <div style={{ fontSize: "10px", color: "#6b7280", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>Quick Action</div>
                <div style={{ fontSize: "14px", fontWeight: 600, marginTop: "2px", color: copied ? "#059669" : "#0f172a" }}>
                  {copied ? "Copied to Clipboard!" : "Copy Email Address"}
                </div>
              </div>
              <span style={{ fontSize: "14px", opacity: 0.85 }}>{copied ? "✓" : "📋"}</span>
            </div>

            <div className="contact-channel-row-light">
              <div>
                <div style={{ fontSize: "10px", color: "#6b7280", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>Studio Location</div>
                <div style={{ fontSize: "14px", fontWeight: 600, marginTop: "2px", color: "#0f172a" }}>Global • Remote Worldwide</div>
              </div>
              <span style={{ fontSize: "14px", opacity: 0.75 }}>🌐</span>
            </div>
          </div>

          {/* Direct CTA */}
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=New%20Project%20Inquiry`}
            className="panel-cta-btn"
          >
            <span>Start a Conversation →</span>
          </a>
        </div>

        {/* Panel Footer */}
        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>
              &copy; 2025 Nexora
            </span>
            <div style={{ display: "flex", gap: "16px", fontSize: "12px" }}>
              <a
                href="https://github.com/Mausam5055/Nexora"
                target="_blank"
                rel="noreferrer"
                style={{ color: "#374151", textDecoration: "none", fontWeight: 500 }}
              >
                GitHub
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                style={{ color: "#374151", textDecoration: "none", fontWeight: 500 }}
              >
                Inquiries
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

