"use client";

import React, { useEffect } from "react";
import { ExternalLink, X } from "lucide-react";

interface VrFullscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialScene?: string;
}

export default function VrFullscreenModal({
  isOpen,
  onClose,
  initialScene = "0-main",
}: VrFullscreenModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="3D VR University Tour"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        backgroundColor: "#000000",
        overflow: "hidden",
      }}
    >
      {/* Top Header Floating Controls */}
      <div
        style={{
          position: "absolute",
          top: "18px",
          left: "24px",
          right: "24px",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 20px",
            borderRadius: "9999px",
            background: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            color: "#111827",
            fontFamily: '"Times New Roman", Times, Georgia, serif',
            fontSize: "14px",
            fontWeight: 600,
            letterSpacing: "0.2px",
            pointerEvents: "auto",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)",
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              backgroundColor: "#0f172a",
              display: "inline-block",
            }}
          />
          <span>VIT Bhopal — 360° Virtual Tour</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", pointerEvents: "auto" }}>
          <a
            href={`/explore?scene=${initialScene}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in new tab"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 18px",
              borderRadius: "9999px",
              background: "rgba(255, 255, 255, 0.92)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              color: "#111827",
              fontFamily: '"Times New Roman", Times, Georgia, serif',
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#ffffff";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.92)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <ExternalLink size={14} color="#111827" />
            <span>Full Page</span>
          </a>

          <button
            onClick={onClose}
            aria-label="Close 3D VR Tour"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.92)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              color: "#111827",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#ffffff";
              e.currentTarget.style.transform = "scale(1.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.92)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <X size={18} color="#111827" />
          </button>
        </div>
      </div>

      {/* Sandboxed Iframe for 100% WebGL Context Isolation */}
      <iframe
        src={`/explore?scene=${initialScene}&embed=true`}
        title="3D VR University Tour"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        }}
        allow="accelerometer; gyroscope; magnetometer; xr-spatial-tracking; fullscreen"
      />
    </div>
  );
}
