'use client';

import React from 'react';
import {
  Smartphone,
  Laptop,
  Monitor,
  Keyboard,
  Mouse,
  Headphones,
  Watch,
  Gamepad2,
  Tablet,
  Cpu,
  Tv,
  HardDrive,
  CircuitBoard,
  Layers,
  Sparkles,
} from 'lucide-react';

interface CategoryIconProps {
  slug: string;
  size?: number;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  slug,
  size = 18,
  className = '',
}) => {
  switch (slug) {
    case 'smartphones':
      return <Smartphone size={size} className={className} strokeWidth={1.8} />;
    case 'laptops':
      return <Laptop size={size} className={className} strokeWidth={1.8} />;
    case 'monitors':
      return <Monitor size={size} className={className} strokeWidth={1.8} />;
    case 'keyboards':
      return <Keyboard size={size} className={className} strokeWidth={1.8} />;
    case 'mice':
      return <Mouse size={size} className={className} strokeWidth={1.8} />;
    case 'headphones':
      return <Headphones size={size} className={className} strokeWidth={1.8} />;
    case 'smart-watches':
      return <Watch size={size} className={className} strokeWidth={1.8} />;
    case 'gaming-consoles':
      return <Gamepad2 size={size} className={className} strokeWidth={1.8} />;
    case 'tablets':
      return <Tablet size={size} className={className} strokeWidth={1.8} />;
    case 'pc':
      return <Cpu size={size} className={className} strokeWidth={1.8} />;
    case 'tv':
      return <Tv size={size} className={className} strokeWidth={1.8} />;
    case 'storage-devices':
      return <HardDrive size={size} className={className} strokeWidth={1.8} />;
    case 'pc-components':
      return <CircuitBoard size={size} className={className} strokeWidth={1.8} />;
    case 'accessories':
      return <Layers size={size} className={className} strokeWidth={1.8} />;
    default:
      return <Sparkles size={size} className={className} strokeWidth={1.8} />;
  }
};
