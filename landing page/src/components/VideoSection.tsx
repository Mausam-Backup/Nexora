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
    <section
      id="investors"
      className="video-fullscreen-section"
      style={{
        position: "relative",
        width: "100%",
        padding: "40px 2vw",
        boxSizing: "border-box",
        zIndex: 2,
      }}
    >
      {/* Increased Height & Rounded Corners Container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "120vh",
          minHeight: "120vh",
          borderRadius: "44px",
          overflow: "hidden",
          backgroundColor: "#000",
          boxShadow: "0 30px 70px -15px rgba(0, 0, 0, 0.8)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Local Video Player (VIT Video) */}
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
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        )}

        {/* YouTube Embed Player (16:9 Full Cover) */}
        {source === "youtube" && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "100%",
              height: "56.25vw",
              minHeight: "120vh",
              minWidth: "213.33vh",
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

        {/* Top & Bottom Soft Gradient Vignettes */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "140px",
            background: "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, transparent 100%)",
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
            height: "140px",
            background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)",
            pointerEvents: "none",
            zIndex: 3,
          }}
        />

        {/* Minimal Unmute/Mute Floating Button (No Text Overlay) */}
        <button
          onClick={toggleMute}
          type="button"
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          style={{
            position: "absolute",
            bottom: "28px",
            right: "28px",
            width: "48px",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
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
            e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
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
    </section>
  );
}
