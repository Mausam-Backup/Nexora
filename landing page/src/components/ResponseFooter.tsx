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
            "copy    .       address" auto / 250px 1fr auto
          `,
          rowGap: "24px",
          columnGap: "32px",
        }}
      >
        {/* Clickable Home MockButton overlaying the logo (Footer__MockButton-sc-12rbdn7-1 cvHGEp) */}
        <a
          aria-current="page"
          aria-label="Response Home"
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
            gap: "clamp(30px, 5.5vw, 85px)",
            paddingTop: "6px",
          }}
        >
          {/* Product Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div
              style={{
                fontFamily: '"PP Telegraf", -apple-system, sans-serif',
                fontSize: "14px",
                fontWeight: 600,
                color: "#7CB1FF",
                letterSpacing: "-0.3px",
              }}
            >
              Product
            </div>
            {[
              { label: "Sign In", href: "https://app.tryresponse.com/login/" },
              { label: "Pricing", href: "/pricing" },
              { label: "FAQ", href: "/pricing#faq" },
              { label: "Contact", href: "mailto:contact@tryresponse.com" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                style={{
                  color: "#ffffff",
                  fontSize: "13px",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
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
                <span style={{ fontSize: "11px", opacity: 0.9 }}>→</span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>

          {/* Industries Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div
              style={{
                fontFamily: '"PP Telegraf", -apple-system, sans-serif',
                fontSize: "14px",
                fontWeight: 600,
                color: "#7CB1FF",
                letterSpacing: "-0.3px",
              }}
            >
              Industries
            </div>
            {[
              { label: "Retailers", href: "retailers" },
              { label: "Distributors", href: "distributors" },
              { label: "3PLs", href: "3pls" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                style={{
                  color: "#ffffff",
                  fontSize: "13px",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
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
                <span style={{ fontSize: "11px", opacity: 0.9 }}>→</span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>

          {/* Company Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div
              style={{
                fontFamily: '"PP Telegraf", -apple-system, sans-serif',
                fontSize: "14px",
                fontWeight: 600,
                color: "#7CB1FF",
                letterSpacing: "-0.3px",
              }}
            >
              Company
            </div>
            {[
              { label: "About Us", href: "/about" },
              { label: "Careers", href: "https://jobs.ashbyhq.com/response" },
              { label: "Blog", href: "/blog" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                style={{
                  color: "#ffffff",
                  fontSize: "13px",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
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
                <span style={{ fontSize: "11px", opacity: 0.9 }}>→</span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>

          {/* Legal Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div
              style={{
                fontFamily: '"PP Telegraf", -apple-system, sans-serif',
                fontSize: "14px",
                fontWeight: 600,
                color: "#7CB1FF",
                letterSpacing: "-0.3px",
              }}
            >
              Legal
            </div>
            {[
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                style={{
                  color: "#ffffff",
                  fontSize: "13px",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
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
                <span style={{ fontSize: "11px", opacity: 0.9 }}>→</span>
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
          {/* X / Twitter */}
          <a
            href="https://twitter.com/tryresponse"
            target="_blank"
            rel="noreferrer"
            aria-label="Twitter"
            style={{
              color: "#ffffff",
              opacity: hoveredSocial === "x" ? 0.75 : 1,
              transition: "opacity 0.2s ease",
              display: "inline-flex",
            }}
            onMouseEnter={() => setHoveredSocial("x")}
            onMouseLeave={() => setHoveredSocial(null)}
          >
            <svg width="15" height="15" viewBox="0 0 32 32" fill="none">
              <path
                d="M21.5355 7.16602H24.4873L18.0385 14.5366L25.6251 24.5663H19.6849L15.0323 18.4833L9.70871 24.5663H6.75513L13.6528 16.6826L6.375 7.16602H12.466L16.6715 12.7261L21.5355 7.16602ZM20.4996 22.7995H22.1352L11.5772 8.84001H9.82204L20.4996 22.7995Z"
                fill="white"
              />
            </svg>
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com/tryresponse"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            style={{
              color: "#ffffff",
              opacity: hoveredSocial === "insta" ? 0.75 : 1,
              transition: "opacity 0.2s ease",
              display: "inline-flex",
            }}
            onMouseEnter={() => setHoveredSocial("insta")}
            onMouseLeave={() => setHoveredSocial(null)}
          >
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path
                d="M9 0C6.55575 0 6.24926 0.01036 5.28931 0.05416C4.33137 0.09789 3.67712 0.25 3.10462 0.4725C2.51279 0.7025 2.01088 1.01025 1.51055 1.51058C1.01021 2.01092 0.70247 2.51283 0.47247 3.10466C0.24997 3.67712 0.09785 4.33137 0.05412 5.28931C0.01032 6.24926 0 6.55575 0 9C0 11.4443 0.01032 11.7507 0.05412 12.7107C0.09785 13.6686 0.24997 14.3229 0.47247 14.8953C0.70247 15.4872 1.01021 15.9891 1.51055 16.4895C2.01088 16.9898 2.51279 17.2975 3.10462 17.5275C3.67712 17.75 4.33137 17.9021 5.28931 17.9458C6.24926 17.9896 6.55575 18 9 18C11.4443 18 11.7507 17.9896 12.7107 17.9458C13.6686 17.9021 14.3229 17.75 14.8953 17.5275C15.4872 17.2975 15.9891 16.9898 16.4895 16.4895C16.9898 15.9891 17.2975 15.4872 17.5275 14.8953C17.75 14.3229 17.9021 13.6686 17.9458 12.7107C17.9896 11.7507 18 11.4443 18 9C18 6.55575 17.9896 6.24926 17.9458 5.28931C17.9021 4.33137 17.75 3.67712 17.5275 3.10466C17.2975 2.51283 16.9898 2.01092 16.4895 1.51058C15.9891 1.01025 15.4872 0.7025 14.8953 0.4725C14.3229 0.25 13.6686 0.09789 12.7107 0.05416C11.7507 0.01036 11.4443 0 9 0ZM9 1.62165C11.4031 1.62165 11.6878 1.6308 12.6368 1.6741C13.5143 1.71415 13.9908 1.86077 14.3079 1.98398C14.728 2.14725 15.0278 2.34231 15.3428 2.65723C15.6577 2.97215 15.8528 3.272 16.016 3.69206C16.1393 4.00919 16.2859 4.48574 16.3259 5.36323C16.3692 6.31224 16.3784 6.5969 16.3784 9C16.3784 11.4031 16.3692 11.6878 16.3259 12.6368C16.2859 13.5143 16.1393 13.9908 16.016 14.3079C15.8528 14.728 15.6577 15.0278 15.3428 15.3428C15.0278 15.6577 14.728 15.8528 14.3079 16.016C13.9908 16.1393 13.5143 16.2859 12.6368 16.3259C11.6879 16.3692 11.4033 16.3784 9 16.3784C6.59672 16.3784 6.31213 16.3692 5.36323 16.3259C4.48574 16.2859 4.00919 16.1393 3.69206 16.016C3.27196 15.8528 2.97215 15.6577 2.6572 15.3428C2.34227 15.0278 2.14721 14.728 1.98398 14.3079C1.86073 13.9908 1.71411 13.5143 1.67406 12.6368C1.63076 11.6878 1.62162 11.4031 1.62162 9C1.62162 6.5969 1.63076 6.31224 1.67406 5.36323C1.71411 4.48574 1.86073 4.00919 1.98398 3.69206C2.14721 3.272 2.34227 2.97215 2.6572 2.65723C2.97215 2.34231 3.27196 2.14725 3.69206 1.98398C4.00919 1.86077 4.48574 1.71415 5.36323 1.6741C6.31224 1.6308 6.5969 1.62165 9 1.62165ZM9 12C7.34366 12 6.00052 10.6564 6.00052 9C6.00052 7.34269 7.34366 5.99955 9 5.99955C10.6574 5.99955 12 7.34269 12 9C12 10.6564 10.6574 12 9 12ZM9 4.37793C6.44806 4.37793 4.37891 6.44708 4.37891 9C4.37891 11.552 6.44806 13.6212 9 13.6212C11.553 13.6212 13.6221 11.552 13.6221 9C13.6221 6.44708 11.553 4.37793 9 4.37793ZM14.8846 4.19571C14.8846 4.79218 14.4011 5.27569 13.8046 5.27569C13.2082 5.27569 12.7246 4.79218 12.7246 4.19571C12.7246 3.59923 13.2082 3.11572 13.8046 3.11572C14.4011 3.11572 14.8846 3.59923 14.8846 4.19571Z"
                fill="white"
              />
            </svg>
          </a>

          {/* Facebook */}
          <a
            href="https://www.facebook.com/tryresponse/"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            style={{
              color: "#ffffff",
              opacity: hoveredSocial === "fb" ? 0.75 : 1,
              transition: "opacity 0.2s ease",
              display: "inline-flex",
            }}
            onMouseEnter={() => setHoveredSocial("fb")}
            onMouseLeave={() => setHoveredSocial(null)}
          >
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path
                d="M12.5353 10.4903L13.0017 7.43689H10.0839V5.45543C10.0839 4.62007 10.4915 3.80583 11.7984 3.80583H13.125V1.20632C13.125 1.20632 11.921 1 10.77 1C8.36688 1 6.79625 2.46233 6.79625 5.10972V7.43689H4.125V10.4903H6.79625V17.8717C7.33187 17.956 7.88086 18 8.44009 18C8.99933 18 9.54828 17.956 10.0839 17.8717V10.4903H12.5353Z"
                fill="white"
              />
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/company/responseinc"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            style={{
              color: "#ffffff",
              opacity: hoveredSocial === "li" ? 0.75 : 1,
              transition: "opacity 0.2s ease",
              display: "inline-flex",
            }}
            onMouseEnter={() => setHoveredSocial("li")}
            onMouseLeave={() => setHoveredSocial(null)}
          >
            <svg width="15" height="15" viewBox="0 0 32 32" fill="none">
              <path
                d="M24.9456 5.5H7.0504C6.19317 5.5 5.5 6.17676 5.5 7.01348V24.9825C5.5 25.8192 6.19317 26.5001 7.0504 26.5001H24.9456C25.8028 26.5001 26.5001 25.8192 26.5001 24.9866V7.01348C26.5001 6.17676 25.8028 5.5 24.9456 5.5ZM11.7303 23.3952H8.6131V13.3709H11.7303V23.3952ZM10.1717 12.0051C9.17091 12.0051 8.3629 11.1971 8.3629 10.2004C8.3629 9.20372 9.17091 8.39571 10.1717 8.39571C11.1684 8.39571 11.9764 9.20372 11.9764 10.2004C11.9764 11.193 11.1684 12.0051 10.1717 12.0051ZM23.3952 23.3952H20.2821V18.5225C20.2821 17.3618 20.2616 15.8647 18.662 15.8647C17.0418 15.8647 16.7957 17.1321 16.7957 18.4405V23.3952H13.6867V13.3709H16.6727V14.7408H16.7137C17.128 13.9533 18.1452 13.1207 19.6586 13.1207C22.8127 13.1207 23.3952 15.1961 23.3952 17.895V23.3952Z"
                fill="white"
              />
            </svg>
          </a>
        </div>

        {/* 3. Call Section with Divider (grid-area: smarter) */}
        <div
          style={{
            gridArea: "smarter",
            borderBottom: "1px solid white",
            paddingBottom: "28px",
            marginBottom: "12px",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "24px",
          }}
        >
          {/* Headline matching Footer__CallText-sc-12rbdn7-9 cNWwyq */}
          <div
            style={{
              fontFamily: '"PP Telegraf", -apple-system, sans-serif',
              fontSize: "clamp(30px, 3.8vw, 54px)",
              fontWeight: 400,
              lineHeight: "92%",
              letterSpacing: "-1.5px",
              color: "white",
              maxWidth: "600px",
            }}
          >
            Response helps
            <br />
            you spend smarter
            <br />
            without working harder
          </div>

          {/* PrimaryCTA Button matching PrimaryCTA__Wrapper-sc-1gsb7bo-2 bqwrjd */}
          <button
            type="button"
            style={{
              padding: "18px 36px",
              borderRadius: "16px",
              fontFamily: '"PP Telegraf", -apple-system, sans-serif',
              fontSize: "15px",
              fontWeight: 600,
              lineHeight: "100%",
              letterSpacing: "-0.5px",
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1916B0",
              background: "white",
              border: "1px solid white",
              cursor: "pointer",
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
            Book a Demo
          </button>
        </div>

        {/* 4. Copyright and Barcode (grid-area: copy) */}
        <div
          style={{
            gridArea: "copy",
            fontFamily: '"PP Telegraf", -apple-system, sans-serif',
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: "150%",
            letterSpacing: "0.2px",
            color: "white",
            alignSelf: "center",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          <div>© 2026 Response Inc.</div>
          {/* Exact Barcode Vector matching Footer__Barcode-sc-12rbdn7-11 kVuQSw */}
          <svg
            width="127"
            height="20"
            viewBox="0 0 129 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "120px", height: "18px" }}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2.52368 0H0V19.2559H2.52368V0ZM14.6377 0H16.1519V19.2559H14.6377V0ZM72.1773 0H70.6631V19.2559H72.1773V0ZM75.2055 0H73.6912V19.2559H75.2055V0ZM98.4238 0H99.938V19.2559H98.4238V0ZM103.976 0H101.452V19.2559H103.976V0ZM77.2244 0H81.767V19.2559H77.2244V0ZM86.3097 0H83.7861V19.2559H86.3097V0ZM87.8242 0H88.8337V19.2559H87.8242V0ZM91.3572 0H90.3477V19.2559H91.3572V0ZM92.8712 0H93.8806V19.2559H92.8712V0ZM96.404 0H95.3945V19.2559H96.404V0ZM20.1895 0H17.6659V19.2559H20.1895V0ZM41.3887 0H42.9029V19.2559H41.3887V0ZM45.931 0H44.4168V19.2559H45.931V0ZM47.95 0H52.4926V19.2559H47.95V0ZM4.03786 0H5.04733V19.2559H4.03786V0ZM7.57112 0H6.56165V19.2559H7.57112V0ZM9.08511 0H10.0946V19.2559H9.08511V0ZM25.237 0H24.2275V19.2559H25.237V0ZM26.751 0H27.7604V19.2559H26.751V0ZM29.78 0H28.7705V19.2559H29.78V0ZM31.2939 0H32.3034V19.2559H31.2939V0ZM34.3221 0H33.3126V19.2559H34.3221V0ZM35.8361 0H36.8456V19.2559H35.8361V0ZM56.531 0H55.5215V19.2559H56.531V0ZM58.0449 0H59.0544V19.2559H58.0449V0ZM61.0731 0H60.0636V19.2559H61.0731V0ZM62.587 0H63.5965V19.2559H62.587V0ZM65.6159 0H64.6064V19.2559H65.6159V0ZM67.1299 0H68.1394V19.2559H67.1299V0ZM12.6188 0H11.6094V19.2559H12.6188V0Z"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M110.597 13.5819V2.59705L121.622 2.59803C123.432 2.64166 124.88 4.12306 124.88 5.93718C124.88 7.75132 123.432 9.23271 121.622 9.27635L121.531 9.27871H117.278L117.277 13.6233C117.233 15.4329 115.751 16.8806 113.937 16.8806C112.123 16.8806 110.642 15.4329 110.597 13.5819ZM124.88 13.5404C124.88 15.3851 123.384 16.8805 121.539 16.8805C119.694 16.8805 118.199 15.3851 118.199 13.5404C118.199 11.6957 119.694 10.2003 121.539 10.2003C123.384 10.2003 124.88 11.6957 124.88 13.5404Z"
              fill="white"
            />
            <rect
              x="108.325"
              y="0.324627"
              width="18.8284"
              height="18.8284"
              stroke="white"
              strokeWidth="0.649254"
            />
          </svg>
        </div>

        {/* 5. Address (grid-area: address) */}
        <div
          style={{
            gridArea: "address",
            fontFamily: '"PP Telegraf", -apple-system, sans-serif',
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: "106.5%",
            letterSpacing: "0.2px",
            textAlign: "right",
            color: "white",
            alignSelf: "center",
          }}
        >
          +1 (844) 966-1910
          <br />
          2261 MARKET STREET STE 4116
          <br />
          SAN FRANCISCO, CA 94114-1612
        </div>
      </div>
    </footer>
  );
}
