import { Job } from '../types/index.js';

// Format job data
export function formatJob(job: Job): string {
  return [
    `Title: ${job.title || 'Unknown'}`,
    `Processed: ${job.lastExecution ? 'Yes' : 'No'}`,
    '---',
  ].join('\n');
}
