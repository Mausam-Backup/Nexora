"use client";

import React, { useState } from "react";
import LionFullscreenModal from "./LionFullscreenModal";
import VrFullscreenModal from "./VrFullscreenModal";

export default function Navbar() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isVrModalOpen, setIsVrModalOpen] = useState(false);

  return (
  <div className="fixed-items">
    <div className="container-menu__light">
      <div className="link-logo">
        <a href="#" className="link-logo__is1 w-inline-block">
          <div className="link-logo__image w-embed">
            <svg fill="none" viewBox="0 0 26 19">
              <path fill="var(--logo-dot-color)" d="M1 4.557A3.5 3.5 0 0 1 4.556 1a3.497 3.497 0 0 1 3.556 3.557 3.499 3.499 0 0 1-3.556 3.555A3.498 3.498 0 0 1 1 4.557Z">
              </path>
              <path fill="var(--logo-color)" stroke="var(--logo-color)" strokeWidth=".2" d="M13.867 16.96v.067l.064.025c.245.096.496.212.765.337 1.05.486 2.373 1.098 4.676 1.099 1.831 0 3.353-.493 4.419-1.385 1.067-.893 1.669-2.18 1.669-3.749 0-1.624-.664-2.679-1.666-3.453-.95-.735-2.207-1.219-3.476-1.707l-.175-.067c-1.395-.526-2.3-.966-2.856-1.45a2.152 2.152 0 0 1-.585-.769 2.331 2.331 0 0 1-.174-.944c0-.814.282-1.436.783-1.856.503-.421 1.238-.65 2.162-.65 1.249 0 2.257.352 3.019 1.042.763.692 1.288 1.735 1.552 3.135l.015.082h.693V2.282l-.074-.02c-.368-.098-.719-.205-1.067-.31-1.153-.352-2.282-.695-3.932-.695-1.77 0-3.19.494-4.17 1.342-.981.85-1.512 2.05-1.512 3.442 0 1.485.613 2.451 1.516 3.154.857.665 1.976 1.094 3.066 1.512l.15.058c1.247.477 2.26.891 2.963 1.438.695.54 1.084 1.207 1.084 2.2 0 .925-.338 1.641-.928 2.128-.592.488-1.448.754-2.498.754-1.325 0-2.37-.388-3.157-1.164-.789-.78-1.328-1.96-1.618-3.564l-.014-.082h-.694v4.484Z">
              </path>
            </svg>
          </div>
        </a>
      </div>
      <div className="menu-items">
        <a href="#intro" className="menu-item nav-1 w-inline-block" suppressHydrationWarning>
          <div className="menu-text">Intro</div>
        </a>
        <a href="#platform" className="menu-item nav-2 w-inline-block" suppressHydrationWarning>
          <div className="menu-text">Platform</div>
        </a>
        <a href="#about" className="menu-item nav-3 w-inline-block" suppressHydrationWarning>
          <div className="menu-text">About</div>
        </a>
        <a
          href="#tour"
          role="button"
          onClick={(e) => {
            e.preventDefault();
            setIsVrModalOpen(true);
          }}
          className="menu-item nav-vr w-inline-block"
          suppressHydrationWarning
          style={{ cursor: "pointer" }}
        >
          <div className="menu-text">3D Tour</div>
        </a>
        <a href="#investors" className="menu-item nav-4 w-inline-block" suppressHydrationWarning>
          <div className="menu-text">Investors</div>
        </a>
        <a href="#news" className="menu-item nav-5 w-inline-block" suppressHydrationWarning>
          <div className="menu-text">News</div>
        </a>
        <a
          href="#contact"
          role="button"
          onClick={(e) => {
            e.preventDefault();
            setIsVideoModalOpen(true);
          }}
          className="menu-button to-footer w-inline-block"
          suppressHydrationWarning
          style={{ cursor: "pointer" }}
        >
          <div className="menu-text-non-hover">Contact us</div>
          <div data-w-id="8312a1a5-dae7-16a1-8cec-e79ee9e966df" suppressHydrationWarning style={{ transform: "translate3d(0, 0, 0) scale3d(1, 1, 1)" }} className="menu-button__bg"></div>
        </a>
      </div>
    </div>
    <div no-click="" className="container-menu__light-is-back" suppressHydrationWarning>
      <div className="link-logo">
        <div className="link-logo__is2">
          <img src="/images/secured.svg" loading="lazy" alt="" className="link-logo__image" />
        </div>
      </div>
    </div>
    <div data-w-id="7f96e916-c5c0-f2e1-200b-a96fac32cef1" className="m-close-menu">
      <img src="/images/Frame-137919.png" loading="lazy" alt="" className="m-close-menu__logo" />
      <div data-w-id="70ad9961-268a-561b-24d4-94a7ae81636c" className="m-close-menu__bt">
        <div className="m-close-menu__bt-wrapper">
          <div data-w-id="e10a0ef2-9db7-c0a9-1b69-4adbc3b1416e" className="m-close-menu__line-1"></div>
        </div>
        <div className="m-close-menu__bt-wrapper">
          <div data-w-id="f8ed2bb2-3fff-1e06-7be5-c8110d27490a" className="m-close-menu__line-2"></div>
        </div>
      </div>
    </div>
    <div data-w-id="3ecd4d3b-5f05-bf52-e1ba-1fc699acc23f" className="m-open-menu" suppressHydrationWarning>
      <a href="#intro" className="m-open-menu__link nav-1 w-inline-block" suppressHydrationWarning>
        <div className="menu-text">Intro</div>
      </a>
      <a href="#platform" className="m-open-menu__link nav-2 w-inline-block" suppressHydrationWarning>
        <div className="menu-text">Platform</div>
      </a>
      <a href="#about" className="m-open-menu__link nav-3 w-inline-block" suppressHydrationWarning>
        <div className="menu-text">About us</div>
      </a>
      <a href="#investors" className="m-open-menu__link nav-4 w-inline-block" suppressHydrationWarning>
        <div className="menu-text">Investors</div>
      </a>
      <a href="#news" className="m-open-menu__link nav-5 w-inline-block" suppressHydrationWarning>
        <div className="menu-text">News</div>
      </a>
      <a
        href="#tour"
        role="button"
        onClick={(e) => {
          e.preventDefault();
          setIsVrModalOpen(true);
        }}
        className="m-open-menu__link nav-vr w-inline-block"
        suppressHydrationWarning
        style={{ cursor: "pointer" }}
      >
        <div className="menu-text">3D Tour</div>
      </a>
      <div className="m-open-menu__button-container">
        <a
          href="#contact"
          role="button"
          onClick={(e) => {
            e.preventDefault();
            setIsVideoModalOpen(true);
          }}
          data-w-id="418bead1-2a16-fae5-81f3-d14489478f36"
          className="m-open-menu__button to-footer w-inline-block"
          suppressHydrationWarning
          style={{ cursor: "pointer" }}
        >
          <div className="button-text-t black">Contact us</div>
          <img src="/images/Vector-18.svg" loading="lazy" alt="" className="m-open-menu__ic" />
        </a>
      </div>
    </div>
    <LionFullscreenModal
      isOpen={isVideoModalOpen}
      onClose={() => setIsVideoModalOpen(false)}
    />
    <VrFullscreenModal
      isOpen={isVrModalOpen}
      onClose={() => setIsVrModalOpen(false)}
    />
  </div>
  );
}
