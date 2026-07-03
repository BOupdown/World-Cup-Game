import { motion } from 'framer-motion';

export default function ProgressBar({ current, total }) {
  const pct = (current / total) * 100;
  return (
    <div style={{
      width: '100%', height: 6,
      background: 'rgba(255,255,255,0.12)',
      borderRadius: 99, overflow: 'hidden',
    }}>
      <motion.div
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{
          height: '100%', borderRadius: 99,
          /* Green → Yellow → Red - FIFA tri-color */
          background: 'linear-gradient(90deg, #00A550, #FFD700, #E8001C)',
          boxShadow: '0 0 10px #FFD70088',
        }}
      />
    </div>
  );
}
