'use client';
 
import { registerRowTable } from '@/app/(main)/ca/_services/workflow-api';
import { Button } from '@/components/ui/button';
import ThreeDotsLoader from '@/components/ui/dots-loader';
import { PdfDocument } from '@/lib/pdf-data';
import { DEFAULT_METADATA, FILE_CONSTANTS } from '@/lib/constants';
import { generateFileUniqueId } from '@/lib/utils';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { Eye, FileUp } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
 
 
const PdfConfirmationButton = ({ pdf }: { pdf: PdfDocument }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
 
  // Extract parameters from URL
  const project_id = searchParams.get('project_id') || '';
  const project_code = searchParams.get('project_code') || '';
  const workflow_id = searchParams.get('workflow_id') || '';
  const workflow_code = searchParams.get('workflow_code') || '';
  const task_id = searchParams.get('task_id') || '';
  const task_uid = searchParams.get('task_uid') || '';
  const user_id = searchParams.get('user_id') || '';
 
  // Debug logging for URL parameters
  useEffect(() => {
    // URL parameters logging removed for production
  }, [
    project_id,
    project_code,
    workflow_id,
    workflow_code,
    task_id,
    task_uid,
    user_id,
  ]);
 
  // Create configuration based on URL parameters with fallback to environment variables
  const defaultConfiguration = {
    project_code: project_code || process.env.NEXT_PUBLIC_PROJECT_CODE || '',
    workflow_code: workflow_code || process.env.NEXT_PUBLIC_WORKFLOW_CODE || '',
    first_task_uid: task_uid || process.env.NEXT_PUBLIC_FIRST_TASK_UID || '',
    file_unique_identifier: '',
    file_name: '', // This will be auto-populated when a file is selected
    file_path: FILE_CONSTANTS.DEFAULT_FILE_PATH,
    project_id: project_id || '',
    workflow_id: workflow_id || '',
    meta_data: { ...DEFAULT_METADATA },
  };
 
  const handleRegister = async () => {
    setLoading(true);
    try {
      const requestData = {
        ...defaultConfiguration,
        file_name: pdf.filename,
        file_unique_identifier: generateFileUniqueId(pdf.filename),
        file_path: pdf.path,
        meta_data: { ...DEFAULT_METADATA },
      };
 
      // Make sure all required fields are filled
      const requiredFields = [
        { field: 'project_code', label: 'Project Code' },
        { field: 'workflow_code', label: 'Workflow Code' },
        { field: 'first_task_uid', label: 'Content Acquisition Task UID' },
      ];
 
      const missingField = requiredFields.find(
        ({ field }) =>
          !requestData[field as keyof typeof requestData] ||
          (typeof requestData[field as keyof typeof requestData] === 'string' &&
            (
              requestData[field as keyof typeof requestData] as string
            ).trim() === '')
      );
 
      if (missingField) {
        toast.error(
          `${missingField.label} is required. Please fill it out before proceeding.`
        );
        setLoading(false);
        return;
      }
 
      if (!requestData.file_name || requestData.file_name.trim() === '') {
        toast.error('File name cannot be empty');
        setLoading(false);
        return;
      }
 
      if (!requestData.file_path || requestData.file_path.trim() === '') {
        toast.error('File path cannot be empty');
        setLoading(false);
        return;
      }
      await registerRowTable({
        body: requestData,
      });
 
      toast.success('PDF registered successfully');
    } catch {
      toast.error('Failed to register PDF');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
 
  const router = useRouter();
 
  const handlePdfViewer = () => {
    const params = new URLSearchParams({
      id: pdf.id,
      title: pdf.title,
      fileName: pdf.filename,
      path: pdf.path,
      size: (pdf.size ?? 0).toString(),
      type: pdf.type,
      createdAt: String(pdf.createdAt),
      isActive: pdf.isActive ? 'true' : 'false',
      createdBy: String(pdf.createdBy),
      updatedAt: String(pdf.updatedAt),
    });
 
    router.push(`/pdf?${params.toString()}`);
  };
 
  return (
    <div className='flex space-x-2 '>
      <Button
        variant='ghost'
        size='icon'
        onClick={handlePdfViewer}
        title='View PDF'
        className='cursor-pointer'
      >
        <Eye className='h-4 w-4' />
      </Button>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          onClick={() => setOpen(!open)}
          className='cursor-pointer hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2'
        >
          <FileUp className='h-4 w-4' />
        </PopoverTrigger>
        <PopoverContent className=' p-4 w-fit border-2 *:border-gray-300 bg-white flex flex-col items-center gap-2 rounded-md '>
          <p>Do you want to register this file ?</p>
          <div className='flex flex-row gap-2'>
            <Button
              size='icon'
              className='cursor-pointer w-fit p-4'
              onClick={handleRegister}
              title='Register file'
              disabled={loading}
            >
              {loading ? (
                <ThreeDotsLoader variant='white' />
              ) : (
                'Yes, register it.'
              )}
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