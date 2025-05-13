import { getXataClient } from '@/src/xata';
import { NextResponse } from 'next/server';

const GET = async () => {
  const xata = getXataClient();

  const record = await xata.db.test.getAll();
  console.log(record);

  return NextResponse.json({
    message: 'Hello from the API',
    data: record,
  });
};

export { GET };
