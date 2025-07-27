"use client";

import { useTheme } from '@/context/ThemeContext';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

interface BadgeProps {
  children: string | ReactNode;
  className?: string;
  href?: string;
  icon?: ReactNode; 
}

const Badge = ({ 
  children, 
  className = "", 
  href,
  icon = (
    <Image
      src="/code-circle.svg"
      alt="Badge Icon"
      width={24}
      height={24}
    />
  )
}: BadgeProps) => {
  const { currentTheme } = useTheme();
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        inline-flex items-center space-x-2 
        ${currentTheme.secondary} 
        text-gray-100
        
        px-3 py-1 text-sm
        rounded-full font-medium
        ${href ? "cursor-pointer hover:opacity-90 transition-opacity" : ""}
        ${className}
      `}
    >
      {icon && (
        <span className="flex items-center justify-center h-8 w-8">
          {icon}
        </span>
      )}
      <span>{children}</span>
    </div>
  );
};

export default Badge;