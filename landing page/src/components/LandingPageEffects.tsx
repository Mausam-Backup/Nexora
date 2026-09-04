"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    prTg?: number;
    setupWebgl?: (opts: { parent: Element | null }) => void;
    Lenis?: any;
    Swiper?: any;
    TweenMax?: any;
    gsap?: any;
    ScrollTrigger?: any;
    Webflow?: any;
    $?: any;
    jQuery?: any;
  }
}

export default function LandingPageEffects() {
  useEffect(() => {
    let checkScriptsInterval: NodeJS.Timeout | null = null;
    let cleanupScrollListener: (() => void) | null = null;
    let rafId: number | null = null;
    let lenisInstance: any = null;
    let swiperInstance: any = null;

    const initAll = () => {
      const $ = window.$;

      // 1. WebGL Initialization
      const videoParent = document.querySelector(".scroll-anim__2s-video");
      if (videoParent && typeof window.setupWebgl === "function" && videoParent.children.length === 0) {
        try {
          window.setupWebgl({ parent: videoParent });
        } catch (e) {
          console.warn("WebGL setup note:", e);
        }
      }

      // 2. Scroll tracking for WebGL animation progress (window.prTg)
      const ui = {
        pointerWrapper: document.querySelector(".pointer-wrapper") as HTMLElement | null,
        header: document.querySelector(".header") as HTMLElement | null,
        animArea: document.querySelector(".anim-area-100vh") as HTMLElement | null,
        intro: document.querySelector("#intro-anim") as HTMLElement | null,
        gui: document.querySelector(".dg.ac") as HTMLElement | null,
      };

      if (ui.gui) {
        ui.gui.style.zIndex = "999";
      }

      const onScroll = () => {
        const height = (ui.header?.offsetHeight || 0) + (ui.animArea?.offsetHeight || 0) + (ui.intro?.offsetHeight || 0);
        if (height > window.innerHeight) {
          const top = window.scrollY / (height - window.innerHeight);
          window.prTg = Math.max(0, Math.min(5, top * 5));
        }
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      cleanupScrollListener = () => window.removeEventListener("scroll", onScroll);

      // 3. Lenis Smooth Scroll
      if (typeof window.Lenis === "function") {
        lenisInstance = new window.Lenis({
          duration: 1.2,
          easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
          orientation: "vertical",
          gestureOrientation: "vertical",
          smoothWheel: true,
          smoothTouch: false,
          touchMultiplier: 2,
        });

        if (window.ScrollTrigger) {
          lenisInstance.on("scroll", () => window.ScrollTrigger?.update());
        }

        const raf = (time: number) => {
          lenisInstance?.raf(time);
          rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
      }

      // 4. Anchor Link Handlers
      if ($) {
        $(".container-menu__light").removeClass("blue");

        $(".explore-btn").off("click").on("click", function (e: any) {
          e.preventDefault();
          $(".nav-2").trigger("click");
          return false;
        });

        $(".nav-1").off("click").on("click", function (e: any) {
          e.preventDefault();
          const anchor = document.querySelector("#intro");
          if (anchor) {
            if (lenisInstance) {
              lenisInstance.scrollTo(anchor, { immediate: true });
            } else {
              anchor.scrollIntoView({ behavior: "smooth" });
            }
          }
          setTimeout(() => {
            $(".container-menu__light").removeClass("blue");
          }, 10);
        });

        $(".nav-2").off("click").on("click", function (e: any) {
          e.preventDefault();
          const anchor = document.querySelector("#platform");
          if (anchor) {
            if (lenisInstance) {
              lenisInstance.scrollTo(anchor, { immediate: true });
            } else {
              anchor.scrollIntoView({ behavior: "smooth" });
            }
          }
          setTimeout(() => {
            $(".container-menu__light").removeClass("blue");
          }, 10);
        });

        $(".nav-3").off("click").on("click", function (e: any) {
          e.preventDefault();
          const anchor = document.querySelector("#about");
          if (anchor) {
            if (lenisInstance) {
              lenisInstance.scrollTo(anchor, { immediate: true });
            } else {
              anchor.scrollIntoView({ behavior: "smooth" });
            }
          }
          setTimeout(() => {
            $(".container-menu__light").addClass("blue");
          }, 10);
        });

        $(".nav-4").off("click").on("click", function (e: any) {
          e.preventDefault();
          const anchor = document.querySelector("#investors");
          if (anchor) {
            if (lenisInstance) {
              lenisInstance.scrollTo(anchor, { immediate: true });
            } else {
              anchor.scrollIntoView({ behavior: "smooth" });
            }
          }
          setTimeout(() => {
            $(".container-menu__light").addClass("blue");
          }, 10);
        });

        $(".nav-5").off("click").on("click", function (e: any) {
          e.preventDefault();
          const anchor = document.querySelector("#news");
          if (anchor) {
            if (lenisInstance) {
              lenisInstance.scrollTo(anchor, { immediate: true });
            } else {
              anchor.scrollIntoView({ behavior: "smooth" });
            }
          }
          setTimeout(() => {
            $(".container-menu__light").addClass("blue");
          }, 10);
        });

        $(".to-footer").off("click").on("click", function (e: any) {
          e.preventDefault();
          const anchor = document.querySelector("#footer");
          if (anchor) {
            if (lenisInstance) {
              lenisInstance.scrollTo(anchor, { immediate: true });
            } else {
              anchor.scrollIntoView({ behavior: "smooth" });
            }
          }
          setTimeout(() => {
            $(".container-menu__light").removeClass("blue");
          }, 10);
        });

        // 5. ScrollTrigger Video Reveal Expand Animation & Color triggers
        if (window.ScrollTrigger && window.gsap) {
          const card = document.querySelector(".video-reveal-card");
          const wrapper = document.querySelector(".video-reveal-wrapper");
          const clipPathElem = document.querySelector("#video-flag-path");
          const borderPathElem = document.querySelector("#video-flag-border-path");
          const seamElem = document.querySelector(".video-reveal-seam");
          const glowElem = document.querySelector(".video-reveal-crease-glow");
          const borderSvg = document.querySelector(".video-reveal-border");

          const pathRect =
            "M 0.57148 0.0 C 0.28571 0.0, 0.0 0.0, 0.0 0.0 V 1.0 C 0.22794 1.0, 0.4285 1.0, 0.4285 1.0 V 1.0 C 0.71427 1.0, 1.0 1.0, 1.0 1.0 V 0.0 C 0.77204 0.0, 0.57148 0.0, 0.57148 0.0 V 0.0 Z";

          if (card && wrapper) {
            const tl = window.gsap.timeline({
              scrollTrigger: {
                trigger: wrapper,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
              },
            });

            tl.to(
              card,
              {
                width: "100vw",
                maxWidth: "100vw",
                height: "100vh",
                aspectRatio: "auto",
                ease: "power2.inOut",
              },
              0
            );

            if (clipPathElem) {
              tl.to(
                clipPathElem,
                {
                  attr: { d: pathRect },
                  ease: "power2.inOut",
                },
                0
              );
            }

            if (borderPathElem) {
              tl.to(
                borderPathElem,
                {
                  attr: { d: pathRect },
                  ease: "power2.inOut",
                },
                0
              );
            }

            if (borderSvg) {
              tl.to(
                borderSvg,
                {
                  opacity: 0,
                  ease: "power2.inOut",
                },
                0
              );
            }

            if (seamElem) {
              tl.to(
                seamElem,
                {
                  opacity: 0,
                  ease: "power2.inOut",
                },
                0
              );
            }

            if (glowElem) {
              tl.to(
                glowElem,
                {
                  opacity: 0,
                  ease: "power2.inOut",
                },
                0
              );
            }
          }

          $("[data-color='blue']").each(function (this: HTMLElement) {
            window.ScrollTrigger.create({
              trigger: this,
              start: "top 10%",
              end: "bottom 10%",
              onEnter: () => {
                $(".container-menu__light").addClass("blue");
              },
              onEnterBack: () => {
                $(".container-menu__light").addClass("blue");
              },
              onLeave: () => {
                $(".container-menu__light").removeClass("blue");
              },
              onLeaveBack: () => {
                $(".container-menu__light").removeClass("blue");
              },
            });
          });
        }

        // 6. Share Button
        const shMain = $(".share");
        const shText = $(".share .body-caps");
        const shBtn = $("#sharebtn");

        if (window.innerWidth > 991) {
          shMain.off("mouseover").on("mouseover", () => {
            shMain.addClass("open");
          });
          shMain.off("mouseout").on("mouseout", () => {
            shMain.removeClass("open");
          });
        } else {
          shBtn.off("click").on("click", () => {
            shMain.toggleClass("open");
            if (shMain.hasClass("open")) {
              shText.text("CLOSE");
            } else {
              shText.text("SHARE");
            }
          });
        }
      }

      // 7. Swiper team slider
      if (typeof window.Swiper === "function" && document.querySelector("._6s")) {
        try {
          swiperInstance = new window.Swiper("._6s", {
            grabCursor: true,
            spaceBetween: 0,
            slidesPerView: "auto",
            wrapperClass: "_6s-horizontal-wrapper",
            slideClass: "_6s-horizontal-card",
            freeMode: {
              enabled: false,
              sticky: false,
              momentumBounce: false,
            },
            breakpoints: {
              992: {
                freeMode: {
                  enabled: true,
                  sticky: false,
                  momentumBounce: false,
                },
              },
            },
          });

          swiperInstance.on("touchStart", () => {
            if (window.TweenMax) {
              window.TweenMax.to("._6s-horizontal-card", 0.4, { scale: 0.9 });
            }
          });
          swiperInstance.on("touchEnd", () => {
            if (window.TweenMax) {
              window.TweenMax.to("._6s-horizontal-card", 0.4, { scale: 1 });
            }
          });
        } catch (e) {
          console.warn("Swiper init note:", e);
        }
      }

      // 8. Preloader dismissal & Webflow rehydration
      setTimeout(() => {
        document.documentElement.classList.add("is-loaded");
        document.body.style.overflow = "visible";
        if (window.Webflow) {
          try {
            window.Webflow.ready();
            window.Webflow.require("ix2")?.init();
          } catch (e) {
            console.warn("Webflow reinit note:", e);
          }
        }
      }, 1200);
    };

    // Check when scripts are ready
    let attempts = 0;
    checkScriptsInterval = setInterval(() => {
      attempts++;
      if (window.$ && (window.setupWebgl || window.Lenis || attempts > 20)) {
        if (checkScriptsInterval) clearInterval(checkScriptsInterval);
        initAll();
      }
    }, 100);

    return () => {
      if (checkScriptsInterval) clearInterval(checkScriptsInterval);
      if (cleanupScrollListener) cleanupScrollListener();
      if (rafId) cancelAnimationFrame(rafId);
      if (lenisInstance && typeof lenisInstance.destroy === "function") {
        lenisInstance.destroy();
      }
      if (swiperInstance && typeof swiperInstance.destroy === "function") {
        swiperInstance.destroy();
      }
    };
  }, []);

  return null;
}
