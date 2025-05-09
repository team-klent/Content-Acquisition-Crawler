import type { Metadata } from '@/lib/types';

export interface CrawlerSource extends Metadata {
  id: string;
  source: string;
  script: string;
  status: string;
  interval: string;
  initial: string;
  type: string;
}

export interface ContentAcquisitionColumns {
  id: string;
  source: string;
  script: string;
  status: string;
  interval: string;
  initial: string;
  type: string;
}
