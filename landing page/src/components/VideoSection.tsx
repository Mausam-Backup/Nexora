"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface VideoSectionProps {
  localVideoSrc?: string;
  youtubeId?: string;
}

export default function VideoSection({
  localVideoSrc = "/videos/vit-video.mp4",
  youtubeId = "cFEyuG6Q3og",
}: VideoSectionProps) {
  const [source, setSource] = useState<"local" | "youtube">("local");
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const headlineTopRef = useRef<HTMLDivElement>(null);
  const headlineBottomRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Toggle Mute
  const toggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (source === "local" && videoRef.current) {
      videoRef.current.muted = nextMuted;
    } else if (source === "youtube" && iframeRef.current?.contentWindow) {
      const command = nextMuted ? "mute" : "unMute";
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: command, args: [] }),
        "*"
      );
    }
  };

  // GSAP ScrollTrigger Setup
  useEffect(() => {
    if (typeof window === "undefined" || !triggerRef.current || !cardRef.current) return;

    const ctx = gsap.context(() => {
      // Timeline for smooth pinned expansion
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "+=140%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1. Headlines glide apart & fade
      if (headlineTopRef.current) {
        tl.to(
          headlineTopRef.current,
          {
            y: -60,
            opacity: 0,
            scale: 0.95,
            ease: "power2.inOut",
          },
          0
        );
      }

      if (headlineBottomRef.current) {
        tl.to(
          headlineBottomRef.current,
          {
            y: 50,
            opacity: 0,
            ease: "power2.inOut",
          },
          0
        );
      }

      // 2. The Video Card expands to full viewport width & height
      tl.to(
        cardRef.current,
        {
          width: "100vw",
          height: "100vh",
          borderRadius: "0px",
          borderWidth: "0px",
          boxShadow: "none",
          ease: "power2.inOut",
        },
        0
      );

      // Subtle parallax on the video itself during expansion
      if (videoRef.current) {
        tl.fromTo(
          videoRef.current,
          { scale: 1.12 },
          { scale: 1.0, ease: "power2.inOut" },
          0
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      id="investors"
      style={{
        position: "relative",
        width: "100%",
        backgroundColor: "#000",
        color: "#fff",
        zIndex: 10,
      }}
    >
      {/* Pinned Scroll Container */}
      <div
        ref={triggerRef}
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          backgroundColor: "#030303",
        }}
      >
        {/* Ambient Subtle Grid Background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 0)",
            backgroundSize: "32px 32px",
            opacity: 0.35,
            pointerEvents: "none",
          }}
        />

        {/* Top Headline Section (Kinetic Typography) */}
        <div
          ref={headlineTopRef}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            marginBottom: "24px",
            zIndex: 5,
            pointerEvents: "none",
            willChange: "transform, opacity",
          }}
        >
          {/* Category Tag with Custom SVG Icon */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              borderRadius: "9999px",
              backgroundColor: "rgba(202, 252, 196, 0.08)",
              border: "1px solid rgba(202, 252, 196, 0.25)",
              marginBottom: "14px",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="4" fill="#cafcc4" />
              <path
                d="M12 2v3M12 19v3M2 12h3M19 12h3"
                stroke="#cafcc4"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span
              style={{
                fontFamily: "Suisseintl, sans-serif",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#cafcc4",
              }}
            >
              Cinematic Drone Experience
            </span>
          </div>

          {/* Main Display Title */}
          <h2
            style={{
              fontFamily: "Suisseintl, sans-serif",
              fontSize: "clamp(2rem, 4.5vw, 4.2rem)",
              fontWeight: 300,
              letterSpacing: "-0.03em",
              margin: 0,
              lineHeight: 1.1,
              color: "#fff",
              textTransform: "uppercase",
            }}
          >
            Explore <span style={{ fontWeight: 800, color: "#cafcc4" }}>VIT Bhopal</span>
          </h2>
        </div>

        {/* Expandable Video Card */}
        <div
          ref={cardRef}
          style={{
            position: "relative",
            width: "56vw",
            height: "54vh",
            borderRadius: "44px",
            overflow: "hidden",
            backgroundColor: "#000",
            boxShadow:
              "0 40px 100px -20px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            willChange: "width, height, border-radius",
            zIndex: 6,
          }}
        >
          {/* Custom SVG Viewfinder Corner Brackets */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              zIndex: 4,
              pointerEvents: "none",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M0 24V0H24"
                stroke="#cafcc4"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              zIndex: 4,
              pointerEvents: "none",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M0 0H24V24"
                stroke="#cafcc4"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "20px",
              zIndex: 4,
              pointerEvents: "none",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M0 0V24H24"
                stroke="#cafcc4"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              right: "20px",
              zIndex: 4,
              pointerEvents: "none",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M0 24H24V0"
                stroke="#cafcc4"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Top Telemetry Bar inside Video Frame */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "54px",
              right: "54px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              zIndex: 4,
              pointerEvents: "none",
            }}
          >
            {/* Live REC Indicator with pulsing SVG dot */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#ff3b30",
                  boxShadow: "0 0 10px #ff3b30",
                }}
              />
              <span
                style={{
                  fontFamily: "Suisseintl, monospace",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  color: "#fff",
                }}
              >
                REC // 4K 60FPS
              </span>
            </div>

            {/* Coordinates / Telemetry */}
            <span
              style={{
                fontFamily: "Suisseintl, monospace",
                fontSize: "10px",
                letterSpacing: "0.15em",
                color: "rgba(255, 255, 255, 0.65)",
              }}
            >
              23°04′48″N 76°51′32″E
            </span>
          </div>

          {/* Bottom Custom SVG Focal Tick Marks */}
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "54px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              zIndex: 4,
              pointerEvents: "none",
              opacity: 0.6,
            }}
          >
            <svg width="120" height="12" viewBox="0 0 120 12" fill="none">
              <line x1="0" y1="6" x2="120" y2="6" stroke="#fff" strokeWidth="1" strokeDasharray="2 4" />
              <line x1="20" y1="2" x2="20" y2="10" stroke="#cafcc4" strokeWidth="1.5" />
              <line x1="60" y1="0" x2="60" y2="12" stroke="#cafcc4" strokeWidth="2" />
              <line x1="100" y1="2" x2="100" y2="10" stroke="#cafcc4" strokeWidth="1.5" />
            </svg>
            <span
              style={{
                fontFamily: "Suisseintl, monospace",
                fontSize: "9px",
                color: "#cafcc4",
                letterSpacing: "0.1em",
              }}
            >
              AF [TRACKING]
            </span>
          </div>

          {/* Local HTML5 Video (VIT Video) */}
          {source === "local" && (
            <video
              ref={videoRef}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              src={localVideoSrc}
              onError={() => setSource("youtube")}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          )}

          {/* YouTube Embed Player Fallback */}
          {source === "youtube" && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "100%",
                height: "56.25vw",
                minHeight: "100vh",
                minWidth: "177.78vh",
                transform: "translate(-50%, -50%)",
              }}
            >
              <iframe
                ref={iframeRef}
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&playsinline=1&enablejsapi=1`}
                title="Video Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  display: "block",
                }}
              />
            </div>
          )}

          {/* Soft Cinematic Vignettes for Depth */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "140px",
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "140px",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />

          {/* Modern Interactive Sound Toggle with Equalizer */}
          <button
            onClick={toggleMute}
            type="button"
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            style={{
              position: "absolute",
              bottom: "24px",
              right: "24px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 18px",
              backgroundColor: "rgba(10, 10, 10, 0.65)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "9999px",
              color: "#fff",
              cursor: "pointer",
              transition: "all 0.25s ease",
              zIndex: 10,
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(202, 252, 196, 0.15)";
              e.currentTarget.style.borderColor = "rgba(202, 252, 196, 0.5)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(10, 10, 10, 0.65)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {/* Custom SVG Sound Bars */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "3px",
                height: "16px",
              }}
            >
              <div
                style={{
                  width: "3px",
                  height: isMuted ? "4px" : "14px",
                  backgroundColor: isMuted ? "#888" : "#cafcc4",
                  borderRadius: "1px",
                  transition: "height 0.2s ease",
                }}
              />
              <div
                style={{
                  width: "3px",
                  height: isMuted ? "4px" : "10px",
                  backgroundColor: isMuted ? "#888" : "#cafcc4",
                  borderRadius: "1px",
                  transition: "height 0.2s ease",
                }}
              />
              <div
                style={{
                  width: "3px",
                  height: isMuted ? "4px" : "16px",
                  backgroundColor: isMuted ? "#888" : "#cafcc4",
                  borderRadius: "1px",
                  transition: "height 0.2s ease",
                }}
              />
              <div
                style={{
                  width: "3px",
                  height: isMuted ? "4px" : "8px",
                  backgroundColor: isMuted ? "#888" : "#cafcc4",
                  borderRadius: "1px",
                  transition: "height 0.2s ease",
                }}
              />
            </div>

            <span
              style={{
                fontFamily: "Suisseintl, sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: isMuted ? "rgba(255, 255, 255, 0.8)" : "#cafcc4",
              }}
            >
              {isMuted ? "AUDIO OFF" : "AUDIO ON"}
            </span>
          </button>
        </div>

        {/* Bottom Scroll Prompt (Fades Out as Video Expands) */}
        <div
          ref={headlineBottomRef}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginTop: "24px",
            zIndex: 5,
            pointerEvents: "none",
            willChange: "transform, opacity",
          }}
        >
          {/* Animated Scroll Indicator SVG */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#cafcc4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-bounce"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
          <span
            style={{
              fontFamily: "Suisseintl, sans-serif",
              fontSize: "12px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.6)",
              fontWeight: 500,
            }}
          >
            Scroll to Expand Viewport
          </span>
        </div>
      </div>
    </div>
  );
}
