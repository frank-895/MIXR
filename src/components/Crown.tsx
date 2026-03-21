import { motion } from 'motion/react'

/**
 * Animated SVG crown. Renders absolutely positioned to sit on top of its
 * nearest positioned ancestor, poking out above the container.
 */
export function Crown({ size = 44 }: { size?: number }) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 52"
      width={size}
      height={size * (52 / 64)}
      className="crown"
      initial={{ scale: 0, rotate: -60 }}
      animate={{
        scale: 1,
        rotate: -18,
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 14,
        delay: 0.15,
      }}
    >
      {/* Crown body */}
      <motion.path
        d="M4 42 L4 18 L16 28 L32 8 L48 28 L60 18 L60 42 Z"
        fill="#ffd700"
        stroke="#000"
        strokeWidth={3.5}
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      />
      {/* Crown base band */}
      <rect
        x={4}
        y={42}
        width={56}
        height={8}
        rx={1}
        fill="#ffb800"
        stroke="#000"
        strokeWidth={3.5}
        strokeLinejoin="round"
      />
      {/* Jewels */}
      <motion.circle
        cx={20}
        cy={34}
        r={4}
        fill="#ff4757"
        stroke="#000"
        strokeWidth={2}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, delay: 0.5 }}
      />
      <motion.circle
        cx={32}
        cy={28}
        r={4}
        fill="#ff4757"
        stroke="#000"
        strokeWidth={2}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, delay: 0.6 }}
      />
      <motion.circle
        cx={44}
        cy={34}
        r={4}
        fill="#ff4757"
        stroke="#000"
        strokeWidth={2}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, delay: 0.7 }}
      />
      {/* Spike tips */}
      <motion.circle
        cx={4}
        cy={18}
        r={3}
        fill="#ffd700"
        stroke="#000"
        strokeWidth={2.5}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 600, delay: 0.35 }}
      />
      <motion.circle
        cx={32}
        cy={8}
        r={3.5}
        fill="#ffd700"
        stroke="#000"
        strokeWidth={2.5}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 600, delay: 0.4 }}
      />
      <motion.circle
        cx={60}
        cy={18}
        r={3}
        fill="#ffd700"
        stroke="#000"
        strokeWidth={2.5}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 600, delay: 0.45 }}
      />
    </motion.svg>
  )
}
