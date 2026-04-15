import { motion } from "motion/react";
import { ReactNode } from "react";

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  scaleHover?: number;
  scaleTap?: number;
}

const AnimatedButton = ({
  children,
  onClick,
  className = "",
  scaleTap = 0.95,
}: AnimatedButtonProps) => {
  return (
    <motion.button
      className={className}
      onClick={onClick}
      whileTap={{ scale: scaleTap }}
    >
      {children}
    </motion.button>
  );
};

export default AnimatedButton;
