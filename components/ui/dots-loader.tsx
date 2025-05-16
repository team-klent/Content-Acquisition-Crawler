import { cn } from '@/lib/utils';

const ThreeDotsLoader = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn('flex items-center justify-center space-x-2', className)}
    >
      <div className='w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]'></div>
      <div className='w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]'></div>
      <div className='w-1.5 h-1.5 bg-white rounded-full animate-bounce'></div>
    </div>
  );
};

export default ThreeDotsLoader;
