import { env } from '../env.js';

const CRON_JOB_API_BASE = 'https://api.cron-job.org';

// Helper function for making Cron Job API requests
export async function makeCronJobRequest<T>(
  url: string,
  method: string = 'GET',
  body?: Record<string, any>
): Promise<T | null> {
  const headers = {
    Authorization: `Bearer ${env.CRON_JOB_API_KEY}`,
    'Content-Type': 'application/json',
  };

  const fetchOptions: RequestInit = {
    headers,
    method,
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error('Error making Cron Job request:', error);
    return null;
  }
}

export { CRON_JOB_API_BASE };
