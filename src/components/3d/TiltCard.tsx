"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltDegree?: number;
  scaleOnHover?: number;
  glare?: boolean;
}

const TiltCard = ({
  children,
  className = "",
  tiltDegree = 5,
  scaleOnHover = 1.01,
  glare = true,
}: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 300 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateX = (mouseY / (rect.height / 2)) * -tiltDegree;
    const rotateY = (mouseX / (rect.width / 2)) * tiltDegree;

    x.set(rotateY);
    y.set(rotateX);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        scale: isHovered ? scaleOnHover : 1,
      }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        style={{
          rotateX: ySpring,
          rotateY: xSpring,
          transformStyle: "preserve-3d",
        }}
        className="relative"
      >
        {children}
        {glare && isHovered && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-inherit"
            style={{
              background:
                "linear-gradient(135deg, rgba(215,255,61,0.06) 0%, transparent 50%)",
              transform: "translateZ(20px)",
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default TiltCard;
