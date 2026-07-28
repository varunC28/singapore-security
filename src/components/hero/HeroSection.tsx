import { useRef, useState, useEffect, Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CameraModel from './CameraModel';
import HeroFallback from './HeroFallback';
import { SHOP_NAME, SHOP_TAGLINE } from '@/lib/constants';

gsap.registerPlugin(ScrollTrigger);

/**
 * Check if WebGL is available and performant enough for the 3D scene.
 */
function canUseWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return false;
    // Check for prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Determine the DPR cap based on viewport width.
 * Mobile devices get lower DPR to protect frame rate.
 */
function getDPRCap(): number {
  if (typeof window === 'undefined') return 1.5;
  const width = window.innerWidth;
  if (width < 768) return 1.5;     // Mobile: cap at 1.5x
  if (width < 1024) return 2;       // Tablet: cap at 2x
  return Math.min(window.devicePixelRatio, 2); // Desktop: up to 2x
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const [useWebGL, setUseWebGL] = useState(true);
  const [dprCap] = useState(getDPRCap);

  const [animationProgress, setAnimationProgress] = useState(0);
  const [emissiveIntensity, setEmissiveIntensity] = useState(0);
  const [pointLightIntensity, setPointLightIntensity] = useState(0);

  // Mobile detection for responsive 3D scaling
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setUseWebGL(canUseWebGL());
  }, []);

  // Determine scrub distance based on viewport (shorter on mobile)
  const getScrubDistance = useCallback(() => {
    if (typeof window === 'undefined') return '150%';
    return window.innerWidth < 768 ? '100%' : '150%';
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${getScrubDistance()}`,
          scrub: 1.5,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Phase 1: Camera zooms in (0% → 50%)
      tl.to(
        {},
        {
          duration: 0.5,
          onUpdate: function () {
            const progress = this.progress();
            setAnimationProgress(progress);
          },
        }
      );

      // Phase 2: Lens power-on glow (50% → 80%)
      tl.to(
        {},
        {
          duration: 0.3,
          onUpdate: function () {
            const progress = this.progress();
            setEmissiveIntensity(progress * 2.5);
            setPointLightIntensity(progress * 3);
          },
        }
      );

      // Phase 3: Brief hold then release (80% → 100%)
      tl.to({}, { duration: 0.2 });

      if (textRef.current) {
        tl.to(
          textRef.current,
          {
            scale: 0.85,
            transformOrigin: 'left center',
            duration: 0.8,
          },
          0
        );
      }

      if (scrollIndicatorRef.current) {
        tl.to(
          scrollIndicatorRef.current,
          {
            opacity: 0,
            duration: 0.15,
          },
          0
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [getScrubDistance]);

  const cameraScale = isMobile 
    ? 1.4 + animationProgress * 0.2  // Mobile: 1.4 -> 1.6
    : 0.9 + animationProgress * 1.0; // Desktop: 0.9 -> 1.9

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-black overflow-hidden"
    >
      {/* 3D Canvas or Fallback */}
      <div className="absolute inset-0 z-0 top-[50%] md:top-0 md:left-[40%]">
        {useWebGL ? (
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <Canvas
              dpr={[1, dprCap]}
              camera={{ position: [0, 0, 5], fov: 45 }}
              gl={{
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
              }}
              style={{ background: 'transparent' }}
            >
              {/* Lighting */}
              <ambientLight intensity={0.3} />
              <directionalLight
                position={[5, 5, 5]}
                intensity={1.2}
                castShadow={false}
              />
              <directionalLight
                position={[-3, 2, -2]}
                intensity={0.4}
                color="#6699ff"
              />

              {/* Accent point light — appears with lens glow */}
              <pointLight
                position={[2, 0, 2]}
                intensity={pointLightIntensity}
                color="#3b82f6"
                distance={8}
                decay={2}
              />

              {/* Subtle rim light */}
              <pointLight
                position={[-3, -1, 3]}
                intensity={0.5}
                color="#ffffff"
                distance={10}
                decay={2}
              />

              <CameraModel
                emissiveIntensity={emissiveIntensity}
                scale={cameraScale}
              />

              <Environment preset="city" />
            </Canvas>
          </Suspense>
        ) : (
          <HeroFallback />
        )}
      </div>

      {/* Text overlay */}
      <div
        ref={textRef}
        className="relative z-10 flex flex-col justify-start md:justify-center pt-[13vh] md:pt-0 min-h-screen px-6 md:px-12 lg:px-24 md:w-[60%] pointer-events-none"
      >
        <div className="max-w-2xl text-left">
          {/* Label */}
          <p className="label-text text-accent mb-4 text-xs md:text-sm">
            CCTV & Security Solutions
          </p>

          {/* Shop name */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white leading-tight tracking-tight">
            {SHOP_NAME}
          </h1>

          {/* Tagline */}
          <p className="mt-4 md:mt-6 text-xl md:text-2xl lg:text-3xl text-white/60 font-light">
            {SHOP_TAGLINE}
          </p>

          {/* CTA */}
          <div className="mt-8 md:mt-10 pointer-events-auto">
            <a
              href="#products"
              className="btn-glass px-8 py-3 text-sm md:text-base inline-block"
            >
              Browse Products
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <span className="label-text text-white/30 text-[10px]">Scroll</span>
          <svg
            className="w-5 h-5 text-white/30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Bottom gradient fade into products section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
    </section>
  );
}
