import { motion } from "motion/react";
import { ReactNode } from "react";

interface ExpandCollapseProps {
  isOpen: boolean;
  children: ReactNode;
  className?: string;
}

const ExpandCollapse = ({ isOpen, children, className = "" }: ExpandCollapseProps) => {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default ExpandCollapse;
