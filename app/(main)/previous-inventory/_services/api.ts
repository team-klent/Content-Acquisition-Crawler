import { getApiUrl } from '@/lib/api-helpers';

const getAllCrawlerData = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_URL || '';
  const res = await fetch(
    `${baseUrl}${getApiUrl('/api/crawl')}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const data = await res.json();
  return data;
};

const getAllCrawlerDataByLength = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_URL || '';
  const res = await fetch(
    `${baseUrl}${getApiUrl('/api/crawl')}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const data = await res.json();
  return data.length;
};

export { getAllCrawlerData, getAllCrawlerDataByLength };
