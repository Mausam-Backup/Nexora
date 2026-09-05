"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import LionFullscreenModal from "./LionFullscreenModal";
import VrFullscreenModal from "./VrFullscreenModal";

export default function Navbar() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isVrModalOpen, setIsVrModalOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const portalDestination = isAuthenticated
    ? user?.role === 'admin'
      ? '/admin/overview'
      : user?.role === 'teacher'
      ? '/teacher/attendance'
      : user?.role === 'examination_controller' || (user?.role as any) === 'examination-controller'
      ? '/examination-controller'
      : '/student/dashboard'
    : '/auth';

  return (
  <div className="fixed-items">
    <div className="container-menu__light">
      <div className="link-logo">
        <a href="#" className="link-logo__is1 w-inline-block">
          <div className="link-logo__image w-embed">
            <svg fill="none" viewBox="0 0 26 19">
              <path fill="var(--logo-dot-color)" d="M1 4.557A3.5 3.5 0 0 1 4.556 1a3.497 3.497 0 0 1 3.556 3.557 3.499 3.499 0 0 1-3.556 3.555A3.498 3.498 0 0 1 1 4.557Z">
              </path>
              <path fill="var(--logo-color)" stroke="var(--logo-color)" strokeWidth=".2" d="M13.5 17.5V1.5h2.4l5.6 11.2V1.5H24v16h-2.4l-5.7-11.4v11.4h-2.4Z">
              </path>
            </svg>
          </div>
        </a>
      </div>
      <div className="menu-items">
        <a href="#intro" className="menu-item nav-1 w-inline-block" suppressHydrationWarning>
          <div className="menu-text">Overview</div>
        </a>
        <a href="#platform" className="menu-item nav-2 w-inline-block" suppressHydrationWarning>
          <div className="menu-text">Architecture</div>
        </a>
        <a href="#about" className="menu-item nav-3 w-inline-block" suppressHydrationWarning>
          <div className="menu-text">Core Modules</div>
        </a>
        <a
          href="/explore"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = "/explore";
          }}
          className="menu-item nav-vr w-inline-block"
          suppressHydrationWarning
          style={{ cursor: "pointer" }}
        >
          <div className="menu-text">3D Campus Tour</div>
        </a>
        <a href="#investors" className="menu-item nav-4 w-inline-block" suppressHydrationWarning>
          <div className="menu-text">Ledger Specs</div>
        </a>
        <a href="#news" className="menu-item nav-5 w-inline-block" suppressHydrationWarning>
          <div className="menu-text">Whitepapers</div>
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
          <div className="menu-text-non-hover">Contact Us</div>
          <div data-w-id="8312a1a5-dae7-16a1-8cec-e79ee9e966df" suppressHydrationWarning style={{ transform: "translate3d(0, 0, 0) scale3d(1, 1, 1)" }} className="menu-button__bg"></div>
        </a>
        {isAuthenticated ? (
          <a
            href={portalDestination}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = portalDestination;
            }}
            className="menu-button w-inline-block"
            style={{
              cursor: "pointer",
              backgroundColor: "#022336",
              color: "#ffffff",
              marginLeft: "6px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
            title="Open Dashboard"
          >
            <div className="menu-text-non-hover" style={{ color: "#ffffff", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#cafcc4" }} />
              Dashboard
            </div>
          </a>
        ) : (
          <>
            <a
              href="/auth"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/auth";
              }}
              className="menu-button w-inline-block"
              style={{
                cursor: "pointer",
                backgroundColor: "#022336",
                color: "#ffffff",
                marginLeft: "6px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
              title="Sign in to ERP Portal"
            >
              <div className="menu-text-non-hover" style={{ color: "#ffffff", display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#cafcc4" }} />
                Sign In
              </div>
            </a>
            <a
              href="/auth?mode=signup"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/auth?mode=signup";
              }}
              className="menu-button w-inline-block"
              style={{
                cursor: "pointer",
                backgroundColor: "#5162ff",
                color: "#ffffff",
                marginLeft: "6px",
                border: "1px solid rgba(255, 255, 255, 0.25)",
              }}
              title="Sign up for Nexora"
            >
              <div className="menu-text-non-hover" style={{ color: "#ffffff", display: "flex", alignItems: "center", gap: "6px", fontWeight: 600 }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#cafcc4" }} />
                Sign Up
              </div>
            </a>
          </>
        )}
      </div>
    </div>
    <div no-click="" className="container-menu__light-is-back" suppressHydrationWarning>
      <div className="link-logo">
        <div className="link-logo__is2">
          <img src="/images/nexora-logo.svg" loading="lazy" alt="Nexora" className="link-logo__image" />
        </div>
      </div>
    </div>
    <div data-w-id="7f96e916-c5c0-f2e1-200b-a96fac32cef1" className="m-close-menu">
      <span className="m-close-menu__logo" style={{ color: "#ffffff", fontWeight: 800, fontSize: "17px", letterSpacing: "2.5px" }}>NEXORA</span>
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
        <div className="menu-text">Overview</div>
      </a>
      <a href="#platform" className="m-open-menu__link nav-2 w-inline-block" suppressHydrationWarning>
        <div className="menu-text">Architecture</div>
      </a>
      <a href="#about" className="m-open-menu__link nav-3 w-inline-block" suppressHydrationWarning>
        <div className="menu-text">Core Modules</div>
      </a>
      <a href="#investors" className="m-open-menu__link nav-4 w-inline-block" suppressHydrationWarning>
        <div className="menu-text">Ledger Specs</div>
      </a>
      <a href="#news" className="m-open-menu__link nav-5 w-inline-block" suppressHydrationWarning>
        <div className="menu-text">Whitepapers</div>
      </a>
      <a
        href="/explore"
        onClick={(e) => {
          e.preventDefault();
          window.location.href = "/explore";
        }}
        className="m-open-menu__link nav-vr w-inline-block"
        suppressHydrationWarning
        style={{ cursor: "pointer" }}
      >
        <div className="menu-text">3D Campus Tour</div>
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
          <div className="button-text-t black">Contact Us</div>
          <img src="/images/Vector-18.svg" loading="lazy" alt="" className="m-open-menu__ic" />
        </a>
        {isAuthenticated ? (
          <a
            href={portalDestination}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = portalDestination;
            }}
            className="m-open-menu__button w-inline-block"
            style={{
              cursor: "pointer",
              marginTop: "10px",
              backgroundColor: "#022336",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <div className="button-text-t" style={{ color: "#ffffff" }}>Open Dashboard</div>
          </a>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%", marginTop: "10px" }}>
            <a
              href="/auth"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/auth";
              }}
              className="m-open-menu__button w-inline-block"
              style={{
                cursor: "pointer",
                backgroundColor: "#022336",
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <div className="button-text-t" style={{ color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#cafcc4" }} />
                Sign In to ERP
              </div>
            </a>
            <a
              href="/auth?mode=signup"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/auth?mode=signup";
              }}
              className="m-open-menu__button w-inline-block"
              style={{
                cursor: "pointer",
                backgroundColor: "#5162ff",
                color: "#ffffff",
                border: "none",
              }}
            >
              <div className="button-text-t" style={{ color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontWeight: 600 }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#cafcc4" }} />
                Sign Up
              </div>
            </a>
          </div>
        )}
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
