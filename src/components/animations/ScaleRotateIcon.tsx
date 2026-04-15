import { motion } from "motion/react";
import { ReactNode } from "react";

interface ScaleRotateIconProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

const ScaleRotateIcon = ({
  children,
  delay = 0,
  duration = 0.8,
  className = "",
}: ScaleRotateIconProps) => {
  return (
    <motion.div
      className={className}
      initial={{ scale: 0, rotate: -180 }}
      whileInView={{ scale: 1, rotate: 0 }}
      transition={{ duration, delay }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
};

export default ScaleRotateIcon;
