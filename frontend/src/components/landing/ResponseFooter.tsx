"use client";

import React, { useState } from "react";

export default function ResponseFooter() {
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  return (
    <footer
      id="footer"
      style={{
        position: "relative",
        zIndex: 40,
        marginTop: "100vh",
        width: "100%",
        backgroundColor: "#f4f4f6",
        paddingTop: "40px",
        paddingBottom: "40px",
        overflow: "hidden",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* 3D Realistic Standing Tape Roll in the Background */}
      <div
        style={{
          position: "absolute",
          top: "0px",
          left: "50%",
          transform: "translateX(-20%)",
          width: "230px",
          height: "160px",
          pointerEvents: "none",
          opacity: 0.9,
          zIndex: 1,
        }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 240 170"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "100%" }}
        >
          {/* Main Tape Ring Outer Cylinder */}
          <ellipse
            cx="110"
            cy="85"
            rx="56"
            ry="75"
            fill="url(#tape-outer)"
            stroke="#cfd3dc"
            strokeWidth="1.5"
          />

          {/* Inner Hollow Hole */}
          <ellipse
            cx="110"
            cy="85"
            rx="32"
            ry="50"
            fill="#f4f4f6"
            stroke="#b8bcc8"
            strokeWidth="2"
          />

          {/* Inner Ring Rim Highlight */}
          <path
            d="M 110 35 C 92 35 78 57 78 85 C 78 113 92 135 110 135"
            stroke="#ffffff"
            strokeWidth="2"
            strokeOpacity="0.8"
            fill="none"
          />

          {/* Tape strip peeling off to the right with torn serrated edge */}
          <path
            d="M 125 18 
               C 145 22 170 35 178 52 
               L 182 86 
               L 174 89 L 178 95 L 170 98 L 174 104 L 166 107 L 170 113 L 160 115 
               L 152 70 
               C 145 48 132 30 118 20 Z"
            fill="url(#tape-peel)"
            stroke="#cfd3dc"
            strokeWidth="1"
            opacity="0.88"
          />

          {/* Translucent sheen on the peeled strip */}
          <path
            d="M 130 24 C 148 30 166 45 172 65 L 166 90 C 160 70 146 45 128 30 Z"
            fill="url(#tape-sheen)"
            opacity="0.5"
          />

          <defs>
            <linearGradient
              id="tape-outer"
              x1="60"
              y1="20"
              x2="170"
              y2="150"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#e8ebf2" />
              <stop offset="40%" stopColor="#dadde6" />
              <stop offset="70%" stopColor="#c5c9d6" />
              <stop offset="100%" stopColor="#e4e7ef" />
            </linearGradient>
            <linearGradient
              id="tape-peel"
              x1="120"
              y1="20"
              x2="180"
              y2="105"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#f0f2f7" />
              <stop offset="50%" stopColor="#dfe2eb" />
              <stop offset="100%" stopColor="#ccd1de" />
            </linearGradient>
            <linearGradient
              id="tape-sheen"
              x1="130"
              y1="25"
              x2="170"
              y2="85"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#b0b5c4" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main Container matching Footer__Wrapper-sc-12rbdn7-0 hOxoAS */}
      <div
        style={{
          position: "relative",
          zIndex: 3,
          maxWidth: "1360px",
          width: "93%",
          aspectRatio: "1360 / 613",
          minHeight: "440px",
          margin: "0 auto",
          padding: "40px 48px 36px",
          boxSizing: "border-box",
          display: "grid",
          gridTemplate: `
            ".       links   socials" auto
            "smarter smarter smarter" 1fr
            "copy    copy    address" auto / 250px 1fr auto
          `,
          rowGap: "20px",
          columnGap: "32px",
        }}
      >
        {/* Clickable Home MockButton overlaying the logo (Footer__MockButton-sc-12rbdn7-1 cvHGEp) */}
        <a
          aria-current="page"
          aria-label="Nexora Home"
          className="Footer__MockButton-sc-12rbdn7-1 cvHGEp"
          href="/"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "200px",
            height: "200px",
            borderRadius: "0 45px 45px",
            zIndex: 10,
            cursor: "pointer",
          }}
        >
          {" "}
        </a>

        {/* Exact Vector Background Shape & Logo (Footer__Background-sc-12rbdn7-2 eejowd) */}
        <svg
          viewBox="0 0 1360 613"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            maxHeight: "unset",
            maxWidth: "unset",
            zIndex: -1,
            pointerEvents: "none",
          }}
          aria-hidden="true"
        >
          {/* Asymmetrical Stepped Blue Container */}
          <path
            d="M226 246H20C8.9543 246 0 254.954 0 266V593C0 604.046 8.95432 613 20 613H1340C1351.05 613 1360 604.046 1360 593V20C1360 8.95431 1351.05 0 1340 0H266C254.954 0 246 8.9543 246 20V226C246 237.046 237.046 246 226 246Z"
            fill="#1916B0"
          />
          {/* Logo Mark in Cutout */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 153.926V0L154.376 0.0138492C179.721 0.625211 200 21.3832 200 46.8037C200 72.2244 179.721 92.9823 154.376 93.5938L153.109 93.6268H93.548L93.534 154.505C92.918 179.862 72.175 200.149 46.7741 200.149C21.3731 200.149 0.630075 179.862 0 153.926ZM200 153.744C200 179.291 179.291 200 153.744 200C128.198 200 107.489 179.291 107.489 153.744C107.489 128.198 128.198 107.489 153.744 107.489C179.291 107.489 200 128.198 200 153.744Z"
            fill="#1916B0"
          />
        </svg>

        {/* 1. Navigation Links (grid-area: links) */}
        <div
          style={{
            gridArea: "links",
            display: "flex",
            gap: "clamp(40px, 7vw, 100px)",
            paddingTop: "6px",
          }}
        >
          {/* Platform Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div
              style={{
                fontFamily: '"PP Telegraf", -apple-system, sans-serif',
                fontSize: "13px",
                fontWeight: 600,
                color: "#7CB1FF",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Platform
            </div>
            {[
              { label: "System Architecture", href: "#platform" },
              { label: "360° Campus Tour", href: "/explore" },
              { label: "Live ERP Portals", href: "http://localhost:5000" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                style={{
                  color: "#ffffff",
                  fontSize: "13px",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "opacity 0.2s ease, transform 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.75";
                  e.currentTarget.style.transform = "translateX(2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "none";
                }}
              >
                <span style={{ fontSize: "11px", opacity: 0.8 }}>→</span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>

          {/* Documentation / Resources Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div
              style={{
                fontFamily: '"PP Telegraf", -apple-system, sans-serif',
                fontSize: "13px",
                fontWeight: 600,
                color: "#7CB1FF",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Resources
            </div>
            {[
              { label: "Technical Documentation", href: "https://github.com/Mausam5055/Nexora#readme" },
              { label: "Database Schema (db.sql)", href: "https://github.com/Mausam5055/Nexora/blob/main/db.sql" },
              { label: "Contact Team AC-DC", href: "mailto:mausamkar5055@gmail.com" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                style={{
                  color: "#ffffff",
                  fontSize: "13px",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "opacity 0.2s ease, transform 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.75";
                  e.currentTarget.style.transform = "translateX(2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "none";
                }}
              >
                <span style={{ fontSize: "11px", opacity: 0.8 }}>→</span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* 2. Socials (grid-area: socials) */}
        <div
          style={{
            gridArea: "socials",
            display: "flex",
            gap: "22px",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            paddingTop: "6px",
          }}
        >
          {/* GitHub Repo */}
          <a
            href="https://github.com/Mausam5055/Nexora"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Repository"
            style={{
              color: "#ffffff",
              opacity: hoveredSocial === "git" ? 0.75 : 1,
              transition: "opacity 0.2s ease",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              textDecoration: "none",
            }}
            onMouseEnter={() => setHoveredSocial("git")}
            onMouseLeave={() => setHoveredSocial(null)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            <span>GitHub</span>
          </a>

          {/* Lead Architect Profile */}
          <a
            href="https://github.com/Mausam5055"
            target="_blank"
            rel="noreferrer"
            aria-label="Lead Architect GitHub"
            style={{
              color: "#ffffff",
              opacity: hoveredSocial === "lead" ? 0.75 : 1,
              transition: "opacity 0.2s ease",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              textDecoration: "none",
            }}
            onMouseEnter={() => setHoveredSocial("lead")}
            onMouseLeave={() => setHoveredSocial(null)}
          >
            <span>@Mausam5055</span>
          </a>
        </div>

        {/* 3. Call Section with Divider (grid-area: smarter) */}
        <div
          style={{
            gridArea: "smarter",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            paddingBottom: "18px",
            marginBottom: "8px",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          {/* Headline */}
          <div
            style={{
              fontFamily: '"PP Telegraf", -apple-system, sans-serif',
              fontSize: "clamp(24px, 3vw, 40px)",
              fontWeight: 400,
              lineHeight: "105%",
              letterSpacing: "-1px",
              color: "white",
              maxWidth: "540px",
            }}
          >
            Nexora unifies campus administration
            <br />
            without manual reconciliation
          </div>

          <a
            href="mailto:mausamkar5055@gmail.com?subject=Inquiry%20for%20Team%20AC-DC%20-%20Nexora"
            style={{
              padding: "14px 28px",
              borderRadius: "45px",
              background: "white",
              color: "#08090d",
              fontFamily: '"Times New Roman", Times, Georgia, serif',
              fontSize: "14.5px",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid white",
              cursor: "pointer",
              textDecoration: "none",
              transition:
                "background 0.3s cubic-bezier(0.76, 0, 0.09, 1), transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#EAF0FD";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.transform = "none";
            }}
          >
            Contact Team AC-DC
          </a>
        </div>

        {/* 4. Copyright and Authorship (grid-area: copy) */}
        <div
          style={{
            gridArea: "copy",
            fontFamily: '"Times New Roman", Times, Georgia, serif',
            fontSize: "13px",
            fontWeight: 400,
            letterSpacing: "0.2px",
            color: "rgba(255, 255, 255, 0.85)",
            alignSelf: "center",
          }}
        >
          © 2026 Team AC-DC • Lead Architect: Mausam Kar
        </div>

        {/* 5. Institutional Subtitle (grid-area: address) */}
        <div
          style={{
            gridArea: "address",
            fontFamily: '"Times New Roman", Times, Georgia, serif',
            fontSize: "13px",
            fontWeight: 400,
            letterSpacing: "0.2px",
            textAlign: "right",
            color: "rgba(255, 255, 255, 0.85)",
            alignSelf: "center",
          }}
        >
          VIT Bhopal University • Problem Statement PS-6
        </div>
      </div>
    </footer>
  );
}
