const getAllCrawlerData = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}${
      process.env.NODE_ENV === 'production' ? '/ca' : ''
    }/api/crawl`,
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
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}${
      process.env.USE_BASE_PATH === 'true' ? '/ca' : ''
    }/api/crawl`,
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
