import { getApiUrl } from '@/lib/api-helpers';

const registerRowTable = async ({ body }) => {
  const res = await fetch(
    getApiUrl('/api/pdfs'),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...body,
      }),
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch roles');
  }

  return 'File registered successfully';
};

const registerFileUpload = async (file) => {
  const res = await fetch(
    getApiUrl('/api/register-job-batch-file'),
    {
      method: 'POST',
      body: file, // FormData automatically sets the correct content-type header
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch roles');
  }

  return res;
};

const registerNonFileUpload = async (payload) => {
  const res = await fetch(
    getApiUrl('/api/register-job-batch-file'),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) {
    throw new Error('Failed to fetch roles');
  }

  return res;
};

export { registerFileUpload, registerNonFileUpload, registerRowTable };
