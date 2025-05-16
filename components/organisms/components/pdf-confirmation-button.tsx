'use client';

import { Button } from '@/components/ui/button';
import ThreeDotsLoader from '@/components/ui/dots-loader';
import { PdfDocument } from '@/lib/pdf-data';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { Eye, FileText } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const PdfConfirmationButton = ({ pdf }: { pdf: PdfDocument }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/pdfs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...pdf,
        }),
      });
      if (!res.ok) {
        throw new Error('Failed to register PDF');
      }

      toast.success('PDF registered successfully');

      console.log('PDF registered successfully');
    } catch (error) {
      console.error('Error registering PDF:', error);
      toast.error('Failed to register PDF');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className='flex space-x-2 '>
      <Button
        variant='ghost'
        size='icon'
        onClick={() => window.open(pdf.path, '_blank')}
        title='View PDF'
      >
        <Eye className='h-4 w-4' />
      </Button>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          onClick={() => setOpen(!open)}
          className='cursor-pointer'
        >
          <FileText className='h-4 w-4' />
        </PopoverTrigger>
        <PopoverContent className=' p-4 w-fit border-2 *:border-gray-300 bg-white flex flex-col items-center gap-2 rounded-md '>
          <p>Do you want to register this file ?</p>
          <div className='flex flex-row gap-2'>
            <Button
              size='icon'
              className='cursor-pointer w-fit p-4'
              onClick={handleRegister}
              title='Register file'
            >
              {loading ? <ThreeDotsLoader /> : 'Yes, register it.'}
            </Button>
            <PopoverClose asChild>
              <Button
                size='icon'
                className='cursor-pointer w-fit p-4 bg-red-600 hover:bg-red-200 '
                title='Close popover'
              >
                No
              </Button>
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PdfConfirmationButton;
