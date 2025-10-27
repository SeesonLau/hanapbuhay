// src/components/ui/Spinner.tsx
import { cn } from "@/lib/utils"; // Assuming you have shadcn's cn utility

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeMap = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-4',
  };

  return (
    <div 
      className={cn(
        "animate-spin rounded-full border-solid border-current border-r-transparent text-blue-500",
        sizeMap[size],
        className
      )}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
