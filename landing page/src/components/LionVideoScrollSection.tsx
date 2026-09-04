"use client";

import React, { useEffect, useRef, useState } from "react";

export default function LionVideoScrollSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentFrameRef = useRef<number>(1);
  const targetFrameRef = useRef<number>(1);
  const rafRef = useRef<number | null>(null);

  const [progress, setProgress] = useState<number>(0);
  const [isFirstLoaded, setIsFirstLoaded] = useState<boolean>(false);

  const totalFrames = 302;
  const framePathPrefix = "/lion_frames/frame_";
  const frameExtension = ".jpg";

  // Preload frames progressively
  useEffect(() => {
    imagesRef.current = new Array(totalFrames + 1).fill(null);

    // 1. Instant first frame
    const firstImg = new Image();
    firstImg.src = `${framePathPrefix}0001${frameExtension}`;
    firstImg.onload = () => {
      imagesRef.current[1] = firstImg;
      setIsFirstLoaded(true);
      drawFrame(1);
    };

    // 2. Preload remainder
    for (let i = 2; i <= totalFrames; i++) {
      const img = new Image();
      const paddedIndex = i.toString().padStart(4, "0");
      img.src = `${framePathPrefix}${paddedIndex}${frameExtension}`;
      img.onload = () => {
        imagesRef.current[i] = img;
      };
    }

    return () => {
      imagesRef.current = [];
    };
  }, []);

  // Draw frame with aspect-ratio cover
  const drawFrame = (frameIndex: number) => {
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
      drawY = 0;
      drawX = (width - drawW) / 2;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();
  };

  // Track scroll position within this specific section
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalScroll = rect.height - window.innerHeight;
      if (totalScroll <= 0) return;

      const currentScroll = -rect.top;
      const rawProgress = Math.max(0, Math.min(1, currentScroll / totalScroll));

      setProgress(rawProgress);

      const target = Math.min(
        totalFrames,
        Math.max(1, Math.round(1 + rawProgress * (totalFrames - 1)))
      );
      targetFrameRef.current = target;
    };

    // Render loop with lerp for ultra-smooth 60fps scrubbing
    const renderLoop = () => {
      const current = currentFrameRef.current;
      const target = targetFrameRef.current;

      if (Math.abs(target - current) > 0.05) {
        const next = current + (target - current) * 0.22;
        currentFrameRef.current = next;
        drawFrame(Math.round(next));
      }

      rafRef.current = requestAnimationFrame(renderLoop);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", () => {
      handleScroll();
      drawFrame(Math.round(currentFrameRef.current));
    });

    handleScroll();
    rafRef.current = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Helper opacities for text overlays based on scroll progress
  // Slide 1: 0.00 -> 0.18
  const op1 = Math.max(0, Math.min(1, (0.18 - progress) / 0.08));
  // Slide 2: 0.22 -> 0.45
  const op2 =
    progress < 0.22
      ? 0
      : progress < 0.32
      ? (progress - 0.22) / 0.1
      : progress < 0.42
      ? 1
      : Math.max(0, (0.48 - progress) / 0.06);
  // Slide 3: 0.48 -> 0.70
  const op3 =
    progress < 0.48
      ? 0
      : progress < 0.56
      ? (progress - 0.48) / 0.08
      : progress < 0.64
      ? 1
      : Math.max(0, (0.72 - progress) / 0.08);
  // Slide 4: 0.70 -> 0.88 (Side Panel)
  const panelProgress = Math.max(0, Math.min(1, (progress - 0.68) / 0.1));
  const panelX = (1 - panelProgress) * 100; // 100% to 0%
  const panelOp =
    progress < 0.68
      ? 0
      : progress < 0.82
      ? 1
      : Math.max(0, (0.89 - progress) / 0.07);
  // Slide 5: 0.88 -> 1.00 (Finale)
  const op5 =
    progress < 0.86 ? 0 : Math.min(1, (progress - 0.86) / 0.08);

  return (
    <section
      ref={containerRef}
      id="lion-video-scroll"
      style={{
        position: "relative",
        height: "420vh",
        backgroundColor: "#08090d",
        zIndex: 25,
      }}
    >
      {/* Sticky Fullscreen Frame */}
      <div
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          backgroundColor: "#08090d",
        }}
      >
        {/* The Frame Animation Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            objectFit: "cover",
          }}
        />

        {/* Subtle Dark Vignette for Premium Readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at center, rgba(0,0,0,0.1) 0%, rgba(8,9,13,0.7) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* 1. Slide 1 Overlay: Intro Branding */}
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            left: "5%",
            width: "min(600px, 90%)",
            opacity: op1,
            transform: `translateY(${(1 - op1) * 20}px)`,
            transition: "opacity 0.15s ease-out, transform 0.15s ease-out",
            pointerEvents: op1 > 0.1 ? "auto" : "none",
            zIndex: 3,
            color: "#ffffff",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: 300,
              letterSpacing: "2px",
              textTransform: "uppercase",
              opacity: 0.7,
              marginBottom: "8px",
            }}
          >
            ©2026 @MausamKar
          </div>
          <h2
            style={{
              fontSize: "clamp(24px, 3.8vw, 46px)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.5px",
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            SHAPING BRANDS <span style={{ color: "#7CB1FF" }}>→</span> CRAFTING MOTION
          </h2>
          <div
            style={{
              marginTop: "20px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              padding: "6px 14px",
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(6px)",
            }}
          >
            <span>Scroll Down to Scrub Video</span>
            <span style={{ fontSize: "14px" }}>↓</span>
          </div>
        </div>

        {/* 2. Slide 2 Overlay: Transforming Visions */}
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            right: "5%",
            width: "min(650px, 90%)",
            textAlign: "right",
            opacity: op2,
            transform: `translateY(${(1 - op2) * 20}px)`,
            transition: "opacity 0.15s ease-out, transform 0.15s ease-out",
            pointerEvents: op2 > 0.1 ? "auto" : "none",
            zIndex: 3,
            color: "#ffffff",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(28px, 4.5vw, 60px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-1px",
              margin: "0 0 16px",
              textTransform: "uppercase",
            }}
          >
            Transforming Visions
          </h2>
          <p
            style={{
              fontSize: "clamp(14px, 1.4vw, 18px)",
              lineHeight: 1.5,
              opacity: 0.85,
              margin: 0,
              maxWidth: "500px",
              marginLeft: "auto",
            }}
          >
            Building identity and inspiring action. Sculpting digital experiences
            that resonate across platforms and borders.
          </p>
        </div>

        {/* 3. Slide 3 Overlay: Elevating Aesthetics */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${0.95 + op3 * 0.05})`,
            width: "min(800px, 90%)",
            textAlign: "center",
            opacity: op3,
            transition: "opacity 0.15s ease-out, transform 0.15s ease-out",
            pointerEvents: op3 > 0.1 ? "auto" : "none",
            zIndex: 3,
            color: "#ffffff",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(32px, 5.5vw, 72px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-1.5px",
              margin: "0 0 16px",
              textTransform: "uppercase",
            }}
          >
            Elevating Aesthetics
          </h2>
          <p
            style={{
              fontSize: "clamp(15px, 1.6vw, 20px)",
              lineHeight: 1.6,
              opacity: 0.85,
              margin: "0 auto",
              maxWidth: "600px",
            }}
          >
            Crafting solutions and exploring new horizons. Evolving narratives
            and elevating visual aesthetics in every motion sequence.
          </p>
        </div>

        {/* 4. Slide 4: Slide-in Side Panel */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "min(460px, 90vw)",
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
            transition: "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s ease-out",
            pointerEvents: panelOp > 0.5 ? "auto" : "none",
            zIndex: 4,
            boxShadow: "-10px 0 40px rgba(0,0,0,0.5)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "13px",
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
                marginBottom: "20px",
              }}
            >
              Sculpting Digital
            </h3>
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.6,
                color: "#444a56",
              }}
            >
              Transforming visions into digital realities. Weaving stories that
              captivate and innovate with modern GPU-accelerated motion.
            </p>
            <a
              href="#intro"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "24px",
                padding: "12px 22px",
                borderRadius: "8px",
                border: "1px solid #08090d",
                color: "#08090d",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Enter Main Platform →
            </a>
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
              Connecting ideas to foster creativity. Designing impactful
              experiences that resonate.
            </p>
          </div>
        </div>

        {/* 5. Slide 5 Overlay: Finale & Transition prompt */}
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
            zIndex: 3,
            color: "#ffffff",
          }}
        >
          <div
            style={{
              fontSize: "clamp(30px, 5vw, 68px)",
              fontWeight: 800,
              letterSpacing: "-1.5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
            }}
          >
            <span>© Nexora</span>
            <span
              style={{
                display: "inline-block",
                width: "60px",
                height: "3px",
                backgroundColor: "#7CB1FF",
              }}
            />
            <span style={{ color: "#7CB1FF" }}>2026</span>
          </div>
          <div
            style={{
              marginTop: "24px",
              fontSize: "14px",
              opacity: 0.7,
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            Continue scrolling to enter Secured Finance
          </div>
        </div>

        {/* Scroll Progress Bar at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "3px",
            background: "rgba(255,255,255,0.1)",
            zIndex: 10,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress * 100}%`,
              background: "linear-gradient(90deg, #5162FF, #7CB1FF)",
              transition: "width 0.1s linear",
            }}
          />
        </div>
      </div>
    </section>
  );
}
