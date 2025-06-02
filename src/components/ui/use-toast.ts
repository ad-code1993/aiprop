import { toast as sonnerToast } from 'sonner';

interface Toast {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

export function useToast() {
  return {
    toast: ({ title, description, variant }: Toast) => {
      sonnerToast(title || '', {
        description,
        className: variant === 'destructive' ? 'bg-red-500 text-white' : '',
      });
    },
  };
}
