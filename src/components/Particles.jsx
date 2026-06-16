import { motion } from 'framer-motion';

/* FIFA World Cup palette confetti */
const COLORS = ['#FFD700','#E8001C','#00A550','#FFFFFF','#FF8C00','#00C853','#FF4560'];

export default function Particles({ count = 28 }) {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 100 }}>
      {Array.from({ length: count }).map((_, i) => {
        const x        = 10 + Math.random() * 80;
        const size     = 6 + Math.random() * 11;
        const color    = COLORS[i % COLORS.length];
        const delay    = Math.random() * 0.25;
        const duration = 0.75 + Math.random() * 0.7;
        const rot      = Math.random() * 720 - 360;
        const shape    = i % 3 === 0 ? '2px' : i % 3 === 1 ? '50%' : '4px';

        return (
          <motion.div key={i}
            initial={{ x: `${x}vw`, y: '55vh', opacity: 1, scale: 1, rotate: 0 }}
            animate={{
              y:       ['55vh', `${15 + Math.random() * 50}vh`, '-8vh'],
              x:       [`${x}vw`, `${x + (Math.random() - 0.5) * 28}vw`],
              opacity: [1, 1, 0],
              scale:   [1, 1.3, 0.4],
              rotate:  rot,
            }}
            transition={{ duration, delay, ease: 'easeOut' }}
            style={{
              position: 'absolute', width: size, height: size,
              background: color, borderRadius: shape,
              boxShadow: `0 0 ${size * 2}px ${color}bb`,
            }}
          />
        );
      })}
    </div>
  );
}
