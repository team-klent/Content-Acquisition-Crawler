import { CrawlerSource } from '@/app/(main)/_components/utils';
import { NextResponse } from 'next/server';
const data: CrawlerSource[] = [
  {
    id: 1,
    source: 'https://example.com',
    name: 'ExampleScraper',
    type: 'blog',
    isActive: true,
    createdAt: new Date('2023-04-20T08:00:00Z'),
    updatedAt: new Date('2023-05-01T08:00:00Z'),
    updateBy: 'admin',
    createdBy: 'admin',
  },
  {
    id: 2,
    source: 'https://news.ycombinator.com',
    name: 'HackerNewsScraper',
    type: 'news',
    isActive: false,
    createdAt: new Date('2023-04-10T10:00:00Z'),
    updatedAt: new Date('2023-04-20T14:30:00Z'),
    updateBy: 'admin',
    createdBy: 'admin',
  },
  {
    id: 3,
    source: 'https://reddit.com/r/programming',
    name: 'RedditScraper',
    type: 'forum',
    isActive: true,
    createdAt: new Date('2023-05-01T15:00:00Z'),
    updatedAt: new Date('2023-05-10T11:20:00Z'),
    updateBy: 'system',
    createdBy: 'admin',
  },
  {
    id: 4,
    source: 'https://dev.to',
    name: 'DevToScraper',
    type: 'pdf',
    isActive: true,
    createdAt: new Date('2023-04-25T16:30:00Z'),
    updatedAt: new Date('2023-05-05T09:15:00Z'),
    updateBy: 'admin',
    createdBy: 'admin',
  },
  {
    id: 5,
    source: 'https://github.com/trending',
    name: 'GithubTrendingScraper',
    type: 'application/pdf',
    isActive: true,
    createdAt: new Date('2023-04-28T17:45:00Z'),
    updatedAt: new Date('2023-05-02T00:00:00Z'),
    updateBy: 'admin',
    createdBy: 'admin',
  },
];

const GET = async () => {
  await new Promise((resolve) => setTimeout(resolve, 6000)); // Simulate a delay
  return NextResponse.json(data);
};

export { GET };
