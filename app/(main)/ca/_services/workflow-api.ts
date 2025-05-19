const registerRowTable = async ({ body }) => {
  const res = await fetch(
    `${process.env.NODE_ENV === 'production' ? '/app1' : ''}/api/pdfs`,
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

  const result = await res.json();

  return result;
};

export { registerRowTable };
