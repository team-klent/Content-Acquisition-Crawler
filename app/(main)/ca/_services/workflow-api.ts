import { getApiUrl } from '@/lib/api-helpers';

const registerRowTable = async ({ body }) => {
  console.log('[registerRowTable] Sending request to /api/pdfs');
  console.log(
    '[registerRowTable] Request body:',
    JSON.stringify(body, null, 2)
  );

  const res = await fetch(getApiUrl('/api/pdfs'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...body,
    }),
  });

  if (!res.ok) {
    console.error('[registerRowTable] Request failed with status:', res.status);
    let errorMessage = 'Failed to register PDF';

    try {
      const errorData = await res.json();
      console.error('[registerRowTable] Error response:', errorData);
      errorMessage = errorData.error || errorData.message || errorMessage;

      // Include error details if available
      if (errorData.details) {
        console.error('[registerRowTable] Error details:', errorData.details);
      }
    } catch (e) {
      console.error('[registerRowTable] Could not parse error response');
    }

    throw new Error(errorMessage);
  }

  const result = await res.json();
  console.log('[registerRowTable] Success! Result:', result);
  return result;
};

const registerFileUpload = async (file) => {
  const res = await fetch(getApiUrl('/api/register-job-batch-file'), {
    method: 'POST',
    body: file, // FormData automatically sets the correct content-type header
  });

  if (!res.ok) {
    throw new Error('Failed to fetch roles');
  }

  return res;
};

const registerNonFileUpload = async (payload) => {
  const res = await fetch(getApiUrl('/api/register-job-batch-file'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to fetch roles');
  }

  return res;
};

export { registerFileUpload, registerNonFileUpload, registerRowTable };
