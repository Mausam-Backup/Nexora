"use client";

import React from "react";
import Link from "next/link";
import { Compass, Eye, Sparkles, MapPin, ArrowUpRight, Layers, Camera } from "lucide-react";

export default function ExploreUniversitySection() {
  const featuredSpots = [
    {
      id: "0-main",
      name: "Main Campus Entrance",
      category: "Landmarks",
      tag: "Iconic Entry",
      preview: "/img/0-main.jpg",
    },
    {
      id: "5-ab01",
      name: "AB1 : View 1",
      category: "Academics",
      tag: "Smart Classrooms",
      preview: "/img/5-ab01.jpg",
    },
    {
      id: "8-lc01",
      name: "Computing & AI Labs",
      category: "Lab Complex",
      tag: "High Performance",
      preview: "/img/8-lc01.jpg",
    },
    {
      id: "2-lion",
      name: "Lion Gate Plaza",
      category: "Landmarks",
      tag: "Central Hub",
      preview: "/img/2-lion.jpg",
    },
  ];

  return (
    <section
      id="explore-university"
      style={{
        position: "relative",
        zIndex: 35,
        width: "100%",
        padding: "100px 24px 80px 24px",
        background: "linear-gradient(180deg, #09090b 0%, #0c0a09 50%, #18181b 100%)",
        color: "#f4f4f5",
        overflow: "hidden",
        borderTop: "1px solid rgba(251, 191, 36, 0.15)",
      }}
    >
      {/* Background Ambient Glows */}
      <div
        style={{
          position: "absolute",
          top: "-150px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "750px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(251, 191, 36, 0.12) 0%, rgba(20, 184, 166, 0.05) 50%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          right: "5%",
          width: "450px",
          height: "350px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1240px", margin: "0 auto", position: "relative", zIndex: 2 }}>
        {/* Header Badge & Title */}
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 18px",
              borderRadius: "9999px",
              backgroundColor: "rgba(251, 191, 36, 0.1)",
              border: "1px solid rgba(251, 191, 36, 0.3)",
              color: "#fbbf24",
              fontSize: "12px",
              fontWeight: "700",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            <Sparkles size={14} className="animate-pulse" />
            <span>Interactive 360° Virtual Experience</span>
          </div>

          <h2
            style={{
              fontSize: "clamp(2rem, 4vw, 3.25rem)",
              fontWeight: "800",
              letterSpacing: "-0.03em",
              lineHeight: "1.15",
              margin: "0 0 18px 0",
              background: "linear-gradient(135deg, #ffffff 30%, #d4d4d8 70%, #fbbf24 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            EXPLORE UNIVERSITY
          </h2>

          <p
            style={{
              maxWidth: "680px",
              margin: "0 auto 32px auto",
              fontSize: "clamp(0.95rem, 1.5vw, 1.15rem)",
              color: "#a1a1aa",
              lineHeight: "1.6",
            }}
          >
            Immerse yourself into our campus from anywhere in the world. Walk through high-tech
            auditoriums, specialized laboratories, modern hostel quads, and architectural landmarks with full 360° panoramic navigation.
          </p>

          {/* Primary Action Button */}
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <Link
              href="/explore"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px 36px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                color: "#09090b",
                fontWeight: "700",
                fontSize: "15px",
                letterSpacing: "0.04em",
                textDecoration: "none",
                boxShadow: "0 10px 30px -5px rgba(251, 191, 36, 0.45)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 20px 40px -5px rgba(251, 191, 36, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 10px 30px -5px rgba(251, 191, 36, 0.45)";
              }}
            >
              <Compass size={20} className="animate-spin" style={{ animationDuration: "10s" }} />
              <span>LAUNCH 360° CAMPUS TOUR</span>
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>

        {/* Featured Campus Highlights Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginTop: "40px",
          }}
        >
          {featuredSpots.map((spot) => (
            <Link
              key={spot.id}
              href={`/explore?scene=${spot.id}`}
              style={{
                textDecoration: "none",
                display: "block",
                borderRadius: "20px",
                backgroundColor: "rgba(24, 24, 27, 0.75)",
                border: "1px solid rgba(63, 63, 70, 0.4)",
                padding: "20px",
                backdropFilter: "blur(16px)",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.borderColor = "rgba(251, 191, 36, 0.6)";
                e.currentTarget.style.boxShadow = "0 15px 35px -10px rgba(0, 0, 0, 0.6), 0 0 20px rgba(251, 191, 36, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(63, 63, 70, 0.4)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "14px",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#fbbf24",
                    backgroundColor: "rgba(251, 191, 36, 0.1)",
                    padding: "4px 10px",
                    borderRadius: "9999px",
                    border: "1px solid rgba(251, 191, 36, 0.25)",
                    textTransform: "uppercase",
                  }}
                >
                  {spot.category}
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "11px",
                    color: "#71717a",
                  }}
                >
                  <Eye size={12} />
                  <span>360°</span>
                </span>
              </div>

              <h4
                style={{
                  fontSize: "17px",
                  fontWeight: "700",
                  color: "#ffffff",
                  margin: "0 0 6px 0",
                  letterSpacing: "-0.01em",
                }}
              >
                {spot.name}
              </h4>
              <p
                style={{
                  fontSize: "13px",
                  color: "#a1a1aa",
                  margin: "0 0 16px 0",
                }}
              >
                {spot.tag}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: "12px",
                  borderTop: "1px solid rgba(63, 63, 70, 0.4)",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#fbbf24",
                }}
              >
                <span>Jump directly into scene</span>
                <ArrowUpRight size={14} />
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Feature Pill Bar */}
        <div
          style={{
            marginTop: "48px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "28px",
            flexWrap: "wrap",
            padding: "16px 24px",
            borderRadius: "9999px",
            backgroundColor: "rgba(18, 18, 20, 0.6)",
            border: "1px solid rgba(63, 63, 70, 0.3)",
            maxWidth: "780px",
            margin: "48px auto 0 auto",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#d4d4d8" }}>
            <Camera size={15} style={{ color: "#fbbf24" }} />
            <span>High-Res Panoramic VR</span>
          </div>
          <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "#52525b" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#d4d4d8" }}>
            <MapPin size={15} style={{ color: "#34d399" }} />
            <span>15+ Campus Hotspots</span>
          </div>
          <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "#52525b" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#d4d4d8" }}>
            <Layers size={15} style={{ color: "#38bdf8" }} />
            <span>Interactive Floor Points</span>
          </div>
        </div>
      </div>
    </section>
  );
}
