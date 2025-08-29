'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  className?: string;
}

export default function BackButton({ variant = 'outline', className = '' }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button 
      variant={variant} 
      className={`mb-6 ${className}`} 
      onClick={() => router.back()}
    >
      ← Back
    </Button>
  );
}
