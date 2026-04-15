import { motion } from "motion/react";

interface FloatingElementProps {
  className?: string;
  duration?: number;
  delay?: number;
}

const FloatingElement = ({ className = "", duration = 4, delay = 0 }: FloatingElementProps) => {
  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.1, 0.3, 0.1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
};

export default FloatingElement;
