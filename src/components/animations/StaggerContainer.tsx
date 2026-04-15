import { motion } from "motion/react";
import { ReactNode } from "react";

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  speed?: number;
}

const StaggerContainer = ({
  children,
  className = "",
  staggerDelay = 0.1,
}: StaggerContainerProps) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ staggerChildren: staggerDelay, delayChildren: 0.2 }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
};

export default StaggerContainer;
