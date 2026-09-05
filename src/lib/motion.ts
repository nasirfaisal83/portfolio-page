// src/lib/motion.ts
// Re-exports and helpers for the motion library (motion/react).
// Centralises the import so we can swap versions without touching components.

export { motion, AnimatePresence, useReducedMotion, useInView, animate } from "motion/react";
export type { Variants, Transition } from "motion/react";
