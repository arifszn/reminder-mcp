import { env } from '../env.js';
import {
  DeletionType,
  Job,
  JobSchedule,
  RequestMethod,
} from '../types/index.js';
import { NotificationPlatform } from '../types/notification-platform.js';
import { CRON_JOB_API_BASE, makeCronJobRequest } from './cron-job-api.js';

export class ReminderService {
  /**
   * Fetch all reminders (jobs) from the Cron Job API.
   */
  async getAllReminders(): Promise<Job[]> {
    const allJobsEndpoint = `${CRON_JOB_API_BASE}/jobs`;
    const allJobsData = await makeCronJobRequest<{ jobs: Job[] }>(
      allJobsEndpoint
    );
    if (!allJobsData) {
      throw new Error('Failed to retrieve reminders data');
    }
    return allJobsData.jobs || [];
  }

  /**
   * Create a new reminder job.
   * @param title - The reminder title
   * @param datetime - The date and time to trigger the reminder
   * @returns The created job's ID
   */
  async createReminder(title: string, datetime: Date): Promise<number> {
    this.validateReminderInput(title, datetime);
    const createJobEndpoint = `${CRON_JOB_API_BASE}/jobs`;
    const schedule = this.buildJobSchedule(datetime);
    const { url, requestBody } = this.getPlatformPayload(title);

    const job: Job = {
      enabled: true,
      title,
      url,
      schedule,
      requestMethod: RequestMethod.POST,
      saveResponses: true,
      extendedData: {
        headers: { 'Content-Type': 'application/json' },
        body: requestBody,
      },
    };

    const createJobData = await makeCronJobRequest<{ jobId: number }>(
      createJobEndpoint,
      'PUT',
      { job }
    );
    if (!createJobData?.jobId) {
      throw new Error('Failed to create reminder');
    }
    return createJobData.jobId;
  }

  /**
   * Delete reminders by type (title, processed, or all)
   * @param deletionType - The type of deletion
   * @param title - The title to match (if deletionType is Title)
   * @returns The number of deleted jobs
   */
  async deleteReminders(
    deletionType: DeletionType,
    title?: string
  ): Promise<number> {
    const jobs = await this.getAllReminders();
    const jobsToDelete = this.filterJobsForDeletion(jobs, deletionType, title);
    if (jobsToDelete.length === 0) return 0;
    let deletedCount = 0;
    for (const job of jobsToDelete) {
      if (!job.jobId) continue;
      const deleteJobEndpoint = `${CRON_JOB_API_BASE}/jobs/${job.jobId}`;
      const result = await makeCronJobRequest<any>(deleteJobEndpoint, 'DELETE');
      if (result) deletedCount++;
    }
    return deletedCount;
  }

  /**
   * Validate reminder input parameters.
   */
  private validateReminderInput(title: string, datetime: Date) {
    if (!title || typeof title !== 'string') {
      throw new Error('Reminder title must be a non-empty string.');
    }
    const now = new Date();
    if (datetime.getTime() - now.getTime() < 1.5 * 60 * 1000) {
      throw new Error(
        'Reminders must be scheduled at least 2 minutes in the future.'
      );
    }
  }

  /**
   * Build the job schedule object for the Cron Job API.
   */
  private buildJobSchedule(datetime: Date): JobSchedule {
    const expiresAtDate = new Date(datetime.getTime() + 5 * 60 * 1000); // 5 minutes after trigger
    const pad = (n: number) => n.toString().padStart(2, '0');
    const expiresAt = parseInt(
      `${expiresAtDate.getFullYear()}${pad(expiresAtDate.getMonth() + 1)}${pad(
        expiresAtDate.getDate()
      )}${pad(expiresAtDate.getHours())}${pad(expiresAtDate.getMinutes())}${pad(
        expiresAtDate.getSeconds()
      )}`
    );
    return {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      hours: [datetime.getHours()],
      mdays: [datetime.getDate()],
      minutes: [datetime.getMinutes()],
      months: [datetime.getMonth() + 1],
      wdays: [-1],
      expiresAt,
    };
  }

  /**
   * Get the notification platform payload (URL and request body).
   */
  private getPlatformPayload(title: string): {
    url: string;
    requestBody: string;
  } {
    switch (env.NOTIFICATION_PLATFORM) {
      case NotificationPlatform.SLACK:
        return {
          url: env.SLACK_WEBHOOK_URL,
          requestBody: JSON.stringify({ text: `🔔 Reminder: ${title}` }),
        };
      case NotificationPlatform.TELEGRAM:
        return {
          url: `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
          requestBody: JSON.stringify({
            chat_id: env.TELEGRAM_CHAT_ID,
            text: `🔔 Reminder: ${title}`,
          }),
        };
      default:
        throw new Error('Invalid notification platform');
    }
  }

  /**
   * Filter jobs for deletion based on the deletion type and title.
   */
  private filterJobsForDeletion(
    jobs: Job[],
    deletionType: DeletionType,
    title?: string
  ): Job[] {
    switch (deletionType) {
      case DeletionType.Title:
        if (!title)
          throw new Error('Title is required when deletionType is title.');
        return jobs.filter(
          (job) => job.title && job.title.toLowerCase() === title.toLowerCase()
        );
      case DeletionType.Processed:
        return jobs.filter((job) => job.nextExecution === null);
      case DeletionType.All:
        return jobs;
      default:
        throw new Error('Invalid deletion type');
    }
  }
}
