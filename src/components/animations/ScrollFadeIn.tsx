import { motion } from "motion/react";
import { ReactNode } from "react";

interface ScrollFadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  className?: string;
}

const ScrollFadeIn = ({
  children,
  delay = 0,
  duration = 0.6,
  direction = "up",
  distance = 50,
  className = "",
}: ScrollFadeInProps) => {
  const initialValues = {
    up: { opacity: 0, y: distance },
    down: { opacity: 0, y: -distance },
    left: { opacity: 0, x: distance },
    right: { opacity: 0, x: -distance },
  };

  return (
    <motion.div
      className={className}
      initial={initialValues[direction]}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollFadeIn;
