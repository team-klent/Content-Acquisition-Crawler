import type { Metadata } from '@/lib/types';

export interface CrawlerSource extends Metadata {
  id: string | number;
  source: string;
  script: string;
  status?: string;
  type: string;
}
