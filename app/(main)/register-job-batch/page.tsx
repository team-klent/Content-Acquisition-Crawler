'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import CenterContainer from '@/components/shared/center-container';

export default function RegisterJobBatchPage() {
  const defaultMetadata = {
    M1: 'V1',
    M2: 'V2'
  };

  const [formData, setFormData] = useState({
    project_code: '',
    workflow_code: '',
    first_task_uid: '',
    file_unique_identifier: '',
    file_name: '',
    file_path: '-',
    meta_data: { ...defaultMetadata }
  });

  const [apiToken, setApiToken] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // This ensures we always have proper metadata structure
  useEffect(() => {
    if (!formData.meta_data || Object.keys(formData.meta_data).length === 0) {
      setFormData(prev => ({
        ...prev,
        meta_data: { ...defaultMetadata }
      }));
    }
  }, [formData.meta_data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      meta_data: {
        ...prev.meta_data,
        [key]: value
      }
    }));
  };
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Update both file_name and generate a file_unique_identifier
      setFormData(prev => ({
        ...prev,
        file_name: file.name,
        file_unique_identifier: `file-uid-${file.name}-${Date.now()}`
      }));
      
      console.log("File selected:", file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Make sure we have a file name, either from file selection or manual entry
    if (!formData.file_name && !selectedFile) {
      setError('Please select a file or enter a file name');
      setLoading(false);
      return;
    }
    
    // Check if filename is empty
    if (!formData.file_name || formData.file_name.trim() === '') {
      setError('File name cannot be empty');
      setLoading(false);
      return;
    }
    
    // Ensure we have an API token
    if (!apiToken || apiToken.trim() === '') {
      setError('API token is required');
      setLoading(false);
      return;
    }
    
    // Make sure all required fields are filled
    const requiredFields = [
      { field: 'project_code', label: 'Project Code' },
      { field: 'workflow_code', label: 'Workflow Code' },
      { field: 'first_task_uid', label: 'Content Acquisition Task UID' }
    ];
    
    const missingField = requiredFields.find(
      ({ field }) => !formData[field as keyof typeof formData] || 
                   (typeof formData[field as keyof typeof formData] === 'string' && 
                    (formData[field as keyof typeof formData] as string).trim() === '')
    );
    
    if (missingField) {
      setError(`${missingField.label} is required`);
      setLoading(false);
      return;
    }
    
    const payload = {
      project_code: formData.project_code,
      workflow_code: formData.workflow_code,
      first_task_uid: formData.first_task_uid,
      file_name: formData.file_name,
      file_unique_identifier: formData.file_unique_identifier || `file-uid-${formData.file_name}-${Date.now()}`,
      file_path: formData.file_path || '-',
      meta_data: formData.meta_data || { M1: 'V1', M2: 'V2' }
    };
    
    
    try {
     
      const response = await fetch('/api/register-job-batch-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': apiToken
        },
        body: JSON.stringify(payload)
      });
      
      let data;
      try {
        data = await response.json();
        console.log("API response data:", data);
      } catch (parseError) {
        const text = await response.text();
        console.error("Received non-JSON response:", text);
        throw new Error(`Non-JSON response received: ${text.substring(0, 100)}...`);
      }
      
      if (!response.ok) {
        console.error("API error response:", data);
        throw new Error(data.error || `Failed to register job batch file (${response.status})`);
      }
      
      setResponse(data);
      
      // The response includes file_output_upload_url which could be used to upload the actual file
      // This implementation would depend on the actual requirements of the second step
      // If needed, we could implement the file upload to the URL here
      /* 
      if (selectedFile && data.file_output_upload_url) {
        // Upload the file content to the provided URL
        // This would be a separate API call depending on how the target system expects the file
      }
      */
      
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  console.log("API Token:", apiToken);

  return (
    <CenterContainer>
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Register Job Batch File</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="apiToken">API Token</Label>
              <Input
                id="apiToken"
                name="apiToken"
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                placeholder="Enter your API token"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project_code">Project Code</Label>
              <Input
                id="project_code"
                name="project_code"
                value={formData.project_code}
                onChange={handleInputChange}
                placeholder="Enter project code"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="workflow_code">Workflow Code</Label>
              <Input
                id="workflow_code"
                name="workflow_code"
                value={formData.workflow_code}
                onChange={handleInputChange}
                placeholder="Enter workflow code"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="first_task_uid">Content Acquisition Task UID</Label>
              <Input
                id="first_task_uid"
                name="first_task_uid"
                value={formData.first_task_uid}
                onChange={handleInputChange}
                placeholder="Enter task UID"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="file_unique_identifier">File Unique Identifier (Optional)</Label>
              <Input
                id="file_unique_identifier"
                name="file_unique_identifier"
                value={formData.file_unique_identifier}
                onChange={handleInputChange}
                placeholder="Enter file unique identifier (optional)"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="file_upload">File Upload</Label>
              <Input
                id="file_upload"
                type="file"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-1">Select a file to automatically populate the file name field</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="file_name">File Name</Label>
              <Input
                id="file_name"
                name="file_name"
                value={formData.file_name}
                onChange={handleInputChange}
                placeholder="Enter file name (automatically filled when file selected)"
                required
              />
              <p className="text-xs text-gray-500 mt-1">This name will be used to register the file with the system</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label>Metadata</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(formData.meta_data).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Badge>{key}</Badge>
                  <Input
                    value={value as string}
                    onChange={(e) => handleMetadataChange(e, key)}
                    placeholder={`Value for ${key}`}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register Job Batch File'}
          </Button>
        </form>
        
        {response && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Response</h2>
            <div className="bg-slate-100 p-4 rounded overflow-auto max-h-80">
              <pre className="text-sm">{JSON.stringify(response, null, 2)}</pre>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">File ID:</span>
                  <code className="bg-slate-200 px-2 py-1 rounded">{response.file_id}</code>
                </div>
                
                <div className="space-y-1">
                  <span className="font-medium">File Output Upload URL:</span>
                  <div className="bg-slate-200 px-2 py-1 rounded overflow-x-auto">
                    <code className="text-xs">{response.file_output_upload_url}</code>
                  </div>
                </div>
                
                {selectedFile && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <h3 className="text-md font-semibold mb-2">Next Steps</h3>
                    <p className="text-sm">
                      You've successfully registered <strong>{formData.file_name}</strong> with the system.
                      To complete the process, you would need to upload the file content to the provided URL.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-3"
                      onClick={() => {
                        navigator.clipboard.writeText(response.file_output_upload_url);
                        alert('URL copied to clipboard');
                      }}
                    >
                      Copy Upload URL
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </CenterContainer>
  );
}
