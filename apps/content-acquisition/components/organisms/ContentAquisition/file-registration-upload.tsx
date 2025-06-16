'use client';
 
import {
  registerFileUpload,
  registerNonFileUpload,
} from '@/app/(main)/ca/_services/workflow-api';
import { Button } from '@/components/ui/button';
import ThreeDotsLoader from '@/components/ui/dots-loader';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { DEFAULT_METADATA, FILE_CONSTANTS } from '@/lib/constants';
import { generateFileUniqueId } from '@/lib/utils';
import { Upload } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { ChangeEvent, useRef, useState, useMemo } from 'react';
import { toast } from 'sonner';
 
export default function PdfRegisterButton() {
  const defaultMetadata = useMemo(() => DEFAULT_METADATA, []);
  
  const searchParams = useSearchParams();
  
  // Extract parameters from URL
  const project_id = searchParams.get('project_id') || '';
  const project_code = searchParams.get('project_code') || '';
  const workflow_id = searchParams.get('workflow_id') || '';
  const workflow_code = searchParams.get('workflow_code') || '';
  const task_uid = searchParams.get('task_uid') || '';
  

 
  const defaultConfiguration = useMemo(() => ({
    project_code: project_code,
    workflow_code: workflow_code,
    first_task_uid: task_uid,
    file_unique_identifier: '',
    file_name: '',
    file_path: FILE_CONSTANTS.DEFAULT_FILE_PATH,
    project_id: project_id || '',
    workflow_id: workflow_id || '',
    meta_data: { ...defaultMetadata },
  }), [project_code, workflow_code, task_uid, project_id, workflow_id, defaultMetadata]);
 
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
 
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
 
    const formData = {
      ...defaultConfiguration,
      file_name: file.name,
      file_unique_identifier: generateFileUniqueId(file.name),
    };    setLoading(true);

    try {
      let response;
      let data;
      
     
      if (file) {
        // Create FormData object for file upload
        const formDataToSend = new FormData();
        formDataToSend.append('file', file);
        formDataToSend.append('project_code', formData.project_code);
        formDataToSend.append('workflow_code', formData.workflow_code);
        formDataToSend.append('first_task_uid', formData.first_task_uid);
        formDataToSend.append('project_id', formData.project_id);
        formDataToSend.append('workflow_id', formData.workflow_id);

        if (formData.file_unique_identifier) {
          formDataToSend.append(
            'file_unique_identifier',
            formData.file_unique_identifier
          );
        }
        formDataToSend.append(
          'meta_data',
          JSON.stringify(formData.meta_data || DEFAULT_METADATA)
        );
        
        response = await registerFileUpload(formDataToSend);
      } else {
        const payload = {
          project_code: formData.project_code,
          workflow_code: formData.workflow_code,
          first_task_uid: formData.first_task_uid,
          file_name: formData.file_name,
          file_unique_identifier:
            formData.file_unique_identifier ||
            generateFileUniqueId(formData.file_name),
          file_path: formData.file_path || FILE_CONSTANTS.DEFAULT_FILE_PATH,
          project_id: formData.project_id || '',
          workflow_id: formData.workflow_id || '',
          meta_data: formData.meta_data || DEFAULT_METADATA,
        };
        response = await registerNonFileUpload(payload);
      }
 
      try {
        data = await response.json();
      } catch {
        const text = await response.text();
        throw new Error(
          `Non-JSON response received: ${text.substring(0, 100)}...`
        );
      }
 
      if (!response.ok) {
        throw new Error(
          data.error || `Failed to register job batch file (${response.status})`
        );
      }
 
      if (
        data &&
        (data?.file_output_upload_url ||
          (data?.registration && data?.registration.file_output_upload_url))
      ) {
        toast.success('File successfully registered!');
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred';
      toast.error(`Failed to register job batch file: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };
 
  const handleClick = () => {
    fileInputRef.current?.click();
  };
 
  return (
    <div className='relative'>
      <input
        id='file_upload'
        ref={fileInputRef}
        type='file'
        onChange={handleFileChange}
        className='sr-only'
      />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              className='relative cursor-pointer shadow-md ring-1  ring-gray-200 hover:bg-gray-100 '
              onClick={handleClick}
              disabled={loading}
            >
              <Upload />
              {loading ? (
                <>
                  Registering <ThreeDotsLoader variant='black' />
                </>
              ) : (
                'Register Uploaded File'
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent className='max-w-xs'>
            <p>
              Choose another file to upload and register (This will not upload
              your file in your preferred storage)
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
} 