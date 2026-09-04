"use client";

import React, { useEffect, useState } from "react";

export default function Preloader() {
  const [mounted, setMounted] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Start fade out after initial render
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 500);

    // Completely unmount and guarantee body scroll is enabled
    const unmountTimer = setTimeout(() => {
      setMounted(false);
      document.documentElement.classList.add("is-loaded");
      document.body.style.overflow = "visible";
    }, 1000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`preloader ${fading ? "preloader--hidden" : ""}`}
      style={{
        opacity: fading ? 0 : 1,
        visibility: fading ? "hidden" : "visible",
        pointerEvents: fading ? "none" : "auto",
        transition: "opacity 0.4s ease, visibility 0.4s ease",
      }}
    >
      <div className="preloader__wrapper">
        <div className="prelaoder__speaner w-embed">
          <svg fill="none" viewBox="0 0 250 250" width="100%" height="100%">
            <path
              stroke="#fff"
              strokeWidth="8"
              strokeLinecap="round"
              d="M125 20c57.99 0 105 47.01 105 105s-47.01 105-105 105S20 182.99 20 125C20 67.023 66.988 20.022 124.96 20"
              className="svg-elem-1"
            ></path>
          </svg>
        </div>
        <div className="preloader__logo w-embed">
          <svg fill="none" viewBox="0 0 26 19">
            <path
              fill="#cafcc4"
              d="M1 4.557A3.5 3.5 0 0 1 4.556 1a3.497 3.497 0 0 1 3.556 3.557 3.499 3.499 0 0 1-3.556 3.555A3.498 3.498 0 0 1 1 4.557Z"
            ></path>
            <path
              fill="#fff"
              stroke="#fff"
              strokeWidth=".2"
              d="M13.867 16.96v.067l.064.025c.245.096.496.212.765.337 1.05.486 2.373 1.098 4.676 1.099 1.831 0 3.353-.493 4.419-1.385 1.067-.893 1.669-2.18 1.669-3.749 0-1.624-.664-2.679-1.666-3.453-.95-.735-2.207-1.219-3.476-1.707l-.175-.067c-1.395-.526-2.3-.966-2.856-1.45a2.152 2.152 0 0 1-.585-.769 2.331 2.331 0 0 1-.174-.944c0-.814.282-1.436.783-1.856.503-.421 1.238-.65 2.162-.65 1.249 0 2.257.352 3.019 1.042.763.692 1.288 1.735 1.552 3.135l.015.082h.693V2.282l-.074-.02c-.368-.098-.719-.205-1.067-.31-1.153-.352-2.282-.695-3.932-.695-1.77 0-3.19.494-4.17 1.342-.981.85-1.512 2.05-1.512 3.442 0 1.485.613 2.451 1.516 3.154.857.665 1.976 1.094 3.066 1.512l.15.058c1.247.477 2.26.891 2.963 1.438.695.54 1.084 1.207 1.084 2.2 0 .925-.338 1.641-.928 2.128-.592.488-1.448.754-2.498.754-1.325 0-2.37-.388-3.157-1.164-.789-.78-1.328-1.96-1.618-3.564l-.014-.082h-.694v4.484Z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
}

