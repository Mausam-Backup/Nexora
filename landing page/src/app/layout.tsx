import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "SecuredFinanve v2",
  description: "Secured Finance - The Institutional DeFi Protocol",
  icons: {
    icon: "/images/favicon.png",
    apple: "/images/webclip.png",
  },
  openGraph: {
    title: "SecuredFinanve v2",
    description: "Secured Finance - The Institutional DeFi Protocol",
  },
  twitter: {
    title: "SecuredFinanve v2",
    description: "Secured Finance - The Institutional DeFi Protocol",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-wf-page="64357e0972ffee1e51c2b876"
      data-wf-site="636022c4862798e85d43e71e"
      className="w-mod-js"
      suppressHydrationWarning
    >
      <head>
        <Script id="touch-check" strategy="beforeInteractive">
          {`!(function (o, c) {
            var n = c.documentElement;
            if (!n.classList.contains('w-mod-js')) {
              n.classList.add('w-mod-js');
            }
            if ('ontouchstart' in o || (o.DocumentTouch && c instanceof DocumentTouch)) {
              n.classList.add('w-mod-touch');
            }
          })(window, document);`}
        </Script>
      </head>
      <body data-w-id="6351348a9becce665771eb98" suppressHydrationWarning>
        {children}

        {/* Vendor & Runtime Scripts */}
        <script src="/js/jquery-3.5.1.min.dc5e7f18c8.js" defer></script>
        <script src="/js/secured-finance-old.js" defer></script>
        <script src="/gh/studio-freight/lenis@latest/bundled/lenis.js" defer></script>
        <script src="/ajax/libs/gsap/3.11.3/gsap.min.js" defer></script>
        <script src="/ajax/libs/gsap/3.11.3/ScrollTrigger.min.js" defer></script>
        <script src="/npm/swiper@8/swiper-bundle.min.js" defer></script>
        <script src="/npm/@finsweet/attributes-socialshare@1/socialshare.js" defer></script>
        <script src="/static/main.js" defer></script>
      </body>
    </html>
  );
}
