import { CrawlerSource } from '@/app/(main)/_components/utils';
import { NextResponse } from 'next/server';

const data: CrawlerSource[] = [
  {
    id: 1,
    source: 'https://example.com',
    script: 'ExampleScraper',
    status: 'active',
    interval: '1h',
    initial: '2023-05-01T08:00:00Z',
    type: 'blog',
    isActive: true,
    createdAt: '2023-04-20T08:00:00Z',
    updatedAt: '2023-05-01T08:00:00Z',
    updateBy: 'admin',
    createdBy: 'admin',
  },
  {
    id: 2,
    source: 'https://news.ycombinator.com',
    script: 'HackerNewsScraper',
    status: 'paused',
    interval: '30m',
    initial: '2023-04-15T12:30:00Z',
    type: 'news',
    isActive: false,
    createdAt: '2023-04-10T10:00:00Z',
    updatedAt: '2023-04-20T14:30:00Z',
    updateBy: 'admin',
    createdBy: 'admin',
  },
  {
    id: 3,
    source: 'https://reddit.com/r/programming',
    script: 'RedditScraper',
    status: 'error',
    interval: '2h',
    initial: '2023-05-10T10:00:00Z',
    type: 'forum',
    isActive: true,
    createdAt: '2023-05-01T15:00:00Z',
    updatedAt: '2023-05-10T11:20:00Z',
    updateBy: 'system',
    createdBy: 'admin',
  },
  {
    id: 4,
    source: 'https://dev.to',
    script: 'DevToScraper',
    status: 'active',
    interval: '4h',
    initial: '2023-05-05T09:15:00Z',
    type: 'blog',
    isActive: true,
    createdAt: '2023-04-25T16:30:00Z',
    updatedAt: '2023-05-05T09:15:00Z',
    updateBy: 'admin',
    createdBy: 'admin',
  },
  {
    id: 5,
    source: 'https://github.com/trending',
    script: 'GithubTrendingScraper',
    status: 'active',
    interval: '12h',
    initial: '2023-05-02T00:00:00Z',
    type: 'repository',
    isActive: true,
    createdAt: '2023-04-28T17:45:00Z',
    updatedAt: '2023-05-02T00:00:00Z',
    updateBy: 'admin',
    createdBy: 'admin',
  },
];

const GET = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return NextResponse.json(data);
};

// const POST = async (req) => {

// }

export { GET };
