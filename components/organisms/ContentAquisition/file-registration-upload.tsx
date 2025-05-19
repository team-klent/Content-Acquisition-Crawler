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
import { Upload } from 'lucide-react';
import { ChangeEvent, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function PdfRegisterButton() {
  const defaultMetadata = {
    M1: 'V1',
    M2: 'V2',
  };

  const defaultConfiguration = {
    project_code: process.env.NEXT_PUBLIC_PROJECT_CODE || '',
    workflow_code: process.env.NEXT_PUBLIC_WORKFLOW_CODE || '',
    first_task_uid: process.env.NEXT_PUBLIC_FIRST_TASK_UID || '',
    file_unique_identifier: '',
    file_name: '', // This will be auto-populated when a file is selected
    file_path: '-',
    meta_data: { ...defaultMetadata },
  };

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const formData = {
      ...defaultConfiguration,
      file_name: file.name,
      file_unique_identifier: `file-uid-${file.name}-${Date.now()}`,
    };

    setLoading(true);

    // Make sure we have a file name, either from file selection or manual entry
    if (!formData.file_name && !file) {
      toast.error('Please select a file or enter a file name');
      setLoading(false);
      return;
    }

    // Check if filename is empty
    if (!formData.file_name || formData.file_name.trim() === '') {
      toast.error('File name cannot be empty');
      setLoading(false);
      return;
    }

    // Make sure all required fields are filled
    const requiredFields = [
      { field: 'project_code', label: 'Project Code' },
      { field: 'workflow_code', label: 'Workflow Code' },
      { field: 'first_task_uid', label: 'Content Acquisition Task UID' },
    ];

    const missingField = requiredFields.find(
      ({ field }) =>
        !formData[field as keyof typeof formData] ||
        (typeof formData[field as keyof typeof formData] === 'string' &&
          (formData[field as keyof typeof formData] as string).trim() === '')
    );

    if (missingField) {
      toast.error(
        `${missingField.label} is required. Please fill it out before proceeding.`
      );
      setLoading(false);
      return;
    }

    if (fileInputRef.current?.files && fileInputRef.current.files.length > 0) {
      toast.info(
        `Selected file: ${fileInputRef.current.files[0].name} (${(
          fileInputRef.current.files[0].size / 1024
        ).toFixed(1)} KB)`
      );
    }

    try {
      let response;
      let data;

      // If we have a selected file, use FormData for multipart upload
      if (file) {
        // Create FormData object for file upload
        const formDataToSend = new FormData();
        formDataToSend.append('file', file);
        formDataToSend.append('project_code', formData.project_code);
        formDataToSend.append('workflow_code', formData.workflow_code);
        formDataToSend.append('first_task_uid', formData.first_task_uid);

        if (formData.file_unique_identifier) {
          formDataToSend.append(
            'file_unique_identifier',
            formData.file_unique_identifier
          );
        }

        // Convert meta_data object to JSON string
        formDataToSend.append(
          'meta_data',
          JSON.stringify(formData.meta_data || { M1: 'V1', M2: 'V2' })
        );
        response = await registerFileUpload(formDataToSend);
      } else {
        // Use JSON payload for non-file requests
        const payload = {
          project_code: formData.project_code,
          workflow_code: formData.workflow_code,
          first_task_uid: formData.first_task_uid,
          file_name: formData.file_name,
          file_unique_identifier:
            formData.file_unique_identifier ||
            `file-uid-${formData.file_name}-${Date.now()}`,
          file_path: formData.file_path || '-',
          meta_data: formData.meta_data || { M1: 'V1', M2: 'V2' },
        };
        response = await registerNonFileUpload(payload);
      }

      try {
        data = await response.json();
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        const text = await response.text();
        console.error('Received non-JSON response:', text);
        throw new Error(
          `Non-JSON response received: ${text.substring(0, 100)}...`
        );
      }

      if (!response.ok) {
        console.error('API error response:', data);
        throw new Error(
          data.error || `Failed to register job batch file (${response.status})`
        );
      }

      // The response includes file_output_upload_url which could be used to upload the actual file
      // This implementation would depend on the actual requirements of the second step
      // If needed, we could implement the file upload to the URL here
      /*
      if (selectedFile && data.file_output_upload_url) {
        // Upload the file content to the provided URL
        // This would be a separate API call depending on how the target system expects the file
      }
      */

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
      console.error('Error:', err);
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
