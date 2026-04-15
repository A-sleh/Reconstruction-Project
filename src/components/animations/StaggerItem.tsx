import { motion } from "motion/react";
import { ReactNode } from "react";

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  scaleHover?: number;
}

const StaggerItem = ({
  children,
  className = "",
  direction = "up",
  distance = 50,
}: StaggerItemProps) => {
  const initialValues = {
    up: { opacity: 0, y: distance },
    down: { opacity: 0, y: -distance },
    left: { opacity: 0, x: distance },
    right: { opacity: 0, x: -distance },
  };

  const animateValues = {
    up: { opacity: 1, y: 0 },
    down: { opacity: 1, y: 0 },
    left: { opacity: 1, x: 0 },
    right: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className={className}
      initial={initialValues[direction]}
      whileInView={animateValues[direction]}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
};

export default StaggerItem;
