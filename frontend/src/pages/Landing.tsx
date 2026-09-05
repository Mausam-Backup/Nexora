import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Preloader from "@/components/landing/Preloader";
import Cursor from "@/components/landing/Cursor";
import Navbar from "@/components/landing/Navbar";
import MainContent from "@/components/landing/MainContent";
import LandingPageEffects from "@/components/landing/LandingPageEffects";
import "@/components/landing/styles/landing.css";

export default function Landing() {
  useEffect(() => {
    // 1. Mark active landing page flags for Webflow runtime and scoped styling
    document.documentElement.classList.add("w-mod-js", "nexora-landing-active");
    document.body.classList.add("nexora-landing-active", "landing-preloading");
    document.body.setAttribute("data-w-id", "6351348a9becce665771eb98");
    document.documentElement.setAttribute("data-wf-page", "64357e0972ffee1e51c2b876");
    document.documentElement.setAttribute("data-wf-site", "636022c4862798e85d43e71e");

    // Dismiss preloader class after initial reveal
    const timer = setTimeout(() => {
      document.body.classList.remove("landing-preloading");
    }, 1400);

    return () => {
      clearTimeout(timer);
      document.documentElement.classList.remove("w-mod-js", "nexora-landing-active", "is-loaded");
      document.body.classList.remove("nexora-landing-active", "landing-preloading");
      document.body.removeAttribute("data-w-id");
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="landing-page-root">
      <Helmet>
        <title>Nexora — Enterprise Integrated Campus ERP &amp; Reconciliation Ledger</title>
        <meta
          name="description"
          content="Nexora (Problem Statement PS-6) — Enterprise-Grade Integrated Student Management &amp; Reconciliation System. Featuring 0ms multi-window synchronization, automated statutory gatekeeping, AI copilot, and deterministic audit ledgers."
        />
        <meta property="og:title" content="Nexora — Enterprise Integrated Campus ERP &amp; Reconciliation Ledger" />
        <meta
          property="og:description"
          content="Enterprise-grade collegiate platform replacing disconnected spreadsheets with a single synchronized relational ledger and 0ms BroadcastChannel event fabric."
        />
      </Helmet>
      <Preloader />
      <Cursor />
      <Navbar />
      <MainContent />
      <LandingPageEffects />
    </div>
  );
}
