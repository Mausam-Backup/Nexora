"use client";

import React, { useEffect, useRef, useState } from "react";

interface LionScrollCanvasProps {
  totalFrames?: number;
  framePathPrefix?: string;
  frameExtension?: string;
  className?: string;
}

export default function LionScrollCanvas({
  totalFrames = 302,
  framePathPrefix = "/lion_frames/frame_",
  frameExtension = ".jpg",
  className = "lion-scroll-canvas",
}: LionScrollCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentFrameRef = useRef<number>(1);
  const targetFrameRef = useRef<number>(1);
  const rafRef = useRef<number | null>(null);
  const [loadedCount, setLoadedCount] = useState<number>(0);

  // Preload frames progressively
  useEffect(() => {
    imagesRef.current = new Array(totalFrames + 1).fill(null);

    // 1. Load first frame with high priority
    const firstImg = new Image();
    firstImg.src = `${framePathPrefix}0001${frameExtension}`;
    firstImg.onload = () => {
      imagesRef.current[1] = firstImg;
      setLoadedCount((prev) => prev + 1);
      drawFrame(1);
    };

    // 2. Progressively preload remaining frames
    let loaded = 1;
    for (let i = 2; i <= totalFrames; i++) {
      const img = new Image();
      const paddedIndex = i.toString().padStart(4, "0");
      img.src = `${framePathPrefix}${paddedIndex}${frameExtension}`;
      img.onload = () => {
        imagesRef.current[i] = img;
        loaded++;
        if (loaded % 20 === 0 || loaded === totalFrames) {
          setLoadedCount(loaded);
        }
      };
      img.onerror = () => {
        // In case a frame fails, skip silently
        loaded++;
      };
    }

    return () => {
      imagesRef.current = [];
    };
  }, [totalFrames, framePathPrefix, frameExtension]);

  // Draw a specific frame onto the canvas (cover fit)
  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Find closest loaded image if requested frame isn't loaded yet
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

    // Compute aspect ratio cover
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

  // Scroll listener & smooth RAF rendering
  useEffect(() => {
    const updateTargetFrame = () => {
      // Find intro / scroll wrapper height
      const introAnim = document.getElementById("intro-anim");
      const header = document.querySelector(".header") as HTMLElement | null;
      const animArea = document.querySelector(".anim-area-100vh") as HTMLElement | null;

      const totalSectionHeight =
        (header?.offsetHeight || 0) +
        (animArea?.offsetHeight || 0) +
        (introAnim?.offsetHeight || window.innerHeight * 4);

      const maxScroll = Math.max(totalSectionHeight - window.innerHeight, 1);
      const scrollY = window.scrollY || window.pageYOffset || 0;

      // Calculate progress from 0.0 to 1.0
      const progress = Math.max(0, Math.min(1, scrollY / maxScroll));
      const target = Math.round(1 + progress * (totalFrames - 1));
      targetFrameRef.current = target;
    };

    // Render loop with lerp for ultra-smooth motion
    const renderLoop = () => {
      const current = currentFrameRef.current;
      const target = targetFrameRef.current;

      if (Math.abs(target - current) > 0.1) {
        // Smoothly interpolate towards target frame
        const next = current + (target - current) * 0.25;
        currentFrameRef.current = next;
        drawFrame(Math.round(next));
      }

      rafRef.current = requestAnimationFrame(renderLoop);
    };

    window.addEventListener("scroll", updateTargetFrame, { passive: true });
    window.addEventListener("resize", () => {
      updateTargetFrame();
      drawFrame(Math.round(currentFrameRef.current));
    });

    updateTargetFrame();
    rafRef.current = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener("scroll", updateTargetFrame);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [totalFrames]);

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        pointerEvents: "none",
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
    </div>
  );
}
