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
        paddingTop: "36px",
        paddingBottom: "32px",
        overflow: "hidden",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* 3D Realistic Packing Tape Roll Standing in the Background */}
      <div
        style={{
          position: "absolute",
          top: "-15px",
          left: "50%",
          transform: "translateX(-20%)",
          width: "240px",
          height: "170px",
          pointerEvents: "none",
          opacity: 0.9,
          zIndex: 0,
        }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 240 170"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "100%" }}
        >
          {/* Main Tape Ring (Outer Cylinder) */}
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

      {/* Main Centered Width Container */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1180px",
          width: "92%",
          margin: "0 auto",
        }}
      >
        {/* Top Section: Logo in cut-out pocket on the left, Upper blue tab on the right */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            width: "100%",
          }}
        >
          {/* Response Iconic Stylized 'r' Logo in Cut-out Pocket */}
          <div
            style={{
              flex: "0 0 160px",
              paddingBottom: "16px",
              paddingLeft: "4px",
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            <svg
              width="118"
              height="102"
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

          {/* Stepped Upper Tab of Blue Container */}
          <div
            style={{
              flex: 1,
              position: "relative",
              backgroundColor: "#1411b8",
              borderTopLeftRadius: "22px",
              borderTopRightRadius: "22px",
              padding: "24px 34px 18px 36px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "24px",
            }}
          >
            {/* Smooth Concave Fillet Curve connecting lower card to upper tab */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: "absolute",
                bottom: 0,
                left: "-22px",
                pointerEvents: "none",
              }}
              aria-hidden="true"
            >
              <path d="M 22 0 A 22 22 0 0 0 0 22 L 22 22 Z" fill="#1411b8" />
            </svg>

            {/* Navigation Columns */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(90px, 1fr))",
                gap: "28px",
                flex: 1,
              }}
            >
              {/* Column 1: Product */}
              <div>
                <h4
                  style={{
                    color: "#ffffff",
                    fontSize: "13px",
                    fontWeight: 500,
                    marginBottom: "12px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Product
                </h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {["Sign In", "Pricing", "FAQ", "Contact"].map((item) => (
                    <li key={item} style={{ marginBottom: "7px" }}>
                      <a
                        href="#"
                        style={{
                          color: "rgba(255, 255, 255, 0.85)",
                          fontSize: "12px",
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          transition: "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#ffffff";
                          e.currentTarget.style.transform = "translateX(3px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "rgba(255, 255, 255, 0.85)";
                          e.currentTarget.style.transform = "translateX(0)";
                        }}
                      >
                        <span style={{ fontSize: "11px", opacity: 0.8 }}>→</span>
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
                    fontSize: "13px",
                    fontWeight: 500,
                    marginBottom: "12px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Industries
                </h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {["Retailers", "Distributors", "3PLs"].map((item) => (
                    <li key={item} style={{ marginBottom: "7px" }}>
                      <a
                        href="#"
                        style={{
                          color: "rgba(255, 255, 255, 0.85)",
                          fontSize: "12px",
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          transition: "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#ffffff";
                          e.currentTarget.style.transform = "translateX(3px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "rgba(255, 255, 255, 0.85)";
                          e.currentTarget.style.transform = "translateX(0)";
                        }}
                      >
                        <span style={{ fontSize: "11px", opacity: 0.8 }}>→</span>
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
                    fontSize: "13px",
                    fontWeight: 500,
                    marginBottom: "12px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Company
                </h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {["About Us", "Careers", "Blog"].map((item) => (
                    <li key={item} style={{ marginBottom: "7px" }}>
                      <a
                        href="#"
                        style={{
                          color: "rgba(255, 255, 255, 0.85)",
                          fontSize: "12px",
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          transition: "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#ffffff";
                          e.currentTarget.style.transform = "translateX(3px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "rgba(255, 255, 255, 0.85)";
                          e.currentTarget.style.transform = "translateX(0)";
                        }}
                      >
                        <span style={{ fontSize: "11px", opacity: 0.8 }}>→</span>
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
                    fontSize: "13px",
                    fontWeight: 500,
                    marginBottom: "12px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Legal
                </h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {["Privacy", "Terms"].map((item) => (
                    <li key={item} style={{ marginBottom: "7px" }}>
                      <a
                        href="#"
                        style={{
                          color: "rgba(255, 255, 255, 0.85)",
                          fontSize: "12px",
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          transition: "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#ffffff";
                          e.currentTarget.style.transform = "translateX(3px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "rgba(255, 255, 255, 0.85)";
                          e.currentTarget.style.transform = "translateX(0)";
                        }}
                      >
                        <span style={{ fontSize: "11px", opacity: 0.8 }}>→</span>
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
                gap: "14px",
                paddingTop: "1px",
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
                  transform: hoveredSocial === "x" ? "translateY(-1px)" : "none",
                  transition: "all 0.15s ease",
                  display: "inline-flex",
                }}
                onMouseEnter={() => setHoveredSocial("x")}
                onMouseLeave={() => setHoveredSocial(null)}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
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
                  transform: hoveredSocial === "insta" ? "translateY(-1px)" : "none",
                  transition: "all 0.15s ease",
                  display: "inline-flex",
                }}
                onMouseEnter={() => setHoveredSocial("insta")}
                onMouseLeave={() => setHoveredSocial(null)}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
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
                  transform: hoveredSocial === "fb" ? "translateY(-1px)" : "none",
                  transition: "all 0.15s ease",
                  display: "inline-flex",
                }}
                onMouseEnter={() => setHoveredSocial("fb")}
                onMouseLeave={() => setHoveredSocial(null)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
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
                  transform: hoveredSocial === "li" ? "translateY(-1px)" : "none",
                  transition: "all 0.15s ease",
                  display: "inline-flex",
                }}
                onMouseEnter={() => setHoveredSocial("li")}
                onMouseLeave={() => setHoveredSocial(null)}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
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
            borderTopLeftRadius: "22px",
            borderBottomLeftRadius: "22px",
            borderBottomRightRadius: "22px",
            padding: "36px 36px 24px 36px",
            marginTop: "-1px", // seamless joining with the upper tab
          }}
        >
          {/* Headline & Book a Demo Row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "24px",
              marginBottom: "32px",
            }}
          >
            {/* 3-Line Headline matching reference */}
            <h2
              style={{
                color: "#ffffff",
                fontSize: "clamp(26px, 3.2vw, 40px)",
                fontWeight: 500,
                lineHeight: 1.12,
                letterSpacing: "-0.025em",
                margin: 0,
                maxWidth: "600px",
              }}
            >
              Response helps
              <br />
              you spend smarter
              <br />
              without working harder
            </h2>

            {/* Rounded Rectangle "Book a Demo" Button */}
            <div>
              <a
                href="#demo"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#ffffff",
                  color: "#1411b8",
                  fontSize: "13px",
                  fontWeight: 600,
                  padding: "13px 24px",
                  borderRadius: "12px",
                  textDecoration: "none",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 18px rgba(0, 0, 0, 0.18)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
                }}
              >
                Book a Demo
              </a>
            </div>
          </div>

          {/* Thin Horizontal Hairline Divider */}
          <div
            style={{
              width: "100%",
              height: "1px",
              backgroundColor: "rgba(255, 255, 255, 0.18)",
              marginBottom: "16px",
            }}
          />

          {/* Bottom Row: Copyright + Barcode & Address */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            {/* Left: Copyright and Barcode */}
            <div>
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.75)",
                  fontSize: "11px",
                  margin: "0 0 8px 0",
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
                  gap: "5px",
                  opacity: 0.85,
                }}
              >
                {/* Vector Barcode */}
                <svg
                  width="112"
                  height="18"
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
                    width: "18px",
                    height: "18px",
                    border: "1.2px solid rgba(255, 255, 255, 0.8)",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "2px",
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 135 118" fill="none">
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
                color: "rgba(255, 255, 255, 0.75)",
                fontSize: "10px",
                lineHeight: 1.45,
                letterSpacing: "0.04em",
                fontFamily:
                  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
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
