"use client";

import { useState, useRef, useEffect } from "react";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const toggleMute = () => {
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

  return (
    <div
      id="investors"
      className="video-reveal-wrapper"
      style={{
        position: "relative",
        width: "100%",
        height: "230vh", // Provides scroll space for the GSAP scrub reveal
        backgroundColor: "#000",
        zIndex: 2,
      }}
    >
      {/* Sticky Fullscreen Frame pinned during scroll */}
      <div
        className="video-reveal-sticky"
        style={{
          position: "sticky",
          top: 0,
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          backgroundColor: "#000",
        }}
      >
        {/* Expanding Video Card Container (GSAP animates width, height, borderRadius) */}
        <div
          className="video-reveal-card"
          style={{
            position: "relative",
            width: "56vw",
            height: "52vh",
            borderRadius: "44px",
            overflow: "hidden",
            backgroundColor: "#050505",
            boxShadow: "0 35px 80px -15px rgba(0, 0, 0, 0.95)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            willChange: "width, height, border-radius",
            transition: "none",
          }}
        >
          {/* Local HTML5 Video */}
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
                width: "100vw",
                height: "56.25vw", // 16:9
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

          {/* Soft ambient vignette overlays */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "120px",
              background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)",
              pointerEvents: "none",
              zIndex: 3,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "120px",
              background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)",
              pointerEvents: "none",
              zIndex: 3,
            }}
          />

          {/* Floating Unmute/Mute Toggle */}
          <button
            onClick={toggleMute}
            type="button"
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            style={{
              position: "absolute",
              bottom: "28px",
              right: "28px",
              width: "46px",
              height: "46px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.55)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              borderRadius: "50%",
              color: "#fff",
              cursor: "pointer",
              transition: "all 0.25s ease",
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.25)";
              e.currentTarget.style.transform = "scale(1.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.55)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {isMuted ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
