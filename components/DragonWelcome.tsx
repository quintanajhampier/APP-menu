'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Smoke {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  opacity: number;
}

interface Spark {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
}

interface DragonWelcomeProps {
  onStart?: () => void;
}

export default function DragonWelcome({ onStart }: DragonWelcomeProps) {
  const [ready, setReady]     = useState(false);
  const [smokes, setSmokes]   = useState<Smoke[]>([]);
  const [sparks, setSparks]   = useState<Spark[]>([]);
  const containerRef          = useRef<HTMLDivElement>(null);
  const [tilt, setTilt]       = useState({ x: 0, y: 0 });

  useEffect(() => {
    // smoke clouds
    setSmokes(Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 80 + 60,
      duration: Math.random() * 6 + 8,
      delay: Math.random() * 4,
      drift: (Math.random() - 0.5) * 120,
      opacity: Math.random() * 0.25 + 0.1,
    })));
    // gold sparks
    setSparks(Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 40 + 30,
      size: Math.random() * 5 + 2,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
      drift: (Math.random() - 0.5) * 60,
    })));
    const t = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTilt({
      x: ((e.clientY - rect.top - rect.height / 2) / rect.height) * -8,
      y: ((e.clientX - rect.left - rect.width / 2) / rect.width) * 8,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center select-none"
      style={{ backgroundColor: '#0A0A0A', touchAction: 'none' }}
    >
      {/* ── Deep teal/green felt background (card interior) ── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 110% 90% at 50% 40%, #1A3A2A 0%, #0F2218 40%, #060E0A 70%, #030705 100%)',
        }}
      />

      {/* Chinese lattice pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, rgba(212,175,55,0.8) 0px, rgba(212,175,55,0.8) 1px, transparent 1px, transparent 28px),
            repeating-linear-gradient(90deg, rgba(212,175,55,0.8) 0px, rgba(212,175,55,0.8) 1px, transparent 1px, transparent 28px)
          `,
        }}
      />

      {/* ── Smoke particles (white/grey, rising) ── */}
      {smokes.map((s) => (
        <motion.div
          key={s.id}
          className="absolute bottom-0 rounded-full pointer-events-none"
          style={{
            left: `${s.x}%`,
            width: s.size,
            height: s.size,
            background: 'radial-gradient(circle, rgba(200,220,210,0.6) 0%, rgba(180,200,190,0.15) 50%, transparent 70%)',
            filter: 'blur(18px)',
          }}
          animate={{
            y: [0, -300 - Math.random() * 200],
            x: [0, s.drift],
            opacity: [s.opacity, s.opacity * 0.6, 0],
            scale: [0.5, 1.4, 2],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* ── Gold sparks ── */}
      {sparks.map((sp) => (
        <motion.div
          key={sp.id}
          className="absolute pointer-events-none rounded-full"
          style={{
            left: `${sp.x}%`,
            bottom: `${sp.y}%`,
            width: sp.size,
            height: sp.size,
            background: 'radial-gradient(circle, #FFD700, #E74C3C)',
            filter: 'blur(1px)',
          }}
          animate={{
            y: [0, -180],
            x: [0, sp.drift],
            opacity: [0.9, 0.5, 0],
            scale: [1, 0.4, 0],
          }}
          transition={{
            duration: sp.duration,
            delay: sp.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* ── Red fire glow at bottom ── */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '45%',
          background: 'radial-gradient(ellipse 90% 60% at 50% 100%, rgba(180,30,10,0.55) 0%, rgba(120,20,5,0.3) 40%, transparent 70%)',
        }}
      />

      {/* ── Outer gold frame border ── */}
      <div
        className="absolute inset-3 pointer-events-none rounded-2xl"
        style={{
          border: '2px solid rgba(212,175,55,0.7)',
          boxShadow: `
            0 0 0 1px rgba(212,175,55,0.2),
            inset 0 0 40px rgba(0,0,0,0.6),
            0 0 60px rgba(212,175,55,0.1)
          `,
        }}
      />
      {/* inner double border */}
      <div
        className="absolute inset-5 pointer-events-none rounded-xl"
        style={{ border: '1px solid rgba(212,175,55,0.25)' }}
      />

      {/* ── Corner ornaments ── */}
      {(['top-4 left-4', 'top-4 right-4 rotate-90', 'bottom-4 left-4 -rotate-90', 'bottom-4 right-4 rotate-180'] as const).map((pos, i) => (
        <div
          key={i}
          className={`absolute ${pos} w-10 h-10 pointer-events-none`}
          style={{ borderTop: '2px solid rgba(212,175,55,0.8)', borderLeft: '2px solid rgba(212,175,55,0.8)', borderRadius: '4px 0 0 0' }}
        />
      ))}

      {/* ── CHIFA title at top ── */}
      <AnimatePresence>
        {ready && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
            className="absolute top-12 z-20 text-center"
          >
            <h1
              className="text-6xl md:text-7xl font-black tracking-widest"
              style={{
                fontFamily: 'Georgia, serif',
                background: 'linear-gradient(180deg, #FFE566 0%, #D4AF37 35%, #B8860B 65%, #8B6914 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: 'none',
                filter: 'drop-shadow(0 2px 12px rgba(212,175,55,0.6)) drop-shadow(0 0 30px rgba(212,175,55,0.4))',
                letterSpacing: '0.15em',
              }}
            >
              CHIFA
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Red circular backdrop for dragon ── */}
      <div
        className="relative z-10 mt-8"
        style={{
          perspective: '1200px',
          transform: `perspective(1200px) rotateX(${tilt.x * 0.3}deg) rotateY(${tilt.y * 0.3}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
      >
        {/* Red ornamental circle */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            border: '2px solid rgba(212,175,55,0.3)',
            borderStyle: 'dashed',
          }}
        />

        <div
          className="relative flex items-center justify-center"
          style={{
            width: 260,
            height: 260,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 45% 35%, #C0392B 0%, #8B1A1A 50%, #5C0E0E 80%, #2D0707 100%)',
            border: '3px solid rgba(212,175,55,0.7)',
            boxShadow: `
              0 0 0 6px rgba(212,175,55,0.15),
              0 0 40px rgba(192,57,43,0.6),
              0 0 80px rgba(192,57,43,0.3),
              inset 0 0 40px rgba(0,0,0,0.4)
            `,
          }}
        >
          {/* Cloud puffs inside circle */}
          <div
            className="absolute bottom-6 left-0 right-0 h-16 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 100% 60% at 50% 100%, rgba(230,240,235,0.85) 0%, rgba(200,220,210,0.4) 50%, transparent 70%)',
              filter: 'blur(4px)',
            }}
          />
          <motion.div
            className="absolute bottom-4 left-4 right-4 h-14 pointer-events-none"
            animate={{ scaleX: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background: 'radial-gradient(ellipse 80% 50% at 50% 80%, rgba(240,248,244,0.9) 0%, rgba(210,230,220,0.5) 50%, transparent 70%)',
              filter: 'blur(6px)',
            }}
          />

          {/* Dragon image — floating + breathing */}
          <motion.div
            animate={{
              y: [0, -14, 0],
              rotate: [0, 0.8, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: [0.45, 0.05, 0.55, 0.95],
            }}
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateX(${tilt.x * 0.5}deg) rotateY(${tilt.y * 0.5}deg)`,
            }}
          >
            <motion.div
              animate={{
                filter: [
                  'drop-shadow(0 0 20px rgba(192,57,43,0.7)) drop-shadow(0 0 40px rgba(212,175,55,0.4))',
                  'drop-shadow(0 0 35px rgba(231,76,60,1)) drop-shadow(0 0 70px rgba(241,196,15,0.6))',
                  'drop-shadow(0 0 20px rgba(192,57,43,0.7)) drop-shadow(0 0 40px rgba(212,175,55,0.4))',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Image
                src="/images/image.png"
                alt="Dragon Chifa"
                width={200}
                height={200}
                priority
                style={{ objectFit: 'contain', maxHeight: 200 }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Hanging lanterns ── */}
      <div className="absolute top-0 left-8 z-10" style={{ animation: 'lanternSway 4s ease-in-out infinite' }}>
        <div className="w-px h-14 mx-auto bg-gradient-to-b from-[#D4AF37] to-transparent" />
        <div className="w-7 h-11 rounded-full mx-auto flex items-center justify-center" style={{ background: 'radial-gradient(circle at 40% 35%, #E74C3C, #7B241C)', boxShadow: '0 0 16px rgba(231,76,60,0.7)' }}>
          <div className="w-px h-5 bg-[#D4AF37] opacity-60" />
        </div>
        <div className="w-3.5 h-5 mx-auto" style={{ background: 'linear-gradient(to bottom, #D4AF37, #B8860B)', borderRadius: '0 0 50% 50%' }} />
      </div>
      <div className="absolute top-0 right-8 z-10" style={{ animation: 'lanternSway 4.5s ease-in-out infinite', animationDelay: '0.8s' }}>
        <div className="w-px h-18 mx-auto bg-gradient-to-b from-[#D4AF37] to-transparent" style={{ height: 72 }} />
        <div className="w-9 h-14 rounded-full mx-auto flex items-center justify-center" style={{ background: 'radial-gradient(circle at 40% 35%, #E74C3C, #7B241C)', boxShadow: '0 0 18px rgba(231,76,60,0.7)' }}>
          <div className="w-px h-7 bg-[#D4AF37] opacity-60" />
        </div>
        <div className="w-4.5 h-6 mx-auto" style={{ width: 18, background: 'linear-gradient(to bottom, #D4AF37, #B8860B)', borderRadius: '0 0 50% 50%' }} />
      </div>

      {/* ── CTA card block ── */}
      <AnimatePresence>
        {ready && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="relative z-20 mt-6 mx-6 text-center"
            style={{ maxWidth: 320 }}
          >
            {/* Speech/tagline box */}
            <div
              className="px-6 py-4 rounded-2xl mb-4"
              style={{
                background: 'linear-gradient(135deg, rgba(30,20,10,0.95), rgba(20,10,5,0.98))',
                border: '2px solid rgba(212,175,55,0.5)',
                boxShadow: '0 0 30px rgba(212,175,55,0.15), inset 0 0 20px rgba(0,0,0,0.5)',
              }}
            >
              <p
                className="text-base md:text-lg font-semibold leading-snug"
                style={{
                  color: '#F9E79F',
                  fontFamily: 'Georgia, serif',
                  textShadow: '0 0 20px rgba(249,231,159,0.4)',
                }}
              >
                ¡Un festín Chifa te espera,<br />estimado cliente!
              </p>
            </div>

            {/* CTA button — golden wood style */}
            <motion.button
              onClick={onStart}
              whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(212,175,55,0.5), 0 0 80px rgba(192,57,43,0.4)' }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full py-4 rounded-2xl text-white font-bold text-lg tracking-wider uppercase relative overflow-hidden cursor-pointer"
              style={{
                background: 'linear-gradient(180deg, #C0392B 0%, #8B1A1A 50%, #6B0F0F 100%)',
                border: '2px solid rgba(212,175,55,0.6)',
                boxShadow: '0 4px 20px rgba(192,57,43,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
                fontFamily: 'Georgia, serif',
                letterSpacing: '0.1em',
              }}
            >
              {/* shine sweep */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
                  transform: 'skewX(-20deg)',
                }}
              />
              <span className="relative z-10">Toca para empezar</span>
            </motion.button>

            {/* mini lantern below button */}
            <motion.div
              animate={{ y: [0, -4, 0], rotate: [-3, 3, -3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="mt-4 mx-auto flex flex-col items-center"
              style={{ width: 'fit-content' }}
            >
              <div className="w-px h-5 bg-gradient-to-b from-[#D4AF37] to-transparent" />
              <div
                className="w-8 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(circle at 40% 35%, #E74C3C, #7B241C)',
                  boxShadow: '0 0 14px rgba(231,76,60,0.8)',
                }}
              >
                <div className="w-px h-5 bg-[#D4AF37] opacity-70" />
              </div>
              <div className="w-4 h-3 rounded-b-full" style={{ background: '#D4AF37', opacity: 0.7 }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom inscription */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 0.45 : 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 text-xs tracking-widest uppercase z-10"
        style={{ color: '#D4AF37', fontFamily: 'Georgia, serif', letterSpacing: '0.3em' }}
      >
        龙 · Fuego · Tradición · Sabor · 菜单
      </motion.p>
    </div>
  );
}
