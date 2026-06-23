import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

/** Wraps each route's content so it fades/slides on navigation (framer-motion). */
export default function Page({ children, className = "" }) {
  return (
    <motion.main
      className={"main " + className}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      {children}
    </motion.main>
  );
}

/** Reusable container variants for staggered card reveals inside a page. */
export const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const cardIn = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
