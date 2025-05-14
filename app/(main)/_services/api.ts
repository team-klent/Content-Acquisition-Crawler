const getAllCrawlerData = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/crawl`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const data = await res.json();
  return data;
};

const getAllCrawlerDataByLength = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/crawl`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const data = await res.json();
  return data.length;
};

export { getAllCrawlerData, getAllCrawlerDataByLength };
