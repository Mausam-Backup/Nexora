import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import * as THREE from "three";
import { useTheme } from "@/components/theme-provider";

export interface ExpanseBackgroundProps {
  className?: string;
  /** Maximum framerate (default: 60) */
  targetFps?: number;
}

export const ExpanseBackground: React.FC<ExpanseBackgroundProps> = ({
  className = "",
  targetFps = 60,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();
  const location = useLocation();

  // Disable background shader on landing page and 360 tour to avoid WebGL context conflicts
  if (location.pathname === "/" || location.pathname === "/explore") {
    return null;
  }

  // Keep references to update uniforms on the fly without tearing down the WebGL context
  const uniformsRef = useRef<{
    u_time: { value: number };
    u_resolution: { value: THREE.Vector2 };
    u_isDark: { value: number };
    u_cutoffColor: { value: THREE.Vector3 };
  }>({
    u_time: { value: 0.0 },
    u_resolution: { value: new THREE.Vector2(1, 1) },
    u_isDark: { value: 0 },
    u_cutoffColor: { value: new THREE.Vector3(0.973, 0.976, 0.980) }, // #F8F9FA
  });

  // Dynamically update theme uniform when user toggles light/dark mode
  useEffect(() => {
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (uniformsRef.current) {
      uniformsRef.current.u_isDark.value = isDark ? 1.0 : 0.0;
      if (isDark) {
        // Dark theme cutoff: #0B0F19 -> rgb(11, 15, 25)
        uniformsRef.current.u_cutoffColor.value.set(
          11 / 255,
          15 / 255,
          25 / 255
        );
      } else {
        // Light theme cutoff: #F8F9FA -> rgb(248, 249, 250)
        uniformsRef.current.u_cutoffColor.value.set(
          248 / 255,
          249 / 255,
          250 / 255
        );
      }
    }
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Accessibility: Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // 2. Initialize WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);

    // 3. Full-screen Quad Setup using Orthographic Camera (no perspective distortion)
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);

    // 4. Determine initial theme state
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    const initialCutoff = isDark
      ? new THREE.Vector3(11 / 255, 15 / 255, 25 / 255)
      : new THREE.Vector3(248 / 255, 249 / 255, 250 / 255);

    const uniforms = {
      u_time: uniformsRef.current.u_time,
      u_resolution: {
        value: new THREE.Vector2(width * dpr, height * dpr),
      },
      u_isDark: { value: isDark ? 1.0 : 0.0 },
      u_cutoffColor: { value: initialCutoff },
    };
    uniformsRef.current = uniforms;

    // =========================================================================
    // 5. SHADER CODE: Custom Expanse Field Staircase Gradient + Film Grain
    // =========================================================================
    const vertexShader = /* glsl */ `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = /* glsl */ `
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform float u_isDark;
      uniform vec3 u_cutoffColor;

      // High-frequency pseudo-random generator
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        float numBars = 14.0;
        float barIndex = floor(st.x * numBars);
        float t = barIndex / (numBars - 1.0);

        // Breathing pulse animation
        float anim = sin(u_time * 0.45 + t * 3.0) * 0.04;

        // Soft fade-out horizon — NO HARD CUTOFF, just a smooth envelope
        float envelope = 0.55 + pow(t, 1.1) * 0.42 + anim;

        // Color palette adaptation for light and dark modes
        vec3 colorBase;
        vec3 colorLeft;
        vec3 colorRight;

        if (u_isDark > 0.5) {
          colorBase = vec3(0.043, 0.059, 0.098); // #0B0F19
          colorLeft = vec3(0.06, 0.18, 0.52);
          colorRight = vec3(0.48, 0.12, 0.36);
        } else {
          colorBase = vec3(0.88, 0.90, 0.94);
          colorLeft = vec3(0.37, 0.65, 0.92);   // #5EA6EB
          colorRight = vec3(0.98, 0.52, 0.74);  // #FA85BD
        }

        vec3 colorMid = mix(colorLeft, colorRight, st.x);
        vec3 color = mix(colorBase, colorMid, smoothstep(0.0, 1.0, st.y));

        // Film grain noise
        float noiseIntensity = u_isDark > 0.5 ? 0.07 : 0.04;
        float noise = (random(st * (u_time * 0.08 + 1.0)) - 0.5) * noiseIntensity;

        // SMOOTH fade — blend gradient into page background, NO hard horizontal line
        // Uses a wide softstep range so the transition is invisible (no step artifacts)
        float fade = 1.0 - smoothstep(envelope - 0.18, envelope + 0.18, st.y);
        vec3 finalColor = mix(u_cutoffColor, color + noise, fade);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: false,
      depthTest: false,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // =========================================================================
    // 6. RESIZE LISTENER
    // =========================================================================
    const handleResize = () => {
      if (!renderer || !canvas) return;
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      const newDpr = Math.min(window.devicePixelRatio || 1, 2);

      renderer.setPixelRatio(newDpr);
      renderer.setSize(newWidth, newHeight);
      uniforms.u_resolution.value.set(newWidth * newDpr, newHeight * newDpr);

      renderer.render(scene, camera);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // =========================================================================
    // 7. ANIMATION LOOP & THROTTLING LOGIC
    // =========================================================================
    let animationFrameId: number;
    let isPaused = false;
    let lastRenderTime = performance.now();
    const frameInterval = 1000 / targetFps;

    const renderFrame = (currentTime: number) => {
      if (isPaused) return;

      animationFrameId = requestAnimationFrame(renderFrame);

      const elapsed = currentTime - lastRenderTime;
      if (elapsed < frameInterval) return;
      lastRenderTime = currentTime - (elapsed % frameInterval);

      uniforms.u_time.value = currentTime * 0.001;
      renderer.render(scene, camera);
    };

    if (prefersReducedMotion) {
      // If user prefers reduced motion, render single static frame
      uniforms.u_time.value = 1.0;
      renderer.render(scene, camera);
    } else {
      animationFrameId = requestAnimationFrame(renderFrame);
    }

    // =========================================================================
    // 8. TAB VISIBILITY / IDLE MANAGEMENT (LOW OVERHEAD)
    // =========================================================================
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isPaused = true;
        cancelAnimationFrame(animationFrameId);
      } else {
        if (isPaused && !prefersReducedMotion) {
          isPaused = false;
          lastRenderTime = performance.now();
          animationFrameId = requestAnimationFrame(renderFrame);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // =========================================================================
    // 9. CLEANUP & COMPLETE GPU RESOURCE DISPOSAL
    // =========================================================================
    return () => {
      isPaused = true;
      cancelAnimationFrame(animationFrameId);

      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, [targetFps]);

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 -z-10 w-full h-full pointer-events-none overflow-hidden select-none ${className}`}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default ExpanseBackground;
