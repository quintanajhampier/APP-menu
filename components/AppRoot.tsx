'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DragonWelcome from '@/components/DragonWelcome';
import MenuPrincipal from '@/components/MenuPrincipal';

type Scene = 'welcome' | 'fade' | 'menu';

export default function AppRoot() {
  const [scene, setScene] = useState<Scene>('welcome');

  const handleStart = () => {
    setScene('fade');
    setTimeout(() => setScene('menu'), 900);
  };

  if (scene === 'menu') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={{ backgroundColor: '#0A0A0A', minHeight: '100vh' }}
      >
        <MenuPrincipal mesa="1" />
      </motion.div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0A0A0A', minHeight: '100vh' }}>
      <AnimatePresence mode="wait">
        {scene === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ scale: 1.1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
            style={{ originX: 0.5, originY: 0.5 }}
          >
            <DragonWelcome onStart={handleStart} />
          </motion.div>
        )}
      </AnimatePresence>

      {scene === 'fade' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{ position: 'fixed', inset: 0, backgroundColor: '#0A0A0A', zIndex: 50 }}
        />
      )}
    </div>
  );
}
