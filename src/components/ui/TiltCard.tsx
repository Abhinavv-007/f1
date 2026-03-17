"use client";

import { useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  glass?: boolean;
  carbon?: boolean;
  style?: React.CSSProperties;
}

export function TiltCard({ children, className, intensity = 15, glass, carbon, style }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Motion values for the 3D rotation
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Spring physics for smooth return
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });
  
  // Transform template
  const transform = useMotionTemplate`rotateX(${mouseXSpring}deg) rotateY(${mouseYSpring}deg)`;

  // Glare effect values
  const [glareOpacity, setGlareOpacity] = useState(0);
  const glareX = useSpring(useMotionValue(50), { stiffness: 300, damping: 20 });
  const glareY = useSpring(useMotionValue(50), { stiffness: 300, damping: 20 });
  
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.1) 0%, transparent 60%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Mouse position relative to the center of the card
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate rotation (-intensity to +intensity)
    const xPct = (mouseX / width - 0.5) * 2;
    const yPct = (mouseY / height - 0.5) * 2;
    
    x.set(yPct * -intensity); // Rotate around X axis based on Y position
    y.set(xPct * intensity);  // Rotate around Y axis based on X position
    
    // Glare positioning
    glareX.set((mouseX / width) * 100);
    glareY.set((mouseY / height) * 100);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setGlareOpacity(0);
  };
  
  const handleMouseEnter = () => {
    setGlareOpacity(1);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        transformStyle: "preserve-3d",
        transform,
        ...style
      }}
      className="relative [perspective:1000px] w-full"
    >
      <Card 
        glass={glass} 
        carbon={carbon}
        className={cn("w-full relative transition-shadow duration-300", className)}
      >
        {/* Depth Wrapper to make children pop out slightly */}
        <div style={{ transform: "translateZ(30px)" }} className="h-full w-full">
          {children}
        </div>
        
        {/* Dynamic Glare Overlay */}
        <motion.div 
          className="absolute inset-0 pointer-events-none rounded-inherit z-50 mix-blend-overlay"
          style={{
            background: glareBackground,
            opacity: glareOpacity,
            transition: "opacity 0.3s ease",
          }}
        />
      </Card>
    </motion.div>
  );
}
