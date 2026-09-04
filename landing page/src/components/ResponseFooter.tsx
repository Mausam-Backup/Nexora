"use client";

import React, { useState } from "react";

export default function ResponseFooter() {
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  return (
    <footer
      id="footer"
      style={{
        position: "relative",
        width: "100%",
        backgroundColor: "#f6f5fa",
        paddingTop: "90px",
        paddingBottom: "48px",
        overflow: "hidden",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Subtle Floating 3D Metallic Ribbon / Loop in background */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "280px",
          height: "220px",
          pointerEvents: "none",
          opacity: 0.85,
          zIndex: 0,
        }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 280 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "100%", filter: "blur(0.5px)" }}
        >
          {/* 3D Torus/Ribbon Loop Outline and Gradient */}
          <path
            d="M140 25 C80 25, 45 65, 52 110 C58 150, 95 185, 140 185 C185 185, 222 150, 228 110 C235 65, 200 25, 140 25 Z"
            stroke="url(#ribbon-grad)"
            strokeWidth="38"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.55"
          />
          <path
            d="M138 30 C90 30, 62 68, 68 108 C73 142, 102 172, 138 172 C174 172, 203 142, 208 108 C214 68, 186 30, 138 30 Z"
            stroke="rgba(255, 255, 255, 0.65)"
            strokeWidth="2"
            opacity="0.75"
          />
          {/* Subtle fold ribbon edge */}
          <path
            d="M110 32 L150 16 C165 14, 185 24, 188 40 L195 75 L160 80 Z"
            fill="url(#ribbon-sheen)"
            opacity="0.4"
          />
          <defs>
            <linearGradient
              id="ribbon-grad"
              x1="50"
              y1="30"
              x2="230"
              y2="180"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#cfd3dc" />
              <stop offset="35%" stopColor="#e8ebf2" />
              <stop offset="70%" stopColor="#b8bcc8" />
              <stop offset="100%" stopColor="#dce0ea" />
            </linearGradient>
            <linearGradient
              id="ribbon-sheen"
              x1="120"
              y1="20"
              x2="190"
              y2="80"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#a0a5b5" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main Centered Width Container */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1280px",
          width: "92%",
          margin: "0 auto",
        }}
      >
        {/* Top Section: Logo in cut-out pocket on the left, Blue tab on the right */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            width: "100%",
          }}
        >
          {/* Response Iconic Stylized 'r' Logo Glyph */}
          <div
            style={{
              flex: "0 0 170px",
              paddingBottom: "24px",
              paddingLeft: "4px",
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            <svg
              width="135"
              height="118"
              viewBox="0 0 135 118"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Response Logo"
            >
              {/* Main Stem & Hook: rounded bottom, curves right at top with rounded end */}
              <path
                d="M 42 110 C 18.8 110 0 91.2 0 68 L 0 42 C 0 18.8 18.8 0 42 0 L 92 0 C 115.2 0 134 18.8 134 42 C 134 65.2 115.2 84 92 84 L 56 84 C 52 84 48 88 48 92 L 48 104 C 48 107.3 45.3 110 42 110 Z"
                fill="#1411b8"
              />
              {/* Detached Dot below the hook */}
              <circle cx="95" cy="85" r="28" fill="#1411b8" />
            </svg>
          </div>

          {/* Stepped Top-Bar of Blue Container */}
          <div
            style={{
              flex: 1,
              backgroundColor: "#1411b8",
              borderTopLeftRadius: "28px",
              borderTopRightRadius: "28px",
              padding: "36px 44px 28px 48px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "28px",
            }}
          >
            {/* Navigation Columns */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(110px, 1fr))",
                gap: "36px",
                flex: 1,
              }}
            >
              {/* Column 1: Product */}
              <div>
                <h4
                  style={{
                    color: "#ffffff",
                    fontSize: "15px",
                    fontWeight: 600,
                    marginBottom: "18px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Product
                </h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {["Sign In", "Pricing", "FAQ", "Contact"].map((item) => (
                    <li key={item} style={{ marginBottom: "11px" }}>
                      <a
                        href="#"
                        style={{
                          color: "rgba(255, 255, 255, 0.82)",
                          fontSize: "13.5px",
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#ffffff";
                          e.currentTarget.style.transform = "translateX(4px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "rgba(255, 255, 255, 0.82)";
                          e.currentTarget.style.transform = "translateX(0)";
                        }}
                      >
                        <span style={{ fontSize: "12px", opacity: 0.8 }}>→</span>
                        <span>{item}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2: Industries */}
              <div>
                <h4
                  style={{
                    color: "#ffffff",
                    fontSize: "15px",
                    fontWeight: 600,
                    marginBottom: "18px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Industries
                </h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {["Retailers", "Distributors", "3PLs"].map((item) => (
                    <li key={item} style={{ marginBottom: "11px" }}>
                      <a
                        href="#"
                        style={{
                          color: "rgba(255, 255, 255, 0.82)",
                          fontSize: "13.5px",
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#ffffff";
                          e.currentTarget.style.transform = "translateX(4px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "rgba(255, 255, 255, 0.82)";
                          e.currentTarget.style.transform = "translateX(0)";
                        }}
                      >
                        <span style={{ fontSize: "12px", opacity: 0.8 }}>→</span>
                        <span>{item}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: Company */}
              <div>
                <h4
                  style={{
                    color: "#ffffff",
                    fontSize: "15px",
                    fontWeight: 600,
                    marginBottom: "18px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Company
                </h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {["About Us", "Careers", "Blog"].map((item) => (
                    <li key={item} style={{ marginBottom: "11px" }}>
                      <a
                        href="#"
                        style={{
                          color: "rgba(255, 255, 255, 0.82)",
                          fontSize: "13.5px",
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#ffffff";
                          e.currentTarget.style.transform = "translateX(4px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "rgba(255, 255, 255, 0.82)";
                          e.currentTarget.style.transform = "translateX(0)";
                        }}
                      >
                        <span style={{ fontSize: "12px", opacity: 0.8 }}>→</span>
                        <span>{item}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 4: Legal */}
              <div>
                <h4
                  style={{
                    color: "#ffffff",
                    fontSize: "15px",
                    fontWeight: 600,
                    marginBottom: "18px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Legal
                </h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {["Privacy", "Terms"].map((item) => (
                    <li key={item} style={{ marginBottom: "11px" }}>
                      <a
                        href="#"
                        style={{
                          color: "rgba(255, 255, 255, 0.82)",
                          fontSize: "13.5px",
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#ffffff";
                          e.currentTarget.style.transform = "translateX(4px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "rgba(255, 255, 255, 0.82)";
                          e.currentTarget.style.transform = "translateX(0)";
                        }}
                      >
                        <span style={{ fontSize: "12px", opacity: 0.8 }}>→</span>
                        <span>{item}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Social Icons (Far Right) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "18px",
                paddingTop: "2px",
              }}
            >
              {/* X / Twitter */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                style={{
                  color: "#ffffff",
                  opacity: hoveredSocial === "x" ? 1 : 0.85,
                  transform: hoveredSocial === "x" ? "translateY(-2px)" : "none",
                  transition: "all 0.2s ease",
                  display: "inline-flex",
                }}
                onMouseEnter={() => setHoveredSocial("x")}
                onMouseLeave={() => setHoveredSocial(null)}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                style={{
                  color: "#ffffff",
                  opacity: hoveredSocial === "insta" ? 1 : 0.85,
                  transform: hoveredSocial === "insta" ? "translateY(-2px)" : "none",
                  transition: "all 0.2s ease",
                  display: "inline-flex",
                }}
                onMouseEnter={() => setHoveredSocial("insta")}
                onMouseLeave={() => setHoveredSocial(null)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                style={{
                  color: "#ffffff",
                  opacity: hoveredSocial === "fb" ? 1 : 0.85,
                  transform: hoveredSocial === "fb" ? "translateY(-2px)" : "none",
                  transition: "all 0.2s ease",
                  display: "inline-flex",
                }}
                onMouseEnter={() => setHoveredSocial("fb")}
                onMouseLeave={() => setHoveredSocial(null)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                style={{
                  color: "#ffffff",
                  opacity: hoveredSocial === "li" ? 1 : 0.85,
                  transform: hoveredSocial === "li" ? "translateY(-2px)" : "none",
                  transition: "all 0.2s ease",
                  display: "inline-flex",
                }}
                onMouseEnter={() => setHoveredSocial("li")}
                onMouseLeave={() => setHoveredSocial(null)}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Lower Main Section of Blue Card */}
        <div
          style={{
            position: "relative",
            backgroundColor: "#1411b8",
            borderTopLeftRadius: "28px",
            borderBottomLeftRadius: "28px",
            borderBottomRightRadius: "28px",
            padding: "60px 48px 42px 48px",
            marginTop: "-2px", // seamless joining with the upper tab
          }}
        >
          {/* Headline & Book a Demo Row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: "36px",
              marginBottom: "52px",
            }}
          >
            {/* Bold Headline */}
            <h2
              style={{
                color: "#ffffff",
                fontSize: "clamp(32px, 4.4vw, 54px)",
                fontWeight: 600,
                lineHeight: 1.15,
                letterSpacing: "-0.025em",
                margin: 0,
                maxWidth: "680px",
              }}
            >
              Response helps
              <br />
              you spend smarter
              <br />
              without working harder
            </h2>

            {/* Book a Demo Button */}
            <div>
              <a
                href="#demo"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#ffffff",
                  color: "#1411b8",
                  fontSize: "14px",
                  fontWeight: 600,
                  padding: "16px 32px",
                  borderRadius: "999px",
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.12)",
                  transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 28px rgba(0, 0, 0, 0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow =
                    "0 4px 14px rgba(0, 0, 0, 0.12)";
                }}
              >
                Book a Demo
              </a>
            </div>
          </div>

          {/* Thin Horizontal Divider Rule */}
          <div
            style={{
              width: "100%",
              height: "1px",
              backgroundColor: "rgba(255, 255, 255, 0.22)",
              marginBottom: "28px",
            }}
          />

          {/* Bottom Row: Copyright + Barcode & Address */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: "24px",
            }}
          >
            {/* Left: Copyright and Barcode */}
            <div>
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.75)",
                  fontSize: "12px",
                  margin: "0 0 10px 0",
                  letterSpacing: "-0.01em",
                }}
              >
                © 2025 Response Inc.
              </p>

              {/* Barcode Graphic + Badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  opacity: 0.85,
                }}
              >
                {/* Vector Barcode */}
                <svg
                  width="130"
                  height="22"
                  viewBox="0 0 130 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="0" y="0" width="2" height="22" fill="#ffffff" />
                  <rect x="4" y="0" width="1" height="22" fill="#ffffff" />
                  <rect x="7" y="0" width="3" height="22" fill="#ffffff" />
                  <rect x="12" y="0" width="1" height="22" fill="#ffffff" />
                  <rect x="15" y="0" width="2" height="22" fill="#ffffff" />
                  <rect x="19" y="0" width="4" height="22" fill="#ffffff" />
                  <rect x="25" y="0" width="1" height="22" fill="#ffffff" />
                  <rect x="28" y="0" width="2" height="22" fill="#ffffff" />
                  <rect x="32" y="0" width="1" height="22" fill="#ffffff" />
                  <rect x="35" y="0" width="3" height="22" fill="#ffffff" />
                  <rect x="40" y="0" width="2" height="22" fill="#ffffff" />
                  <rect x="44" y="0" width="1" height="22" fill="#ffffff" />
                  <rect x="47" y="0" width="4" height="22" fill="#ffffff" />
                  <rect x="53" y="0" width="2" height="22" fill="#ffffff" />
                  <rect x="57" y="0" width="1" height="22" fill="#ffffff" />
                  <rect x="60" y="0" width="3" height="22" fill="#ffffff" />
                  <rect x="65" y="0" width="1" height="22" fill="#ffffff" />
                  <rect x="68" y="0" width="2" height="22" fill="#ffffff" />
                  <rect x="72" y="0" width="4" height="22" fill="#ffffff" />
                  <rect x="78" y="0" width="1" height="22" fill="#ffffff" />
                  <rect x="81" y="0" width="3" height="22" fill="#ffffff" />
                  <rect x="86" y="0" width="2" height="22" fill="#ffffff" />
                  <rect x="90" y="0" width="1" height="22" fill="#ffffff" />
                  <rect x="93" y="0" width="2" height="22" fill="#ffffff" />
                  <rect x="97" y="0" width="4" height="22" fill="#ffffff" />
                  <rect x="103" y="0" width="1" height="22" fill="#ffffff" />
                  <rect x="106" y="0" width="3" height="22" fill="#ffffff" />
                  <rect x="111" y="0" width="2" height="22" fill="#ffffff" />
                  <rect x="115" y="0" width="1" height="22" fill="#ffffff" />
                  <rect x="118" y="0" width="2" height="22" fill="#ffffff" />
                  <rect x="122" y="0" width="3" height="22" fill="#ffffff" />
                  <rect x="127" y="0" width="2" height="22" fill="#ffffff" />
                </svg>

                {/* Square Icon Badge */}
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    border: "1.2px solid rgba(255, 255, 255, 0.8)",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "2px",
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 135 118" fill="none">
                    <path
                      d="M 42 110 C 18.8 110 0 91.2 0 68 L 0 42 C 0 18.8 18.8 0 42 0 L 92 0 C 115.2 0 134 18.8 134 42 C 134 65.2 115.2 84 92 84 L 56 84 C 52 84 48 88 48 92 L 48 104 C 48 107.3 45.3 110 42 110 Z"
                      fill="#ffffff"
                    />
                    <circle cx="95" cy="85" r="28" fill="#ffffff" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right: Phone & Address */}
            <div
              style={{
                textAlign: "right",
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "11px",
                lineHeight: 1.55,
                letterSpacing: "0.04em",
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
              }}
            >
              <div>+1 (844) 966-1910</div>
              <div>2261 MARKET STREET STE 4116</div>
              <div>SAN FRANCISCO, CA 94114-1612</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
