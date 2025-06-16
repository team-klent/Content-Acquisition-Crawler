import { cn } from '@/lib/utils';

interface ThreeDotsLoaderProps {
  className?: string;
  variant?: 'white' | 'black';
}

const ThreeDotsLoader = ({
  className,
  variant = 'white',
}: ThreeDotsLoaderProps) => {
  return (
    <div
      className={cn('flex items-center justify-center space-x-2', className)}
    >
      <div
        className={`w-1.5 h-1.5 bg-${variant} rounded-full animate-bounce [animation-delay:-0.3s]`}
      ></div>
      <div
        className={`w-1.5 h-1.5 bg-${variant} rounded-full animate-bounce [animation-delay:-0.15s]`}
      ></div>
      <div
        className={`w-1.5 h-1.5 bg-${variant} rounded-full animate-bounce`}
      ></div>
    </div>
  );
};

export default ThreeDotsLoader;
