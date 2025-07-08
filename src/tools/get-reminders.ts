import { ReminderService } from '../services/index.js';
import { formatJob } from '../utils/index.js';

const reminderService = new ReminderService();

export const getRemindersHandler = async () => {
  try {
    const jobs = await reminderService.getAllReminders();

    if (jobs.length === 0) {
      return {
        content: [
          {
            type: 'text' as const,
            text: `No active reminders`,
          },
        ],
      };
    }

    const formattedJobs = jobs.map(formatJob);
    const remindersText = `All reminders:\n\n${formattedJobs.join('\n')}`;

    return {
      content: [
        {
          type: 'text' as const,
          text: remindersText,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text' as const,
          text: 'Failed to retrieve reminders data',
        },
      ],
    };
  }
};
