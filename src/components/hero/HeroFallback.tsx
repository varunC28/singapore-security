import { motion } from 'framer-motion';

/**
 * CSS/SVG fallback hero for devices without WebGL or with prefers-reduced-motion.
 * Mimics the 3D hero's visual feel with a stylized SVG camera and CSS animations.
 */
export default function HeroFallback() {
  return (
    <motion.div
      className="w-full h-full flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      {/* Stylized CCTV camera SVG with glow */}
      <div className="relative">
        {/* Glow backdrop */}
        <div className="absolute inset-0 blur-3xl opacity-30 bg-accent rounded-full scale-150" />
        
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
        >
          {/* Camera body */}
          <rect x="50" y="70" width="80" height="50" rx="8" fill="#1a1a1a" stroke="#333" strokeWidth="1.5" />
          
          {/* Lens housing */}
          <circle cx="140" cy="95" r="22" fill="#111" stroke="#333" strokeWidth="1.5" />
          
          {/* Lens outer ring */}
          <circle cx="140" cy="95" r="16" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.6" />
          
          {/* Lens inner - animated glow */}
          <motion.circle
            cx="140"
            cy="95"
            r="10"
            fill="#3b82f6"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          
          {/* Lens center dot */}
          <circle cx="140" cy="95" r="4" fill="white" opacity="0.9" />
          
          {/* Mount arm */}
          <rect x="80" y="50" width="10" height="25" rx="2" fill="#111" />
          
          {/* Wall mount plate */}
          <rect x="65" y="42" width="40" height="10" rx="3" fill="#111" stroke="#333" strokeWidth="1" />
          
          {/* Sunshade */}
          <rect x="110" y="62" width="40" height="4" rx="1" fill="#1a1a1a" transform="rotate(-5 130 64)" />
          
          {/* LED indicator */}
          <motion.circle
            cx="60"
            cy="78"
            r="2"
            fill="#ff3333"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      </div>
    </motion.div>
  );
}
