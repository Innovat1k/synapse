export const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // 50ms entre chaque enfant
      delayChildren: 0.1, // 100ms avant de commencer
    },
  },
};

/**
 * Item Variants – Pour chaque enfant dans un container staggered
 * Usage: <motion.div variants={itemVariants}>
 */
export const itemVariants = {
  hidden: {
    opacity: 0,
    y: 8, // Subtle slide up (8px = perceptible mais pas distrayant)
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
      mass: 0.5,
    },
  },
};

/**
 * Fade In Only – Pour les éléments sans slide
 * Usage: <motion.div variants={fadeInVariants}>
 */
export const fadeInVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

/**
 * Scale In – Pour les modals, cards featured
 * Usage: <motion.div variants={scaleInVariants}>
 */
export const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.97 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
};
